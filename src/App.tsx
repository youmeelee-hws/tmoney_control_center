import React from 'react'
import Router from '@/routes/MainRouter'

// 전체 프로젝트를 감싸는 최상위 래퍼
function App() {
  return (
    <div id="app-root">
      <Router />
    </div>
  )
}

export default App
