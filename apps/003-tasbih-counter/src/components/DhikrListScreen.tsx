import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FREE_CUSTOM_LIMIT, PRESETS, type Dhikr } from '../core/dhikr'
import { canAddCustom, deleteCustom, selectDhikr, upsertCustom, type AppState } from '../core/state'
import { DhikrEditor } from './DhikrEditor'
import { Confirm } from './Modal'
import { dhikrMeaning, dhikrTitle } from './names'

interface Props {
  state: AppState
  update: (fn: (s: AppState) => AppState) => void
  onPicked: () => void
}

export function DhikrListScreen({ state, update, onPicked }: Props) {
  const { t } = useTranslation()
  const [editing, setEditing] = useState<Dhikr | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Dhikr | null>(null)
  const canAdd = canAddCustom(state, FREE_CUSTOM_LIMIT)

  const pick = (id: string) => {
    update((s) => selectDhikr(s, id))
    onPicked()
  }

  const row = (d: Dhikr) => {
    const current = state.session.dhikrId === d.id
    return (
      <li key={d.id} className={current ? 'dhikr-row current' : 'dhikr-row'}>
        <button className="dhikr-main" onClick={() => pick(d.id)}>
          {d.arabic && <span className="dhikr-arabic" lang="ar" dir="rtl">{d.arabic}</span>}
          <span className="dhikr-name">{dhikrTitle(d)}</span>
          {dhikrMeaning(d, t) && <span className="dhikr-meaning">{dhikrMeaning(d, t)}</span>}
          <span className="dhikr-meta">
            {d.sequence ? t('list.sequence') : d.target ? t('list.target', { n: d.target }) : t('counter.unlimited')}
            {current && <span className="chip">{t('list.current')}</span>}
          </span>
        </button>
        {d.custom && (
          <button className="icon-btn" onClick={() => setEditing(d)} aria-label={t('common.edit')}>✎</button>
        )}
      </li>
    )
  }

  return (
    <section className="page">
      <h2 className="section-title">{t('list.presets')}</h2>
      <ul className="dhikr-list">{PRESETS.map(row)}</ul>

      <h2 className="section-title">{t('list.custom')}</h2>
      {state.custom.length === 0 && <p className="muted">{t('list.empty')}</p>}
      <ul className="dhikr-list">{state.custom.map(row)}</ul>

      <button className="btn btn-primary btn-block" disabled={!canAdd} onClick={() => setEditing('new')}>
        + {t('list.add')}
      </button>
      {!state.settings.pro && (
        <p className="muted small center">{t('list.limit', { n: FREE_CUSTOM_LIMIT })}</p>
      )}

      {editing && (
        <DhikrEditor
          initial={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSave={(d) => {
            update((s) => upsertCustom(s, d))
            setEditing(null)
          }}
          onDelete={editing === 'new' ? undefined : () => { setDeleting(editing); setEditing(null) }}
        />
      )}
      {deleting && (
        <Confirm
          message={t('editor.deleteConfirm')}
          confirmLabel={t('common.delete')}
          cancelLabel={t('common.cancel')}
          danger
          onConfirm={() => {
            update((s) => deleteCustom(s, deleting.id))
            setDeleting(null)
          }}
          onCancel={() => setDeleting(null)}
        />
      )}
    </section>
  )
}
