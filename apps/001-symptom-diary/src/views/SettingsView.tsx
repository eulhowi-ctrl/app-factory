import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AppData } from '../types'
import { clearAll, setPremium, addSchedule, removeSchedule, setAppointment, addSymptom, addMed } from '../store'
import { toCSV, csvBlob } from '../stats'
import { LANGUAGES } from '../i18n/languages'
import { changeLang } from '../i18n'
import { requestNotificationPermission } from '../reminders'
import { getTheme, applyTheme, type Theme } from '../theme'

interface Props {
  data: AppData
  set: (fn: (d: AppData) => AppData) => void
  pin?: string
  onSetPin: (pin: string | undefined) => void
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

function splitCSVLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++ } else inQ = false
      } else cur += c
    } else if (c === '"') inQ = true
    else if (c === ',') { out.push(cur); cur = '' }
    else cur += c
  }
  out.push(cur)
  return out
}

function parseCSV(text: string): Record<string, string>[] {
  const rows: Record<string, string>[] = []
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return rows
  const header = splitCSVLine(lines[0]).map((h) => h.trim())
  for (let i = 1; i < lines.length; i++) {
    const cells = splitCSVLine(lines[i])
    const row: Record<string, string> = {}
    header.forEach((h, idx) => {
      row[h] = (cells[idx] ?? '').trim()
    })
    rows.push(row)
  }
  return rows
}

