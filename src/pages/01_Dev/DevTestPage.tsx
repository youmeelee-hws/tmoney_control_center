import React from 'react'
import { useNavigate } from 'react-router-dom'

const DevTestPage: React.FC = () => {
  const navigate = useNavigate()

  const goToTest1 = () => {
    navigate('/dev/test1')
  }
  const goToTest2 = () => {
    navigate('/dev/test2')
  }
  const goToStreaming = () => {
    navigate('/streaming')
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxWidth: '100vw',
        alignItems: 'center',
      }}
    >
      <button
        onClick={goToTest1}
        style={{
          minWidth: '30rem',
          padding: '1.5rem 3rem',
          fontSize: '2rem',
          fontWeight: '500',
          backgroundColor: '#1890ff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#40a9ff')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1890ff')}
      >
        API 테스트
      </button>
      <button
        onClick={goToTest2}
        style={{
          minWidth: '30rem',
          padding: '1.5rem 3rem',
          fontSize: '2rem',
          fontWeight: '500',
          backgroundColor: '#1890ff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#40a9ff')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1890ff')}
      >
        라이브 스트리밍 테스트
      </button>
      <button
        onClick={goToStreaming}
        style={{
          minWidth: '30rem',
          padding: '1.5rem 3rem',
          fontSize: '2rem',
          fontWeight: '500',
          backgroundColor: '#1890ff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#40a9ff')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1890ff')}
      >
        개발 페이지 1 : 실시간 모니터링 화면
      </button>
    </div>
  )
}

export default DevTestPage
