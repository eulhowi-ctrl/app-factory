import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { exportCsv, exportJson, importJson } from '../core/backup'
import { findDhikr } from '../core/dhikr'
import { ACCENTS, dateKey, type AppState, type Lang, type Settings, type Theme } from '../core/state'
import { LANG_LABELS } from '../i18n'
import { readTextFile, saveTextFile } from '../platform/files'
import { Confirm } from './Modal'
import { dhikrTitle } from './names'

interface Props {
  state: AppState
  update: (fn: (s: AppState) => AppState) => void
}

export function SettingsScreen({ state, update }: Props) {
  const { t } = useTranslation()
  const s = state.settings
  const fileRef = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<AppState | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    update((st) => ({ ...st, settings: { ...st.settings, [key]: value } }))

  const today = dateKey(new Date())

  const onImport = async (file: File | undefined) => {
    if (!file) return
    const parsed = importJson(await readTextFile(file))
    if (fileRef.current) fileRef.current.value = ''
    if (!parsed) setNotice(t('settings.importFail'))
    else setPending(parsed)
  }

  const toggle = (key: 'vibrate' | 'sound' | 'keepAwake', label: string) => (
    <label className="setting-row">
      <span>{label}</span>
      <input type="checkbox" className="switch" checked={s[key]} onChange={(e) => set(key, e.target.checked)} />
    </label>
  )

  return (
    <section className="page">
      <p className="banner">{t('app.noAds')}</p>

      <div className="card">
        <label className="setting-row">
          <span>{t('settings.language')}</span>
          <select value={s.lang ?? ''} onChange={(e) => set('lang', (e.target.value || null) as Lang | null)}>
            <option value="">{t('settings.auto')}</option>
            {Object.entries(LANG_LABELS).map(([code, label]) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
        </label>
        <label className="setting-row">
          <span>{t('settings.theme')}</span>
          <select value={s.theme} onChange={(e) => set('theme', e.target.value as Theme)}>
            <option value="system">{t('settings.themeSystem')}</option>
            <option value="light">{t('settings.themeLight')}</option>
            <option value="dark">{t('settings.themeDark')}</option>
          </select>
        </label>
        {toggle('vibrate', t('settings.vibrate'))}
        {toggle('sound', t('settings.sound'))}
        {toggle('keepAwake', t('settings.keepAwake'))}
      </div>

      <h2 className="section-title">{t('settings.pro')}</h2>
      <div className="card">
        <p className="muted small">{t('settings.proDesc')}</p>
        <label className="setting-row">
          <span>{t('settings.proTest')}</span>
          <input type="checkbox" className="switch" checked={s.pro} onChange={(e) => set('pro', e.target.checked)} />
        </label>
        <div className="setting-row">
          <span>{t('settings.accent')} {!s.pro && <span className="chip">{t('settings.proOnly')}</span>}</span>
          <div className="swatches">
            {ACCENTS.map((a) => (
              <button
                key={a}
                className={s.accent === a ? `swatch accent-${a} selected` : `swatch accent-${a}`}
                disabled={!s.pro}
                onClick={() => set('accent', a)}
                aria-label={a}
                aria-pressed={s.accent === a}
              />
            ))}
          </div>
        </div>
      </div>

      <h2 className="section-title">{t('settings.backup')}</h2>
      <div className="card stack">
        <button className="btn btn-block" onClick={() => void saveTextFile(`tasbih-backup-${today}.json`, exportJson(state), 'application/json')}>
          {t('settings.export')}
        </button>
        <button className="btn btn-block" onClick={() => fileRef.current?.click()}>{t('settings.import')}</button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => void onImport(e.target.files?.[0])} />
        <button
          className="btn btn-block"
          disabled={!s.pro}
          onClick={() =>
            void saveTextFile(
              `tasbih-history-${today}.csv`,
              exportCsv(state, (id) => {
                const d = findDhikr(id, state.custom)
                return d ? dhikrTitle(d) : id
              }),
              'text/csv',
            )
          }
        >
          {t('settings.csv')} {!s.pro && <span className="chip">{t('settings.proOnly')}</span>}
        </button>
      </div>

      <p className="center small">
        <a href="/privacy.html" target="_blank" rel="noreferrer">{t('settings.privacy')}</a>
        <br />
        <span className="muted">{t('settings.version', { v: __APP_VERSION__ })}</span>
      </p>

      {pending && (
        <Confirm
          message={t('settings.importConfirm')}
          confirmLabel={t('common.ok')}
          cancelLabel={t('common.cancel')}
          danger
          onConfirm={() => {
            const next = pending
            update(() => next)
            setPending(null)
            setNotice(t('settings.importOk'))
          }}
          onCancel={() => setPending(null)}
        />
      )}
      {notice && (
        <Confirm message={notice} confirmLabel={t('common.ok')} cancelLabel={t('common.cancel')} onConfirm={() => setNotice(null)} onCancel={() => setNotice(null)} />
      )}
    </section>
  )
}
