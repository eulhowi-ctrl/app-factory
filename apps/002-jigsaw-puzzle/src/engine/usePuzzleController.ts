import { useMemo, useRef, useState, useCallback, useEffect } from 'react'
import type { PuzzleLayout, PieceLayout } from './puzzleGenerator'
import type { Point } from './edgeCurve'

export interface PieceState {
  id: string
  layout: PieceLayout
  position: Point
  placed: boolean
  zIndex: number
}

function mulberry32(seed: number): () => number {
  let s = seed
  return function () {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function scatter(layout: PuzzleLayout, seed?: number) {
  const rand = mulberry32(seed ?? Math.floor(Math.random() * 1e9))
  const cw = layout.pieceCanvasWidth
  const ch = layout.pieceCanvasHeight
  const boardWidth = layout.imageWidth
  const boardHeight = layout.imageHeight

  const trayCols = Math.max(1, Math.floor(boardWidth / (cw * 1.15)))
  const trayTop = boardHeight + 40
  const trayRows = Math.ceil(layout.pieces.length / trayCols)
  const trayHeight = trayRows * (ch * 1.15) + 40

  const worldSize = {
    width: Math.max(boardWidth, trayCols * cw * 1.15),
    height: trayTop + trayHeight,
  }

  const order = layout.pieces.map((_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }

  const pieces: PieceState[] = layout.pieces.map((pieceLayout, i) => {
    const slot = order[i]
    const gridR = Math.floor(slot / trayCols)
    const gridC = slot % trayCols
    const jitterX = (rand() - 0.5) * (cw * 0.15)
    const jitterY = (rand() - 0.5) * (ch * 0.15)
    return {
      id: `${pieceLayout.row}_${pieceLayout.col}`,
      layout: pieceLayout,
      position: {
        x: gridC * cw * 1.15 + jitterX,
        y: trayTop + gridR * ch * 1.15 + jitterY,
      },
      placed: false,
      zIndex: i,
    }
  })

  return { pieces, worldSize }
}

const SNAP_THRESHOLD = 28

export function usePuzzleController(layout: PuzzleLayout, seed?: number) {
  const initial = useMemo(() => scatter(layout, seed), [layout, seed])
  const piecesRef = useRef<PieceState[]>(initial.pieces)
  const zCounterRef = useRef(initial.pieces.length)
  const [, setVersion] = useState(0)
  const rerender = useCallback(() => setVersion((v) => v + 1), [])

  const startTimeRef = useRef<number | null>(null)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    startTimeRef.current = performance.now()
    const id = window.setInterval(() => {
      if (startTimeRef.current !== null && !isComplete) {
        setElapsedMs(performance.now() - startTimeRef.current)
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [isComplete])

  const movePiece = useCallback(
    (id: string, dx: number, dy: number) => {
      const piece = piecesRef.current.find((p) => p.id === id)
      if (!piece || piece.placed) return
      piece.position = { x: piece.position.x + dx, y: piece.position.y + dy }
      rerender()
    },
    [rerender],
  )

  const bringToFront = useCallback(
    (id: string) => {
      const piece = piecesRef.current.find((p) => p.id === id)
      if (!piece) return
      zCounterRef.current += 1
      piece.zIndex = zCounterRef.current
      rerender()
    },
    [rerender],
  )

  const endDrag = useCallback(
    (id: string) => {
      const piece = piecesRef.current.find((p) => p.id === id)
      if (!piece || piece.placed) return
      const target = piece.layout.targetTopLeft
      const dist = Math.hypot(piece.position.x - target.x, piece.position.y - target.y)
      if (dist <= SNAP_THRESHOLD) {
        piece.position = target
        piece.placed = true
        if (piecesRef.current.every((p) => p.placed)) {
          setIsComplete(true)
          if (startTimeRef.current !== null) {
            setElapsedMs(performance.now() - startTimeRef.current)
          }
        }
      }
      rerender()
    },
    [rerender],
  )

  const placedCount = piecesRef.current.filter((p) => p.placed).length

  return {
    pieces: piecesRef.current,
    worldSize: initial.worldSize,
    placedCount,
    total: piecesRef.current.length,
    elapsedMs,
    isComplete,
    movePiece,
    bringToFront,
    endDrag,
  }
}
