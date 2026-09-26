import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { currentTarget, findDhikr, isSequence } from '../core/dhikr'
import { reset, tap, undo, type AppState } from '../core/state'
import { useLongPress } from '../hooks/useLongPress'
import { feedback } from '../platform/feedback'
import { Confirm } from './Modal'
import { dhikrMeaning, dhikrTitle } from './names'
import { ProgressRing } from './ProgressRing'

interface Props {
  state: AppState
  update: (fn: (s: AppState) => AppState) => void
  onChangeDhikr: () => void
}

export function CounterScreen({ state, update, onChangeDhikr }: Props) {
  const { t } = useTranslation()
  const [confirmReset, setConfirmReset] = useState(false)
  const [flash, setFlash] = useState<string | null>(null)
  const longPress = useLongPress(() => setConfirmReset(true))

  const d = findDhikr(state.session.dhikrId, state.custom)!
  const { count, step, rounds } = state.session
  const seq = isSequence(d)
  const shown = seq ? findDhikr(d.sequence![step], state.custom)! : d
  const target = currentTarget(d, step)

  // 단일 모드: 누적 카운트를 표시하고 링은 현재 바퀴 진행률
  const inLap = target ? count % target : count
  const laps = target ? Math.floor(count / target) : 0
  const progress = target ? (count > 0 && inLap === 0 ? 1 : inLap / target) : null

  const onTap = () => {
    // 탭은 개별 이벤트라 렌더 사이에 state가 항상 최신이다. 부수효과는 updater 밖에서.
    const r = tap(state, new Date())
    feedback(r.event, state.settings)
    setFlash(r.event === 'complete' ? t('counter.complete') : r.event === 'tick' ? null : '✓')
    update(() => r.state)
  }

  return (
    <section className="counter">
      <header className="counter-head">
        <div className="counter-arabic" lang="ar" dir="rtl">{shown.arabic}</div>
        <div className="counter-title">{dhikrTitle(shown)}</div>
        <div className="counter-meaning">{dhikrMeaning(shown, t)}</div>
        {seq && (
          <div className="counter-steps" aria-label={t('counter.step', { n: step + 1, total: d.sequence!.length })}>
            {d.sequence!.map((id, i) => (
              <span key={id} className={i === step ? 'dot active' : i < step ? 'dot done' : 'dot'} />
            ))}
          </div>
        )}
      </header>

      <button className="tap-area" onClick={onTap} aria-label={t('counter.tapHint')}>
        <ProgressRing progress={progress} size={240} />
        <span className="tap-count" aria-live="polite">{count}</span>
        <span className="tap-sub">
          {target ? t('counter.of', { target }) : t('counter.unlimited')}
        </span>
        {(seq ? rounds > 0 : laps > 0) && (
          <span className="tap-badge">{seq ? t('counter.round', { n: rounds }) : t('counter.lap', { n: laps })}</span>
        )}
        {flash && <span className="tap-flash" key={`${count}-${step}-${rounds}`}>{flash}</span>}
        <span className="tap-hint">{t('counter.tapHint')}</span>
      </button>

      <div className="counter-actions">
        <button className="btn" onClick={() => update((s) => undo(s, new Date()))}>
          <bdi dir="ltr">{t('counter.undo')}</bdi>
        </button>
        <button className={longPress.pressing ? 'btn btn-hold pressing' : 'btn btn-hold'} {...longPress.handlers}>
          <span className="hold-fill" />
          <span className="hold-label">{t('counter.reset')}</span>
        </button>
        <button className="btn" onClick={onChangeDhikr}>{t('counter.change')}</button>
      </div>

      {confirmReset && (
        <Confirm
          message={t('counter.resetConfirm')}
          confirmLabel={t('common.ok')}
          cancelLabel={t('common.cancel')}
          danger
          onConfirm={() => {
            update(reset)
            setFlash(null)
            setConfirmReset(false)
          }}
          onCancel={() => setConfirmReset(false)}
        />
      )}
    </section>
  )
}
