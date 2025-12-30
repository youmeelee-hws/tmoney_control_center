import React from 'react'
import { usePlayerMachine } from '@/hooks/usePlayerMachine'

export default function TestPlayerSlot({
  streamId,
  mode,
}: {
  streamId: string
  mode: 'main' | 'thumb'
}) {
  const { state, actions } = usePlayerMachine()

  React.useEffect(() => {
    actions.start(streamId)
    return () => actions.disconnect() // unmount 시 정리(중요)
  }, [streamId])

  return (
    <>
      <div>
        {streamId} / {state.status}
      </div>

      {state.status === 'playing' && (
        <video
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          // controls
          autoPlay
          muted
          loop
          playsInline
          style={{ width: 'auto', height: '100%' }}
        />
      )}

      {/* 하단 고정 컨트롤 버튼 */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
        }}
      >
        <button
          style={{
            border: '0.2rem solid white',
            padding: '0.5rem 1rem',
            color: state.status === 'playing' ? 'white' : 'black',
            fontSize: '1.5rem',
          }}
          onClick={actions.play}
        >
          재생
        </button>
        <button
          style={{
            border: '0.2rem solid white',
            padding: '0.5rem 1rem',
            color: state.status === 'playing' ? 'white' : 'black',
            fontSize: '1.5rem',
          }}
          onClick={() => {
            actions.reset()
            console.log('재시도')
            actions.start(streamId)
          }}
        >
          재시도
        </button>
        <button
          style={{
            border: '0.2rem solid white',
            padding: '0.5rem 1rem',
            color: state.status === 'playing' ? 'white' : 'black',
            fontSize: '1.5rem',
          }}
          onClick={actions.disconnect}
        >
          연결 해제
        </button>
      </div>
    </>
  )
}
