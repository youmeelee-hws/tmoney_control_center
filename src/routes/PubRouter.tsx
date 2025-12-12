import React from 'react'
import { Outlet } from 'react-router-dom' // 💡 Outlet 추가 import
import { RouteConfig } from '@/types/route'
import PubTestPage from '@/pages/02_Publish/PubTestPage'

const PubLayout: React.FC = () => (
  <div
    className="layout-publisher"
    style={{ padding: '20px', backgroundColor: '#fffbe6' }}
  >
    <header style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
      <h1>🎨 퍼블리셔 영역 레이아웃</h1>
    </header>
    <Outlet />
  </div>
)

export const pubRoutes: RouteConfig[] = [
  {
    path: '/pub',
    element: <PubLayout />,
    children: [
      {
        path: '',
        element: <PubTestPage />,
      },
    ],
  },
]
