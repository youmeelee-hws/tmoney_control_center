import { useEffect, useMemo, useReducer, useRef } from 'react'
import { issuePlayTicket } from '@/api/streams'
import { Ticket } from '@/api/streams'

type PlayerStatus =
  | 'idle'
  | 'issuing_ticket'
  | 'ready'
  | 'connecting'
  | 'playing'
  | 'paused'
  | 'refreshing_ticket'
  | 'reconnecting'
  | 'disconnected'
  | 'error'

// 플레이어 상태
type PlayerState =
  | { status: 'idle' }
  | { status: 'issuing_ticket'; streamId: string }
  | { status: 'ready'; ticket: Ticket }
  | { status: 'connecting'; ticket: Ticket }
  | { status: 'playing'; ticket: Ticket }
  | { status: 'paused'; ticket: Ticket }
  | { status: 'refreshing_ticket'; ticket: Ticket }
  | {
      status: 'reconnecting'
      streamId: string
      attempt: number
      lastError?: string
    }
  | { status: 'disconnected'; streamId?: string }
  | { status: 'error'; streamId?: string; message: string }

// 이벤트 타입
type Action =
  | { type: 'START'; streamId: string }
  | { type: 'TICKET_OK'; ticket: Ticket }
  | { type: 'TICKET_FAIL'; streamId: string; message: string }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'DISCONNECT' }
  | { type: 'REFRESH_BEGIN' }
  | { type: 'REFRESH_OK'; ticket: Ticket; keepPlaying: boolean }
  | { type: 'REFRESH_FAIL'; streamId: string; message: string }
  | {
      type: 'RECONNECT_SCHEDULED'
      streamId: string
      attempt: number
      lastError?: string
    }
  | { type: 'RECONNECT_GIVEUP'; streamId: string; message: string }
  | { type: 'RESET' }

function hasTicket(
  state: PlayerState
): state is
  | { status: 'ready'; ticket: Ticket }
  | { status: 'connecting'; ticket: Ticket }
  | { status: 'playing'; ticket: Ticket }
  | { status: 'paused'; ticket: Ticket }
  | { status: 'refreshing_ticket'; ticket: Ticket } {
  return (
    state.status === 'ready' ||
    state.status === 'connecting' ||
    state.status === 'playing' ||
    state.status === 'paused' ||
    state.status === 'refreshing_ticket'
  )
}

// dispatch: 이벤트를 상태 머신에 던지는 행위
// 상태 전이표(상태 머신) <- useReducer에서 반환된 dispatch로 이벤트를 던짐
// 첫번째 parameter state는 current 플레이어 상태 -> reducer에서 반환되는 state는 next 플레이어 상태
function reducer(state: PlayerState, action: Action): PlayerState {
  // 발생한 이벤트 타입(action.type)에 따라 플레이어 상태 전이(return { status: 'issuing_ticket', ...})가 결정됨
  switch (action.type) {
    case 'START':
      return { status: 'issuing_ticket', streamId: action.streamId }

    case 'TICKET_OK':
      // 여기서 바로 connecting으로 갈지(미래 WebRTC), ready로 둘지 선택.
      // 지금은 가짜 플레이어니까 ready부터.
      return { status: 'ready', ticket: action.ticket }

    case 'TICKET_FAIL':
      return {
        status: 'reconnecting',
        streamId: action.streamId,
        attempt: 0,
        lastError: action.message,
      }

    case 'PLAY':
      if (state.status === 'ready' || state.status === 'paused')
        return { status: 'playing', ticket: state.ticket }
      return state

    case 'PAUSE':
      if (state.status === 'playing')
        return { status: 'paused', ticket: state.ticket }
      return state

    case 'REFRESH_BEGIN':
      if (hasTicket(state))
        return { status: 'refreshing_ticket', ticket: state.ticket }
      return state

    case 'REFRESH_OK':
      // 갱신은 “끊김 없이”가 목표.
      // keepPlaying=true면 playing 유지, 아니면 ready 유지.
      if (action.keepPlaying)
        return { status: 'playing', ticket: action.ticket }
      return { status: 'ready', ticket: action.ticket }

    case 'REFRESH_FAIL':
      return {
        status: 'reconnecting',
        streamId: action.streamId,
        attempt: 0,
        lastError: action.message,
      }

    case 'RECONNECT_SCHEDULED':
      return {
        status: 'reconnecting',
        streamId: action.streamId,
        attempt: action.attempt,
        lastError: action.lastError,
      }

    case 'RECONNECT_GIVEUP':
      return {
        status: 'error',
        streamId: action.streamId,
        message: action.message,
      }

    case 'DISCONNECT':
      return {
        status: 'disconnected',
        streamId: hasTicket(state)
          ? state.ticket.streamId
          : (state as any).streamId,
      }

    case 'RESET':
      return { status: 'idle' }

    default:
      return state
  }
}