function refillDate(startDate: string, durationDays: number): string {
  const d = new Date(startDate + 'T00:00:00')
  d.setDate(d.getDate() + durationDays)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function SettingsView({ data, set, pin, onSetPin }: Props) {
  const { t, i18n } = useTranslation()
  const restoreRef = useRef<HTMLInputElement>(null)
  const importCsvRef = useRef<HTMLInputElement>(null)
  const [pinInput, setPinInput] = useState('')
  const [theme, setTheme] = useState<Theme>(getTheme())
  const [importMsg, setImportMsg] = useState('')
  const [sName, setSName] = useState('')
  const [sDose, setSDose] = useState('')
  const [sTimes, setSTimes] = useState('')
  const [sStart, setSStart] = useState('')
  const [sDur, setSDur] = useState('')

  function handleAddSchedule(e: React.FormEvent) {
    e.preventDefault()
    const name = sName.trim()
    if (!name) return
    const times = sTimes
      .split(',')
      .map((x) => x.trim())
      .filter((x) => /^\d{2}:\d{2}$/.test(x))
    if (times.length === 0) return
    const durationDays = Number(sDur)
    set((d) =>
      addSchedule(d, {
        name,
        dose: sDose.trim() || undefined,
        times,
        startDate: sStart || undefined,
        durationDays: sDur && Number.isFinite(durationDays) && durationDays > 0 ? durationDays : undefined,
      })
    )
    setSName('')
    setSDose('')
    setSTimes('')
    setSStart('')
    setSDur('')
  }

  function handleExportAll() {
    download('symptomly-all.csv', csvBlob(toCSV(data.symptoms, data.meds, '0000-00-00', '9999-99-99')))
  }

  function handleImportCsv(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const r = new FileReader()
    r.onload = () => {
      const rows = parseCSV(r.result as string)
      let count = 0
      for (const row of rows) {
        const type = (row.type || '').trim().toLowerCase()
        if (type === 'symptom' && row.date && row.name) {
          set((d) =>
            addSymptom(d, {
              date: row.date, time: row.time || '00:00', name: row.name,
              severity: Number(row.severity) || 5, note: row.note || undefined,
              hospital: row.hospital || undefined,
            })
          )
          count++
        } else if (type === 'med' && row.date && row.name) {
          set((d) =>
            addMed(d, {
              date: row.date, time: row.time || '00:00', name: row.name,
              dose: row.dose || undefined, pharmacy: row.pharmacy || undefined,
            })
          )
          count++
        }
      }
      setImportMsg(count > 0 ? `${t('settings.importDone')} (${count})` : t('settings.importNone'))
    }
    r.readAsText(file)
  }

  function handleBackup() {
    download('symptomly-backup.json', new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
  }

  function handleRestore(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const r = new FileReader()
    r.onload = () => {
      try {
        const parsed = JSON.parse(r.result as string)
        if (Array.isArray(parsed.symptoms) && Array.isArray(parsed.meds)) {
          set((d) => ({ ...d, ...parsed }))
        } else {
          window.alert('Invalid backup file')
        }
      } catch {
        window.alert('Invalid backup file')
      }
    }
    r.readAsText(file)
  }

  function handleClear() {
    if (window.confirm(t('settings.clearConfirm'))) {
      set((d) => clearAll(d))
    }
  }

  return (
    <section>
      <h2>{t('settings.title')}</h2>

      <div className="card">
        <h3>{t('settings.premium')}</h3>
        <p className={data.premium ? '' : 'muted'}>
          {data.premium ? t('settings.premiumStatus') : t('settings.freeStatus')}
        </p>
        <button className="btn secondary" onClick={() => set((d) => setPremium(d, !d.premium))}>
          {data.premium ? t('settings.testLock') : t('settings.testUnlock')}
        </button>
      </div>

      <div className="card">
        <h3>{t('settings.reminders')}</h3>
        <button className="btn secondary" onClick={requestNotificationPermission}>
          {t('settings.notifAllow')}
        </button>
      </div>

      <div className="card">
        <h3>{t('settings.encrypt')}</h3>
        {pin ? (
          <>
            <p className="muted">{t('settings.encryptOn')}</p>
            <button className="btn danger" onClick={() => onSetPin(undefined)}>
              {t('settings.clearPin')}
            </button>
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (pinInput.trim().length >= 4) {
                onSetPin(pinInput.trim())
                setPinInput('')
              }
            }}
          >
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder={t('settings.pinPh')}
            />
            <div style={{ marginTop: '0.5rem' }}>
              <button type="submit" className="btn secondary">{t('settings.encryptPin')}</button>
            </div>
          </form>
        )}
        <p className="muted" style={{ fontSize: '0.72rem', marginTop: '0.4rem' }}>{t('settings.pinNote')}</p>
      </div>

      <div className="card">
        <h3>{t('settings.appointment')}</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="date"
            value={data.appointment ?? ''}
            onChange={(e) => set((d) => setAppointment(d, e.target.value))}
          />
          {data.appointment && (
            <button className="btn danger" onClick={() => set((d) => setAppointment(d))}>
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <h3>{t('settings.theme')}</h3>
        <div className="seg" style={{ boxShadow: 'none', background: 'transparent', border: 'none', padding: 0 }}>
          {(['auto', 'light', 'dark'] as Theme[]).map((th) => (
            <button
              key={th}
              className={theme === th ? 'active' : ''}
              onClick={() => {
                applyTheme(th)
                setTheme(th)
              }}
            >
              {th === 'auto' ? t('settings.themeAuto') : th === 'light' ? t('settings.themeLight') : t('settings.themeDark')}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>{t('settings.language')}</h3>
        <div className="lang-grid">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              className={i18n.language === l.code ? 'lang-btn active' : 'lang-btn'}
              onClick={() => changeLang(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>{t('settings.medSchedule')}</h3>
        <form onSubmit={handleAddSchedule}>
          <label>{t('log.name')}</label>
          <input value={sName} onChange={(e) => setSName(e.target.value)} placeholder={t('log.medNamePh')} />
          <label>{t('log.dose')}</label>
          <input value={sDose} onChange={(e) => setSDose(e.target.value)} placeholder={t('log.dosePh')} />
          <label>{t('settings.medTimes')}</label>
          <input value={sTimes} onChange={(e) => setSTimes(e.target.value)} placeholder={t('settings.timesPh')} />
          <div className="field-row">
            <div>
              <label>{t('settings.startDate')}</label>
              <input type="date" value={sStart} onChange={(e) => setSStart(e.target.value)} />
            </div>
            <div>
              <label>{t('settings.durationDays')}</label>
              <input type="number" min={1} value={sDur} onChange={(e) => setSDur(e.target.value)} placeholder="30" />
            </div>
          </div>
          <div style={{ marginTop: '0.7rem' }}>
            <button type="submit" className="btn">{t('settings.addMed')}</button>
          </div>
        </form>
        {data.schedule.length === 0 ? (
          <p className="muted" style={{ marginTop: '0.7rem' }}>{t('settings.noSchedule')}</p>
        ) : (
          <ul className="list" style={{ marginTop: '0.7rem' }}>
            {data.schedule.map((s) => {
              const refill = s.startDate && s.durationDays ? refillDate(s.startDate, s.durationDays) : null
              return (
                <li key={s.id}>
                  <span style={{ flex: 1 }}>
                    <strong>{s.name}</strong>
                    {s.dose && <span className="muted"> · {s.dose}</span>}
                    <span className="muted" style={{ display: 'block', fontSize: '0.78rem' }}>
                      {s.times.join(', ')}
                      {refill ? ` · ${t('settings.refillBy')} ${refill}` : ''}
                    </span>
                  </span>
                  <button type="button" className="btn danger" onClick={() => set((d) => removeSchedule(d, s.id))}>
                    ✕
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="card">
        <h3>{t('settings.data')}</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn" onClick={handleExportAll}>{t('settings.exportAll')}</button>
          <button className="btn secondary" onClick={handleBackup}>{t('settings.backup')}</button>
          <button className="btn secondary" onClick={() => restoreRef.current?.click()}>{t('settings.restore')}</button>
          <input ref={restoreRef} type="file" accept="application/json,.json" hidden onChange={handleRestore} />
          <button className="btn danger" onClick={handleClear}>{t('settings.clearAll')}</button>
        </div>
        <div style={{ marginTop: '0.6rem' }}>
          <button className="btn secondary" onClick={() => importCsvRef.current?.click()}>
            📥 {t('settings.importCsv')}
          </button>
          <input ref={importCsvRef} type="file" accept=".csv,text/csv" hidden onChange={handleImportCsv} />
          {importMsg && <p className="muted" style={{ marginTop: '0.4rem' }}>{importMsg}</p>}
        </div>
      </div>

      <div className="card">
        <h3>{t('settings.about')}</h3>
        <p className="muted">
          {t('settings.version')}: 0.1.0 ·{' '}
          <a href="privacy.html" target="_blank" rel="noreferrer">
            {t('settings.privacy')}
          </a>
        </p>
        <p className="muted">{t('app.disclaimer')}</p>
      </div>
    </section>
  )
}

export default SettingsView
