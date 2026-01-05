import React from 'react'
import { usePlayerMachine } from '@/hooks/usePlayerMachine'
import { useWebRTCPlayer } from '@/hooks/useWebRTCPlayer'

// 애니메이션 스타일 추가
const style = document.createElement('style')
style.textContent = `
  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 20px rgba(246, 51, 90, 0.6), 0 0 40px rgba(246, 51, 90, 0.4);
    }
    50% {
      box-shadow: 0 0 30px rgba(246, 51, 90, 0.9), 0 0 60px rgba(246, 51, 90, 0.6);
    }
  }
`
if (!document.head.querySelector('style[data-pulse-animation]')) {
  style.setAttribute('data-pulse-animation', 'true')
  document.head.appendChild(style)
}

export default function TestPlayerSlot({
  streamId,
  mode,
  selected = true,
  onClick,
  detected = false,
}: {
  streamId: string
  mode: 'main' | 'thumb'
  selected?: boolean
  onClick?: () => void
  detected?: boolean
}) {
  const { state, actions } = usePlayerMachine()
  const videoRef = React.useRef<HTMLVideoElement>(null)

  // detected prop으로 감지 상태 제어
  const isDetected = detected
  const badgeText = isDetected ? 'Detected' : 'Normal'
  const badgeColor = isDetected ? '#f6335a' : '#09dc99'

  // 티켓 발급 및 자동 갱신 관리
  React.useEffect(() => {
    actions.start(streamId)
    return () => actions.disconnect() // unmount 시 정리(중요)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // 디버깅용 로그
  React.useEffect(() => {
    console.log('[TestPlayerSlot] State:', state.status)
    console.log('[TestPlayerSlot] Ticket:', (state as any).ticket)
    console.log('[TestPlayerSlot] WHEP URL:', whepUrl)
  }, [state.status, whepUrl])

  const { state: webrtcState, error: webrtcError } = useWebRTCPlayer({
    whepUrl,
    videoRef,
    autoPlay: true,
  })

  // mode가 'thumb'일 때는 썸네일 스타일
  if (mode === 'thumb') {
    const getBorderStyle = () => {
      if (selected) {
        return '3px solid #f08300'
      }
      if (isDetected) {
        return '3px solid #f6335a'
      }
      return '1px solid rgba(255, 255, 255, 0.1)'
    }

    return (
      <button
        type="button"
        onClick={onClick}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
          overflow: 'hidden',
          border: getBorderStyle(),
          cursor: 'pointer',
          padding: 0,
          transition: 'border-color 0.2s ease',
          boxShadow:
            isDetected && !selected
              ? '0 0 20px rgba(246, 51, 90, 0.6), 0 0 40px rgba(246, 51, 90, 0.4)'
              : 'none',
          animation:
            isDetected && !selected ? 'pulse 2s ease-in-out infinite' : 'none',
        }}
        aria-label={streamId}
        title={streamId}
      >
        {/* 라벨 */}
        <div
          style={{
            position: 'absolute',
            top: '0.8rem',
            left: '0.8rem',
            padding: '0.4rem 0.8rem',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            borderRadius: '0.5rem',
            fontSize: '1.1rem',
            fontWeight: 500,
            zIndex: 10,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {streamId} / {webrtcState}
        </div>

        {/* 상태 뱃지 */}
        <div
          style={{
            position: 'absolute',
            top: '0.8rem',
            right: '0.8rem',
            padding: '0.4rem 0.8rem',
            backgroundColor: badgeColor,
            color: '#fff',
            borderRadius: '0.5rem',
            fontSize: '1.1rem',
            fontWeight: 500,
            zIndex: 10,
          }}
        >
          {badgeText}
        </div>

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
              webrtcState === 'connected'
                ? 'block'
                : 'none',
          }}
        />
        {/* 로딩/에러 상태 표시 */}
        {!(
          state.status === 'playing' ||
          webrtcState === 'playing' ||
          webrtcState === 'connected'
        ) && (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '1.2rem',
              backgroundColor: '#1a1a1a',
            }}
          >
            {webrtcError || state.status}
          </div>
        )}
      </button>
    )
  }

  // mode가 'main'일 때는 메인 화면 스타일
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        overflow: 'hidden',
        border: isDetected ? '4px solid #f6335a' : 'none',
        boxShadow: isDetected
          ? '0 0 30px rgba(246, 51, 90, 0.7), 0 0 60px rgba(246, 51, 90, 0.5), inset 0 0 30px rgba(246, 51, 90, 0.2)'
          : 'none',
        animation: isDetected ? 'pulse 2s ease-in-out infinite' : 'none',
      }}
    >
      {/* 상태 표시 */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          padding: '1rem 2rem',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          borderRadius: '1rem',
          fontSize: '1.5rem',
          fontWeight: 500,
          zIndex: 10,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {streamId} / {state.status}
      </div>

      {/* 상태 뱃지 */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          padding: '1rem 2rem',
          backgroundColor: badgeColor,
          color: '#fff',
          borderRadius: '1rem',
          fontSize: '1.5rem',
          fontWeight: 500,
          zIndex: 10,
        }}
      >
        {badgeText}
      </div>

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
            webrtcState === 'connected'
              ? 'block'
              : 'none',
        }}
      />
      {/* 로딩/에러 상태 표시 */}
      {!(
        state.status === 'playing' ||
        webrtcState === 'playing' ||
        webrtcState === 'connected'
      ) && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '1.8rem',
            backgroundColor: '#1a1a1a',
          }}
        >
          {webrtcError || state.status}
        </div>
      )}
    </div>
  )
}
