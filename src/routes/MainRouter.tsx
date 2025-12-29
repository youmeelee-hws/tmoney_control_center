import React from 'react'
import { useRoutes } from 'react-router-dom'
import { RouteConfig } from '@/types/route'
import GatewayPage from '@/pages/00_Gateway/GatewayPage'

// 서브 라우터 import
import { devRoutes } from '@/routes/DevRouter'
import { pubRoutes } from '@/routes/PubRouter'

const routes: RouteConfig[] = [
  // 1. 개발용 게이트웨이 라우트
  {
    path: '/',
    element: <GatewayPage />,
  },
  // 2. 개발 라우트
  ...devRoutes,
  // 3. 퍼블리싱 라우트
  ...pubRoutes,
  // 4. 404 Not Found
  {
    path: '*',
    element: <h1>404 Not Found!</h1>,
  },
]

const MainRouter: React.FC = () => {
  // useRoutes 훅이 정의된 routes 객체를 분석하여 라우팅 컴포넌트로 변환합니다.
  const element = useRoutes(routes)

  return element
}

export default MainRouter
