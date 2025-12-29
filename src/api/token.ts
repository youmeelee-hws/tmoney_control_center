import { post } from './http'

export type TokenResponse = {
  token: string
}

export function issueToken() {
  return post<TokenResponse>(`/v1/token`)
}
