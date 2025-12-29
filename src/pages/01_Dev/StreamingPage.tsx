import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import live from '@/assets/images/live.svg'
import camera from '@/assets/images/camera.svg'

function LoadingSpinner() {
  return (
    <div className="img">
      {/* <img src={video} alt="" />
                <span className="live">live</span> */}
      <div className="camera-info">
        <img src={camera} alt="" />
        <p className="b-tit">미디어 서버에 연결 중...</p>
      </div>
    </div>
  )
}

function VideoPlaceholder({ label }: { label: string }) {
  return (
    <video
      src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      controls
      autoPlay
      muted
      loop
      playsInline
      style={{ width: 'auto', height: '100%' }}
    />
  )
}

const StreamingPage: React.FC = () => {
  // TODO 선택된 지하철역의 gate 목록 조회
  const [gates, setGates] = useState<string[]>()
  // 선택된 gate 목록 관리
  const [selectedGate, setSelectedGate] = useState<string[]>()

  const getGates = async () => {
    // const response = await getGates()
    // setGates(response.data)
    setGates([
      'Gate-01',
      // 'Gate-02',
      // 'Gate-03',
      // 'Gate-04',
    ])
    setSelectedGate(['Gate-01'])
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

  // 미디어 서버 연결 시뮬레이션
  const [isMediaServerConnecting, setIsMediaServerConnecting] = useState(true)
  useEffect(() => {
    const connectToMediaServer = async () => {
      setIsMediaServerConnecting(true)
      try {
        // TODO: 실제 미디어 서버 연결 로직
        // await fetch('/api/media-server/connect')
        await new Promise(resolve => setTimeout(resolve, 2000)) // 시뮬레이션
      } catch (error) {
        console.error('미디어 서버 연결 실패:', error)
      } finally {
        setIsMediaServerConnecting(false)
      }
    }

    connectToMediaServer()
  }, [selectedGate]) // selectedGate 변경 시 재연결

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
            {selectedGate && (
              <div
                className={clsx(
                  'video-card',
                  isMediaServerConnecting ? 'loading' : ''
                )}
              >
                <div className="video">
                  {isMediaServerConnecting ? (
                    <LoadingSpinner />
                  ) : (
                    <VideoPlaceholder label={selectedGate?.[0]} />
                  )}
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
