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

  return (
    <div>
      <button onClick={goToTest1}>개발 페이지 1</button>
      <button onClick={goToTest2}>개발 페이지 2</button>
    </div>
  )
}

export default DevTestPage
