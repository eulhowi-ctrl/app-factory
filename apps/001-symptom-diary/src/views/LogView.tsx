import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AppData } from '../types'
import {
  addSymptom, addMed, addMood, addSleep, addFood, addMemo, addRecord, addDoc,
  todayISO, nowTime, newId,
} from '../store'
import { savePhoto } from '../photos'
import { PhotoThumb } from '../components/PhotoView'
import { lookupMed, suggestMeds } from '../meds'
import { medInfo as localizedMedInfo } from '../medsText'
import { ocrImage, extractMedNames } from '../ocr'
import { suggestSymptoms } from '../symptomNames'

interface Props {
  data: AppData
  set: (fn: (d: AppData) => AppData) => void
}

type Kind = 'symptom' | 'med' | 'mood' | 'sleep' | 'food' | 'memo' | 'diagnosis' | 'document'
const KINDS: Kind[] = ['symptom', 'med', 'mood', 'sleep', 'food', 'diagnosis', 'document', 'memo']

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result as string)
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

function LogView({ data, set }: Props) {
  const { t, i18n } = useTranslation()
  const [kind, setKind] = useState<Kind>('symptom')
  const [date, setDate] = useState(todayISO())
  const [time, setTime] = useState(nowTime())
  const [saved, setSaved] = useState(false)
  const [err, setErr] = useState(false)

  // 증상 (다중 추가)
  const [pending, setPending] = useState<string[]>([])
  const [sName, setSName] = useState('')
  const [severity, setSeverity] = useState(5)
  const [sNote, setSNote] = useState('')
  const [sHospital, setSHospital] = useState('')
  const [sPhoto, setSPhoto] = useState<string | undefined>()

  // 약물
  const [mName, setMName] = useState('')
  const [dose, setDose] = useState('')
  const [pharmacy, setPharmacy] = useState('')
  const [mPhoto, setMPhoto] = useState<string | undefined>()
  const [scanning, setScanning] = useState(false)
  const [ocrHits, setOcrHits] = useState<string[]>([])

  // 기분 / 수면 / 식사 / 메모
  const [moodLevel, setMoodLevel] = useState<'good' | 'ok' | 'bad'>('ok')
  const [moodNote, setMoodNote] = useState('')
  const [sleepHours, setSleepHours] = useState(7)
  const [sleepQuality, setSleepQuality] = useState(3)
  const [sleepNote, setSleepNote] = useState('')
  const [meal, setMeal] = useState('')
  const [foodNote, setFoodNote] = useState('')
  const [text, setText] = useState('')
  const [diagName, setDiagName] = useState('')
  const [diagResult, setDiagResult] = useState('')
  const [docName, setDocName] = useState('')
  const [docKind, setDocKind] = useState<'certificate' | 'receipt' | 'details' | 'other'>('certificate')
  const [docHospital, setDocHospital] = useState('')
  const [docNote, setDocNote] = useState('')
  const [docPhoto, setDocPhoto] = useState<string | undefined>()

  const scanRef = useRef<HTMLInputElement>(null)
  const photoRef = useRef<HTMLInputElement>(null)
  const photoFor = kind === 'med' ? 'med' : kind === 'document' ? 'doc' : 'symptom'

  const med = kind === 'med' ? lookupMed(mName) : null
  const medText = med ? localizedMedInfo(i18n.language, med) : null
  const medSuggestions = kind === 'med' && mName.trim() ? suggestMeds(mName) : []
  const symptomSuggestions = kind === 'symptom' && sName.trim() ? suggestSymptoms(sName) : []

  function addPending(name: string) {
    const n = name.trim()
    if (!n) return
    setPending((p) => (p.includes(n) ? p : [...p, n]))
    setSName('')
  }

  function handleScan(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setScanning(true)
    setOcrHits([])
    ocrImage(file)
      .then((text) => setOcrHits(extractMedNames(text)))
      .catch((err) => console.warn('OCR failed:', err))
      .finally(() => setScanning(false))
  }

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const url = await fileToDataURL(file)
    const id = newId()
    await savePhoto(id, url)
    if (photoFor === 'med') setMPhoto(id)
    else if (photoFor === 'doc') setDocPhoto(id)
    else setSPhoto(id)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (kind === 'symptom') {
      const names = pending.length ? pending : sName.trim() ? [sName.trim()] : []
      if (names.length === 0) { setErr(true); return }
      names.forEach((name) =>
        set((d) => addSymptom(d, {
          date, time, name, severity,
          note: sNote.trim() || undefined,
          hospital: sHospital.trim() || undefined,
          photo: sPhoto,
        }))
      )
      setPending([]); setSName(''); setSNote(''); setSHospital(''); setSPhoto(undefined)
    } else if (kind === 'med') {
      if (!mName.trim()) { setErr(true); return }
      set((d) => addMed(d, {
        date, time, name: mName.trim(), dose: dose.trim() || undefined,
        pharmacy: pharmacy.trim() || undefined, photo: mPhoto,
      }))
      setMName(''); setDose(''); setPharmacy(''); setMPhoto(undefined); setOcrHits([])
    } else if (kind === 'mood') {
      set((d) => addMood(d, { date, time, level: moodLevel, note: moodNote.trim() || undefined }))
      setMoodNote('')
    } else if (kind === 'sleep') {
      set((d) => addSleep(d, { date, hours: sleepHours, quality: sleepQuality, note: sleepNote.trim() || undefined }))
      setSleepNote('')
    } else if (kind === 'food') {
      if (!meal.trim()) { setErr(true); return }
      set((d) => addFood(d, { date, meal: meal.trim(), note: foodNote.trim() || undefined }))
      setMeal(''); setFoodNote('')
    } else if (kind === 'diagnosis') {
      if (!diagName.trim()) { setErr(true); return }
      set((d) => addRecord(d, { date, name: diagName.trim(), result: diagResult.trim() || undefined }))
      setDiagName('')
      setDiagResult('')
    } else if (kind === 'document') {
      if (!docName.trim()) { setErr(true); return }
      set((d) =>
        addDoc(d, {
          date,
          name: docName.trim(),
          kind: docKind,
          hospital: docHospital.trim() || undefined,
          note: docNote.trim() || undefined,
          photo: docPhoto,
        })
      )
      setDocName('')
      setDocHospital('')
      setDocNote('')
      setDocPhoto(undefined)
    } else {
      if (!text.trim()) { setErr(true); return }
      set((d) => addMemo(d, { date, time, text: text.trim() }))
      setText('')
    }
    setErr(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const segLabel: Record<Kind, string> = {
    symptom: t('log.symptom'), med: t('log.med'), mood: t('log.mood'),
    sleep: t('log.sleep'), food: t('log.food'), diagnosis: t('log.diagnosis'),
    document: t('log.document'), memo: t('log.memo'),
  }

  return (
    <section>
      <h2>{t('log.title')}</h2>

      <div className="seg">
        {KINDS.map((k) => (
          <button key={k} className={kind === k ? 'active' : ''} onClick={() => setKind(k)}>
            {segLabel[k]}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="card">
        {kind === 'symptom' && (
          <>
            <label>{t('log.name')}</label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                value={sName}
                onChange={(e) => setSName(e.target.value)}
                placeholder={t('log.namePh')}
                autoComplete="off"
              />
              <button type="button" className="btn secondary" onClick={() => addPending(sName)}>
                +
              </button>
            </div>
            {symptomSuggestions.length > 0 && (
              <div className="ac-list">
                {symptomSuggestions.map((n) => (
                  <button key={n} type="button" className="ac-item" onClick={() => addPending(n)}>
                    {n}
                  </button>
                ))}
              </div>
            )}
            {pending.length > 0 && (
              <div className="ocr-hits" style={{ marginTop: '0.5rem' }}>
                <span className="muted">{t('log.pendingList')}</span>
                {pending.map((n) => (
                  <button key={n} type="button" className="chip" onClick={() => setPending((p) => p.filter((x) => x !== n))}>
                    {n} ✕
                  </button>
                ))}
              </div>
            )}
            <label>{t('log.severity')}: <strong>{severity}</strong></label>
            <input type="range" min={1} max={10} value={severity} onChange={(e) => setSeverity(Number(e.target.value))} />
            <label>{t('log.hospital')}</label>
            <input value={sHospital} onChange={(e) => setSHospital(e.target.value)} placeholder={t('log.hospitalPh')} />
            <label>{t('log.note')}</label>
            <textarea value={sNote} onChange={(e) => setSNote(e.target.value)} placeholder={t('log.notePh')} rows={2} />
            <PhotoRow label={t('log.photo')} photoId={sPhoto} onClear={() => setSPhoto(undefined)} onPick={() => photoRef.current?.click()} />
          </>
        )}

        {kind === 'med' && (
          <>
            <label>{t('log.name')}</label>
            <input value={mName} onChange={(e) => setMName(e.target.value)} placeholder={t('log.medNamePh')} autoComplete="off" />
            {medSuggestions.length > 0 && (
              <div className="ac-list">
                {medSuggestions.map((s) => (
                  <button key={s.name} type="button" className="ac-item" onClick={() => setMName(s.name)}>
                    {s.name}
                  </button>
                ))}
              </div>
            )}
            {medText && <p className="med-info">💊 {medText.cat} — {medText.info}</p>}
            <label>{t('log.dose')}</label>
            <input value={dose} onChange={(e) => setDose(e.target.value)} placeholder={t('log.dosePh')} />
            <label>{t('log.pharmacy')}</label>
            <input value={pharmacy} onChange={(e) => setPharmacy(e.target.value)} placeholder={t('log.pharmacyPh')} />
            <div style={{ marginTop: '0.6rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button type="button" className="btn secondary" onClick={() => scanRef.current?.click()} disabled={scanning}>
                {scanning ? '⏳…' : '📷 ' + t('log.scanPrescription')}
              </button>
              <input ref={scanRef} type="file" accept="image/*" capture="environment" hidden onChange={handleScan} />
            </div>
            {ocrHits.length > 0 && (
              <div className="ocr-hits">
                <span className="muted">{t('log.ocrFound')}</span>
                {ocrHits.map((n) => (
                  <button key={n} type="button" className="chip" onClick={() => { setMName(n); setOcrHits([]) }}>
                    {n}
                  </button>
                ))}
              </div>
            )}
            <PhotoRow label={t('log.photo')} photoId={mPhoto} onClear={() => setMPhoto(undefined)} onPick={() => photoRef.current?.click()} />
          </>
        )}

        {kind === 'mood' && (
          <>
            <label>{t('log.mood')}</label>
            <div className="seg" style={{ boxShadow: 'none', background: 'transparent', border: 'none', padding: 0 }}>
              {(['good', 'ok', 'bad'] as const).map((lv) => (
                <button key={lv} className={moodLevel === lv ? 'active' : ''} onClick={() => setMoodLevel(lv)}>
                  {lv === 'good' ? '😊 ' : lv === 'ok' ? '😐 ' : '😞 '}
                  {lv === 'good' ? t('log.moodGood') : lv === 'ok' ? t('log.moodOk') : t('log.moodBad')}
                </button>
              ))}
            </div>
            <label>{t('log.note')}</label>
            <textarea value={moodNote} onChange={(e) => setMoodNote(e.target.value)} placeholder={t('log.notePh')} rows={2} />
          </>
        )}

        {kind === 'sleep' && (
          <>
            <label>{t('log.hours')}: <strong>{sleepHours}</strong></label>
            <input type="range" min={0} max={14} step={0.5} value={sleepHours} onChange={(e) => setSleepHours(Number(e.target.value))} />
            <label>{t('log.quality')}: <strong>{sleepQuality}</strong></label>
            <input type="range" min={1} max={5} value={sleepQuality} onChange={(e) => setSleepQuality(Number(e.target.value))} />
            <label>{t('log.note')}</label>
            <textarea value={sleepNote} onChange={(e) => setSleepNote(e.target.value)} placeholder={t('log.notePh')} rows={2} />
          </>
        )}

        {kind === 'food' && (
          <>
            <label>{t('log.meal')}</label>
            <input value={meal} onChange={(e) => setMeal(e.target.value)} placeholder={t('log.mealPh')} />
            <label>{t('log.note')}</label>
            <textarea value={foodNote} onChange={(e) => setFoodNote(e.target.value)} placeholder={t('log.notePh')} rows={2} />
          </>
        )}

        {kind === 'diagnosis' && (
          <>
            <label>{t('log.diagnosis')}</label>
            <input value={diagName} onChange={(e) => setDiagName(e.target.value)} placeholder={t('log.diagnosisPh')} />
            <label>{t('log.result')}</label>
            <input value={diagResult} onChange={(e) => setDiagResult(e.target.value)} placeholder={t('log.resultPh')} />
          </>
        )}

        {kind === 'document' && (
          <>
            <label>{t('log.name')}</label>
            <input value={docName} onChange={(e) => setDocName(e.target.value)} placeholder={t('log.docNamePh')} />
            <label>{t('log.docKind')}</label>
            <div className="seg" style={{ boxShadow: 'none', background: 'transparent', border: 'none', padding: 0 }}>
              {(['certificate', 'receipt', 'details', 'other'] as const).map((k) => (
                <button key={k} className={docKind === k ? 'active' : ''} onClick={() => setDocKind(k)}>
                  {t(`log.doc${cap(k)}`)}
                </button>
              ))}
            </div>
            <label>{t('log.hospital')}</label>
            <input value={docHospital} onChange={(e) => setDocHospital(e.target.value)} placeholder={t('log.hospitalPh')} />
            <label>{t('log.note')}</label>
            <textarea value={docNote} onChange={(e) => setDocNote(e.target.value)} placeholder={t('log.notePh')} rows={2} />
            <PhotoRow label={t('log.photo')} photoId={docPhoto} onClear={() => setDocPhoto(undefined)} onPick={() => photoRef.current?.click()} />
          </>
        )}

        {kind === 'memo' && (
          <>
            <label>{t('log.text')}</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t('log.textPh')} rows={4} autoFocus />
          </>
        )}

        <input ref={photoRef} type="file" accept="image/*" hidden onChange={handlePhoto} />

        <div className="field-row">
          <div>
            <label>{t('log.date')}</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          {kind !== 'food' && kind !== 'memo' && kind !== 'document' && (
            <div>
              <label>{t('log.time')}</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          )}
        </div>

        {err && <p className="muted" style={{ color: 'var(--sev-high)' }}>{t('log.noName')}</p>}

        <div style={{ marginTop: '1rem' }}>
          <button type="submit" className="btn">
            {saved ? t('log.saved') : t('log.save')}
          </button>
        </div>
      </form>
    </section>
  )
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function PhotoRow({ label, photoId, onClear, onPick }: { label: string; photoId?: string; onClear: () => void; onPick: () => void }) {
  return (
    <div style={{ marginTop: '0.7rem' }}>
      <label>{label}</label>
      {photoId ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <PhotoThumb photoId={photoId} className="photo-preview" />
          <button type="button" className="btn danger" onClick={onClear}>✕</button>
        </div>
      ) : (
        <button type="button" className="btn secondary" onClick={onPick}>📷</button>
      )}
    </div>
  )
}

export default LogView
