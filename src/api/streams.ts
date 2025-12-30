import { get, post } from './http'

export type StreamState = {
  id: string
  name: string
  status: string
}

export type StreamListState = {
  streams: StreamState[]
}

export type Ticket = {
  streamId: string
  playTicket: string
  expiresAt: string // ISO
  whepUrl: string
}

export function getStreamList() {
  return get<StreamListState>('/v1/streams')
}

export function issuePlayTicket(streamId: string) {
  return post<Ticket>(`/v1/streams/${streamId}/play-ticket`)
}
