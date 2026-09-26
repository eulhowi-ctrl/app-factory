import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { findDhikr } from '../core/dhikr'
import { dateKey, type AppState } from '../core/state'
import { dayTotal, lastNDays, streak, totalsByDhikr } from '../core/stats'
import { dhikrTitle } from './names'

export function HistoryScreen({ state }: { state: AppState }) {
  const { t, i18n } = useTranslation()
  const now = new Date()
  const today = dayTotal(state.history, dateKey(now))
  const days = lastNDays(state.history, now, 30)
  const totals = useMemo(() => totalsByDhikr(state.history), [state.history])
  const allTime = Object.values(totals).reduce((a, b) => a + b, 0)
  const max = Math.max(1, ...days.map((d) => d.total))
  const [selected, setSelected] = useState<number | null>(null)
  const fmt = new Intl.NumberFormat(i18n.language)
  const dayFmt = new Intl.DateTimeFormat(i18n.language, { month: 'short', day: 'numeric' })
  const label = (key: string) => dayFmt.format(new Date(`${key}T12:00:00`))
  const sel = selected !== null ? days[selected] : days[days.length - 1]

  const rows = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([id, n]) => {
      const d = findDhikr(id, state.custom)
      return { id, name: d ? dhikrTitle(d) : id, n }
    })

  return (
    <section className="page">
      <div className="stats">
        <div className="stat"><span className="stat-value">{fmt.format(today)}</span><span className="stat-label">{t('history.today')}</span></div>
        <div className="stat"><span className="stat-value">{fmt.format(streak(state.history, now))}</span><span className="stat-label">{t('history.streak')}</span></div>
        <div className="stat"><span className="stat-value">{fmt.format(allTime)}</span><span className="stat-label">{t('history.total')}</span></div>
      </div>

      <h2 className="section-title">{t('history.last30')}</h2>
      <div className="chart-card">
        <div className="chart-readout" aria-live="polite">
          <span className="muted">{label(sel.day)}</span> <strong>{fmt.format(sel.total)}</strong>
        </div>
        <div className="chart" role="img" aria-label={`${t('history.last30')}: ${days.map((d) => `${label(d.day)} ${d.total}`).join(', ')}`}>
          {days.map((d, i) => (
            <button
              key={d.day}
              className={i === (selected ?? days.length - 1) ? 'bar-hit active' : 'bar-hit'}
              onClick={() => setSelected(i)}
              onPointerEnter={() => setSelected(i)}
              title={`${label(d.day)}: ${d.total}`}
              tabIndex={-1}
            >
              <span className="bar" style={{ height: d.total ? `${Math.max(3, (d.total / max) * 100)}%` : 0 }} />
            </button>
          ))}
        </div>
        <div className="chart-axis muted small">
          <span>{label(days[0].day)}</span>
          <span>{label(days[days.length - 1].day)}</span>
        </div>
      </div>

      <h2 className="section-title">{t('history.byDhikr')}</h2>
      {rows.length === 0 ? (
        <p className="muted">{t('history.empty')}</p>
      ) : (
        <table className="totals">
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}><td>{r.name}</td><td className="num">{fmt.format(r.n)}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
