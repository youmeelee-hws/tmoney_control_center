import { get, post } from './http'

// ============================================
// Station Types & APIs
// ============================================
export type Station = {
  stationId: string
  name: string
}

export type StationListResponse = {
  stations: Station[]
}

export function getStations() {
  return get<StationListResponse>('/v1/stations')
}

// ============================================
// Gate Types & APIs
// ============================================
export type Gate = {
  gateId: string
  stationId: string
  name: string
}

export type GateListResponse = {
  gates: Gate[]
}

export function getStationGates(stationId: string) {
  return get<GateListResponse>(`/v1/stations/${stationId}/gates`)
}

// ============================================
// Stream Types & APIs
// ============================================
export type Stream = {
  streamId: string
  gateId: string
  name: string
  status: string
}

export type StreamListResponse = {
  streams: Stream[]
}

export function getGateStreams(gateId: string) {
  return get<StreamListResponse>(`/v1/gates/${gateId}/streams`)
}

// ============================================
// Play Ticket (kept for backward compatibility)
// ============================================
export type Ticket = {
  streamId: string
  playTicket: string
  expiresAt: string // ISO
  whepUrl: string
}

export function issuePlayTicket(streamId: string) {
  return post<Ticket>(`/v1/streams/${streamId}/play-ticket`)
}
