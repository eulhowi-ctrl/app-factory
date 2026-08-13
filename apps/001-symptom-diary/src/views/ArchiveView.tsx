import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AppData } from '../types'
import { PhotoThumb, Lightbox, usePhoto } from '../components/PhotoView'

interface Props {
  data: AppData
}

function ArchiveView({ data }: Props) {
  const { t } = useTranslation()
  const [openId, setOpenId] = useState<string | null>(null)

  const items = [
    ...data.meds
      .filter((m) => m.photo)
      .map((m) => ({ id: m.photo as string, kind: '💊', label: m.name, date: m.date })),
    ...data.symptoms
      .filter((s) => s.photo)
      .map((s) => ({ id: s.photo as string, kind: '🏥', label: s.name, date: s.date })),
    ...data.docs
      .filter((d) => d.photo)
      .map((d) => ({ id: d.photo as string, kind: '📄', label: d.name, date: d.date })),
  ].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <section>
      <h2>{t('tabs.archive')}</h2>
      {items.length === 0 ? (
        <div className="empty">
          <span className="empty-emoji">🖼️</span>
          <p>{t('archive.empty')}</p>
        </div>
      ) : (
        <div className="archive-grid">
          {items.map((it, i) => (
            <button key={`${it.id}-${i}`} className="archive-cell" onClick={() => setOpenId(it.id)}>
              <PhotoThumb photoId={it.id} />
              <span className="archive-label">
                {it.kind} {it.label}
              </span>
              <span className="muted archive-date">{it.date}</span>
            </button>
          ))}
        </div>
      )}
      {openId && <OpenLightbox id={openId} onClose={() => setOpenId(null)} />}
    </section>
  )
}

function OpenLightbox({ id, onClose }: { id: string; onClose: () => void }) {
  const src = usePhoto(id)
  if (!src) return null
  return <Lightbox src={src} onClose={onClose} />
}

export default ArchiveView
