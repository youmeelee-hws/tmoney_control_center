export interface RouteConfig {
  path: string
  element: React.ReactNode
  children?: RouteConfig[] // 중첩 라우트 지원 (예: /developer/settings)
  id?: string // 라우트를 식별할 고유 ID (선택 사항)
}
