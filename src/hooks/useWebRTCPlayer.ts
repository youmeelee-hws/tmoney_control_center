import { useEffect, useRef, useState } from 'react'

/**
 * WebRTC 플레이어의 현재 상태를 나타내는 타입
 *
 * 상태 전환 순서:
 * idle → connecting → connected → rendering
 *   ↓
 * error / disconnected
 */
type WebRTCPlayerState =
  | 'idle' // 아무것도 하지 않는 초기 상태
  | 'connecting' // 서버와 연결을 시도하는 중
  | 'connected' // 서버와 연결됨, 비디오 데이터가 도착하기 시작
  | 'playing' // (현재 미사용)
  | 'rendering' // 실제로 화면에 비디오가 보이기 시작
  | 'error' // 오류 발생
  | 'disconnected' // 연결 종료됨

interface UseWebRTCPlayerOptions {
  whepUrl: string // 스트림 서버 주소 (예: http://192.168.0.10:8889/stream1/whep)
  videoRef: React.RefObject<HTMLVideoElement> // <video> 태그의 ref (영상을 보여줄 곳)
  autoPlay?: boolean // 연결되면 자동으로 재생할지 여부
}

/**
 * WebRTC 플레이어 훅 (WHEP 프로토콜 사용)
 *
 * 📡 WHEP (WebRTC-HTTP Egress Protocol)란?
 * - HTTP POST로 Offer를 보내고, Answer를 받아서 WebRTC 연결을 맺는 표준 프로토콜
 * - 서버에서 브라우저로 비디오를 보내는 용도 (단방향 스트리밍)
 *
 * 🔄 동작 순서:
 * 1. RTCPeerConnection 객체 생성 (WebRTC 연결 관리자)
 * 2. "비디오를 받겠다"는 Offer 생성
 * 3. WHEP 서버에 POST 요청으로 Offer 전송
 * 4. 서버가 Answer를 응답으로 보내줌
 * 5. Answer를 설정하면 비디오 데이터가 자동으로 흘러옴
 * 6. <video> 태그에 자동으로 비디오가 재생됨
 */
