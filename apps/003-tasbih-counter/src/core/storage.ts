import { findDhikr, PRESETS, type Dhikr } from './dhikr'
import { ACCENTS, defaultState, type Accent, type AppState, type History } from './state'

const KEY = 'tasbih.state.v1'

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/** 외부 입력(저장소·백업 파일)을 검증해 AppState로 복원. 잘못된 필드는 기본값으로. */
export function parseState(raw: unknown): AppState | null {
  if (!isObj(raw) || raw.version !== 1) return null
  const base = defaultState()

  const custom: Dhikr[] = Array.isArray(raw.custom)
    ? raw.custom
        .filter(isObj)
        .filter((c) => typeof c.id === 'string' && !PRESETS.some((p) => p.id === c.id))
        .map((c) => ({
          id: String(c.id),
          arabic: typeof c.arabic === 'string' ? c.arabic : '',
          translit: typeof c.translit === 'string' ? c.translit : '',
          customName: typeof c.customName === 'string' ? c.customName : 'Dhikr',
          target: typeof c.target === 'number' && c.target > 0 ? Math.floor(c.target) : null,
          custom: true,
        }))
    : []

  const history: History = {}
  if (isObj(raw.history)) {
    for (const [day, m] of Object.entries(raw.history)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !isObj(m)) continue
      const dayMap: Record<string, number> = {}
      for (const [id, c] of Object.entries(m)) {
        if (typeof c === 'number' && c > 0) dayMap[id] = Math.floor(c)
      }
      if (Object.keys(dayMap).length) history[day] = dayMap
    }
  }

  const s = isObj(raw.session) ? raw.session : {}
  const dhikrId = typeof s.dhikrId === 'string' && findDhikr(s.dhikrId, custom) ? s.dhikrId : base.session.dhikrId
  const num = (v: unknown) => (typeof v === 'number' && v >= 0 ? Math.floor(v) : 0)
  const d = findDhikr(dhikrId, custom)!
  const maxStep = d.sequence ? d.sequence.length - 1 : 0
  const session = {
    dhikrId,
    count: num(s.count),
    step: Math.min(num(s.step), maxStep),
    rounds: num(s.rounds),
  }

  const st = isObj(raw.settings) ? raw.settings : {}
  const langs = ['en', 'id', 'tr', 'ar', 'ko']
  const settings = {
    lang: typeof st.lang === 'string' && langs.includes(st.lang) ? (st.lang as AppState['settings']['lang']) : null,
    theme: st.theme === 'light' || st.theme === 'dark' ? st.theme : 'system',
    accent: ACCENTS.includes(st.accent as Accent) ? st.accent : 'green',
    vibrate: typeof st.vibrate === 'boolean' ? st.vibrate : base.settings.vibrate,
    sound: typeof st.sound === 'boolean' ? st.sound : base.settings.sound,
    keepAwake: typeof st.keepAwake === 'boolean' ? st.keepAwake : base.settings.keepAwake,
    pro: st.pro === true,
    onboarded: st.onboarded === true,
  } as AppState['settings']

  return { version: 1, custom, session, history, settings }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return parseState(JSON.parse(raw)) ?? defaultState()
  } catch {
    // 손상된 데이터 → 기본값
  }
  return defaultState()
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // 저장 실패(용량 등)는 동작을 막지 않는다
  }
}
