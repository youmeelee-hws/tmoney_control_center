import { get } from './http'

export type PingResponse = { ok: boolean; message: string }

export function ping() {
  return get<PingResponse>('/v1/ping')
}
