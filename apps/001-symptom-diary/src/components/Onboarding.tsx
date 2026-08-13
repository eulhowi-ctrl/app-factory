import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const KEY = 'symptomly-onboarded'

export function hasSeenOnboarding(): boolean {
  return localStorage.getItem(KEY) === '1'
}

export function markOnboardingSeen(): void {
  localStorage.setItem(KEY, '1')
}

interface Props {
  onDone: () => void
}

const STEPS = 3

function Onboarding({ onDone }: Props) {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)

  const steps = [
    { icon: '📝', title: t('onboard.step1'), body: t('onboard.step1Desc') },
    { icon: '💊', title: t('onboard.step2'), body: t('onboard.step2Desc') },
    { icon: '🏥', title: t('onboard.step3'), body: t('onboard.step3Desc') },
  ]
  const s = steps[step]

  return (
    <div className="onboarding">
      <div className="lock-card">
        <span className="empty-emoji">{s.icon}</span>
        <h2>{s.title}</h2>
        <p className="muted">{s.body}</p>
        <div className="dots">
          {Array.from({ length: STEPS }).map((_, i) => (
            <span key={i} className={i === step ? 'dot active' : 'dot'} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {step > 0 && (
            <button className="btn secondary" onClick={() => setStep((x) => x - 1)}>
              {t('onboard.back')}
            </button>
          )}
          <button
            className="btn"
            style={{ flex: 1 }}
            onClick={() => {
              if (step < STEPS - 1) setStep((x) => x + 1)
              else {
                markOnboardingSeen()
                onDone()
              }
            }}
          >
            {step < STEPS - 1 ? t('onboard.next') : t('onboard.start')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
