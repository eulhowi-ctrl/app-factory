import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { PuzzleImage, Difficulty } from '../engine/config'
import { generatePuzzleLayout } from '../engine/puzzleGenerator'
import { usePuzzleController } from '../engine/usePuzzleController'
import { PieceSvg } from './PieceSvg'

interface Props {
  image: PuzzleImage
  difficulty: Difficulty
  onExit: () => void
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const MIN_SCALE = 0.2
const MAX_SCALE = 3

export function PuzzleScreen({ image, difficulty, onExit }: Props) {
  const { t } = useTranslation()
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null)

  useEffect(() => {
    const img = new Image()
    img.onload = () => setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })
    img.src = image.src
  }, [image.src])

  const layout = naturalSize
    ? generatePuzzleLayout({
        targetPieceCount: difficulty.pieceCount,
        imageWidth: naturalSize.w,
        imageHeight: naturalSize.h,
      })
    : null

  if (!layout) {
    return (
      <div className="loading-screen">
        <p>{t('puzzle.loading')}</p>
      </div>
    )
  }

  return <PuzzleBoard image={image} layout={layout} onExit={onExit} />
}

function PuzzleBoard({
  image,
  layout,
  onExit,
}: {
  image: PuzzleImage
  layout: ReturnType<typeof generatePuzzleLayout>
  onExit: () => void
}) {
  const { t } = useTranslation()
  const controller = usePuzzleController(layout)
  const [showComplete, setShowComplete] = useState(false)

  useEffect(() => {
    if (controller.isComplete) setShowComplete(true)
  }, [controller.isComplete])

  // --- 뷰포트(팬/줌) 상태 ---
  const [view, setView] = useState({ scale: 0.6, x: 40, y: 20 })
  const viewportRef = useRef<HTMLDivElement>(null)
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map())
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null)
  const panStart = useRef<{ x: number; y: number; viewX: number; viewY: number } | null>(null)
  const draggingPieceId = useRef<string | null>(null)

  const onBackgroundPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 1) {
      panStart.current = { x: e.clientX, y: e.clientY, viewX: view.x, viewY: view.y }
    } else if (pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values())
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      pinchStart.current = { dist, scale: view.scale }
      panStart.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view])

  const onBackgroundPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointers.current.size === 2 && pinchStart.current) {
      const pts = Array.from(pointers.current.values())
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      const nextScale = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, pinchStart.current.scale * (dist / pinchStart.current.dist)),
      )
      setView((v) => ({ ...v, scale: nextScale }))
    } else if (pointers.current.size === 1 && panStart.current) {
      const dx = e.clientX - panStart.current.x
      const dy = e.clientY - panStart.current.y
      setView((v) => ({ ...v, x: panStart.current!.viewX + dx, y: panStart.current!.viewY + dy }))
    }
  }, [])

  const onBackgroundPointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size === 0) {
      panStart.current = null
      pinchStart.current = null
    } else if (pointers.current.size === 1) {
      const [[, p]] = Array.from(pointers.current.entries())
      panStart.current = { x: p.x, y: p.y, viewX: view.x, viewY: view.y }
      pinchStart.current = null
    }
  }, [view])

  const onWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1
    setView((v) => ({ ...v, scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.scale * factor)) }))
  }, [])

  // --- 조각 드래그 ---
  const handlePiecePointerDown = useCallback(
    (id: string) => (e: ReactPointerEvent<HTMLDivElement>) => {
      e.stopPropagation()
      const piece = controller.pieces.find((p) => p.id === id)
      if (!piece || piece.placed) return
      ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
      draggingPieceId.current = id
      controller.bringToFront(id)
    },
    [controller],
  )

  const handlePiecePointerMove = useCallback(
    (id: string) => (e: ReactPointerEvent<HTMLDivElement>) => {
      if (draggingPieceId.current !== id) return
      controller.movePiece(id, e.movementX / view.scale, e.movementY / view.scale)
    },
    [controller, view.scale],
  )

  const handlePiecePointerUp = useCallback(
    (id: string) => (e: ReactPointerEvent<HTMLDivElement>) => {
      if (draggingPieceId.current !== id) return
      draggingPieceId.current = null
      ;(e.currentTarget as Element).releasePointerCapture?.(e.pointerId)
      controller.endDrag(id)
    },
    [controller],
  )

  return (
    <div className="puzzle-screen">
      <div className="puzzle-topbar">
        <button className="ghost-btn" onClick={onExit}>
          ← {t('puzzle.back')}
        </button>
        <div className="puzzle-status">
          {controller.placedCount}/{controller.total} · {formatDuration(controller.elapsedMs)}
        </div>
      </div>

      <div
        ref={viewportRef}
        className="puzzle-viewport"
        onPointerDown={onBackgroundPointerDown}
        onPointerMove={onBackgroundPointerMove}
        onPointerUp={onBackgroundPointerUp}
        onPointerCancel={onBackgroundPointerUp}
        onWheel={onWheel}
      >
        <div
          className="puzzle-world"
          style={{
            width: controller.worldSize.width,
            height: controller.worldSize.height,
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
            transformOrigin: '0 0',
          }}
        >
          <div
            className="puzzle-board-outline"
            style={{ width: layout.imageWidth, height: layout.imageHeight }}
          />
          {controller.pieces.map((piece) => (
            <PieceSvg
              key={piece.id}
              piece={piece}
              imageSrc={image.src}
              imageWidth={layout.imageWidth}
              imageHeight={layout.imageHeight}
              canvasWidth={layout.pieceCanvasWidth}
              canvasHeight={layout.pieceCanvasHeight}
              dragging={draggingPieceId.current === piece.id}
              onPointerDown={handlePiecePointerDown(piece.id)}
              onPointerMove={handlePiecePointerMove(piece.id)}
              onPointerUp={handlePiecePointerUp(piece.id)}
            />
          ))}
        </div>
      </div>

      {showComplete && (
        <div className="complete-overlay">
          <div className="complete-card">
            <h2>🎉 {t('puzzle.completeTitle')}</h2>
            <p>{t('puzzle.completeBody', { pieces: layout.pieces.length, time: formatDuration(controller.elapsedMs) })}</p>
            <button className="primary-btn" onClick={onExit}>
              {t('puzzle.confirm')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
