import React from 'react'
import { Outlet } from 'react-router-dom'
import { RouteConfig } from '@/types/route'
import DevTestPage from '@/pages/01_Dev/DevTestPage'
import Live from '@/pages/01_Dev/TestLive'
import Test2 from '@/pages/01_Dev/Test2'

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

export const devRoutes: RouteConfig[] = [
  {
    path: '/dev',
    element: <DevLayout />,
    children: [
      {
        path: '',
        element: <DevTestPage />,
      },
      // /dev/test
      {
        path: 'test',
        element: <Live />,
      },
      // /dev/test2
      {
        path: 'test2',
        element: <Test2 />,
      },
    ],
  },
]
