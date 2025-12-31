import React, { useEffect } from 'react'
import { getStationGates, getGateStreams } from '@/api/streams'
import TestPlayerSlot from '@/components/TestPlayerSlot'
import { useStationContext } from '@/routes/DevRouter'

// Helper function for calculating thumbnail columns (temp.tsx와 동일)
function calcThumbCols(len: number) {
  return Math.max(1, Math.min(6, len))
}

export default function SamplePage() {
  // Use context to get selected station from NewLayout
  const { selectedStation } = useStationContext()

  const [streams, setStreams] = React.useState<
    Array<{ id: string; name: string; gateName: string; detected: boolean }>
  >([])
  const [selectedStreamId, setSelectedStreamId] = React.useState<string>('')

  // Load streams when station changes
  useEffect(() => {
    if (!selectedStation) return

    const loadStreamList = async () => {
      try {
        // 1. 선택된 역의 모든 게이트 가져오기
        const gatesResponse = await getStationGates(selectedStation)
        const allStreams: Array<{
          id: string
          name: string
          gateName: string
          detected: boolean
        }> = []

        // 2. 각 게이트의 스트림 가져오기 (게이트당 1개만 존재)
        for (const gate of gatesResponse.gates) {
          try {
            const streamsResponse = await getGateStreams(gate.gateId)
            if (streamsResponse.streams.length > 0) {
              const stream = streamsResponse.streams[0] // 게이트당 1개만
              // 30% 확률로 감지 상태 설정
              const detected = Math.random() < 0.3
              allStreams.push({
                id: stream.streamId,
                name: stream.name,
                gateName: gate.name,
                detected,
              })
            }
          } catch (err) {
            console.debug(`Failed to load stream for gate ${gate.gateId}`)
          }
        }

        setStreams(allStreams)
        // 첫 번째 스트림 자동 선택
        if (allStreams.length > 0) {
          setSelectedStreamId(allStreams[0].id)
        }
      } catch (e: any) {
        console.debug(e.message)
      }
    }

    loadStreamList()
  }, [selectedStation])

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
                    detected={
                      streams.find(s => s.id === selectedStreamId)?.detected ||
                      false
                    }
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
                  <div
                    key={stream.id}
                    style={{
                      position: 'relative',
                      height: '100%',
                      minHeight: 0,
                      minWidth: 0,
                      cursor: 'pointer',
                      overflow: 'hidden',
                    }}
                    onClick={() => setSelectedStreamId(stream.id)}
                  >
                    <TestPlayerSlot
                      streamId={stream.id}
                      mode="thumb"
                      selected={stream.id === selectedStreamId}
                      onClick={() => setSelectedStreamId(stream.id)}
                      detected={stream.detected}
                    />
                    {/* 게이트 이름 오버레이 */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '0.5rem',
                        left: '0.5rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: '#fff',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '0.4rem',
                        fontSize: '1.2rem',
                        fontWeight: 500,
                        pointerEvents: 'none',
                      }}
                    >
                      {stream.gateName}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
