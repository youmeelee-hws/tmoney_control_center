import { post, get } from './http'

/**
 * MediaMTX 오류 로그 전송
 */
export type MediaMTXErrorLog = {
  streamId: string
  errorType:
    | 'connection_failed'
    | 'whep_post_failed'
    | 'connection_closed'
    | 'fetch_error'
    | 'unknown'
  errorMessage: string
  statusCode?: number
  whepUrl?: string
  timestamp: string // ISO 8601
  userAgent?: string
  clientInfo?: {
    browserName?: string
    browserVersion?: string
    os?: string
    screenResolution?: string
  }
}

export type ErrorLogResponse = {
  success: boolean
  logFile: string
  message: string
}

/**
 * MediaMTX 서버 오류를 백엔드에 로그로 전송
 *
 * @param errorLog 오류 정보
 * @returns 로그 저장 결과
 */
export function logMediaMTXError(errorLog: MediaMTXErrorLog) {
  return post<ErrorLogResponse>('/v1/error-logs/mediamtx', errorLog)
}

/**
 * 최근 오류 로그 조회 (디버깅용)
 *
 * @param limit 조회할 로그 개수 (기본 50)
 */
export function getLatestErrorLogs(limit: number = 50) {
  return get<{ logs: MediaMTXErrorLog[]; count: number; message: string }>(
    `/v1/error-logs/mediamtx/latest?limit=${limit}`
  )
}
