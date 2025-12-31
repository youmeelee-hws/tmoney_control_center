import React from 'react'
import { useNavigate } from 'react-router-dom'

const DevTestPage: React.FC = () => {
  const navigate = useNavigate()

  // 테스트 페이지
  const goToApiTest = () => {
    navigate('/dev/api-test')
  }
  const goToStreamingTest = () => {
    navigate('/dev/streaming-test')
  }

  // 샘플 페이지(실시간 모니터링)
  const goToSample1 = () => {
    navigate('/dev/sample1')
  }
  const goToSample2 = () => {
    navigate('/dev/sample2')
  }
  const goToSample3 = () => {
    navigate('/dev/sample3')
  }

  // 실시간 모니터링 prototype
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
      {/* 테스트 페이지 */}
      <button
        onClick={goToApiTest}
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
        onClick={goToStreamingTest}
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
        영상 스트리밍 테스트
      </button>

      <br />
      <br />

      {/* 샘플 페이지 */}
      <button
        onClick={goToSample1}
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
        실시간 모니터링 sample A
      </button>
      <button
        onClick={goToSample2}
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
        실시간 모니터링 sample B
      </button>
      <button
        onClick={goToSample3}
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
        실시간 모니터링 sample B’
      </button>

      <br />
      <br />

      {/* 실시간 모니터링 prototype */}
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
