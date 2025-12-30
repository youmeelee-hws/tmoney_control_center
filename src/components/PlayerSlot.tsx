import React from 'react'
import { usePlayerMachine } from '@/hooks/usePlayerMachine'

export default function PlayerSlot({
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
    <div>
      <div>
        {streamId} / {state.status}
      </div>
      {/* video 컴포넌트/가짜 플레이어/WebRTC 붙이기 */}
      <button onClick={actions.disconnect}>연결 해제</button>
    </div>
  )
}
