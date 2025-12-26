import React from 'react'
import { ping } from '@/api/debug'
import { issuePlayTicket } from '@/api/streams'

export default function Live() {
  const [log, setLog] = React.useState<string>('')

  const testPing = async () => {
    try {
      const r = await ping()
      setLog(JSON.stringify(r, null, 2))
    } catch (e: any) {
      setLog(e.message)
    }
  }

  const testTicket = async () => {
    try {
      const r = await issuePlayTicket('STREAM-001')
      setLog(JSON.stringify(r, null, 2))
    } catch (e: any) {
      setLog(e.message)
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontSize: '2rem' }}>Live Streaming (Test)</h2>

      <div
        style={{
          fontSize: '1.5rem',
          display: 'flex',
          gap: 8,
          marginBottom: 12,
        }}
      >
        <button onClick={testPing}>GET /ping</button>
        <button onClick={testTicket}>POST /streams/.../play-ticket</button>
      </div>

      <div
        style={{
          width: '50vw', // TODO 임시
          height: '50vh', // TODO 임시
          border: '1px dashed #999',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
        }}
      >
        {/* TODO 비디오 플레이어(<video>태그) */}
        [여기에 MediaMTX(WebRTC/HLS) 플레이어가 들어갈 자리]
      </div>

      <pre
        style={{
          fontSize: '1.5rem',
          background: '#111',
          color: '#0f0',
          padding: 12,
          borderRadius: 12,
        }}
      >
        {log || 'API 호출 결과가 여기에 표시됩니다.'}
      </pre>
    </div>
  )
}
