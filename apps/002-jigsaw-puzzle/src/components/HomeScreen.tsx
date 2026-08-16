import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DIFFICULTIES, PUZZLE_IMAGES, type Difficulty, type PuzzleImage } from '../engine/config'

interface Props {
  onStart: (image: PuzzleImage, difficulty: Difficulty) => void
}

export function HomeScreen({ onStart }: Props) {
  const { t } = useTranslation()
  const [image, setImage] = useState<PuzzleImage>(PUZZLE_IMAGES[0])
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTIES[0])

  return (
    <main className="container">
      <h1>{t('app.title')}</h1>

      <h2>{t('home.chooseImage')}</h2>
      <div className="image-grid">
        {PUZZLE_IMAGES.map((img) => (
          <button
            key={img.id}
            className={`image-card ${img.id === image.id ? 'selected' : ''}`}
            onClick={() => setImage(img)}
          >
            <img src={img.src} alt={t(img.nameKey)} />
            <span>{t(img.nameKey)}</span>
          </button>
        ))}
      </div>

      <h2>{t('home.chooseDifficulty')}</h2>
      <div className="chip-row">
        {DIFFICULTIES.map((d) => (
          <button
            key={d.id}
            className={`chip ${d.id === difficulty.id ? 'selected' : ''}`}
            onClick={() => setDifficulty(d)}
          >
            {t(d.labelKey, { count: d.pieceCount })}
          </button>
        ))}
      </div>

      <button className="primary-btn start-btn" onClick={() => onStart(image, difficulty)}>
        {t('home.start')}
      </button>
    </main>
  )
}
