import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { RouteConfig } from '@/types/route'
import DevTestPage from '@/pages/01_Dev/DevTestPage'
import SamplePage from '@/pages/01_Dev/SamplePage'
import SamplePage2 from '@/pages/01_Dev/SamplePage2'
import SamplePage3 from '@/pages/01_Dev/SamplePage3'
import TestApi from '@/pages/01_Dev/TestApi'
import TestStreaming from '@/pages/01_Dev/TestStreaming'
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

const NewLayout: React.FC = () => {
  const [isNoticeOpen, setIsNoticeOpen] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#410d3b',
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: '7rem',
          height: '100vh',
          backgroundColor: '#410d3b',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '4.5rem',
          flexShrink: 0,
          position: 'relative',
          zIndex: 100,
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '3rem',
          }}
        >
          <img src={logo} alt="Tmoney" style={{ maxWidth: '80%' }} />
        </div>

        <nav style={{ width: '100%' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li>
              <div
                style={{
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <img src={mnIco1} alt="" />
              </div>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: '1.2rem 5rem',
            background: 'rgba(255, 255, 255, 0.09)',
            backdropFilter: 'blur(24px)',
            position: 'relative',
            zIndex: 5,
            flexShrink: 0,
          }}
        >
          {/* Notice Box */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: isNoticeOpen ? 0 : '-40rem',
              width: '40rem',
              height: '100vh',
              backgroundColor: '#2a0a26',
              padding: '2rem',
              transition: 'right 0.3s ease',
              zIndex: 1000,
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
              }}
            >
              <p
                style={{
                  color: '#fff',
                  fontSize: '2rem',
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Active Alerts
              </p>
              <button
                onClick={() => setIsNoticeOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                }}
              >
                <img src={close} alt="close" />
              </button>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '2rem',
                  borderRadius: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                  }}
                >
                  <span
                    style={{
                      backgroundColor: '#09dc99',
                      color: '#fff',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      fontSize: '1.3rem',
                    }}
                  >
                    Normal
                  </span>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '1.4rem',
                      margin: 0,
                    }}
                  >
                    2025-12-16 AM 08:15
                  </p>
                </div>

                <p
                  style={{
                    color: '#fff',
                    fontSize: '1.7rem',
                    fontWeight: 500,
                    marginBottom: '0.5rem',
                  }}
                >
                  No issues detected
                </p>
                <p
                  style={{
                    color: '#efefef',
                    fontSize: '1.6rem',
                    marginBottom: '1rem',
                  }}
                >
                  Seoul Station ·
                </p>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '1.4rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  Passenger flow is within normal range. No action is required
                  at this time.
                </p>

                <button
                  type="button"
                  style={{
                    backgroundColor: '#f08300',
                    color: '#fff',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '0.6rem',
                    fontSize: '1.4rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  View CCTV <img src={arrowWhite} alt="" />
                </button>
              </li>
            </ul>
          </div>

          {/* Header Content */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2.8rem',
              }}
            >
              <p
                style={{
                  display: 'inline-block',
                  background: 'rgba(146, 7, 131, 0.43)',
                  color: '#fff',
                  padding: '0.8rem 1.2rem',
                  borderRadius: '3rem',
                  fontSize: '1.5rem',
                  margin: 0,
                }}
              >
                AI Smart Surveillance Center
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2.8rem',
                  paddingLeft: '3rem',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    height: '1.6rem',
                    width: '1px',
                    background: 'rgba(204, 204, 204, 1)',
                  }}
                />
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '1.4rem',
                    margin: 0,
                  }}
                >
                  selected station
                </p>
                <div>
                  <select
                    style={{
                      height: '3.6rem',
                      fontSize: '1.5rem',
                      padding: '0.8rem 1.2rem',
                      borderRadius: '0.6rem',
                      outline: 'none',
                      border: '1px solid rgba(255, 255, 255, 0.21)',
                      backgroundColor: '#555',
                      color: '#fff',
                      paddingRight: '4rem',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="Seoul Station">Seoul Station</option>
                  </select>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '3rem',
              }}
            >
              <button
                onClick={() => setIsNoticeOpen(prev => !prev)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                }}
              >
                <img src={bell} alt="notification" />
              </button>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                }}
              >
                <img src={set} alt="settings" />
              </button>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  color: '#fff',
                  fontSize: '1.4rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                }}
              >
                <img src={user} alt="user" />
                Login
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  )
}

