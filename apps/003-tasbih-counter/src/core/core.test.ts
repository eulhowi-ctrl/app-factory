import { describe, expect, it } from 'vitest'
import { exportCsv, exportJson, importJson } from './backup'
import { FREE_CUSTOM_LIMIT } from './dhikr'
import {
  canAddCustom,
  dateKey,
  defaultState,
  deleteCustom,
  reset,
  selectDhikr,
  tap,
  undo,
  upsertCustom,
  type AppState,
} from './state'
import { lastNDays, streak, totalsByDhikr } from './stats'
import { parseState } from './storage'

const NOW = new Date(2026, 8, 26, 10, 0)
const TODAY = dateKey(NOW)

function tapN(s: AppState, n: number, now = NOW) {
  const events: string[] = []
  for (let i = 0; i < n; i++) {
    const r = tap(s, now)
    s = r.state
    events.push(r.event)
  }
  return { s, events }
}

describe('after-salah sequence', () => {
  it('advances 33 → 33 → 34 and completes a round', () => {
    let s = defaultState()
    let r = tapN(s, 33)
    expect(r.events.at(-1)).toBe('step')
    expect(r.s.session).toMatchObject({ step: 1, count: 0 })
    r = tapN(r.s, 33)
    expect(r.s.session.step).toBe(2)
    r = tapN(r.s, 34)
    expect(r.events.at(-1)).toBe('complete')
    expect(r.s.session).toMatchObject({ step: 0, count: 0, rounds: 1 })
    s = r.s
    expect(s.history[TODAY]).toEqual({ subhanallah: 33, alhamdulillah: 33, allahuakbar: 34 })
  })

  it('undo at a step boundary returns to the previous step', () => {
    const r = tapN(defaultState(), 33)
    const u = undo(r.s, NOW)
    expect(u.session).toMatchObject({ step: 0, count: 32 })
    expect(u.history[TODAY].subhanallah).toBe(32)
  })

  it('undo right after completing a round restores the last step', () => {
    const r = tapN(defaultState(), 100)
    const u = undo(r.s, NOW)
    expect(u.session).toMatchObject({ step: 2, count: 33, rounds: 0 })
    expect(u.history[TODAY].allahuakbar).toBe(33)
  })

  it('undo at zero does nothing', () => {
    const s = defaultState()
    expect(undo(s, NOW)).toBe(s)
  })
})

describe('single dhikr', () => {
  it('fires goal every target and keeps counting', () => {
    const s = selectDhikr(defaultState(), 'subhanallah')
    const r = tapN(s, 66)
    expect(r.events.filter((e) => e === 'goal')).toHaveLength(2)
    expect(r.s.session.count).toBe(66)
  })

  it('unlimited target never fires goal', () => {
    let s = upsertCustom(defaultState(), { id: 'c1', arabic: '', translit: '', customName: 'X', target: null })
    s = selectDhikr(s, 'c1')
    expect(tapN(s, 50).events.every((e) => e === 'tick')).toBe(true)
  })
})

describe('reset keeps history', () => {
  it('zeros the session only', () => {
    const r = tapN(defaultState(), 10)
    const s = reset(r.s)
    expect(s.session.count).toBe(0)
    expect(s.history[TODAY].subhanallah).toBe(10)
  })
})

describe('custom dhikr limit', () => {
  it('free users can add up to the limit, pro unlimited', () => {
    let s = defaultState()
    for (let i = 0; i < FREE_CUSTOM_LIMIT; i++) {
      expect(canAddCustom(s, FREE_CUSTOM_LIMIT)).toBe(true)
      s = upsertCustom(s, { id: `c${i}`, arabic: '', translit: '', customName: `C${i}`, target: 10 })
    }
    expect(canAddCustom(s, FREE_CUSTOM_LIMIT)).toBe(false)
    s = { ...s, settings: { ...s.settings, pro: true } }
    expect(canAddCustom(s, FREE_CUSTOM_LIMIT)).toBe(true)
  })

  it('deleting the active custom dhikr falls back to after-salah', () => {
    let s = upsertCustom(defaultState(), { id: 'c1', arabic: '', translit: '', customName: 'X', target: 10 })
    s = selectDhikr(s, 'c1')
    s = deleteCustom(s, 'c1')
    expect(s.session.dhikrId).toBe('after-salah')
  })
})

describe('stats', () => {
  it('streak counts back from yesterday when today is empty', () => {
    const y = new Date(NOW)
    y.setDate(y.getDate() - 1)
    const yy = new Date(NOW)
    yy.setDate(yy.getDate() - 2)
    const h = { [dateKey(y)]: { a: 1 }, [dateKey(yy)]: { a: 5 } }
    expect(streak(h, NOW)).toBe(2)
    expect(streak({ ...h, [TODAY]: { a: 1 } }, NOW)).toBe(3)
    expect(streak({}, NOW)).toBe(0)
  })

  it('lastNDays returns n entries ending today', () => {
    const days = lastNDays({ [TODAY]: { a: 3, b: 2 } }, NOW, 30)
    expect(days).toHaveLength(30)
    expect(days.at(-1)).toEqual({ day: TODAY, total: 5 })
  })

  it('totalsByDhikr sums across days', () => {
    expect(totalsByDhikr({ '2026-09-25': { a: 1 }, '2026-09-26': { a: 2, b: 3 } })).toEqual({ a: 3, b: 3 })
  })
})

describe('backup', () => {
  it('JSON round-trips', () => {
    let s = upsertCustom(defaultState(), { id: 'c1', arabic: 'x', translit: 'y', customName: 'Mine', target: 7 })
    s = tapN(s, 40).s
    s = { ...s, settings: { ...s.settings, lang: 'ar', theme: 'dark', accent: 'gold' } }
    expect(importJson(exportJson(s))).toEqual(s)
  })

  it('rejects garbage and sanitizes bad fields', () => {
    expect(importJson('not json')).toBeNull()
    expect(importJson('{"version":2}')).toBeNull()
    const s = parseState({
      version: 1,
      custom: [{ id: 'subhanallah', customName: 'dup preset' }],
      session: { dhikrId: 'missing', count: -5 },
      history: { bad: { a: 1 }, '2026-09-26': { a: -1, b: 2 } },
      settings: { lang: 'xx' },
    })!
    expect(s.custom).toEqual([])
    expect(s.session).toMatchObject({ dhikrId: 'after-salah', count: 0 })
    expect(s.history).toEqual({ '2026-09-26': { b: 2 } })
    expect(s.settings.lang).toBeNull()
  })

  it('CSV escapes names', () => {
    const s = { ...defaultState(), history: { '2026-09-26': { a: 2 } } }
    expect(exportCsv(s, () => 'He said "hi", ok')).toBe('date,dhikr,count\n2026-09-26,"He said ""hi"", ok",2\n')
  })
})
