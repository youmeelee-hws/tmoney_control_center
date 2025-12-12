import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 👈 BrowserRouter import
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 프로젝트 전체를 BrowserRouter로 감싸 라우팅 기능 활성화 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
