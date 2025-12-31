import React from 'react'
import { ping } from '@/api/debug'
import { issueToken } from '@/api/token'
import {
  issuePlayTicket,
  getStations,
  getStationGates,
  getGateStreams,
} from '@/api/streams'

type LogEntry = {
  timestamp: string
  request: {
    method: string
    url: string
    headers: Record<string, any>
    hasToken: boolean
  }
  response?: {
    status: number
    statusText: string
    data: any
  }
  error?: {
    message: string
    status: number | string
  }
  duration?: string
}

export default function TestApi() {
  const [log, setLog] = React.useState<string>('')
  const [selectedStationId, setSelectedStationId] =
    React.useState<string>('station-001')
  const [selectedGateId, setSelectedGateId] = React.useState<string>('gate-001')
  const [selectedStreamId, setSelectedStreamId] =
    React.useState<string>('cam-001')

  const formatLog = (entry: LogEntry) => {
    return JSON.stringify(entry, null, 2)
  }

  const executeApiCall = async (
    apiCall: () => Promise<any>,
    method: string,
    endpoint: string
  ) => {
    try {
      // Request 정보 수집
      const token = import.meta.env.VITE_DEV_AUTH_TOKEN
      const isPublicApi = endpoint === '/v1/ping' || endpoint === '/v1/token'

      const requestInfo = {
        method,
        url: `/api${endpoint}`,
        headers: {
          'Content-Type': 'application/json',
          ...(token && !isPublicApi
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
        hasToken: !!(token && !isPublicApi),
      }

      // API 호출
      const startTime = Date.now()
      const response = await apiCall()
      const duration = Date.now() - startTime

      // 전체 로그 생성
      const logEntry: LogEntry = {
        timestamp: new Date().toISOString(),
        request: requestInfo,
        response: {
          status: 200,
          statusText: 'OK',
          data: response,
        },
      }

      setLog(formatLog({ ...logEntry, duration: `${duration}ms` }))
    } catch (e: any) {
      const token = import.meta.env.VITE_DEV_AUTH_TOKEN
      const isPublicApi = endpoint === '/v1/ping' || endpoint === '/v1/token'

      const errorLog = {
        timestamp: new Date().toISOString(),
        request: {
          method,
          url: `/api${endpoint}`,
          headers: {
            'Content-Type': 'application/json',
            ...(token && !isPublicApi
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
          hasToken: !!(token && !isPublicApi),
        },
        error: {
          message: e.message,
          status: e.response?.status || 'N/A',
        },
      }
      setLog(formatLog(errorLog))
    }
  }

  // ========================== PUBLIC APIs ==========================
  const testPing = () => executeApiCall(ping, 'GET', '/v1/ping')
  const testToken = () => executeApiCall(issueToken, 'POST', '/v1/token')
  // ========================== PUBLIC APIs ==========================

  // ========================== PRIVATE APIs ==========================
  const testStations = () => executeApiCall(getStations, 'GET', '/v1/stations')

  const testStationGates = () =>
    executeApiCall(
      () => getStationGates(selectedStationId),
      'GET',
      `/v1/stations/${selectedStationId}/gates`
    )

  const testGateStreams = () =>
    executeApiCall(
      () => getGateStreams(selectedGateId),
      'GET',
      `/v1/gates/${selectedGateId}/streams`
    )

  const testTicket = () =>
    executeApiCall(
      () => issuePlayTicket(selectedStreamId),
      'POST',
      `/v1/streams/${selectedStreamId}/play-ticket`
    )
  // ========================== PRIVATE APIs ==========================

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontSize: '2rem' }}>Api Test</h2>

      <div
        style={{
          fontSize: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          marginBottom: 12,
          width: '20vw',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', marginTop: 12 }}>Public APIs</h2>
        <button
          onClick={testPing}
          style={{
            border: '2px solid #333',
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          GET /ping
        </button>
        <button
          onClick={testToken}
          style={{
            border: '2px solid #333',
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          POST /token
        </button>

        <h2 style={{ fontSize: '1.5rem', marginTop: 12 }}>Private APIs</h2>
        <button
          onClick={testStations}
          style={{
            border: '2px solid #333',
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          GET /stations
        </button>

        <div style={{ marginTop: 8 }}>
          <label style={{ fontSize: '1.3rem', marginRight: 8 }}>
            Station ID:
          </label>
          <input
            type="text"
            value={selectedStationId}
            onChange={e => setSelectedStationId(e.target.value)}
            style={{
              padding: '4px 8px',
              fontSize: '1.3rem',
              border: '1px solid #ccc',
              borderRadius: 4,
              width: '150px',
            }}
          />
        </div>
        <button
          onClick={testStationGates}
          style={{
            border: '2px solid #333',
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          GET /stations/{'{stationId}'}/gates
        </button>

        <div style={{ marginTop: 8 }}>
          <label style={{ fontSize: '1.3rem', marginRight: 8 }}>Gate ID:</label>
          <input
            type="text"
            value={selectedGateId}
            onChange={e => setSelectedGateId(e.target.value)}
            style={{
              padding: '4px 8px',
              fontSize: '1.3rem',
              border: '1px solid #ccc',
              borderRadius: 4,
              width: '150px',
            }}
          />
        </div>
        <button
          onClick={testGateStreams}
          style={{
            border: '2px solid #333',
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          GET /gates/{'{gateId}'}/streams
        </button>

        <div style={{ marginTop: 8 }}>
          <label style={{ fontSize: '1.3rem', marginRight: 8 }}>
            Stream ID:
          </label>
          <input
            type="text"
            value={selectedStreamId}
            onChange={e => setSelectedStreamId(e.target.value)}
            style={{
              padding: '4px 8px',
              fontSize: '1.3rem',
              border: '1px solid #ccc',
              borderRadius: 4,
              width: '150px',
            }}
          />
        </div>
        <button
          onClick={testTicket}
          style={{
            border: '2px solid #333',
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          POST /streams/{'{streamId}'}/play-ticket
        </button>
      </div>

      <pre
        style={{
          fontSize: '1.5rem',
          background: '#111',
          color: '#0f0',
          padding: 12,
          borderRadius: 12,
        }}
      >
        {log || 'API 호출 결과가 여기에 표시됩니다.'}
      </pre>
    </div>
  )
}
