// 복약 리마인더 (웹 Notification API). 앱이 켜져 있는 동안 1분 간격으로 확인.
// ⚠️ 백그라운드·잠금 화면 알림은 Android 네이티브 빌드에서 Capacitor 플러그인으로 확장 필요.
import { todayISO } from './store'

let intervalId: number | null = null
let notified = new Set<string>()

export interface ReminderData {
  schedule: { id: string; name: string; times: string[] }[]
  takenByDay: Record<string, string[]>
}

export function setupReminders(get: () => ReminderData): void {
  if (!('Notification' in window)) return
  stopReminders()
  const check = () => {
    if (Notification.permission !== 'granted') return
    const now = new Date()
    const hh = String(now.getHours()).padStart(2, '0')
    const mm = String(now.getMinutes()).padStart(2, '0')
    const today = todayISO()
    const d = get()
    const dayTaken = d.takenByDay[today] ?? []
    for (const s of d.schedule) {
      for (const tm of s.times) {
        if (tm === `${hh}:${mm}`) {
          const key = `${today}@${s.id}@${tm}`
          if (!notified.has(key) && !dayTaken.includes(`${s.id}@${tm}`)) {
            notified.add(key)
            try {
              new Notification(`💊 ${s.name}`, { body: `${tm} — It's time.` })
            } catch {
              /* ignore */
            }
          }
        }
      }
    }
  }
  check()
  intervalId = window.setInterval(check, 60000)
}

export function stopReminders(): void {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
}

export function requestNotificationPermission(): void {
  if ('Notification' in window && Notification.permission === 'default') {
    void Notification.requestPermission()
  }
}
