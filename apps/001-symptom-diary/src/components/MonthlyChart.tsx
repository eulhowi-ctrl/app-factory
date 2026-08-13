import { useState } from 'react'

export interface MonthPoint {
  month: string // YYYY-MM
  count: number
  avg: number
}

interface Props {
  data: MonthPoint[]
}

const W = 560
const H = 200
const PAD_L = 30
const PAD_R = 6
const PAD_T = 12
const PAD_B = 26

function monthLabel(ym: string): string {
  const [y, m] = ym.split('-')
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-US', { month: 'short' })
}

/** 상단 모서리만 둥글게 (베이스라인은 직각으로 고정) */
function roundedTopPath(x: number, y: number, w: number, h: number, r: number): string {
  return [
    `M ${x} ${y + r}`,
    `Q ${x} ${y} ${x + r} ${y}`,
    `L ${x + w - r} ${y}`,
    `Q ${x + w} ${y} ${x + w} ${y + r}`,
    `L ${x + w} ${y + h}`,
    `L ${x} ${y + h}`,
    'Z',
  ].join(' ')
}

function MonthlyChart({ data }: Props) {
  const [hover, setHover] = useState<MonthPoint & { cx: number; y: number } | null>(null)

  if (data.length === 0) return null

  const max = Math.max(1, ...data.map((d) => d.count))
  const plotW = W - PAD_L - PAD_R
  const plotH = H - PAD_T - PAD_B
  const n = data.length
  const step = plotW / n
  const barW = Math.min(44, step * 0.6)
  const baselineY = PAD_T + plotH

  const bars = data.map((d, i) => {
    const x = PAD_L + i * step + (step - barW) / 2
    const h = (d.count / max) * plotH
    const y = baselineY - h
    return { ...d, x, y, h, cx: x + barW / 2 }
  })

  const ariaLabel =
    `Symptom count by month: ${data.map((d) => `${monthLabel(d.month)} ${d.count}`).join(', ')}`

  return (
    <div className="chart-wrap" role="img" aria-label={ariaLabel}>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="presentation">
        {/* 얇고 은은한 y 그리드 */}
        {[0, 0.5, 1].map((f) => {
          const gy = PAD_T + plotH - f * plotH
          return <line key={f} x1={PAD_L} x2={W - PAD_R} y1={gy} y2={gy} className="chart-grid" />
        })}

        {bars.map((b) => (
          <path
            key={b.month}
            d={roundedTopPath(b.x, b.y, barW, b.h, 4)}
            className="chart-bar"
            onMouseEnter={() => setHover(b)}
            onMouseLeave={() => setHover(null)}
          >
            <title>{`${monthLabel(b.month)} ${b.month.slice(0, 4)} · ${b.count} symptoms`}</title>
          </path>
        ))}

        {/* x축 월 라벨 */}
        {bars.map((b) => (
          <text
            key={b.month}
            x={b.cx}
            y={baselineY + 16}
            className="chart-xlabel"
            textAnchor="middle"
          >
            {monthLabel(b.month)}
          </text>
        ))}
      </svg>

      {hover && (
        <div
          className="chart-tooltip"
          style={{ left: `${(hover.cx / W) * 100}%`, top: `${(hover.y / H) * 100}%` }}
        >
          <strong>
            {monthLabel(hover.month)} {hover.month.slice(0, 4)}
          </strong>
          <span>
            {hover.count} symptoms · avg {hover.avg.toFixed(1)}
          </span>
        </div>
      )}
    </div>
  )
}

export default MonthlyChart
