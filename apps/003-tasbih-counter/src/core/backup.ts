import { parseState } from './storage'
import type { AppState } from './state'

export function exportJson(state: AppState): string {
  return JSON.stringify(state, null, 2)
}

export function importJson(text: string): AppState | null {
  try {
    return parseState(JSON.parse(text))
  } catch {
    return null
  }
}

/** date,dhikr,count — 이름 해석은 호출 측에서(언어별 표시명) */
export function exportCsv(state: AppState, nameOf: (id: string) => string): string {
  const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)
  const rows = ['date,dhikr,count']
  for (const day of Object.keys(state.history).sort()) {
    for (const [id, c] of Object.entries(state.history[day])) {
      rows.push(`${day},${esc(nameOf(id))},${c}`)
    }
  }
  return rows.join('\n') + '\n'
}
