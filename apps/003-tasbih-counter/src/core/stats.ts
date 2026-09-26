import { dateKey, type History } from './state'

export function dayTotal(history: History, day: string): number {
  const m = history[day]
  if (!m) return 0
  return Object.values(m).reduce((a, b) => a + b, 0)
}

/** 오늘 기록이 없으면 어제부터 거꾸로 센다(오늘 아직 안 했어도 연속일 유지). */
export function streak(history: History, today: Date): number {
  const d = new Date(today)
  if (dayTotal(history, dateKey(d)) === 0) d.setDate(d.getDate() - 1)
  let n = 0
  while (dayTotal(history, dateKey(d)) > 0) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

export function lastNDays(history: History, today: Date, n: number): { day: string; total: number }[] {
  const out: { day: string; total: number }[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = dateKey(d)
    out.push({ day: key, total: dayTotal(history, key) })
  }
  return out
}

export function totalsByDhikr(history: History): Record<string, number> {
  const out: Record<string, number> = {}
  for (const day of Object.values(history)) {
    for (const [id, c] of Object.entries(day)) out[id] = (out[id] ?? 0) + c
  }
  return out
}
