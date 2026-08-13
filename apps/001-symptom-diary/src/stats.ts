import type { Symptom, Med, MedSchedule } from './types'

function isoOf(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** date(YYYY-MM-DD)가 [from, to] 구간 안인지 (문자열 비교로 충분) */
export function inRange(date: string, from: string, to: string): boolean {
  return date >= from && date <= to
}

export interface RangeStats {
  total: number
  avgSeverity: number
  byName: { name: string; count: number }[]
  byMonth: { month: string; count: number; avg: number }[]
  medCount: number
}

export function rangeStats(symptoms: Symptom[], meds: Med[], from: string, to: string): RangeStats {
  const inS = symptoms.filter((s) => inRange(s.date, from, to))
  const inM = meds.filter((m) => inRange(m.date, from, to))

  const nameMap = new Map<string, number>()
  for (const s of inS) nameMap.set(s.name, (nameMap.get(s.name) ?? 0) + 1)
  const byName = [...nameMap.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  const monthMap = new Map<string, { count: number; sum: number }>()
  for (const s of inS) {
    const month = s.date.slice(0, 7) // YYYY-MM
    const cur = monthMap.get(month) ?? { count: 0, sum: 0 }
    monthMap.set(month, { count: cur.count + 1, sum: cur.sum + s.severity })
  }
  const byMonth = [...monthMap.entries()]
    .map(([month, v]) => ({ month, count: v.count, avg: v.count ? v.sum / v.count : 0 }))
    .sort((a, b) => (a.month < b.month ? -1 : 1))

  const sum = inS.reduce((acc, s) => acc + s.severity, 0)
  const avgSeverity = inS.length ? sum / inS.length : 0

  return { total: inS.length, avgSeverity, byName, byMonth, medCount: inM.length }
}

/** CSV 문자열 생성 (엑셀 안전: 따옴표 이스케이프) */
function esc(v: string | number): string {
  const s = String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function toCSV(symptoms: Symptom[], meds: Med[], from: string, to: string): string {
  const rows: string[] = ['type,date,time,name,severity,dose,note']
  for (const s of symptoms.filter((x) => inRange(x.date, from, to))) {
    rows.push(['symptom', s.date, s.time, s.name, s.severity, '', s.note ?? ''].map(esc).join(','))
  }
  for (const m of meds.filter((x) => inRange(x.date, from, to))) {
    rows.push(['med', m.date, m.time, m.name, '', m.dose ?? '', ''].map(esc).join(','))
  }
  return rows.join('\n')
}

/** 엑셀의 한글/유니코드 깨짐 방지용 BOM */
export function csvBlob(csv: string): Blob {
  return new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
}

/** 복약 순응도 — 최근 days일 동안 예정 대비 복용 비율 (스케줄별) */
export function medAdherence(
  schedule: MedSchedule[],
  takenByDay: Record<string, string[]>,
  days: number
): { id: string; name: string; expected: number; taken: number; pct: number }[] {
  const res: { id: string; name: string; expected: number; taken: number; pct: number }[] = []
  for (const s of schedule) {
    let expected = 0
    let taken = 0
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const iso = isoOf(d)
      const dayTaken = takenByDay[iso] ?? []
      for (const tm of s.times) {
        expected++
        if (dayTaken.includes(`${s.id}@${tm}`)) taken++
      }
    }
    res.push({
      id: s.id,
      name: s.name,
      expected,
      taken,
      pct: expected ? Math.round((taken / expected) * 100) : 100,
    })
  }
  return res
}

/** 복약한 날 vs 안 한 날의 증상 비교 (최근 days일) */
export function medCorrelation(
  symptoms: Symptom[],
  meds: Med[],
  medName: string,
  days: number
): { medDays: { count: number; avg: number }; noMedDays: { count: number; avg: number } } {
  const d = new Date()
  d.setDate(d.getDate() - days)
  const from = isoOf(d)
  const medDates = new Set(
    meds
      .filter((m) => inRange(m.date, from, '9999-99-99') && m.name.toLowerCase() === medName.toLowerCase())
      .map((m) => m.date)
  )
  let mc = 0
  let ms = 0
  let nc = 0
  let ns = 0
  for (const s of symptoms) {
    if (!inRange(s.date, from, '9999-99-99')) continue
    if (medDates.has(s.date)) { mc++; ms += s.severity } else { nc++; ns += s.severity }
  }
  return {
    medDays: { count: mc, avg: mc ? ms / mc : 0 },
    noMedDays: { count: nc, avg: nc ? ns / nc : 0 },
  }
}

/** 기록된 약 이름 목록 (상관분석 선택용) */
export function distinctMedNames(meds: Med[]): string[] {
  return [...new Set(meds.map((m) => m.name.trim()).filter(Boolean))].sort()
}
