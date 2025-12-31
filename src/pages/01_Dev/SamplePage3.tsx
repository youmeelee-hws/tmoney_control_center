import React, { useState, useEffect } from 'react'
import TestPlayerSlot from '@/components/TestPlayerSlot'

// Mock data from temp.tsx
type GateCam = {
  gateId: string
  streamId: string
}

const mockGatesByStation: Record<string, GateCam[]> = {
  서울역: [
    { gateId: 'Gate-01', streamId: 'cam-001' },
    { gateId: 'Gate-02', streamId: 'cam-002' },
    { gateId: 'Gate-03', streamId: 'cam-003' },
    { gateId: 'Gate-04', streamId: 'cam-004' },
  ],
  강남역: [
    { gateId: 'Gate-01', streamId: 'cam-005' },
    { gateId: 'Gate-02', streamId: 'cam-006' },
    { gateId: 'Gate-03', streamId: 'cam-007' },
  ],
  잠실역: [
    { gateId: 'Gate-01', streamId: 'cam-008' },
    { gateId: 'Gate-02', streamId: 'cam-009' },
  ],
}

type SlotConfig = {
  streamId: string | null
  gateId: string | null
  isDefault: boolean // 기본 슬롯은 삭제 불가
}

const SamplePage3: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<string>('서울역')
  const [slots, setSlots] = useState<SlotConfig[]>([])
  const [fullscreenSlotIndex, setFullscreenSlotIndex] = useState<number | null>(
    null
  )
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
    null
  )
  const [savedConfigs, setSavedConfigs] = useState<
    Array<{ name: string; slots: SlotConfig[] }>
  >([])

  // 초기 슬롯 설정 (서울역 4개 게이트 + 5개 빈 슬롯)
  useEffect(() => {
    const defaultGates = mockGatesByStation['서울역'].slice(0, 4)
    const initialSlots: SlotConfig[] = [
      ...defaultGates.map(gate => ({
        streamId: gate.streamId,
        gateId: gate.gateId,
        isDefault: true,
      })),
      ...Array(5).fill({ streamId: null, gateId: null, isDefault: false }),
    ]
    setSlots(initialSlots)
  }, [])

  // 슬롯 클릭 핸들러
  const handleSlotClick = (index: number) => {
    if (fullscreenSlotIndex === index) {
      // 전체화면 모드 해제
      setFullscreenSlotIndex(null)
    } else if (fullscreenSlotIndex !== null) {
      // 전체화면 모드에서 다른 슬롯 클릭 시 전체화면 해제
      setFullscreenSlotIndex(null)
    } else {
      // 일반 모드에서 슬롯 클릭 시 전체화면으로
      if (slots[index].streamId) {
        setFullscreenSlotIndex(index)
      }
    }
  }

  // 사이드바에서 게이트 선택 핸들러
  const handleGateSelect = (gate: GateCam) => {
    if (selectedSlotIndex === null) return

    const slot = slots[selectedSlotIndex]
    if (slot.isDefault) return // 기본 슬롯은 변경 불가

    const newSlots = [...slots]
    newSlots[selectedSlotIndex] = {
      streamId: gate.streamId,
      gateId: gate.gateId,
      isDefault: false,
    }
    setSlots(newSlots)
    setSelectedSlotIndex(null)
  }

  // 슬롯 삭제 핸들러
  const handleSlotDelete = (index: number) => {
    const slot = slots[index]
    if (slot.isDefault) return // 기본 슬롯은 삭제 불가

    const newSlots = [...slots]
    newSlots[index] = { streamId: null, gateId: null, isDefault: false }
    setSlots(newSlots)
    if (selectedSlotIndex === index) {
      setSelectedSlotIndex(null)
    }
  }

  // 슬롯 구성 저장
  const handleSaveConfig = () => {
    const configName = prompt('구성 이름을 입력하세요:')
    if (configName) {
      setSavedConfigs([
        ...savedConfigs,
        { name: configName, slots: [...slots] },
      ])
      alert(`"${configName}" 구성이 저장되었습니다.`)
    }
  }

  // 저장된 구성 불러오기
  const handleLoadConfig = (config: { name: string; slots: SlotConfig[] }) => {
    if (confirm(`"${config.name}" 구성을 불러오시겠습니까?`)) {
      setSlots([...config.slots])
      setSelectedSlotIndex(null)
      setFullscreenSlotIndex(null)
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
      }}
    >
      {/* 메인 컨텐츠 영역 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        {/* 저장 버튼 영역 */}
        <div
          style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: '#1a1a1a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={handleSaveConfig}
              style={{
                padding: '0.8rem 1.6rem',
                backgroundColor: '#f08300',
                color: '#fff',
                border: 'none',
                borderRadius: '0.6rem',
                fontSize: '1.4rem',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              현재 구성 저장
            </button>
            {savedConfigs.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '1.4rem',
                  }}
                >
                  저장된 구성:
                </span>
                {savedConfigs.map((config, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLoadConfig(config)}
                    style={{
                      padding: '0.6rem 1.2rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.5rem',
                      fontSize: '1.3rem',
                      cursor: 'pointer',
                    }}
                  >
                    {config.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedSlotIndex !== null &&
            !slots[selectedSlotIndex].isDefault && (
              <span
                style={{
                  color: '#f08300',
                  fontSize: '1.4rem',
                  fontWeight: 500,
                }}
              >
                사이드바에서 게이트를 선택하세요
              </span>
            )}
        </div>

        {/* 그리드 영역 */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            padding: fullscreenSlotIndex !== null ? 0 : '2rem',
            minHeight: 0,
          }}
        >
          {fullscreenSlotIndex !== null ? (
            // 전체화면 모드
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#000',
              }}
              onClick={() => setFullscreenSlotIndex(null)}
            >
              {slots[fullscreenSlotIndex].streamId && (
                <TestPlayerSlot
                  streamId={slots[fullscreenSlotIndex].streamId!}
                  mode="main"
                  selected
                  onClick={() => setFullscreenSlotIndex(null)}
                />
              )}
            </div>
          ) : (
            // 그리드 모드 (3x3)
            <div
              style={{
                display: 'grid',
                gridTemplateRows: 'repeat(3, 1fr)',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                height: '100%',
                width: '100%',
                minHeight: 0,
              }}
            >
              {slots.map((slot, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    minHeight: 0,
                    minWidth: 0,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border:
                      selectedSlotIndex === index
                        ? '3px solid #f08300'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  onClick={() => {
                    if (slot.streamId) {
                      handleSlotClick(index)
                    } else if (!slot.isDefault) {
                      setSelectedSlotIndex(index)
                    }
                  }}
                >
                  {slot.streamId ? (
                    <>
                      <TestPlayerSlot
                        streamId={slot.streamId}
                        mode="main"
                        selected
                      />
                      {!slot.isDefault && (
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            handleSlotDelete(index)
                          }}
                          style={{
                            position: 'absolute',
                            bottom: '1rem',
                            right: '1rem',
                            padding: '0.6rem 1.2rem',
                            backgroundColor: 'rgba(246, 51, 90, 0.9)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            zIndex: 20,
                          }}
                        >
                          삭제
                        </button>
                      )}
                    </>
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255, 255, 255, 0.3)',
                        fontSize: '1.4rem',
                      }}
                    >
                      {selectedSlotIndex === index
                        ? '게이트를 선택하세요'
                        : '빈 슬롯'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 사이드바 */}
      <div
        style={{
          width: '30rem',
          height: '100%',
          backgroundColor: '#2a0a26',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* 역 선택 */}
        <div
          style={{
            padding: '2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1.3rem',
              marginBottom: '1rem',
            }}
          >
            역 선택
          </p>
          <select
            value={selectedStation}
            onChange={e => setSelectedStation(e.target.value)}
            style={{
              width: '100%',
              height: '4rem',
              fontSize: '1.5rem',
              padding: '0.8rem 1.2rem',
              borderRadius: '0.6rem',
              outline: 'none',
              border: '1px solid rgba(255, 255, 255, 0.21)',
              backgroundColor: '#555',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            {Object.keys(mockGatesByStation).map(station => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
        </div>

        {/* 게이트 목록 */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '2rem',
          }}
        >
          <p
            style={{
              color: '#fff',
              fontSize: '1.6rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}
          >
            게이트 목록
          </p>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {mockGatesByStation[selectedStation]?.map(gate => (
              <button
                key={gate.streamId}
                onClick={() => handleGateSelect(gate)}
                disabled={selectedSlotIndex === null}
                style={{
                  padding: '1.5rem',
                  backgroundColor:
                    selectedSlotIndex !== null
                      ? 'rgba(240, 131, 0, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.8rem',
                  color: '#fff',
                  fontSize: '1.4rem',
                  cursor:
                    selectedSlotIndex !== null ? 'pointer' : 'not-allowed',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  opacity: selectedSlotIndex !== null ? 1 : 0.6,
                }}
                onMouseEnter={e => {
                  if (selectedSlotIndex !== null) {
                    e.currentTarget.style.backgroundColor =
                      'rgba(240, 131, 0, 0.4)'
                  }
                }}
                onMouseLeave={e => {
                  if (selectedSlotIndex !== null) {
                    e.currentTarget.style.backgroundColor =
                      'rgba(240, 131, 0, 0.2)'
                  }
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                  {gate.gateId}
                </div>
                <div
                  style={{
                    fontSize: '1.2rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  {gate.streamId}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SamplePage3
