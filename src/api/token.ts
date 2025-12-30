import { post } from './http'

export type TokenState = {
  token: string
}

export function issueToken() {
  return post<TokenState>(`/v1/token`)
}
