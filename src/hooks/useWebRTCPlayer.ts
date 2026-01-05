import { useEffect, useRef, useState } from 'react'

type WebRTCPlayerState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'playing'
  | 'rendering' // 실제 비디오 프레임이 렌더링되기 시작
  | 'error'
  | 'disconnected'

interface UseWebRTCPlayerOptions {
  whepUrl: string
  videoRef: React.RefObject<HTMLVideoElement>
  autoPlay?: boolean
}

/**
 * WebRTC 플레이어 훅 (WHEP 프로토콜 사용)
 * T_money_reaserch/examples/web/frontend/static/main.js의 로직을 기반으로 구현
 */
export function useWebRTCPlayer({
  whepUrl,
  videoRef,
  autoPlay = true,
}: UseWebRTCPlayerOptions) {
  const [state, setState] = useState<WebRTCPlayerState>('idle')
  const [error, setError] = useState<string | null>(null)

  const pcRef = useRef<RTCPeerConnection | null>(null)
  const sessionUrlRef = useRef<string | null>(null)
  const disconnectedRef = useRef(false)
  const videoEventListenersRef = useRef(false)

  // ICE gathering 완료 대기 함수
  const waitIceGatheringComplete = (
    pc: RTCPeerConnection,
    timeoutMs: number = 3000
  ): Promise<void> => {
    if (!pc) return Promise.resolve()
    if (pc.iceGatheringState === 'complete') return Promise.resolve()

    return new Promise(resolve => {
      let done = false
      const timer = setTimeout(() => {
        if (done) return
        done = true
        try {
          pc.removeEventListener('icegatheringstatechange', onChange)
        } catch (e) {}
        resolve()
      }, timeoutMs)

      function onChange() {
        if (done) return
        if (pc.iceGatheringState === 'complete') {
          done = true
          clearTimeout(timer)
          try {
            pc.removeEventListener('icegatheringstatechange', onChange)
          } catch (e) {}
          resolve()
        }
      }

      try {
        pc.addEventListener('icegatheringstatechange', onChange)
      } catch (e) {}
    })
  }

  // WebRTC 연결 시작
  const startPlayback = async () => {
    if (!whepUrl || !videoRef.current) {
      const msg = 'WHEP URL or video element is missing'
      console.error('[WebRTC]', msg, {
        whepUrl,
        hasVideoRef: !!videoRef.current,
      })
      setError(msg)
      setState('error')
      return
    }

    try {
      console.log('[WebRTC] Starting playback:', whepUrl)
      setState('connecting')
      setError(null)
      disconnectedRef.current = false

      // RTCPeerConnection 생성
      const pc = new RTCPeerConnection({
        iceServers: [], // LAN 환경에서는 STUN/TURN 불필요
      })
      pcRef.current = pc

      // recvonly video transceiver 추가
      pc.addTransceiver('video', { direction: 'recvonly' })

      // ontrack 이벤트: 원격 스트림을 비디오 엘리먼트에 연결
      pc.ontrack = evt => {
        console.log('[WebRTC] ontrack event:', evt)
        if (evt && evt.streams && evt.streams[0] && videoRef.current) {
          console.log('[WebRTC] Setting srcObject:', evt.streams[0])
          videoRef.current.srcObject = evt.streams[0]
          setState('connected') // 스트림 연결됨, 아직 렌더링 전

          // 비디오 이벤트 리스너 등록 (한 번만)
          if (!videoEventListenersRef.current && videoRef.current) {
            const video = videoRef.current

            // 실제 비디오 프레임이 렌더링되기 시작할 때
            const handlePlaying = () => {
              console.log('[WebRTC] Video playing event - first frame rendered')
              setState('rendering')
            }

            // loadeddata: 첫 프레임이 로드됨
            const handleLoadedData = () => {
              console.log('[WebRTC] Video loadeddata event')
            }

            video.addEventListener('playing', handlePlaying)
            video.addEventListener('loadeddata', handleLoadedData)
            videoEventListenersRef.current = true
          }

          if (autoPlay) {
            videoRef.current.play().catch(err => {
              console.error('[WebRTC] Video autoplay failed:', err)
            })
          }
        }
      }

      // 연결 상태 변경 모니터링
      pc.onconnectionstatechange = () => {
        if (!pc) return

        console.log('[WebRTC] Connection state:', pc.connectionState)

        if (pc.connectionState === 'connected') {
          setState('connected')
        } else if (
          pc.connectionState === 'failed' ||
          pc.connectionState === 'closed'
        ) {
          if (!disconnectedRef.current) {
            const msg = `Connection ${pc.connectionState}`
            console.error('[WebRTC]', msg)
            setError(msg)
            setState('error')
          }
        }
      }

      // Offer SDP 생성 및 ICE candidate 수집 (non-trickle)
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      await waitIceGatheringComplete(pc, 3000)

      if (!pc.localDescription) {
        throw new Error('localDescription is null')
      }

      // WHEP POST 요청으로 Answer SDP 받기
      console.log('[WebRTC] Sending WHEP POST to:', whepUrl)
      const resp = await fetch(whepUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/sdp',
        },
        body: pc.localDescription.sdp,
      })

      console.log('[WebRTC] WHEP POST response:', resp.status, resp.statusText)

      if (!resp.ok) {
        const txt = await resp.text().catch(() => '')
        throw new Error(`WHEP POST failed: ${resp.status} ${txt}`)
      }

      // Location 헤더에서 세션 URL 추출 (DELETE 요청용)
      const loc = resp.headers.get('location') || resp.headers.get('Location')
      if (loc) {
        try {
          sessionUrlRef.current = new URL(loc, whepUrl).toString()
        } catch (e) {
          sessionUrlRef.current = null
        }
      }

      // Answer SDP 설정
      const answerSdp = await resp.text()
      console.log('[WebRTC] Received answer SDP, setting remote description')
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp })

      console.log('[WebRTC] Playback started successfully:', whepUrl)
    } catch (err: any) {
      console.error('WebRTC playback error:', err)
      setError(err?.message || 'Unknown error')
      setState('error')
      stopPlayback()
    }
  }

  // WebRTC 연결 종료
  const stopPlayback = () => {
    disconnectedRef.current = true

    // 비디오 정리
    if (videoRef.current) {
      try {
        videoRef.current.pause()
      } catch (e) {}
      try {
        videoRef.current.srcObject = null
      } catch (e) {}
    }

    // 이벤트 리스너 플래그 초기화
    videoEventListenersRef.current = false

    // PeerConnection 정리
    try {
      if (pcRef.current) {
        pcRef.current.close()
      }
    } catch (e) {}
    pcRef.current = null

    // WHEP 세션 종료 (best-effort)
    try {
      if (sessionUrlRef.current) {
        fetch(sessionUrlRef.current, { method: 'DELETE', mode: 'cors' }).catch(
          () => {}
        )
      }
    } catch (e) {}
    sessionUrlRef.current = null

    setState('disconnected')
  }

  // whepUrl 변경 시 자동으로 재생 시작
  useEffect(() => {
    console.log('[WebRTC] useEffect triggered:', {
      whepUrl,
      hasVideoRef: !!videoRef.current,
    })

    if (!whepUrl || !videoRef.current) {
      console.log('[WebRTC] Skipping playback - missing whepUrl or videoRef')
      return
    }

    startPlayback()

    return () => {
      stopPlayback()
    }
  }, [whepUrl])

  return {
    state,
    error,
    startPlayback,
    stopPlayback,
  }
}
