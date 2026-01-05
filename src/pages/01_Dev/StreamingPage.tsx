import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import live from '@/assets/images/live.svg'
import PlayerSlot from '@/components/PlayerSlot'

const StreamingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  // TODO 선택된 지하철역의 gate 목록 조회
  const [gates, setGates] = useState<string[]>()
  // 선택된 gate 목록 관리
  const [selectedGate, setSelectedGate] = useState<string[]>()

  const getGates = async () => {
    // const response = await getGates()
    // setGates(response.data)
    setGates(['gate-001'])
    setSelectedGate(['gate-001'])
  }

  useEffect(() => {
    getGates()
  }, [])

  // gate 선택 핸들러
  const handleSelectGate = (gate: string) => {
    // if (selectedGate.includes(gate)) {
    //   setSelectedGate(selectedGate.filter(g => g !== gate))
    // } else {
    //   setSelectedGate(prev => [...prev, gate])
    // }
  }
  // gate 전체 선택 핸들러
  const handleSelectGateAll = () => {
    // setSelectedGate(gates)
  }

  return (
    <div className="dashboard-body">
      <div className="container">
        <div className="top-box">
          <div className="title mt-10">Seoul Station</div>
          <p className="live">
            <img src={live} alt="" />
            LIVE streaming
          </p>
          <div className="gate-box">
            <p className="s-tit">Select Gates</p>
            <div className="tab-box ml-20 round">
              {gates?.map((gate, index) => (
                <p
                  className={clsx(
                    'tab',
                    selectedGate?.includes(gate) ? 'active' : ''
                  )}
                  key={`gate-${index}`}
                  onClick={() => handleSelectGate(gate)}
                >
                  {gate}
                </p>
              ))}
              <p className="tab all" onClick={handleSelectGateAll}>
                All
              </p>
            </div>
          </div>
        </div>

        <div className="video-wrap">
          <div className="video-box">
            {selectedGate?.[0] && (
              <div className={clsx('video-card', isLoading ? 'loading' : '')}>
                <div className="video">
                  <PlayerSlot
                    streamId={'stream-001'}
                    mode="main"
                    onStatusChange={status => {
                      // rendering 상태가 되면 실제 비디오 프레임이 화면에 표시됨
                      setIsLoading(status !== 'rendering')
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StreamingPage
