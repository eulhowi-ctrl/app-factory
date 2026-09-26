import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Dhikr } from '../core/dhikr'
import { Modal } from './Modal'

interface Props {
  initial: Dhikr | null
  onSave: (d: Dhikr) => void
  onDelete?: () => void
  onClose: () => void
}

export function DhikrEditor({ initial, onSave, onDelete, onClose }: Props) {
  const { t } = useTranslation()
  const [name, setName] = useState(initial?.customName ?? '')
  const [arabic, setArabic] = useState(initial?.arabic ?? '')
  const [translit, setTranslit] = useState(initial?.translit ?? '')
  const [target, setTarget] = useState(String(initial?.target ?? 33))
  const [error, setError] = useState(false)

  const save = () => {
    if (!name.trim()) {
      setError(true)
      return
    }
    const n = Math.max(0, Math.min(100000, Math.floor(Number(target) || 0)))
    onSave({
      id: initial?.id ?? `c-${Date.now().toString(36)}`,
      customName: name.trim(),
      arabic: arabic.trim(),
      translit: translit.trim(),
      target: n > 0 ? n : null,
      custom: true,
    })
  }

  return (
    <Modal title={initial ? t('editor.editTitle') : t('editor.addTitle')} onClose={onClose}>
      <label className="field">
        <span>{t('editor.name')}</span>
        <input value={name} onChange={(e) => { setName(e.target.value); setError(false) }} maxLength={60} autoFocus />
        {error && <small className="field-error">{t('editor.nameRequired')}</small>}
      </label>
      <label className="field">
        <span>{t('editor.arabic')}</span>
        <input value={arabic} onChange={(e) => setArabic(e.target.value)} dir="rtl" lang="ar" maxLength={200} />
      </label>
      <label className="field">
        <span>{t('editor.translit')}</span>
        <input value={translit} onChange={(e) => setTranslit(e.target.value)} maxLength={120} />
      </label>
      <label className="field">
        <span>{t('editor.target')}</span>
        <input type="number" inputMode="numeric" min={0} value={target} onChange={(e) => setTarget(e.target.value)} />
      </label>
      <div className="modal-actions">
        {onDelete && <button className="btn btn-danger-text" onClick={onDelete}>{t('common.delete')}</button>}
        <span className="spacer" />
        <button className="btn" onClick={onClose}>{t('common.cancel')}</button>
        <button className="btn btn-primary" onClick={save}>{t('common.save')}</button>
      </div>
    </Modal>
  )
}
