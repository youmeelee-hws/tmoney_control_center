import React, { useEffect } from 'react'
import clsx from 'clsx'
import { getStationGates, getGateStreams } from '@/api/streams'
import TestPlayerSlot from '@/components/TestPlayerSlot'
import { useStationContext } from '@/routes/DevRouter'

type LayoutPreset = '3x3' | '2x2' | '4x4'

interface PresetConfig {
  label: string
  rows: number
  cols: number
  maxStreams: number
}

const PRESET_CONFIGS: Record<LayoutPreset, PresetConfig> = {
  '3x3': { label: '기본 관제 화면', rows: 3, cols: 3, maxStreams: 9 },
  '2x2': { label: '야간 모드', rows: 2, cols: 2, maxStreams: 4 },
  '4x4': { label: '전체 감시 모드', rows: 4, cols: 4, maxStreams: 16 },
}

export default function SamplePage2() {
  // Use context to get selected station from NewLayout
  const { selectedStation, stations } = useStationContext()

  const [streams, setStreams] = React.useState<
    Array<{ id: string; name: string; gateName: string; detected: boolean }>
  >([])
  const [selectedPreset, setSelectedPreset] =
    React.useState<LayoutPreset>('3x3')
  const [fullscreenStreamId, setFullscreenStreamId] = React.useState<
    string | null
  >(null)

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
      } catch (e: any) {
        console.debug(e.message)
      }
    }

    loadStreamList()
  }, [selectedStation])

  const currentConfig = PRESET_CONFIGS[selectedPreset]
  const displayStreams = streams.slice(0, currentConfig.maxStreams)

  // 빈 슬롯을 채우기 위한 배열 생성
  const totalSlots = currentConfig.maxStreams
  const emptySlots = Math.max(0, totalSlots - displayStreams.length)

  // 스트림 클릭 핸들러
  const handleStreamClick = (streamId: string) => {
    if (fullscreenStreamId === streamId) {
      // 이미 전체화면인 경우 그리드로 돌아가기
      setFullscreenStreamId(null)
    } else {
      // 전체화면으로 전환
      setFullscreenStreamId(streamId)
    }
  }

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
      {/* 상단 컨트롤 영역 */}
      <div
        style={{
          padding: '2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: '#1a1a1a',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          <p
            style={{
              fontSize: '1.6rem',
              fontWeight: 500,
              color: '#fff',
              margin: 0,
              minWidth: '8rem',
            }}
          >
            레이아웃 프리셋
          </p>
          <div className="tab-box ml-20 round">
            {(Object.keys(PRESET_CONFIGS) as LayoutPreset[]).map(preset => (
              <p
                key={preset}
                className={clsx(
                  'tab',
                  selectedPreset === preset ? 'active' : ''
                )}
                onClick={() => setSelectedPreset(preset)}
                style={{ cursor: 'pointer' }}
              >
                {PRESET_CONFIGS[preset].label}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 그리드 영역 */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: fullscreenStreamId ? 0 : '2rem',
        }}
      >
        {fullscreenStreamId ? (
          // 전체화면 모드
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#000',
            }}
            onClick={() => setFullscreenStreamId(null)}
          >
            <TestPlayerSlot
              streamId={fullscreenStreamId}
              mode="main"
              selected
              onClick={() => setFullscreenStreamId(null)}
              detected={
                streams.find(s => s.id === fullscreenStreamId)?.detected ||
                false
              }
            />
          </div>
        ) : (
          // 그리드 모드
          <div
            style={{
              display: 'grid',
              gridTemplateRows: `repeat(${currentConfig.rows}, 1fr)`,
              gridTemplateColumns: `repeat(${currentConfig.cols}, 1fr)`,
              gap: '1rem',
              height: '100%',
              minHeight: 0,
            }}
          >
            {/* 실제 스트림 표시 */}
            {displayStreams.map(stream => (
              <div
                key={stream.id}
                style={{
                  minHeight: 0,
                  minWidth: 0,
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                onClick={() => handleStreamClick(stream.id)}
              >
                <TestPlayerSlot
                  streamId={stream.id}
                  mode="main"
                  selected
                  detected={stream.detected}
                />
              </div>
            ))}

            {/* 빈 슬롯 표시 */}
            {Array.from({ length: emptySlots }).map((_, index) => (
              <div
                key={`empty-${index}`}
                style={{
                  minHeight: 0,
                  minWidth: 0,
                  overflow: 'hidden',
                  backgroundColor: '#000',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.3)',
                  fontSize: '1.2rem',
                }}
              >
                빈 슬롯
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
