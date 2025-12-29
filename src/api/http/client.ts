import axios from 'axios'

export const apiClient = axios.create({
  baseURL: '/api', // vite proxy 기준
  timeout: 10_000, // 10,000 밀리초 = 10초
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 토큰 주입
 */
apiClient.interceptors.request.use(config => {
  const token = import.meta.env.VITE_DEV_AUTH_TOKEN

  const url = config.url ?? ''
  const isPublicApi =
    url === '/api/v1/ping' ||
    url.endsWith('/api/v1/ping') ||
    url === '/api/v1/token' ||
    url.endsWith('/api/v1/token') // 토큰 발급 API도 인증 제외

  if (token && !isPublicApi) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/**
 * 공통 에러 처리 (선택)
 */
apiClient.interceptors.response.use(
  res => res,
  error => {
    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      'API Error'
    return Promise.reject(new Error(message))
  }
)
