import React, { useEffect } from 'react'
import { issuePlayTicket, getStreamList } from '@/api/streams'

export default function LiveTestPage() {
  const [streamId, setStreamId] = React.useState<string>('')
  const [streamConfig, setStreamConfig] = React.useState<any>(null)

  const testStreamList = async () => {
    try {
      const r1 = await getStreamList()
      if (r1?.streams?.[0]?.id) {
        setStreamId(r1.streams[0].id)

        try {
          const r2 = await issuePlayTicket(r1.streams[0].id)
          setStreamConfig(r2)
        } catch (e: any) {
          console.debug(e.message)
        }
      }
    } catch (e: any) {
      console.debug(e.message)
    }
  }

  useEffect(() => {
    testStreamList()
  }, [])

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontSize: '2rem' }}>Live Streaming (Test)</h2>

      <div
        style={{
          width: '50vw',
          height: '50vh',
          border: '1px dashed #999',
          borderRadius: 12,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
        }}
      >
        {/* TODO 비디오 플레이어(<video>태그) */}
        {/* [여기에 MediaMTX(WebRTC/HLS) 플레이어가 들어갈 자리] */}
        <video
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          // controls
          autoPlay
          muted
          loop
          playsInline
          style={{ width: 'auto', height: '100%' }}
        />

        {/* 하단 고정 컨트롤 버튼 */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 8,
            color: 'white',
            fontSize: '1.5rem',
          }}
        >
          <button
            style={{
              border: '0.2rem solid white',
              padding: '0.5rem 1rem',
              color: 'white',
              fontSize: '1.5rem',
            }}
            onClick={() => console.log('재생')}
          >
            재생
          </button>
          <button
            style={{
              border: '0.2rem solid white',
              padding: '0.5rem 1rem',
              color: 'white',
              fontSize: '1.5rem',
            }}
            onClick={() => console.log('재시도')}
          >
            재시도
          </button>
          <button
            style={{
              border: '0.2rem solid white',
              padding: '0.5rem 1rem',
              color: 'white',
              fontSize: '1.5rem',
            }}
            onClick={() => console.log('연결 해제')}
          >
            연결 해제
          </button>
        </div>
      </div>
    </div>
  )
}
