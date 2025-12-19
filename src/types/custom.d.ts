// .svg 파일을 모듈로 인식시키기 위한 타입 선언
declare module '*.svg' {
  // SVG를 React 컴포넌트로 가져올 때의 타입 정의
  import * as React from 'react'
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>

  // SVG를 파일 경로(URL) 문자열로 가져올 때의 타입 정의
  const src: string
  export default src
}
declare module '*.png' {
  const value: string
  export default value
}