const NewLayout2: React.FC = () => {
  const [isNoticeOpen, setIsNoticeOpen] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
      }}
    >
      {/* Topbar - 사이드바 위에 덮이도록 */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '6rem',
          padding: '0 3rem',
          background: 'rgba(42, 10, 38, 0.95)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* 왼쪽 영역 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          {/* AI Smart Surveillance Center 뱃지 */}
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(146, 7, 131, 0.43)',
              color: '#fff',
              padding: '0.8rem 1.6rem',
              borderRadius: '3rem',
              fontSize: '1.4rem',
              fontWeight: 500,
            }}
          >
            AI Smart Surveillance Center
          </div>

          {/* 구분선 */}
          <div
            style={{
              height: '2rem',
              width: '1px',
              background: 'rgba(204, 204, 204, 0.5)',
            }}
          />

          {/* 실시간 모니터링 아이콘 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              color: '#fff',
              fontSize: '1.4rem',
            }}
          >
            <img src={mnIco1} alt="실시간 모니터링" style={{ width: '2rem' }} />
            <span>실시간 모니터링</span>
          </div>
        </div>

        {/* 오른쪽 유틸리티 영역 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          <button
            onClick={() => setIsNoticeOpen(prev => !prev)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              position: 'relative',
            }}
          >
            <img src={bell} alt="알림" />
            <span
              style={{
                position: 'absolute',
                top: '0',
                right: '0',
                width: '1rem',
                height: '1rem',
                backgroundColor: '#f6335a',
                borderRadius: '50%',
              }}
            />
          </button>
          <button
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
          >
            <img src={set} alt="설정" />
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              color: '#fff',
              fontSize: '1.4rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
          >
            <img src={user} alt="계정" />
            <span>Login</span>
          </button>
        </div>
      </header>

      {/* 알림 패널 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: isNoticeOpen ? 0 : '-40rem',
          width: '40rem',
          height: '100vh',
          backgroundColor: '#2a0a26',
          padding: '2rem',
          transition: 'right 0.3s ease',
          zIndex: 1001,
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <p
            style={{
              color: '#fff',
              fontSize: '2rem',
              fontWeight: 600,
              margin: 0,
            }}
          >
            Active Alerts
          </p>
          <button
            onClick={() => setIsNoticeOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
          >
            <img src={close} alt="닫기" />
          </button>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '2rem',
              borderRadius: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
              }}
            >
              <span
                style={{
                  backgroundColor: '#09dc99',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '1.3rem',
                }}
              >
                Normal
              </span>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '1.4rem',
                  margin: 0,
                }}
              >
                2025-12-31 PM 02:30
              </p>
            </div>

            <p
              style={{
                color: '#fff',
                fontSize: '1.7rem',
                fontWeight: 500,
                marginBottom: '0.5rem',
              }}
            >
              No issues detected
            </p>
            <p
              style={{
                color: '#efefef',
                fontSize: '1.6rem',
                marginBottom: '1rem',
              }}
            >
              서울역 ·
            </p>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1.4rem',
                marginBottom: '1.5rem',
              }}
            >
              모든 게이트가 정상 작동 중입니다.
            </p>

            <button
              type="button"
              style={{
                backgroundColor: '#f08300',
                color: '#fff',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '0.6rem',
                fontSize: '1.4rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              View CCTV <img src={arrowWhite} alt="" />
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content Area with Sidebar */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          height: '100vh',
          overflow: 'hidden',
          paddingTop: '6rem', // Topbar 높이만큼 패딩
        }}
      >
        <Outlet />
      </div>
    </div>
  )
}

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
          🧑‍💻 개발자 작업 공간
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
                  <span className="txt">Live Incident Detection</span>
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
        path: 'api-test',
        element: <TestApi />,
      },
      {
        path: 'streaming-test',
        element: <TestStreaming />,
      },
    ],
  },
  {
    path: '/dev',
    element: <NewLayout />,
    children: [
      {
        path: 'sample1',
        element: <SamplePage />,
      },
      {
        path: 'sample2',
        element: <SamplePage2 />,
      },
    ],
  },
  {
    path: '/dev',
    element: <NewLayout2 />,
    children: [
      {
        path: 'sample3',
        element: <SamplePage3 />,
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
