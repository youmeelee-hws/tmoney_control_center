import { get, post } from './http'

export type StreamResponse = {
  id: string
  name: string
  status: string
}

export type StreamListResponse = {
  streams: StreamResponse[]
}

export type PlayTicketResponse = {
  stream_id: string
  token: string
  expires_at: string
}

export function getStreamList() {
  return get<StreamListResponse>('/v1/streams')
}

export function issuePlayTicket(streamId: string) {
  return post<PlayTicketResponse>(`/v1/streams/${streamId}/play-ticket`)
}
