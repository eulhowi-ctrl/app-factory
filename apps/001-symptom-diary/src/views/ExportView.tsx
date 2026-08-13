import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AppData } from '../types'
import { toISO } from '../store'
import { rangeStats, toCSV, csvBlob, inRange, medCorrelation, distinctMedNames } from '../stats'
import MonthlyChart from '../components/MonthlyChart'

interface Props {
  data: AppData
  onUnlock: () => void
}

type Range = 7 | 30 | 90 | 'all'

function daysAgoISO(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return toISO(d)
}

function download(name: string, blob: Blob): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function ExportView({ data, onUnlock }: Props) {
  const { t } = useTranslation()
  const [range, setRange] = useState<Range>(30)
  const [corrMed, setCorrMed] = useState('')
  const [mask, setMask] = useState(false)

  const from = range === 'all' ? '0000-00-00' : daysAgoISO(range)
  const to = '9999-99-99'
  const stats = rangeStats(data.symptoms, data.meds, from, to)
  const hospitals = [
    ...new Set(
      data.symptoms
        .filter((s) => s.hospital && inRange(s.date, from, to))
        .map((s) => s.hospital as string)
    ),
  ]
  const pharmacies = [
    ...new Set(
      data.meds
        .filter((m) => m.pharmacy && inRange(m.date, from, to))
        .map((m) => m.pharmacy as string)
    ),
  ]
  const medNames = distinctMedNames(data.meds)
  const selMed = corrMed && medNames.includes(corrMed) ? corrMed : medNames[0]
  const corr = selMed ? medCorrelation(data.symptoms, data.meds, selMed, 30) : null
  const visits = data.symptoms
    .filter((s) => s.hospital && inRange(s.date, from, to))
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((s) => ({ date: s.date, hospital: s.hospital as string }))
    .filter((v, i, arr) => arr.findIndex((x) => x.date === v.date && x.hospital === v.hospital) === i)

  function handleCsv() {
    download('symptomly.csv', csvBlob(toCSV(data.symptoms, data.meds, from, to)))
  }

  function handlePrint() {
    window.print()
  }

  return (
    <section>
      <h2>{t('export.title')}</h2>
      <p className="muted">{t('export.intro')}</p>

      <div className="range-row">
        {([7, 30, 90, 'all'] as Range[]).map((r) => (
          <button
            key={String(r)}
            className={range === r ? 'active' : ''}
            onClick={() => setRange(r)}
          >
            {r === 'all' ? t('export.all') : t(`timeline.d${r}`)}
          </button>
        ))}
      </div>

      {/* 요약 카드 3종 */}
      <div className="stats">
        <div className="stat">
          <span className="stat-label">{t('export.totalSymptoms')}</span>
          <span className="stat-value accent">{stats.total}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{t('export.avgSeverity')}</span>
          <span className="stat-value">{stats.total ? stats.avgSeverity.toFixed(1) : '–'}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{t('export.medsTaken')}</span>
          <span className="stat-value">{stats.medCount}</span>
        </div>
      </div>

      <div className="card">
        <h3>{t('export.topSymptoms')}</h3>
        {stats.byName.length === 0 ? (
          <p className="muted">{t('export.none')}</p>
        ) : (
          <ul className="list">
            {stats.byName.map((s) => (
              <li key={s.name}>
                <span>{s.name}</span>
                <span className="muted" style={{ marginLeft: 'auto' }}>{s.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!mask && visits.length > 0 && (
        <div className="card">
          <h3>{t('export.visits')}</h3>
          <ul className="list">
            {visits.map((v, i) => (
              <li key={i}>
                <span>🏥 {v.hospital}</span>
                <span className="muted" style={{ marginLeft: 'auto' }}>{v.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!mask && (hospitals.length > 0 || pharmacies.length > 0) && (
        <div className="card">
          {hospitals.length > 0 && (
            <>
              <h3>🏥 {t('export.hospitals')}</h3>
              <div className="range-row" style={{ marginBottom: pharmacies.length > 0 ? '0.4rem' : 0 }}>
                {hospitals.map((h) => (
                  <span key={h} className="chip" style={{ cursor: 'default' }}>{h}</span>
                ))}
              </div>
            </>
          )}
          {pharmacies.length > 0 && (
            <>
              <h3>🏪 {t('export.pharmacies')}</h3>
              <div className="range-row" style={{ marginBottom: 0 }}>
                {pharmacies.map((p) => (
                  <span key={p} className="chip" style={{ cursor: 'default' }}>{p}</span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {medNames.length > 0 && corr && (
        <div className="card">
          <h3>{t('export.correlation')}</h3>
          <select value={selMed} onChange={(e) => setCorrMed(e.target.value)} className="select">
            {medNames.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <div className="corr-row">
            <span>{t('export.corrOn')} · {corr.medDays.count}d</span>
            <div className="adh-bar">
              <div className="adh-fill on" style={{ width: `${(corr.medDays.avg / 10) * 100}%` }} />
            </div>
            <span className="adh-pct">{corr.medDays.count ? corr.medDays.avg.toFixed(1) : '–'}</span>
          </div>
          <div className="corr-row">
            <span>{t('export.corrOff')} · {corr.noMedDays.count}d</span>
            <div className="adh-bar">
              <div className="adh-fill off" style={{ width: `${(corr.noMedDays.avg / 10) * 100}%` }} />
            </div>
            <span className="adh-pct">{corr.noMedDays.count ? corr.noMedDays.avg.toFixed(1) : '–'}</span>
          </div>
          <p className="muted" style={{ fontSize: '0.72rem', marginTop: '0.4rem' }}>{t('export.corrNote')}</p>
        </div>
      )}

      <div className="card">
        <h3>{t('export.monthlyTrend')}</h3>
        {data.premium ? (
          stats.byMonth.length === 0 ? (
            <p className="muted">{t('export.none')}</p>
          ) : (
            <>
              <MonthlyChart data={stats.byMonth} />
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Count</th>
                    <th>Avg severity</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.byMonth.map((m) => (
                    <tr key={m.month}>
                      <td>{m.month}</td>
                      <td>{m.count}</td>
                      <td>{m.avg.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )
        ) : (
          <>
            <div className="muted" style={{ marginBottom: '0.5rem' }}>{t('export.locked')}</div>
            <button className="btn secondary" onClick={onUnlock}>
              {t('export.goPremium')}
            </button>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
        <button className="btn" onClick={handleCsv}>{t('export.downloadCsv')}</button>
        <button className="btn secondary" onClick={handlePrint}>{t('export.printPdf')}</button>
      </div>
      <div>
        <button className="btn secondary" onClick={() => setMask((m) => !m)}>
          {mask ? '🙈 ' + t('export.maskOn') : t('export.mask')}
        </button>
      </div>

      {/* 인쇄 전용 보고서 (화면에선 숨김, window.print()에서만 노출) */}
      <div className="print-area">
        <div className="report">
          <header className="report-head">
            <h1>Symptomly — Visit Summary</h1>
            <p>Period: {from} ~ {to === '9999-99-99' ? 'present' : to} · Generated: {new Date().toISOString().slice(0, 10)}</p>
          </header>
          <table className="report-stats">
            <tbody>
              <tr><td>Symptoms logged</td><td>{stats.total}</td></tr>
              <tr><td>Avg severity</td><td>{stats.total ? stats.avgSeverity.toFixed(1) : '–'}</td></tr>
              <tr><td>Medications logged</td><td>{stats.medCount}</td></tr>
            </tbody>
          </table>
          {stats.byName.length > 0 && (
            <>
              <h2>Symptom frequency</h2>
              <table>
                <thead>
                  <tr><th>Symptom</th><th>Count</th></tr>
                </thead>
                <tbody>
                  {stats.byName.map((s) => (
                    <tr key={s.name}><td>{s.name}</td><td>{s.count}</td></tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {!mask && (hospitals.length > 0 || pharmacies.length > 0) && (
            <p>
              Hospitals: {hospitals.join(', ') || '—'}
              {pharmacies.length ? ` · Pharmacies: ${pharmacies.join(', ')}` : ''}
            </p>
          )}
          <footer className="report-foot">
            <p>Symptomly — local record. Not medical advice.</p>
          </footer>
        </div>
      </div>
    </section>
  )
}

export default ExportView
