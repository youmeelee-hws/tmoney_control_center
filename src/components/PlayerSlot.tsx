import React from 'react'
import { usePlayerMachine } from '@/hooks/usePlayerMachine'
import { useWebRTCPlayer } from '@/hooks/useWebRTCPlayer'

export default function PlayerSlot({
  streamId,
  mode,
  selected = true,
  onClick,
  detected = false,
  onStatusChange,
}: {
  streamId: string
  mode: 'main' | 'thumb'
  selected?: boolean
  onClick?: () => void
  detected?: boolean
  onStatusChange?: (status: string) => void
}) {
  const { state, actions } = usePlayerMachine()
  const videoRef = React.useRef<HTMLVideoElement>(null)

  // 티켓 발급 및 자동 갱신 관리
  React.useEffect(() => {
    actions.start(streamId)
    return () => actions.disconnect() // unmount 시 정리(중요)
  }, [streamId])

  // ready 상태가 되면 자동으로 play 액션 호출
  React.useEffect(() => {
    if (state.status === 'ready') {
      actions.play()
    }
  }, [state.status, actions])

  // WebRTC 플레이어 연결 (티켓이 있고 playing 상태일 때만)
  const whepUrl =
    state.status === 'playing' ||
    state.status === 'paused' ||
    state.status === 'ready' ||
    state.status === 'connecting' ||
    state.status === 'refreshing_ticket'
      ? (state as any).ticket?.whepUrl || ''
      : ''

  const { state: webrtcState, error: webrtcError } = useWebRTCPlayer({
    whepUrl,
    videoRef,
    autoPlay: true,
    streamId,
  })

  // 상태 변경 시 부모에게 알림
  React.useEffect(() => {
    if (onStatusChange) {
      // WebRTC 상태 우선, 없으면 플레이어 상태
      // rendering 상태가 되면 실제 비디오가 화면에 표시되고 있음
      const currentStatus = webrtcState !== 'idle' ? webrtcState : state.status
      onStatusChange(currentStatus)
    }
  }, [state.status, webrtcState, onStatusChange])

  // mode가 'thumb'일 때는 썸네일 스타일
  if (mode === 'thumb') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={streamId}
        title={streamId}
      >
        {/* 비디오 엘리먼트는 항상 렌더링 (WebRTC가 srcObject를 설정해야 함) */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display:
              state.status === 'playing' ||
              webrtcState === 'playing' ||
              webrtcState === 'connected' ||
              webrtcState === 'rendering'
                ? 'block'
                : 'none',
          }}
        />
        {/* 로딩/에러 상태 표시 */}
        {!(
          state.status === 'playing' ||
          webrtcState === 'playing' ||
          webrtcState === 'connected' ||
          webrtcState === 'rendering'
        ) && <div>{webrtcError || state.status}</div>}
      </button>
    )
  }

  // mode가 'main'일 때는 메인 화면 스타일
  return (
    <div>
      {/* 비디오 영역 */}
      {/* 비디오 엘리먼트는 항상 렌더링 (WebRTC가 srcObject를 설정해야 함) */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display:
            state.status === 'playing' ||
            webrtcState === 'playing' ||
            webrtcState === 'connected' ||
            webrtcState === 'rendering'
              ? 'block'
              : 'none',
        }}
      />
      {/* 로딩/에러 상태 표시 */}
      {!(
        state.status === 'playing' ||
        webrtcState === 'playing' ||
        webrtcState === 'connected' ||
        webrtcState === 'rendering'
      ) && <div>{webrtcError || state.status}</div>}
    </div>
  )
}
