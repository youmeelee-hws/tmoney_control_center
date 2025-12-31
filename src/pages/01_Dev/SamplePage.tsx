import React, { useEffect } from 'react'
import { getStreamList } from '@/api/streams'
import TestPlayerSlot from '@/components/TestPlayerSlot'

// Helper function for calculating thumbnail columns (temp.tsx와 동일)
function calcThumbCols(len: number) {
  return Math.max(1, Math.min(6, len))
}

export default function SamplePage() {
  const [streams, setStreams] = React.useState<
    Array<{ id: string; name: string }>
  >([])
  const [selectedStreamId, setSelectedStreamId] = React.useState<string>('')

  const testStreamList = async () => {
    try {
      const r1 = await getStreamList()
      if (r1?.streams && r1.streams.length > 0) {
        setStreams(r1.streams)
        setSelectedStreamId(r1.streams[0].id)
      }
    } catch (e: any) {
      console.debug(e.message)
    }
  }

  useEffect(() => {
    testStreamList()
  }, [])

  // 스트림 목록이 변경되면 첫 번째 스트림 선택
  React.useEffect(() => {
    if (streams.length > 0 && !selectedStreamId) {
      setSelectedStreamId(streams[0].id)
    }
  }, [streams, selectedStreamId])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1a1a',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 메인 컨텐츠 */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            height: '100%',
            display: 'grid',
            gridTemplateRows: '1fr 140px',
            gap: 0,
            overflow: 'hidden',
          }}
        >
          {/* 메인 비디오 영역 */}
          <section
            style={{
              minHeight: 0,
              overflow: 'hidden',
              backgroundColor: '#000',
            }}
          >
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: '1400px',
                  height: '100%',
                }}
              >
                {selectedStreamId ? (
                  <TestPlayerSlot
                    streamId={selectedStreamId}
                    mode="main"
                    selected
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '1.6rem',
                    }}
                  >
                    스트림을 불러오는 중...
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 썸네일 영역 */}
          <section
            style={{
              minHeight: 0,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: '#1a1a1a',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                display: 'grid',
                gap: 0,
                gridTemplateColumns: `repeat(${calcThumbCols(
                  streams.length
                )}, minmax(0, 1fr))`,
                overflow: 'hidden',
              }}
            >
              {streams.length === 0 ? (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  연결된 스트림이 없습니다.
                </div>
              ) : (
                streams.map(stream => (
                  <TestPlayerSlot
                    key={stream.id}
                    streamId={stream.id}
                    mode="thumb"
                    selected={stream.id === selectedStreamId}
                    onClick={() => setSelectedStreamId(stream.id)}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
