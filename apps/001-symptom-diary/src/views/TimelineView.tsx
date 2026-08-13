import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AppData } from '../types'
import {
  toISO, removeSymptom, removeMed, removeMood, removeSleep, removeFood, removeMemo, removeRecord, removeDoc,
} from '../store'
import { inRange } from '../stats'
import { lookupMed } from '../meds'
import { medInfo as localizedMedInfo } from '../medsText'
import Heatmap from '../components/Heatmap'
import { PhotoThumb, Lightbox, usePhoto } from '../components/PhotoView'

interface Props {
  data: AppData
  set: (fn: (d: AppData) => AppData) => void
}

type Range = 7 | 30 | 90

function daysAgoISO(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return toISO(d)
}

function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function sevClass(v: number): string {
  if (v <= 3) return 'low'
  if (v <= 6) return 'mid'
  return 'high'
}

function labelFor(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

type Kind = 'symptom' | 'med' | 'mood' | 'sleep' | 'food' | 'memo' | 'record' | 'document'

interface Entry {
  id: string
  date: string
  time: string
  kind: Kind
  name: string
  severity?: number
  extra?: string
  hospital?: string
  pharmacy?: string
  photo?: string
}

function TimelineView({ data, set }: Props) {

  function handleDelete(e: Entry) {
    switch (e.kind) {
      case 'symptom': set((d) => removeSymptom(d, e.id)); break
      case 'med': set((d) => removeMed(d, e.id)); break
      case 'mood': set((d) => removeMood(d, e.id)); break
      case 'sleep': set((d) => removeSleep(d, e.id)); break
      case 'food': set((d) => removeFood(d, e.id)); break
      case 'memo': set((d) => removeMemo(d, e.id)); break
      case 'record': set((d) => removeRecord(d, e.id)); break
      case 'document': set((d) => removeDoc(d, e.id)); break
    }
  }
  const { t, i18n } = useTranslation()
  const [range, setRange] = useState<Range>(30)
  const [photoOpen, setPhotoOpen] = useState<string | null>(null)
  const [mode, setMode] = useState<'list' | 'heatmap'>('list')
  const [month, setMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })

  const from = daysAgoISO(range)
  const to = '9999-99-99'

  const entries: Entry[] = [
    ...data.symptoms
      .filter((s) => inRange(s.date, from, to))
      .map((s): Entry => ({
        id: s.id, date: s.date, time: s.time, kind: 'symptom',
        name: s.name, severity: s.severity, extra: s.note, hospital: s.hospital, photo: s.photo,
      })),
    ...data.meds
      .filter((m) => inRange(m.date, from, to))
      .map((m): Entry => ({
        id: m.id, date: m.date, time: m.time, kind: 'med',
        name: m.name, extra: m.dose, pharmacy: m.pharmacy, photo: m.photo,
      })),
    ...data.moods
      .filter((m) => inRange(m.date, from, to))
      .map((m): Entry => ({
        id: m.id, date: m.date, time: m.time, kind: 'mood',
        name: m.level, extra: m.note,
      })),
    ...data.sleeps
      .filter((s) => inRange(s.date, from, to))
      .map((s): Entry => ({
        id: s.id, date: s.date, time: '', kind: 'sleep',
        name: `${s.hours}h`, extra: s.note,
      })),
    ...data.foods
      .filter((f) => inRange(f.date, from, to))
      .map((f): Entry => ({
        id: f.id, date: f.date, time: '', kind: 'food',
        name: f.meal, extra: f.note,
      })),
    ...data.memos
      .filter((m) => inRange(m.date, from, to))
      .map((m): Entry => ({
        id: m.id, date: m.date, time: m.time, kind: 'memo',
        name: '📝', extra: m.text,
      })),
    ...data.records
      .filter((r) => inRange(r.date, from, to))
      .map((r): Entry => ({
        id: r.id, date: r.date, time: '', kind: 'record',
        name: r.name, extra: r.result,
      })),
    ...data.docs
      .filter((d) => inRange(d.date, from, to))
      .map((d): Entry => ({
        id: d.id, date: d.date, time: '', kind: 'document',
        name: d.name, extra: d.note, hospital: d.hospital, photo: d.photo,
      })),
  ]
  entries.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))

  const groups: { date: string; items: Entry[] }[] = []
  for (const e of entries) {
    const last = groups[groups.length - 1]
    if (last && last.date === e.date) last.items.push(e)
    else groups.push({ date: e.date, items: [e] })
  }

  function badge(e: Entry) {
    switch (e.kind) {
      case 'symptom':
        return <span className={`sev ${sevClass(e.severity ?? 5)}`}>{e.severity}</span>
      case 'med':
        return <span className="tag">RX</span>
      case 'mood':
        return <span className="tag">{e.name === 'good' ? '😊' : e.name === 'ok' ? '😐' : '😞'}</span>
      case 'sleep':
        return <span className="tag">🌙</span>
      case 'food':
        return <span className="tag">🍽</span>
      case 'memo':
        return <span className="tag">📝</span>
      case 'record':
        return <span className="tag">📋</span>
      case 'document':
        return <span className="tag">📄</span>
    }
  }

  return (
    <section>
      <h2>{t('timeline.title')}</h2>

      <div className="seg" style={{ boxShadow: 'none', background: 'transparent', border: 'none', padding: 0 }}>
        <button className={mode === 'list' ? 'active' : ''} onClick={() => setMode('list')}>{t('timeline.list')}</button>
        <button className={mode === 'heatmap' ? 'active' : ''} onClick={() => setMode('heatmap')}>{t('timeline.heatmap')}</button>
      </div>

      {mode === 'heatmap' && (
        <>
          <div className="range-row">
            <button onClick={() => setMonth((m) => shiftMonth(m, -1))}>‹</button>
            <span style={{ alignSelf: 'center', padding: '0 0.4rem' }}>{month}</span>
            <button onClick={() => setMonth((m) => shiftMonth(m, 1))}>›</button>
          </div>
          <Heatmap symptoms={data.symptoms} month={month} />
        </>
      )}

      {mode === 'list' && (
        <>
      <div className="range-row">
        {([7, 30, 90] as Range[]).map((r) => (
          <button
            key={r}
            className={range === r ? 'active' : ''}
            onClick={() => setRange(r)}
          >
            {t(`timeline.d${r}`)}
          </button>
        ))}
      </div>

      {groups.length === 0 ? (
        <div className="empty">
          <span className="empty-emoji">🗓️</span>
          <p>{t('timeline.empty')}</p>
        </div>
      ) : (
        groups.map((g) => (
          <div key={g.date} className="card">
            <span className="date-pill">📅 {labelFor(g.date)}</span>
            <ul className="list">
              {g.items.map((e) => {
                const med = e.kind === 'med' ? lookupMed(e.name) : null
                const medText = med ? localizedMedInfo(i18n.language, med) : null
                return (
                  <li key={e.id}>
                    {badge(e)}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span>
                        {e.kind === 'symptom' ? e.name : e.kind === 'mood' ? t(`log.mood${cap(e.name)}`) : e.name}
                      </span>
                      {medText && (
                        <div className="muted med-desc">
                          {medText.cat} — {medText.info}
                        </div>
                      )}
                      {(e.kind === 'symptom' || e.kind === 'document') && e.hospital && (
                        <div className="muted med-desc">🏥 {e.hospital}</div>
                      )}
                      {e.kind === 'med' && e.pharmacy && (
                        <div className="muted med-desc">🏪 {e.pharmacy}</div>
                      )}
                      {e.extra && <div className="muted med-desc">{e.extra}</div>}
                    </div>
                    <span className="muted" style={{ fontSize: '0.8rem' }}>
                      {e.time}
                    </span>
                    {e.photo && (
                      <PhotoThumb photoId={e.photo} onClick={() => setPhotoOpen(e.photo ?? null)} />
                    )}
                    <button type="button" className="btn danger del-btn" onClick={() => handleDelete(e)}>
                      ✕
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))
      )}
        </>
      )}

      {photoOpen && <PhotoLightboxById id={photoOpen} onClose={() => setPhotoOpen(null)} />}
    </section>
  )
}

function PhotoLightboxById({ id, onClose }: { id: string; onClose: () => void }) {
  const src = usePhoto(id)
  if (!src) return null
  return <Lightbox src={src} onClose={onClose} />
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default TimelineView
