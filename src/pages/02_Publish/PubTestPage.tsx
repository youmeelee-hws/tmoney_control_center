import React, { useState } from 'react'
import live from '@/assets/images/live.svg'
import video from '@/assets/images/video.png'
import camera from '@/assets/images/camera.svg'
// import arrowPrev from '@/assets/images/arrow-prev.svg'
// import arrowNext from '@/assets/images/arrow-next.svg'
import play from '@/assets/images/play.svg'
import pause from '@/assets/images/pause.svg'
import comment from '@/assets/images/comment.svg'
import fullScreen from '@/assets/images/full-s.svg'
import stop from '@/assets/images/stop.svg'
const options = [
  { value: '1', label: 'Seoul station' },
  { value: '2', label: 'Gangnam station' },
]

const PubTestPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <div className="dashboard-body">
      <div className="container">
        <div className="top-box">
          <div className="title mt-10">
          Seoul Station
          </div>
          <p className="live">
            <img src={live} alt="" />
            LIVE streaming
          </p>
          <div className="gate-box">
            <p className="s-tit">Select Gates</p>
            <div className="tab-box ml-20 round">
              <p className="tab active">Gate-01</p>
              <p className="tab">Gate-02</p>
              <p className="tab">Gate-03</p>
              <p className="tab">Gate-04</p>
              <p className="tab all">All</p>
            </div>
          </div>
        </div>
        <div className="video">
          <div className="video-box">
            <div className="video-card">
              <div className="img">
                <img src={video} alt="" />
                <div className="camera-info">
                  <img src={camera} alt="" />
                  <p className="b-tit">
                    Seoul Station · Gate-01 Camera CAM-01 live stream seat
                  </p>
                </div>
              </div>
              <div className="top-info flex-space-center">
                <div className="">
                  <p className="b-tit">Gate-01 · CAM-01</p>
                  <p className="desc">people/minute ≈ 120</p>
                </div>
                <span className="badge green">Normal</span>
              </div>
              <div className="bottom-info flex-space-center">
                
                <div className="nav-btn-box">
                  <div className="nav-btn-box-left">
                    {/* 앞으로 10초 */}
                    {/* <button className="nav-btn">
                      <img src={back} alt="" />
                    </button> */}
                    <button className="nav-btn" onClick={() => setIsPlaying(prev => !prev)}>
                      <img src={isPlaying ? pause : play} alt="play/pause" />
                    </button>
                    <button className="nav-btn">
                      <img src={stop} alt="" />
                    </button>
                    {/* 뒤으로 10초 */}
                    {/* <button className="nav-btn">
                      <img src={forward} alt="" />
                    </button> */}
                  </div>
                  <div className="nav-btn-box-right">
                    {/* 코멘트 */}
                    <button className="nav-btn">
                      <img src={comment} alt="" />
                    </button>
                    {/* 풀스크린 */}
                    <button className="nav-btn">
                      <img src={fullScreen} alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PubTestPage
