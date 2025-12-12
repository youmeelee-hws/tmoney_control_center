import React from 'react'
import { Outlet } from 'react-router-dom'
import { RouteConfig } from '@/types/route'
import DevTestPage from '@/pages/01_Dev/DevTestPage'
import Test1 from '@/pages/01_Dev/Test1'
import Test2 from '@/pages/01_Dev/Test2'

const DevLayout: React.FC = () => (
  <div
    className="layout-developer"
    style={{ padding: '20px', backgroundColor: '#e6f7ff' }}
  >
    <header style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
      <h1>🧑‍💻 개발자 영역 레이아웃</h1>
    </header>
    <Outlet />
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
      // /dev/test1
      {
        path: 'test1',
        element: <Test1 />,
      },
      // /dev/test2
      {
        path: 'test2',
        element: <Test2 />,
      },
    ],
  },
]
