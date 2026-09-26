// 앱 상태와 순수 전이 함수. UI·저장소와 분리해 단위 테스트한다.
import { activeDhikrId, currentTarget, findDhikr, isSequence, type Dhikr } from './dhikr'

export type Lang = 'en' | 'id' | 'tr' | 'ar' | 'ko'
export type Theme = 'system' | 'light' | 'dark'
export type Accent = 'green' | 'blue' | 'purple' | 'gold'
export const ACCENTS: Accent[] = ['green', 'blue', 'purple', 'gold']

export interface Settings {
  lang: Lang | null // null = 기기 언어 자동
  theme: Theme
  /** Pro 전용. 무료는 green 고정 */
  accent: Accent
  vibrate: boolean
  sound: boolean
  keepAwake: boolean
  pro: boolean
  onboarded: boolean
}

export interface Session {
  dhikrId: string
  /** 현재 단계(연속 모드) 또는 전체 누적(단일 모드) 카운트 */
  count: number
  step: number
  /** 연속 모드 완료 횟수 */
  rounds: number
}

/** 날짜(YYYY-MM-DD) → 지크르 id → 횟수 */
export type History = Record<string, Record<string, number>>

export interface AppState {
  version: 1
  custom: Dhikr[]
  session: Session
  history: History
  settings: Settings
}

export type TapEvent = 'tick' | 'goal' | 'step' | 'complete'

export function defaultState(): AppState {
  return {
    version: 1,
    custom: [],
    session: { dhikrId: 'after-salah', count: 0, step: 0, rounds: 0 },
    history: {},
    settings: {
      lang: null,
      theme: 'system',
      accent: 'green',
      vibrate: true,
      sound: false,
      keepAwake: true,
      pro: false,
      onboarded: false,
    },
  }
}

export function dateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function addHistory(history: History, day: string, id: string, delta: number): History {
  const dayMap = { ...(history[day] ?? {}) }
  const next = Math.max(0, (dayMap[id] ?? 0) + delta)
  if (next === 0) delete dayMap[id]
  else dayMap[id] = next
  const out = { ...history }
  if (Object.keys(dayMap).length === 0) delete out[day]
  else out[day] = dayMap
  return out
}

function dhikrOf(state: AppState): Dhikr {
  return findDhikr(state.session.dhikrId, state.custom) ?? findDhikr('after-salah', [])!
}

export function tap(state: AppState, now: Date): { state: AppState; event: TapEvent } {
  const d = dhikrOf(state)
  const s = state.session
  const history = addHistory(state.history, dateKey(now), activeDhikrId(d, s.step), 1)
  const target = currentTarget(d, s.step)
  const count = s.count + 1

  if (isSequence(d)) {
    if (target !== null && count >= target) {
      const last = s.step >= d.sequence!.length - 1
      const session: Session = last
        ? { ...s, count: 0, step: 0, rounds: s.rounds + 1 }
        : { ...s, count: 0, step: s.step + 1 }
      return { state: { ...state, history, session }, event: last ? 'complete' : 'step' }
    }
    return { state: { ...state, history, session: { ...s, count } }, event: 'tick' }
  }

  const event: TapEvent = target !== null && count % target === 0 ? 'goal' : 'tick'
  return { state: { ...state, history, session: { ...s, count } }, event }
}

/** -1. 연속 모드에서 단계 시작점이면 이전 단계 마지막으로 되돌린다. */
export function undo(state: AppState, now: Date): AppState {
  const d = dhikrOf(state)
  const s = state.session
  let session: Session
  if (s.count > 0) {
    session = { ...s, count: s.count - 1 }
  } else if (isSequence(d) && s.step > 0) {
    const step = s.step - 1
    session = { ...s, step, count: d.stepTargets![step] - 1 }
  } else if (isSequence(d) && s.rounds > 0) {
    const step = d.sequence!.length - 1
    session = { ...s, step, rounds: s.rounds - 1, count: d.stepTargets![step] - 1 }
  } else {
    return state
  }
  const history = addHistory(state.history, dateKey(now), activeDhikrId(d, session.step), -1)
  return { ...state, session, history }
}

/** 초기화: 현재 카운트만 0으로. 기록(history)은 보존한다. */
export function reset(state: AppState): AppState {
  return { ...state, session: { ...state.session, count: 0, step: 0, rounds: 0 } }
}

export function selectDhikr(state: AppState, id: string): AppState {
  if (id === state.session.dhikrId) return state
  return { ...state, session: { dhikrId: id, count: 0, step: 0, rounds: 0 } }
}

export function canAddCustom(state: AppState, limit: number): boolean {
  return state.settings.pro || state.custom.length < limit
}

export function upsertCustom(state: AppState, d: Dhikr): AppState {
  const exists = state.custom.some((c) => c.id === d.id)
  const custom = exists
    ? state.custom.map((c) => (c.id === d.id ? d : c))
    : [...state.custom, { ...d, custom: true }]
  return { ...state, custom }
}

export function deleteCustom(state: AppState, id: string): AppState {
  const custom = state.custom.filter((c) => c.id !== id)
  const session =
    state.session.dhikrId === id
      ? { dhikrId: 'after-salah', count: 0, step: 0, rounds: 0 }
      : state.session
  return { ...state, custom, session }
}
