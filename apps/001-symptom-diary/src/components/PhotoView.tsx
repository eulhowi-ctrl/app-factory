import { useEffect, useState } from 'react'
import { getPhoto } from '../photos'

/** 사진 id → dataURL 로드 (IndexedDB) */
export function usePhoto(id?: string): string | null {
  const [src, setSrc] = useState<string | null>(null)
  useEffect(() => {
    let on = true
    setSrc(null)
    if (!id) return
    getPhoto(id).then((u) => {
      if (on && u) setSrc(u)
    })
    return () => {
      on = false
    }
  }, [id])
  return src
}

export function PhotoThumb({ photoId, className, onClick }: { photoId: string; className?: string; onClick?: () => void }) {
  const src = usePhoto(photoId)
  if (!src) return null
  return <img src={src} alt="" className={className ?? 'entry-photo'} onClick={onClick} />
}

export function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div className="lightbox" onClick={onClose}>
      <img src={src} alt="" onClick={(e) => e.stopPropagation()} />
      <button className="lightbox-close" onClick={onClose}>
        ✕
      </button>
    </div>
  )
}
