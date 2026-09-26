import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CounterScreen } from './components/CounterScreen'
import { DhikrListScreen } from './components/DhikrListScreen'
import { HistoryScreen } from './components/HistoryScreen'
import { Onboarding } from './components/Onboarding'
import { SettingsScreen } from './components/SettingsScreen'
import { TabIcon } from './components/TabIcon'
import { useAppState } from './hooks/useAppState'
import { deviceLang } from './i18n'
import { useWakeLock } from './platform/wakeLock'

type Tab = 'counter' | 'list' | 'history' | 'settings'

const TABS: Tab[] = ['counter', 'list', 'history', 'settings']

function App() {
  const { t, i18n } = useTranslation()
  const [state, update] = useAppState()
  const [tab, setTab] = useState<Tab>('counter')
  const { settings } = state

  const lang = settings.lang ?? deviceLang()
  useEffect(() => {
    void i18n.changeLanguage(lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang, i18n])

  useEffect(() => {
    const root = document.documentElement
    if (settings.theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', settings.theme)
    root.setAttribute('data-accent', settings.pro ? settings.accent : 'green')
  }, [settings.theme, settings.accent, settings.pro])

  useWakeLock(settings.keepAwake && tab === 'counter')

  return (
    <div className="app">
      <header className="app-bar">
        <h1>{t('app.name')}</h1>
      </header>

      <main className="app-main">
        {tab === 'counter' && <CounterScreen state={state} update={update} onChangeDhikr={() => setTab('list')} />}
        {tab === 'list' && <DhikrListScreen state={state} update={update} onPicked={() => setTab('counter')} />}
        {tab === 'history' && <HistoryScreen state={state} />}
        {tab === 'settings' && <SettingsScreen state={state} update={update} />}
      </main>

      <nav className="tabs" role="tablist">
        {TABS.map((id) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            className={tab === id ? 'tab active' : 'tab'}
            onClick={() => setTab(id)}
          >
            <TabIcon name={id} />
            <span className="tab-label">{t(`tab.${id}`)}</span>
          </button>
        ))}
      </nav>

      {!settings.onboarded && (
        <Onboarding onDone={() => update((s) => ({ ...s, settings: { ...s.settings, onboarded: true } }))} />
      )}
    </div>
  )
}

export default App
