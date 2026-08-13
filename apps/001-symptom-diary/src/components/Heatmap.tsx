import type { Symptom } from '../types'

interface Props {
  symptoms: Symptom[]
  month: string // "YYYY-MM"
}

/** 월간 캘린더 히트맵 — 그날 최대 증상 강도로 셀 색상 */
function Heatmap({ symptoms, month }: Props) {
  const [y, m] = month.split('-').map(Number)
  const startDay = new Date(y, m - 1, 1).getDay()
  const daysInMonth = new Date(y, m, 0).getDate()

  const byDate = new Map<string, number>()
  for (const s of symptoms) {
    if (!s.date.startsWith(month)) continue
    byDate.set(s.date, Math.max(byDate.get(s.date) ?? 0, s.severity))
  }

  const cells: React.ReactNode[] = []
  for (let i = 0; i < startDay; i++) cells.push(<div key={`e${i}`} className="hm-cell empty" />)
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${month}-${String(d).padStart(2, '0')}`
    const sev = byDate.get(iso)
    const cls = !sev ? '' : sev <= 3 ? 'low' : sev <= 6 ? 'mid' : 'high'
    cells.push(
      <div key={iso} className={`hm-cell${cls ? ' ' + cls : ''}`} title={`${iso}${sev ? ` · ${sev}` : ''}`} />
    )
  }

  return (
    <div className="card">
      <div className="hm-weekdays">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="heatmap" role="img" aria-label={`${month} symptom intensity`}>
        {cells}
      </div>
    </div>
  )
}

export default Heatmap
