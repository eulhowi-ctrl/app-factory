import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/** PWA 설치 배너 — beforeinstallprompt 발생 시 표시 */
function InstallBanner() {
  const { t } = useTranslation()
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!deferred) return null

  return (
    <div className="install-banner">
      <span>{t('install.msg')}</span>
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <button
          className="btn"
          onClick={() => {
            void deferred.prompt()
            setDeferred(null)
          }}
        >
          {t('install.install')}
        </button>
        <button className="btn secondary" onClick={() => setDeferred(null)}>
          ✕
        </button>
      </div>
    </div>
  )
}

export default InstallBanner
