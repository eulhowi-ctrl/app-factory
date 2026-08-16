import type { PointerEvent as ReactPointerEvent } from 'react'
import type { PieceState } from '../engine/usePuzzleController'
import { pointsToSvgPath } from '../engine/puzzleGenerator'

interface Props {
  piece: PieceState
  imageSrc: string
  imageWidth: number
  imageHeight: number
  canvasWidth: number
  canvasHeight: number
  dragging: boolean
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void
  onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => void
  onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => void
}

/** SVG clipPath + 이미지를 음수 오프셋으로 배치해 조각 모양대로 잘라 보여준다
 * (실제 픽셀을 자르지 않고 렌더 레벨에서 클리핑 — Flutter판 ClipPath 트릭과 동일). */
export function PieceSvg({
  piece,
  imageSrc,
  imageWidth,
  imageHeight,
  canvasWidth,
  canvasHeight,
  dragging,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: Props) {
  const clipId = `clip-${piece.id}`
  const d = pointsToSvgPath(piece.layout.points)

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: 'absolute',
        left: piece.position.x,
        top: piece.position.y,
        width: canvasWidth,
        height: canvasHeight,
        zIndex: piece.zIndex,
        touchAction: 'none',
        cursor: piece.placed ? 'default' : 'grab',
        filter: dragging ? 'drop-shadow(2px 4px 10px rgba(0,0,0,0.45))' : undefined,
      }}
    >
      <svg width={canvasWidth} height={canvasHeight} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <clipPath id={clipId}>
            <path d={d} />
          </clipPath>
        </defs>
        <image
          href={imageSrc}
          x={-piece.layout.imageOffset.x}
          y={-piece.layout.imageOffset.y}
          width={imageWidth}
          height={imageHeight}
          clipPath={`url(#${clipId})`}
          style={{ pointerEvents: 'none' }}
          preserveAspectRatio="none"
        />
      </svg>
    </div>
  )
}
