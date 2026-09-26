// 화면 켜짐 유지 — Screen Wake Lock API (Chrome/Android WebView 84+). 미지원이면 조용히 무시.
import { useEffect } from 'react'

export function useWakeLock(enabled: boolean): void {
  useEffect(() => {
    if (!enabled || !('wakeLock' in navigator)) return
    let lock: WakeLockSentinel | null = null
    let cancelled = false

    const acquire = async () => {
      try {
        if (document.visibilityState !== 'visible') return
        lock = await navigator.wakeLock.request('screen')
        if (cancelled) void lock.release()
      } catch {
        // 권한/배터리 절약 모드 등 — 무시
      }
    }
    // 앱이 백그라운드로 가면 락이 풀리므로 다시 보일 때 재요청
    const onVisible = () => void acquire()

    void acquire()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
      void lock?.release()
    }
  }, [enabled])
}
