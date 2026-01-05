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
        {/* 라벨 */}
        {/* <div
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
          {streamId} / {state.status}
        </div> */}

        {/* 상태 뱃지 */}
        {/* <div
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
        </div> */}

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
        ) && (
          <div
          // style={{
          //   width: '100%',
          //   height: '100%',
          //   display: 'flex',
          //   alignItems: 'center',
          //   justifyContent: 'center',
          //   color: 'rgba(255, 255, 255, 0.5)',
          //   fontSize: '1.2rem',
          //   backgroundColor: '#1a1a1a',
          // }}
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
    // style={{
    //   position: 'relative',
    //   width: '100%',
    //   height: '100%',
    //   backgroundColor: '#000',
    //   overflow: 'hidden',
    //   border: isDetected ? '4px solid #f6335a' : 'none',
    //   boxShadow: isDetected
    //     ? '0 0 30px rgba(246, 51, 90, 0.7), 0 0 60px rgba(246, 51, 90, 0.5), inset 0 0 30px rgba(246, 51, 90, 0.2)'
    //     : 'none',
    //   animation: isDetected ? 'pulse 2s ease-in-out infinite' : 'none',
    // }}
    >
      {/* 상태 표시 */}
      {/* <div
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
      </div> */}

      {/* 상태 뱃지 */}
      {/* <div
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
      </div> */}

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
      ) && (
        <div
        // style={{
        //   width: '100%',
        //   height: '100%',
        //   display: 'flex',
        //   alignItems: 'center',
        //   justifyContent: 'center',
        //   color: 'rgba(255, 255, 255, 0.5)',
        //   fontSize: '1.8rem',
        //   backgroundColor: '#1a1a1a',
        // }}
        >
          {webrtcError || state.status}
        </div>
      )}
    </div>
  )
}
