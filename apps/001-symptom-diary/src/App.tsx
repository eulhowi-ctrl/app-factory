import { useEffect, useRef, useState, type FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { AppData } from './types'
import { readStore, writeStore, unlockStore, setPremium } from './store'
import { initAds } from './ads'
import { setupReminders, requestNotificationPermission, stopReminders } from './reminders'
import { applyTheme, getTheme } from './theme'
import { migrateInlinePhotos } from './photos'
import Onboarding, { hasSeenOnboarding } from './components/Onboarding'
import InstallBanner from './components/InstallBanner'
import { IconHome, IconPlus, IconCalendar, IconShare, IconSettings, IconFolder } from './icons'
import type { IconProps } from './icons'
import HomeView from './views/HomeView'
import LogView from './views/LogView'
import TimelineView from './views/TimelineView'
import ExportView from './views/ExportView'
import SettingsView from './views/SettingsView'
import ArchiveView from './views/ArchiveView'

type Tab = 'home' | 'log' | 'timeline' | 'export' | 'archive' | 'settings'

const TABS: Tab[] = ['home', 'log', 'timeline', 'export', 'archive', 'settings']
const ICONS: Record<Tab, FC<IconProps>> = {
  home: IconHome,
  log: IconPlus,
  timeline: IconCalendar,
  export: IconShare,
  archive: IconFolder,
  settings: IconSettings,
}

function App() {
  const { t } = useTranslation()
  const [data, setData] = useState<AppData>({ symptoms: [], meds: [], premium: false, schedule: [], takenByDay: {}, moods: [], sleeps: [], foods: [], memos: [], records: [], docs: [] })
  const [tab, setTab] = useState<Tab>('home')
  const [pin, setPin] = useState<string | undefined>(undefined)
  const [locked, setLocked] = useState(false)
  const [ready, setReady] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(() => !hasSeenOnboarding())

  // 초기 로드 (+ 사진 IndexedDB 마이그레이션)
  useEffect(() => {
    applyTheme(getTheme())
    ;(async () => {
      const r = readStore()
      if (r.locked) {
        setLocked(true)
      } else if (r.data) {
        setData(await migrateInlinePhotos(r.data))
        setReady(true)
      } else {
        setReady(true)
      }
    })()
  }, [])

  // 저장 (PIN 있으면 암호화)
  useEffect(() => {
    if (!ready) return
    void writeStore(data, pin)
  }, [data, pin, ready])

  useEffect(() => {
    void initAds()
  }, [])

  const dataRef = useRef(data)
  dataRef.current = data
  useEffect(() => {
    requestNotificationPermission()
    setupReminders(() => ({
      schedule: dataRef.current.schedule,
      takenByDay: dataRef.current.takenByDay,
    }))
    return stopReminders
  }, [])

  const set = (updater: (d: AppData) => AppData) => setData(updater)

  async function handleUnlock(value: string) {
    const d = await unlockStore(value)
    if (d) {
      setData(d)
      setPin(value)
      setLocked(false)
      setReady(true)
    }
    return !!d
  }

  if (locked && !ready) {
    return (
      <div className="app lock-screen">
        <div className="lock-card">
          <span className="empty-emoji">🔒</span>
          <h2>{t('app.lockedTitle')}</h2>
          <p className="muted">{t('app.lockedSub')}</p>
          <LockForm onUnlock={handleUnlock} wrongText={t('app.wrongPin')} unlockText={t('app.unlock')} />
        </div>
      </div>
    )
  }

  if (showOnboarding) {
    return (
      <div className="app lock-screen">
        <Onboarding onDone={() => setShowOnboarding(false)} />
      </div>
    )
  }

  return (
    <div className="app">
      <InstallBanner />
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden>
            ♥
          </span>
          <div>
            <h1>{t('app.title')}</h1>
            <p className="brand-sub">{t('app.tagline')}</p>
          </div>
        </div>
      </header>

      <main className="content">
        {tab === 'home' && <HomeView data={data} onLog={() => setTab('log')} set={set} />}
        {tab === 'log' && <LogView data={data} set={set} />}
        {tab === 'timeline' && <TimelineView data={data} set={set} />}
        {tab === 'export' && (
          <ExportView data={data} onUnlock={() => set((d) => setPremium(d, true))} />
        )}
        {tab === 'archive' && <ArchiveView data={data} />}
        {tab === 'settings' && (
          <SettingsView data={data} set={set} pin={pin} onSetPin={setPin} />
        )}
      </main>

      <nav className="bottom-nav">
        {TABS.map((key) => {
          const Icon = ICONS[key]
          return (
            <button
              key={key}
              className={tab === key ? 'nav-item active' : 'nav-item'}
              onClick={() => setTab(key)}
            >
              <Icon />
              <span>{t(`tabs.${key}`)}</span>
            </button>
          )
        })}
      </nav>

      <div className="medical-note">{t('app.disclaimer')}</div>
    </div>
  )
}

function LockForm({ onUnlock, wrongText, unlockText }: { onUnlock: (v: string) => Promise<boolean>; wrongText: string; unlockText: string }) {
  const [v, setV] = useState('')
  const [err, setErr] = useState(false)
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void onUnlock(v).then((ok) => setErr(!ok))
      }}
    >
      <input
        type="password"
        value={v}
        onChange={(e) => setV(e.target.value)}
        autoFocus
        style={{ marginBottom: '0.6rem' }}
      />
      {err && <p className="muted" style={{ color: 'var(--sev-high)' }}>{wrongText}</p>}
      <button type="submit" className="btn" style={{ width: '100%' }}>{unlockText}</button>
    </form>
  )
}

export default App
