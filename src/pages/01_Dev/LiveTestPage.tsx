import React, { useEffect } from 'react'
import { getStreamList } from '@/api/streams'
import TestPlayerSlot from '@/components/TestPlayerSlot'

export default function LiveTestPage() {
  const [streamId, setStreamId] = React.useState<string>('')

  const testStreamList = async () => {
    try {
      const r1 = await getStreamList()
      if (r1?.streams?.[0]?.id) {
        setStreamId(r1.streams[0].id)
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
        {streamId && <TestPlayerSlot streamId={streamId} mode="main" />}
      </div>
    </div>
  )
}
