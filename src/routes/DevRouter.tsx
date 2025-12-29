import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { RouteConfig } from '@/types/route'
import DevTestPage from '@/pages/01_Dev/DevTestPage'
import Live from '@/pages/01_Dev/TestLive'
import StreamingPage from '@/pages/01_Dev/StreamingPage'
import bell from '@/assets/images/bell.svg'
import set from '@/assets/images/set.svg'
import user from '@/assets/images/user.svg'
import logo from '@/assets/images/logo.svg'
import arrow from '@/assets/images/nav-arrow.svg'
import arrowWhite from '@/assets/images/arrow-w.svg'
import mnIco1 from '@/assets/images/mn-ico1.svg'
import close from '@/assets/images/close.svg'
import { capitalizeFirstLetter } from '@/utils/str'

const DevLayout: React.FC = () => (
  <div className="main">
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header style={{ borderBottom: '1px solid #ccc' }}>
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'black',
          }}
        >
          🧑‍💻 개발자 영역 레이아웃
        </h1>
      </header>

      <Outlet />
    </div>
  </div>
)

const MainLayout: React.FC = () => {
  const [isNoticeOpen, setIsNoticeOpen] = useState(false)

  return (
    <div className="main">
      {/* 사이드바 */}
      <div className="sidebar open">
        <div className="top">
          <div className="logo">
            <img src={logo} alt="" />
          </div>

          <button
            className="toggle-btn"
            type="button"
            aria-label="사이드바 열기/닫기"
          >
            <i className="ri-menu-fold-line"></i>
          </button>

          <p className="s-title">AI Smart Surveillance Center</p>
        </div>

        <nav className="menu">
          <ul>
            <li>
              <div className="menu-item">
                <p>
                  <img src={mnIco1} alt="" />
                  <span className="txt">Live Monitoring</span>
                </p>
                <span className="arrow">
                  <img src={arrow} alt="" />
                </span>
              </div>
            </li>
          </ul>
        </nav>
      </div>

      <div className="dashboard-wrap">
        <header className="header">
          {/* 🔔 Notice Box */}
          <div className={`notice-box ${isNoticeOpen ? 'open' : ''}`}>
            <div className="flex-space-center notice-top">
              <p className="value">Active Alerts</p>
              <button
                className="btn-close"
                onClick={() => setIsNoticeOpen(false)}
              >
                <img src={close} alt="close" />
              </button>
            </div>

            <ul className="notice-lists">
              <li className="notice-lists-item">
                <div className="flex-space-center mb-20">
                  <span className="badge green">Normal</span>
                  <p className="desc">2025-12-16 AM 08:15</p>
                </div>

                <p className="b-tit">No issues detected</p>
                <p className="s-tit">Seoul Station · </p>
                <p className="desc txt">
                  Passenger flow is within normal range. No action is required
                  at this time.
                </p>

                <button type="button" className="btn-view">
                  View CCTV <img src={arrowWhite} alt="" />
                </button>
              </li>
            </ul>
          </div>

          {/* Header content */}
          <div className="flex-space-center">
            <div className="left">
              <p className="status">
                {capitalizeFirstLetter(import.meta.env.VITE_APP_ENV) ||
                  'Operate'}
              </p>
              <p className="header-tit">Subway turnstile control</p>

              <div className="select-platform">
                <p className="desc">selected station</p>
                <div className="select-box">
                  <select>
                    <option value="Seoul Station">Seoul Station</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="utill">
              <button onClick={() => setIsNoticeOpen(prev => !prev)}>
                <img src={bell} alt="notification" />
              </button>
              <button>
                <img src={set} alt="settings" />
              </button>
              <button className="user-button">
                <img src={user} alt="user" />
                Login
              </button>
            </div>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  )
}

export const devRoutes: RouteConfig[] = [
  // 개발용 라우트
  {
    path: '/dev',
    element: <DevLayout />,
    children: [
      {
        path: '',
        element: <DevTestPage />,
      },
      {
        path: 'test',
        element: <Live />,
      },
    ],
  },
  {
    path: '/streaming',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <StreamingPage />,
      },
    ],
  },
]
