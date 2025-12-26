// import React, { useState } from 'react'
import live from '@/assets/images/live.svg'
import video from '@/assets/images/video.png'
import camera from '@/assets/images/camera.svg'
import arrowPrev from '@/assets/images/arrow-prev.svg'
import arrowNext from '@/assets/images/arrow-next.svg'
import Select from 'react-select'

const options = [
  { value: '1', label: 'Seoul station' },
  { value: '2', label: 'Gangnam station' },
]

const PubTestPage: React.FC = () => {
  return (
    <div className="dashboard-body">
      <div className="container">
        <div className="top-box">
          <div className="title mt-10">
          Seoul Station
          </div>
          {/* <div className="select-area">
            <Select
              className="custom-select-container"
              classNamePrefix="custom-select"
              options={options}
              placeholder="Please select a station"
              // value={selectedOption}
              // onChange={setSelectedOption}
            />
          </div> */}
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
          {/* <p className="desc mb-20">
            Selected turnstile <strong className="bold">4</strong>/4
          </p> */}
          <div className="video-box">
            <div className="video-card">
              <div className="img">
                <img src={video} alt="" />
                {/* <span className="live">live</span> */}
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
              {/* <div className="bottom-info flex-space-center">
                <p className="desc">Last frame: 1s ago</p>
                <div className="nav-btn-box">
                  <button className="nav-btn">
                    <img src={arrowPrev} alt="" />
                  </button>
                  <button className="nav-btn active">
                    <img src={arrowNext} alt="" />
                  </button>
                </div>
              </div> */}
            </div>
            {/* <div className="video-card">
              <div className="img">
                <img src={video} alt="" />
                <span className="live">live</span>
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
                <span className="badge red">Caution</span>
              </div>
              <div className="bottom-info flex-space-center">
                <p className="desc">Last frame: 1s ago</p>
                <div className="nav-btn-box">
                  <button className="nav-btn">
                    <img src={arrowPrev} alt="" />
                  </button>
                  <button className="nav-btn active">
                    <img src={arrowNext} alt="" />
                  </button>
                </div>
              </div>
            </div>
            <div className="video-card">
              <div className="img">
                <img src={video} alt="" />
                <span className="live">live</span>
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
                <span className="badge orange">confusion</span>
              </div>
              <div className="bottom-info flex-space-center">
                <p className="desc">Last frame: 1s ago</p>
                <div className="nav-btn-box">
                  <button className="nav-btn">
                    <img src={arrowPrev} alt="" />
                  </button>
                  <button className="nav-btn active">
                    <img src={arrowNext} alt="" />
                  </button>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PubTestPage