function msUntil(iso: string) {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return 0
  return t - Date.now()
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

/**
 * - 티켓 발급: POST /streams/{id}/play-ticket
 * - 자동 갱신: 만료 30~60초 전에 위 API를 다시 호출(지터)
 * - 갱신/발급 실패: reconnecting(backoff) 후 재시도
 */
export function usePlayerMachine() {
  // useReducer(reducer, initialState)
  const [state, dispatch] = useReducer(reducer, {
    status: 'idle',
  } as PlayerState)

  const refreshTimerRef = useRef<number | null>(null)
  const hardExpireTimerRef = useRef<number | null>(null)
  const reconnectTimerRef = useRef<number | null>(null)
  const disconnectedRef = useRef(false)

  const clearTimers = () => {
    if (refreshTimerRef.current) window.clearTimeout(refreshTimerRef.current)
    if (hardExpireTimerRef.current)
      window.clearTimeout(hardExpireTimerRef.current)
    if (reconnectTimerRef.current)
      window.clearTimeout(reconnectTimerRef.current)
    refreshTimerRef.current = null
    hardExpireTimerRef.current = null
    reconnectTimerRef.current = null
  }

  // 1) START -> 티켓 발급
  useEffect(() => {
    if (state.status !== 'issuing_ticket') return
    disconnectedRef.current = false

    let cancelled = false
    ;(async () => {
      try {
        const r = await issuePlayTicket(state.streamId) // 반드시 {streamId, playTicket, expiresAt, whepUrl}
        if (cancelled || disconnectedRef.current) return
        dispatch({ type: 'TICKET_OK', ticket: r })
      } catch (e: any) {
        if (cancelled || disconnectedRef.current) return
        dispatch({
          type: 'TICKET_FAIL',
          streamId: state.streamId,
          message: e?.message ?? 'ticket error',
        })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [state.status === 'issuing_ticket' ? state.streamId : null])

  // 2) 티켓이 생기면(ready/playing/paused…) 자동 갱신 타이머 + 하드 만료 안전망
  useEffect(() => {
    if (!hasTicket(state)) {
      // 티켓 없으면 타이머 정리
      if (
        state.status === 'disconnected' ||
        state.status === 'error' ||
        state.status === 'idle' ||
        state.status === 'reconnecting'
      ) {
        clearTimers()
      }
      return
    }

    clearTimers()

    const ttlMs = msUntil(state.ticket.expiresAt)
    if (ttlMs <= 0) {
      // 이미 만료됐다면 즉시 reconnecting으로
      dispatch({
        type: 'REFRESH_FAIL',
        streamId: state.ticket.streamId,
        message: 'expired before refresh',
      })
      return
    }

    // 지터 포함: 30~60초 전 사이에 갱신
    const leadSec = 30 + Math.floor(Math.random() * 31) // 30..60
    const refreshInMs = Math.max(0, ttlMs - leadSec * 1000)

    refreshTimerRef.current = window.setTimeout(() => {
      dispatch({ type: 'REFRESH_BEGIN' })
    }, refreshInMs)

    // 하드 만료 안전망(갱신 실패/지연시)
    hardExpireTimerRef.current = window.setTimeout(() => {
      dispatch({
        type: 'REFRESH_FAIL',
        streamId: state.ticket.streamId,
        message: 'hard-expired',
      })
    }, ttlMs)

    return () => {
      // 상태 변경 시 정리
      clearTimers()
    }
  }, [state.status, hasTicket(state) ? state.ticket.expiresAt : null])

  // 3) REFRESH_BEGIN -> 같은 API 재호출로 갱신
  useEffect(() => {
    if (state.status !== 'refreshing_ticket') return
    if (disconnectedRef.current) return

    let cancelled = false
    const streamId = state.ticket.streamId
    const keepPlaying = true // WebRTC 플레이어 기준: 끊지 않고 계속 재생 유지

    ;(async () => {
      try {
        const next = await issuePlayTicket(streamId)
        if (cancelled || disconnectedRef.current) return
        dispatch({ type: 'REFRESH_OK', ticket: next, keepPlaying })
      } catch (e: any) {
        if (cancelled || disconnectedRef.current) return
        dispatch({
          type: 'REFRESH_FAIL',
          streamId,
          message: e?.message ?? 'refresh error',
        })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [state.status === 'refreshing_ticket' ? state.ticket.streamId : null])

  // 4) reconnecting(backoff) - 실패 시 티켓 발급부터 다시
  useEffect(() => {
    if (state.status !== 'reconnecting') return
    if (disconnectedRef.current) return

    // attempt 0부터 시작. 1s,2s,4s,8s... 최대 10s
    const attempt = state.attempt
    const delaySec = clamp(Math.pow(2, attempt), 1, 10)
    const nextAttempt = attempt + 1
    const streamId = state.streamId

    // 너무 오래 실패하면 error로 give up (예: 6번 시도)
    if (attempt >= 6) {
      dispatch({
        type: 'RECONNECT_GIVEUP',
        streamId,
        message: state.lastError ?? 'reconnect failed',
      })
      return
    }

    // 다음 재시도 스케줄
    reconnectTimerRef.current = window.setTimeout(() => {
      // 재시도는 “발급부터”로 통일
      dispatch({
        type: 'RECONNECT_SCHEDULED',
        streamId,
        attempt: nextAttempt,
        lastError: state.lastError,
      })
      dispatch({ type: 'START', streamId })
    }, delaySec * 1000)

    return () => {
      if (reconnectTimerRef.current)
        window.clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }
  }, [state.status, state.status === 'reconnecting' ? state.attempt : null])

  const actions = useMemo(
    () => ({
      start: (streamId: string) => {
        clearTimers()
        disconnectedRef.current = false
        dispatch({ type: 'START', streamId })
      },
      play: () => dispatch({ type: 'PLAY' }),
      pause: () => dispatch({ type: 'PAUSE' }),
      disconnect: () => {
        disconnectedRef.current = true
        clearTimers()
        dispatch({ type: 'DISCONNECT' })
      },
      reset: () => {
        disconnectedRef.current = true
        clearTimers()
        dispatch({ type: 'RESET' })
      },
    }),
    []
  )

  return { state, actions }
}
