import { useTranslation } from 'react-i18next'
import type { AppData } from '../types'
import { todayISO, toISO, isTaken, toggleTaken } from '../store'
import { rangeStats, medAdherence } from '../stats'
import { findInteractions } from '../interactions'

interface Props {
  data: AppData
  onLog: () => void
  set: (fn: (d: AppData) => AppData) => void
}

function sevClass(v: number): string {
  if (v <= 3) return 'low'
  if (v <= 6) return 'mid'
  return 'high'
}

function daysAgoISO(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return toISO(d)
}

function calcStreak(data: AppData): number {
  const dates = new Set([...data.symptoms, ...data.meds].map((x) => x.date))
  const d = new Date()
  if (!dates.has(toISO(d))) d.setDate(d.getDate() - 1) // 오늘 기록 없으면 어제 기준
  let count = 0
  while (dates.has(toISO(d))) {
    count++
    d.setDate(d.getDate() - 1)
  }
  return count
}

const TREND_DAYS = 14

function HomeView({ data, onLog, set }: Props) {
  const { t, i18n } = useTranslation()
  const today = todayISO()
  const todaySymptoms = data.symptoms.filter((s) => s.date === today)
  const avg = todaySymptoms.length
    ? todaySymptoms.reduce((a, s) => a + s.severity, 0) / todaySymptoms.length
    : 0
  const streak = calcStreak(data)
  const adherence = medAdherence(data.schedule, data.takenByDay, 7)
  const interactions = findInteractions(data.schedule.map((s) => s.name))

  // 최근 14일 증상 건수 + 평균 강도 색상 (미니 차트)
  const trend: { count: number; cls: string }[] = []
  for (let i = TREND_DAYS - 1; i >= 0; i--) {
    const iso = daysAgoISO(i)
    const day = data.symptoms.filter((s) => s.date === iso)
    const count = day.length
    const avg = count ? day.reduce((a, s) => a + s.severity, 0) / count : 0
    const cls = count === 0 ? '' : avg <= 3 ? 'low' : avg <= 6 ? 'mid' : 'high'
    trend.push({ count, cls })
  }
  const max = Math.max(1, ...trend.map((t) => t.count))

  // 상위 증상 (최근 30일)
  const stats30 = rangeStats(data.symptoms, data.meds, daysAgoISO(30), '9999-99-99')
  const top3 = stats30.byName.slice(0, 3)

  const recent = [...data.symptoms]
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
    .slice(0, 5)

  return (
    <section>
      <div className="stats">
        <div className="stat hero">
          <span className="stat-label">{t('home.symptomCount', { count: todaySymptoms.length })}</span>
          <span className="stat-value">{todaySymptoms.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{t('home.avgSeverity')}</span>
          <span className="stat-value">{todaySymptoms.length ? avg.toFixed(1) : '–'}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{t('home.streak')}</span>
          <span className="stat-value">🔥 {streak}</span>
        </div>
      </div>

      <div className="card">
        <h3>{t('home.trend', { days: TREND_DAYS })}</h3>
        <div className="mini-bars" role="img" aria-label="Daily symptom count">
          {trend.map((t, i) => (
            <div
              key={i}
              className={`mini-bar${t.cls ? ' ' + t.cls : ''}`}
              style={{ height: `${(t.count / max) * 100}%` }}
            />
          ))}
        </div>
      </div>

      {data.appointment && (
        <div className="card">
          <h3>📅 {t('home.appointment')}</h3>
          <p style={{ fontWeight: 700, color: 'var(--primary)' }}>{data.appointment}</p>
        </div>
      )}

      {interactions.length > 0 && (
        <div className="card warn-card">
          <h3>⚠️ {t('home.interactions')}</h3>
          {interactions.map((it, i) => (
            <p key={i} className="muted" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
              <strong>{it.a}</strong> + <strong>{it.b}</strong> — {it.note}
            </p>
          ))}
          <p className="muted" style={{ fontSize: '0.7rem', marginTop: '0.3rem' }}>{t('home.interactionsNote')}</p>
        </div>
      )}

      {data.schedule.length > 0 && (
        <div className="card">
          <h3>{t('home.todayMeds')}</h3>
          {data.schedule.map((s) => (
            <div key={s.id} className="med-sched">
              <div className="med-sched-name">
                <strong>{s.name}</strong>
                {s.dose && <span className="muted"> · {s.dose}</span>}
              </div>
              <div className="sched-times">
                {s.times.map((tm) => {
                  const key = `${s.id}@${tm}`
                  const taken = isTaken(data, today, key)
                  return (
                    <button
                      key={tm}
                      type="button"
                      className={taken ? 'take-btn taken' : 'take-btn'}
                      onClick={() => set((d) => toggleTaken(d, today, key))}
                    >
                      {tm}
                      {taken ? ' ✓' : ''}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {adherence.length > 0 && (
        <div className="card">
          <h3>{t('home.adherence')}</h3>
          {adherence.map((a) => (
            <div key={a.id} className="adh-row">
              <span className="adh-name">{a.name}</span>
              <div className="adh-bar">
                <div className="adh-fill" style={{ width: `${a.pct}%` }} />
              </div>
              <span className="adh-pct">{a.pct}%</span>
            </div>
          ))}
        </div>
      )}

      <button className="btn" onClick={onLog} style={{ width: '100%', padding: '1rem' }}>
        {t('home.quickAdd')}
      </button>

      {top3.length > 0 && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3>{t('home.topSymptoms')}</h3>
          <ul className="list">
            {top3.map((s) => (
              <li key={s.name}>
                <span>{s.name}</span>
                <span className="muted" style={{ marginLeft: 'auto' }}>{s.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h3>{t('home.recent')}</h3>
      {recent.length === 0 ? (
        <div className="empty">
          <span className="empty-emoji">📝</span>
          <p>{t('home.noRecent')}</p>
        </div>
      ) : (
        <div className="card">
          <ul className="list">
            {recent.map((s) => (
              <li key={s.id}>
                <span className={`sev ${sevClass(s.severity)}`}>{s.severity}</span>
                <span>{s.name}</span>
                <span className="muted" style={{ marginLeft: 'auto', fontSize: '0.8rem' }}>
                  {s.date} {s.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default HomeView
