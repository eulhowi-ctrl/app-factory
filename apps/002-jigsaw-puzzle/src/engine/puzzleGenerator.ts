import { buildEdgeCurve, type Point } from './edgeCurve'

export interface PieceLayout {
  row: number
  col: number
  /** 조각의 로컬 좌표계(패딩 포함) 기준 폐다각형 경계 점 목록. */
  points: Point[]
  /** 원본 이미지 기준, 이 조각의 패딩 포함 렌더 영역 좌상단 좌표. */
  imageOffset: Point
  /** 보드 위에서 이 조각이 놓여야 할 정답 위치(좌상단, 패딩 포함). */
  targetTopLeft: Point
}

export interface PuzzleLayout {
  rows: number
  cols: number
  cellWidth: number
  cellHeight: number
  padding: number
  imageWidth: number
  imageHeight: number
  pieceCanvasWidth: number
  pieceCanvasHeight: number
  pieces: PieceLayout[]
}

/** 목표 조각 개수에 가장 가까운 (rows, cols)를 이미지 가로세로비에 맞춰 계산. */
export function resolveGrid(targetPieceCount: number, aspectRatio: number): [number, number] {
  const rows = Math.max(1, Math.round(Math.sqrt(targetPieceCount / aspectRatio)))
  const cols = Math.max(1, Math.round(targetPieceCount / rows))
  return [rows, cols]
}

/** 결정적 의사난수 생성기 (seed 고정 시 항상 같은 레이아웃을 재현하기 위함). */
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

export function generatePuzzleLayout(opts: {
  targetPieceCount: number
  imageWidth: number
  imageHeight: number
  seed?: number
}): PuzzleLayout {
  const { targetPieceCount, imageWidth, imageHeight } = opts
  const seed = opts.seed ?? Math.floor(Math.random() * 1e9)
  const rand = mulberry32(seed)

  const [rows, cols] = resolveGrid(targetPieceCount, imageWidth / imageHeight)
  const cellWidth = imageWidth / cols
  const cellHeight = imageHeight / rows
  const padding = Math.min(cellWidth, cellHeight) * 0.28

  // vSign[r][c]: row r, col c와 c+1 사이의 세로 경계 부호.
  // hSign[r][c]: row r과 r+1 사이, col c의 가로 경계 부호.
  const vSign: (-1 | 1)[][] = Array.from({ length: rows }, () =>
    Array.from({ length: Math.max(0, cols - 1) }, () => (rand() < 0.5 ? 1 : -1)),
  )
  const hSign: (-1 | 1)[][] = Array.from({ length: Math.max(0, rows - 1) }, () =>
    Array.from({ length: cols }, () => (rand() < 0.5 ? 1 : -1)),
  )

  // 각 경계선의 절대좌표 곡선을 한 번만 계산해 두 조각이 동일한 점을 공유하게 한다.
  const vCurves: Point[][][] = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: Math.max(0, cols - 1) }, (_, c) => {
      const x = (c + 1) * cellWidth
      return buildEdgeCurve({ x, y: r * cellHeight }, { x, y: (r + 1) * cellHeight }, vSign[r][c])
    }),
  )
  const hCurves: Point[][][] = Array.from({ length: Math.max(0, rows - 1) }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const y = (r + 1) * cellHeight
      return buildEdgeCurve({ x: c * cellWidth, y }, { x: (c + 1) * cellWidth, y }, hSign[r][c])
    }),
  )

  const flatEdge = (a: Point, b: Point) => buildEdgeCurve(a, b, 0)

  const pieces: PieceLayout[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const topLeft: Point = { x: c * cellWidth, y: r * cellHeight }

      // 시계방향: 상단(L→R) → 우측(T→B) → 하단(R→L) → 좌측(B→T)
      const topEdge =
        r === 0 ? flatEdge(topLeft, { x: topLeft.x + cellWidth, y: topLeft.y }) : hCurves[r - 1][c]
      const rightEdge =
        c === cols - 1
          ? flatEdge(
              { x: topLeft.x + cellWidth, y: topLeft.y },
              { x: topLeft.x + cellWidth, y: topLeft.y + cellHeight },
            )
          : vCurves[r][c]
      const bottomEdge =
        r === rows - 1
          ? flatEdge(
              { x: topLeft.x + cellWidth, y: topLeft.y + cellHeight },
              { x: topLeft.x, y: topLeft.y + cellHeight },
            )
          : [...hCurves[r][c]].reverse()
      const leftEdge =
        c === 0
          ? flatEdge({ x: topLeft.x, y: topLeft.y + cellHeight }, topLeft)
          : [...vCurves[r][c - 1]].reverse()

      const imageOffset: Point = { x: topLeft.x - padding, y: topLeft.y - padding }
      const toLocal = (p: Point): Point => ({ x: p.x - imageOffset.x, y: p.y - imageOffset.y })

      const boundary: Point[] = [toLocal(topEdge[0])]
      for (const edge of [topEdge, rightEdge, bottomEdge, leftEdge]) {
        for (const p of edge.slice(1)) {
          boundary.push(toLocal(p))
        }
      }

      pieces.push({
        row: r,
        col: c,
        points: boundary,
        imageOffset,
        targetTopLeft: imageOffset,
      })
    }
  }

  return {
    rows,
    cols,
    cellWidth,
    cellHeight,
    padding,
    imageWidth,
    imageHeight,
    pieceCanvasWidth: cellWidth + padding * 2,
    pieceCanvasHeight: cellHeight + padding * 2,
    pieces,
  }
}

export function pointsToSvgPath(points: Point[]): string {
  if (points.length === 0) return ''
  const [first, ...rest] = points
  return `M ${first.x} ${first.y} ` + rest.map((p) => `L ${p.x} ${p.y}`).join(' ') + ' Z'
}
