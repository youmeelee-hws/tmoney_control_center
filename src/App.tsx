import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GatewayPage from './pages/00_Gateway/GatewayPage';
import DevTestPage from './pages/01_Dev/DevTestPage';
import PublishTestPage from './pages/02_Publish/PublishTestPage';

function App() {
  return (
    // <Routes> 내부에 모든 라우팅 규칙을 정의합니다.
    <Routes>
      {/* 1. 기본 경로 ('/')를 임시 진입점 (게이트웨이) 페이지로 설정 */}
      <Route path="/" element={<GatewayPage />} />

      {/* 2. 개발자 전용 작업 공간 */}
      <Route path="/dev" element={<DevTestPage />} />

      {/* 3. 퍼블리셔 전용 작업 공간 */}
      <Route path="/pub" element={<PublishTestPage />} />

      {/* 4. (선택 사항) 404 페이지 */}
      <Route
        path="*"
        element={
          <h1 style={{ textAlign: 'center', marginTop: '50px' }}>
            404 Not Found!
          </h1>
        }
      />
    </Routes>
  );
}

export default App;
