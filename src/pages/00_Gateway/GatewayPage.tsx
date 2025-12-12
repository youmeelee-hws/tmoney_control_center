// 임시 진입점 페이지 (Landing Page 역할)
import React from 'react';
import { Link } from 'react-router-dom';

const GatewayPage: React.FC = () => {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>🛠️ 협업 진입 게이트웨이</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        원하는 작업 환경으로 이동하여 개발 및 퍼블리싱 현황을 확인하세요.
      </p>
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <Link to="/dev" style={linkStyle}>
          🧑‍💻 개발자 작업 공간
        </Link>
        <Link to="/pub" style={linkStyle}>
          🎨 퍼블리셔 스타일링 공간
        </Link>
      </nav>

      <p style={{ marginTop: '50px', fontSize: '12px', color: '#aaa' }}>
        * 이 페이지는 프로젝트 최종 배포 시 삭제될 예정입니다.
      </p>
    </div>
  );
};

// 임시 스타일 (실제 프로젝트에서는 CSS/CSS-in-JS 사용)
const linkStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '15px 30px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
  transition: 'background-color 0.2s',
};

export default GatewayPage;
