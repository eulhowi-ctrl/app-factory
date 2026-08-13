import type { AppData, Symptom, Med, MedSchedule, Mood, Sleep, Food, Memo, DiagRecord, Doc } from './types'
import { encryptText, decryptText, isEncryptedBlob } from './crypto'

const KEY = 'symptom-diary/v1'

const EMPTY: AppData = {
  symptoms: [],
  meds: [],
  premium: false,
  schedule: [],
  takenByDay: {},
  moods: [],
  sleeps: [],
  foods: [],
  memos: [],
  records: [],
  docs: [],
  appointment: undefined,
}

function parseAppData(p: Record<string, unknown>): AppData {
  return {
    symptoms: Array.isArray(p.symptoms) ? p.symptoms : [],
    meds: Array.isArray(p.meds) ? p.meds : [],
    premium: !!p.premium,
    schedule: Array.isArray(p.schedule) ? p.schedule : [],
    takenByDay: p.takenByDay && typeof p.takenByDay === 'object' ? (p.takenByDay as Record<string, string[]>) : {},
    moods: Array.isArray(p.moods) ? p.moods : [],
    sleeps: Array.isArray(p.sleeps) ? p.sleeps : [],
    foods: Array.isArray(p.foods) ? p.foods : [],
    memos: Array.isArray(p.memos) ? p.memos : [],
    records: Array.isArray(p.records) ? p.records : [],
    docs: Array.isArray(p.docs) ? p.docs : [],
    appointment: typeof p.appointment === 'string' ? p.appointment : undefined,
  }
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const p = JSON.parse(raw)
    if (isEncryptedBlob(p)) return EMPTY
    return parseAppData(p)
  } catch {
    return EMPTY
  }
}

/** 저장소 상태 읽기 — 잠금(암호화) 여부 + 평문 데이터 */
export function readStore(): { locked: boolean; data?: AppData } {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { locked: false, data: EMPTY }
    const p = JSON.parse(raw)
    if (isEncryptedBlob(p)) return { locked: true }
    return { locked: false, data: parseAppData(p) }
  } catch {
    return { locked: false, data: EMPTY }
  }
}

/** 저장 — PIN이 있으면 암호화, 없으면 평문 */
export async function writeStore(d: AppData, pin?: string): Promise<void> {
  const text = JSON.stringify(d)
  if (pin) {
    localStorage.setItem(KEY, JSON.stringify(await encryptText(text, pin)))
  } else {
    localStorage.setItem(KEY, text)
  }
}

/** PIN으로 잠금 해제 → 데이터 반환 (실패 시 null) */
export async function unlockStore(pin: string): Promise<AppData | null> {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const p = JSON.parse(raw)
    if (!isEncryptedBlob(p)) return null
    const text = await decryptText(p, pin)
    if (!text) return null
    return parseAppData(JSON.parse(text))
  } catch {
    return null
  }
}

/** 암호화 상태인지 (잠금 화면 표시용) */
export function isStoreLocked(): boolean {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return false
    return isEncryptedBlob(JSON.parse(raw))
  } catch {
    return false
  }
}

export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function todayISO(): string {
  const d = new Date()
  return toISO(d)
}

export function nowTime(): string {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function addSymptom(d: AppData, s: Omit<Symptom, 'id'>): AppData {
  return { ...d, symptoms: [...d.symptoms, { ...s, id: newId() }] }
}

export function addMed(d: AppData, m: Omit<Med, 'id'>): AppData {
  return { ...d, meds: [...d.meds, { ...m, id: newId() }] }
}

export function removeSymptom(d: AppData, id: string): AppData {
  return { ...d, symptoms: d.symptoms.filter((s) => s.id !== id) }
}

export function removeMed(d: AppData, id: string): AppData {
  return { ...d, meds: d.meds.filter((m) => m.id !== id) }
}

export function addMood(d: AppData, m: Omit<Mood, 'id'>): AppData {
  return { ...d, moods: [...d.moods, { ...m, id: newId() }] }
}

export function addSleep(d: AppData, s: Omit<Sleep, 'id'>): AppData {
  return { ...d, sleeps: [...d.sleeps, { ...s, id: newId() }] }
}

export function addFood(d: AppData, f: Omit<Food, 'id'>): AppData {
  return { ...d, foods: [...d.foods, { ...f, id: newId() }] }
}

export function addMemo(d: AppData, m: Omit<Memo, 'id'>): AppData {
  return { ...d, memos: [...d.memos, { ...m, id: newId() }] }
}

export function removeMood(d: AppData, id: string): AppData {
  return { ...d, moods: d.moods.filter((m) => m.id !== id) }
}

export function removeSleep(d: AppData, id: string): AppData {
  return { ...d, sleeps: d.sleeps.filter((s) => s.id !== id) }
}

export function removeFood(d: AppData, id: string): AppData {
  return { ...d, foods: d.foods.filter((f) => f.id !== id) }
}

export function removeMemo(d: AppData, id: string): AppData {
  return { ...d, memos: d.memos.filter((m) => m.id !== id) }
}

export function addRecord(d: AppData, r: Omit<DiagRecord, 'id'>): AppData {
  return { ...d, records: [...d.records, { ...r, id: newId() }] }
}

export function removeRecord(d: AppData, id: string): AppData {
  return { ...d, records: d.records.filter((r) => r.id !== id) }
}

export function setAppointment(d: AppData, date?: string): AppData {
  return { ...d, appointment: date || undefined }
}

export function addDoc(d: AppData, doc: Omit<Doc, 'id'>): AppData {
  return { ...d, docs: [...d.docs, { ...doc, id: newId() }] }
}

export function removeDoc(d: AppData, id: string): AppData {
  return { ...d, docs: d.docs.filter((x) => x.id !== id) }
}

export function clearAll(d: AppData): AppData {
  return {
    symptoms: [], meds: [], premium: d.premium, schedule: [], takenByDay: {},
    moods: [], sleeps: [], foods: [], memos: [], records: [], docs: [],
    appointment: undefined,
  }
}

export function setPremium(d: AppData, on: boolean): AppData {
  return { ...d, premium: on }
}

// ── 복약 스케줄 ────────────────────────────────
export function addSchedule(d: AppData, s: Omit<MedSchedule, 'id'>): AppData {
  return { ...d, schedule: [...d.schedule, { ...s, id: newId() }] }
}

export function removeSchedule(d: AppData, id: string): AppData {
  return { ...d, schedule: d.schedule.filter((s) => s.id !== id) }
}

/** 복용 체크 토글 — key = `${scheduleId}@${HH:mm}` */
export function toggleTaken(d: AppData, date: string, key: string): AppData {
  const day = d.takenByDay[date] ?? []
  const has = day.includes(key)
  const next = has ? day.filter((k) => k !== key) : [...day, key]
  return { ...d, takenByDay: { ...d.takenByDay, [date]: next } }
}

export function isTaken(d: AppData, date: string, key: string): boolean {
  return (d.takenByDay[date] ?? []).includes(key)
}