export function useWebRTCPlayer({
  whepUrl,
  videoRef,
  autoPlay = true,
}: UseWebRTCPlayerOptions) {
  // 현재 연결 상태 (idle, connecting, connected, rendering 등)
  const [state, setState] = useState<WebRTCPlayerState>('idle')

  // 에러 메시지 (에러가 없으면 null)
  const [error, setError] = useState<string | null>(null)

  // 🔑 RTCPeerConnection: WebRTC의 핵심 객체
  // - 서버와의 P2P 연결을 관리
  // - 비디오/오디오 데이터를 주고받는 통로
  // - 브라우저가 자동으로 네트워크 연결을 관리해줌
  const pcRef = useRef<RTCPeerConnection | null>(null)

  // 📍 세션 URL: 연결을 끊을 때 DELETE 요청을 보낼 주소
  // - WHEP 서버가 응답 헤더(Location)로 알려줌
  // - 예: http://192.168.0.10:8889/stream1/whep/session-abc123
  const sessionUrlRef = useRef<string | null>(null)

  // 🛑 수동으로 연결을 끊었는지 체크하는 플래그
  // - true면 에러를 무시하고 조용히 종료
  const disconnectedRef = useRef(false)

  // 🎧 비디오 이벤트 리스너를 이미 등록했는지 체크하는 플래그
  // - 중복 등록을 방지 (메모리 누수 방지)
  const videoEventListenersRef = useRef(false)

  /**
   * 🧊 ICE Candidate 수집 완료를 기다리는 함수
   *
   * ICE(Interactive Connectivity Establishment)란?
   * - 두 브라우저(또는 서버)가 서로를 찾아서 연결하는 방법
   * - 내 IP 주소, 공유기 IP, 인터넷 IP 등을 모두 수집해서 "이 주소들로 나한테 연결해!"라고 알려줌
   *
   * 왜 필요한가?
   * - Offer를 만들 때 내 연결 정보(ICE candidate)를 함께 보내야 함
   * - ICE 수집이 완료될 때까지 기다려야 완전한 Offer가 됨
   * - LAN 환경에서는 보통 즉시 완료되지만, 인터넷 환경에서는 시간이 걸릴 수 있음
   *
   * @param pc - RTCPeerConnection 객체
   * @param timeoutMs - 최대 대기 시간 (기본 3초)
   */
  const waitIceGatheringComplete = (
    pc: RTCPeerConnection,
    timeoutMs: number = 3000
  ): Promise<void> => {
    // PeerConnection이 없거나 이미 완료됐으면 바로 리턴
    if (!pc) return Promise.resolve()
    if (pc.iceGatheringState === 'complete') return Promise.resolve()

    return new Promise(resolve => {
      let done = false // 중복 실행 방지 플래그

      // 타임아웃: 너무 오래 걸리면 그냥 진행 (best-effort)
      const timer = setTimeout(() => {
        if (done) return
        done = true
        try {
          pc.removeEventListener('icegatheringstatechange', onChange)
        } catch (e) {}
        resolve() // 타임아웃되도 resolve (reject하지 않음)
      }, timeoutMs)

      // ICE 수집 상태가 변경될 때 호출되는 콜백
      function onChange() {
        if (done) return
        if (pc.iceGatheringState === 'complete') {
          done = true
          clearTimeout(timer)
          try {
            pc.removeEventListener('icegatheringstatechange', onChange)
          } catch (e) {}
          resolve() // 수집 완료!
        }
      }

      // 이벤트 리스너 등록
      try {
        pc.addEventListener('icegatheringstatechange', onChange)
      } catch (e) {}
    })
  }

  /**
   * 🎬 WebRTC 연결 시작 및 재생
   *
   * 전체 프로세스:
   * 1. RTCPeerConnection 생성 (연결 관리 객체)
   * 2. "비디오 받기 전용" transceiver 추가
   * 3. Offer SDP 생성 (내가 받고 싶은 비디오 스펙 설명서)
   * 4. ICE candidate 수집 완료 대기 (내 네트워크 정보 수집)
   * 5. WHEP 서버에 POST 요청으로 Offer 전송
   * 6. 서버로부터 Answer SDP 수신 (서버가 보내줄 비디오 스펙)
   * 7. Answer 설정 → 자동으로 비디오 데이터가 흘러오기 시작!
   * 8. ontrack 이벤트에서 <video> 태그에 스트림 연결
   */
  const startPlayback = async () => {
    // 필수 요소 검증
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

      // 🔧 1단계: RTCPeerConnection 생성
      // 이것이 WebRTC의 핵심! 모든 연결을 관리하는 객체
      const pc = new RTCPeerConnection({
        iceServers: [], // LAN 환경에서는 STUN/TURN 서버가 불필요 (직접 연결 가능)
        // 인터넷을 통한 연결이라면 여기에 STUN/TURN 서버 주소를 추가해야 함
      })
      pcRef.current = pc

      // 📺 2단계: Transceiver 추가
      // transceiver = transmitter(송신기) + receiver(수신기)
      // 'recvonly' = 비디오를 받기만 함 (보내지 않음, WHEP는 단방향)
      pc.addTransceiver('video', { direction: 'recvonly' })

      // 🎯 ontrack: 서버에서 비디오 트랙이 도착하면 자동으로 호출됨!
      // 이것이 비디오 데이터를 받는 핵심 이벤트
      pc.ontrack = evt => {
        console.log('[WebRTC] ontrack event:', evt)

        // evt.streams[0]에 실제 비디오 스트림(MediaStream)이 들어있음
        if (evt && evt.streams && evt.streams[0] && videoRef.current) {
          console.log('[WebRTC] Setting srcObject:', evt.streams[0])

          // 🎥 <video> 태그의 srcObject에 스트림을 연결
          // 이렇게 하면 비디오가 자동으로 <video> 태그에서 재생됨!
          videoRef.current.srcObject = evt.streams[0]
          setState('connected') // 스트림 연결됨, 아직 화면에는 안 보일 수 있음

          // 🎧 비디오 이벤트 리스너 등록 (한 번만)
          if (!videoEventListenersRef.current && videoRef.current) {
            const video = videoRef.current

            // 'playing' 이벤트: 실제로 화면에 비디오가 재생되기 시작
            const handlePlaying = () => {
              console.log('[WebRTC] Video playing event - first frame rendered')
              setState('rendering') // 이제 사용자에게 비디오가 보임!
            }

            // 'loadeddata' 이벤트: 첫 프레임 데이터가 로드됨
            const handleLoadedData = () => {
              console.log('[WebRTC] Video loadeddata event')
            }

            video.addEventListener('playing', handlePlaying)
            video.addEventListener('loadeddata', handleLoadedData)
            videoEventListenersRef.current = true // 중복 등록 방지
          }

          // 자동 재생 시도
          if (autoPlay) {
            videoRef.current.play().catch(err => {
              console.error('[WebRTC] Video autoplay failed:', err)
              // 참고: 일부 브라우저는 사용자 인터랙션 없이 자동재생을 차단할 수 있음
            })
          }
        }
      }

      // 🔌 연결 상태 변경 모니터링
      // WebRTC 연결의 생명주기를 추적
      pc.onconnectionstatechange = () => {
        if (!pc) return

        console.log('[WebRTC] Connection state:', pc.connectionState)
        // 상태: new → connecting → connected / failed / closed

        if (pc.connectionState === 'connected') {
          setState('connected')
        } else if (
          pc.connectionState === 'failed' ||
          pc.connectionState === 'closed'
        ) {
          // 수동 종료가 아닌 경우에만 에러로 처리
          if (!disconnectedRef.current) {
            const msg = `Connection ${pc.connectionState}`
            console.error('[WebRTC]', msg)
            setError(msg)
            setState('error')
          }
        }
      }

      // 📝 3단계: Offer SDP 생성
      // SDP(Session Description Protocol) = "나는 이런 비디오를 받고 싶어요"라는 설명서
      // codec, 해상도, 프레임레이트 등의 정보가 담겨 있음
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer) // Offer를 내 로컬에 설정

      // 🧊 4단계: ICE candidate 수집 완료 대기
      // 내 네트워크 정보(IP 주소 등)를 모두 수집할 때까지 대기
      await waitIceGatheringComplete(pc, 3000)

      if (!pc.localDescription) {
        throw new Error('localDescription is null')
      }

      // 📤 5단계: WHEP 서버에 POST 요청으로 Offer 전송
      console.log('[WebRTC] Sending WHEP POST to:', whepUrl)
      const resp = await fetch(whepUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/sdp', // SDP 형식으로 전송
        },
        body: pc.localDescription.sdp, // Offer SDP를 body에 담아 전송
      })

      console.log('[WebRTC] WHEP POST response:', resp.status, resp.statusText)

      if (!resp.ok) {
        const txt = await resp.text().catch(() => '')
        throw new Error(`WHEP POST failed: ${resp.status} ${txt}`)
      }

      // 📍 Location 헤더에서 세션 URL 추출
      // 이 URL로 나중에 DELETE 요청을 보내서 연결을 끊을 수 있음
      const loc = resp.headers.get('location') || resp.headers.get('Location')
      if (loc) {
        try {
          // 상대 경로일 수 있으므로 절대 URL로 변환
          sessionUrlRef.current = new URL(loc, whepUrl).toString()
        } catch (e) {
          sessionUrlRef.current = null
        }
      }

      // 📥 6단계: Answer SDP 수신
      // 서버가 "OK, 나는 이런 비디오를 보내줄게"라는 답변서
      const answerSdp = await resp.text()
      console.log('[WebRTC] Received answer SDP, setting remote description')

      // 📡 7단계: Answer 설정 → 이 순간부터 비디오 데이터가 흘러오기 시작!
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp })

      console.log('[WebRTC] Playback started successfully:', whepUrl)
      // 이제 ontrack 이벤트가 자동으로 발생하고, 비디오가 재생됨!
    } catch (err: any) {
      console.error('WebRTC playback error:', err)
      setError(err?.message || 'Unknown error')
      setState('error')
      stopPlayback()
    }
  }

  /**
   * 🛑 WebRTC 연결 종료 및 정리
   *
   * 정리 순서:
   * 1. 비디오 엘리먼트 정리 (일시정지, srcObject 제거)
   * 2. RTCPeerConnection 종료
   * 3. WHEP 서버에 DELETE 요청으로 세션 종료 알림
   * 4. 모든 ref 초기화
   */
  const stopPlayback = () => {
    disconnectedRef.current = true // 수동 종료 플래그 설정

    // 🎥 비디오 엘리먼트 정리
    if (videoRef.current) {
      try {
        videoRef.current.pause() // 재생 중지
      } catch (e) {}
      try {
        videoRef.current.srcObject = null // 스트림 연결 해제
      } catch (e) {}
    }

    // 🎧 이벤트 리스너 플래그 초기화 (다음 연결 시 다시 등록 가능)
    videoEventListenersRef.current = false

    // 🔌 PeerConnection 종료
    // close()를 호출하면 모든 네트워크 연결이 끊김
    try {
      if (pcRef.current) {
        pcRef.current.close()
      }
    } catch (e) {}
    pcRef.current = null

    // 📍 WHEP 세션 종료 요청 (best-effort)
    // DELETE 요청을 보내서 서버에 "더 이상 비디오 안 받아요"라고 알림
    // 실패해도 괜찮음 (catch로 무시)
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

  /**
   * 🔄 useEffect: whepUrl이 변경될 때마다 자동으로 재생 시작
   *
   * 동작 방식:
   * 1. whepUrl이 바뀌면 이 effect가 실행됨
   * 2. startPlayback()을 호출해서 새로운 스트림 연결
   * 3. 컴포넌트가 unmount되거나 whepUrl이 다시 바뀌면
   *    cleanup 함수(return)가 실행되어 기존 연결을 끊음
   *
   * 예시:
   * - whepUrl이 "stream1"에서 "stream2"로 변경
   * - cleanup 함수로 stream1 연결 종료
   * - startPlayback()으로 stream2 연결 시작
   */
  useEffect(() => {
    console.log('[WebRTC] useEffect triggered:', {
      whepUrl,
      hasVideoRef: !!videoRef.current,
    })

    // whepUrl이나 videoRef가 없으면 아무것도 안 함
    if (!whepUrl || !videoRef.current) {
      console.log('[WebRTC] Skipping playback - missing whepUrl or videoRef')
      return
    }

    // 자동으로 연결 시작!
    startPlayback()

    // Cleanup 함수: 다음 effect가 실행되기 전이나 unmount 시 호출됨
    return () => {
      stopPlayback()
    }
  }, [whepUrl]) // whepUrl이 변경될 때만 재실행

  // 🎁 외부에서 사용할 수 있도록 상태와 함수들을 반환
  return {
    state, // 현재 연결 상태 (idle, connecting, connected, rendering 등)
    error, // 에러 메시지 (있으면)
    startPlayback, // 수동으로 연결 시작하고 싶을 때
    stopPlayback, // 수동으로 연결 종료하고 싶을 때
  }
}
