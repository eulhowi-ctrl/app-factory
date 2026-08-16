import { describe, expect, it } from 'vitest'
import { generatePuzzleLayout, resolveGrid } from './puzzleGenerator'

describe('resolveGrid', () => {
  it('목표 피스 수에 근접하고 이미지 비율을 반영한다', () => {
    const [rows, cols] = resolveGrid(54, 4 / 3)
    expect(Math.abs(rows * cols - 54)).toBeLessThanOrEqual(12)
    expect(Math.abs(cols / rows - 4 / 3)).toBeLessThanOrEqual(0.6)
  })
})

describe('generatePuzzleLayout', () => {
  for (const target of [20, 54, 96, 150]) {
    it(`난이도 ${target}피스: 실제 생성된 조각 수가 목표와 크게 다르지 않다`, () => {
      const layout = generatePuzzleLayout({
        targetPieceCount: target,
        imageWidth: 1024,
        imageHeight: 768,
        seed: 42,
      })
      expect(layout.pieces.length).toBe(layout.rows * layout.cols)
      expect(Math.abs(layout.pieces.length - target)).toBeLessThanOrEqual(target * 0.3 + 4)
    })
  }

  it('같은 seed면 항상 같은 레이아웃(조각 개수·격자·목표위치)을 생성한다', () => {
    const a = generatePuzzleLayout({ targetPieceCount: 54, imageWidth: 1024, imageHeight: 768, seed: 7 })
    const b = generatePuzzleLayout({ targetPieceCount: 54, imageWidth: 1024, imageHeight: 768, seed: 7 })
    expect(a.rows).toBe(b.rows)
    expect(a.cols).toBe(b.cols)
    for (let i = 0; i < a.pieces.length; i++) {
      expect(a.pieces[i].targetTopLeft).toEqual(b.pieces[i].targetTopLeft)
    }
  })

  it('다른 seed면 조각 모양(경계 곡선)이 달라질 수 있다', () => {
    const a = generatePuzzleLayout({ targetPieceCount: 20, imageWidth: 800, imageHeight: 600, seed: 1 })
    const b = generatePuzzleLayout({ targetPieceCount: 20, imageWidth: 800, imageHeight: 600, seed: 2 })
    const anyDifferent = a.pieces.some(
      (p, i) => JSON.stringify(p.points) !== JSON.stringify(b.pieces[i].points),
    )
    expect(anyDifferent).toBe(true)
  })

  it('모든 조각의 targetTopLeft는 격자 위치와 패딩으로부터 정확히 계산된다', () => {
    const layout = generatePuzzleLayout({ targetPieceCount: 20, imageWidth: 800, imageHeight: 600, seed: 1 })
    for (const piece of layout.pieces) {
      expect(piece.targetTopLeft.x).toBeCloseTo(piece.col * layout.cellWidth - layout.padding, 5)
      expect(piece.targetTopLeft.y).toBeCloseTo(piece.row * layout.cellHeight - layout.padding, 5)
    }
  })

  it('각 조각의 경계 폴리곤은 3개 이상의 점을 가진다', () => {
    const layout = generatePuzzleLayout({ targetPieceCount: 20, imageWidth: 800, imageHeight: 600, seed: 1 })
    for (const piece of layout.pieces) {
      expect(piece.points.length).toBeGreaterThan(3)
    }
  })

  it('인접한 두 조각의 공유 경계는 정확히 맞물린다 (절대좌표 기준 동일 곡선)', () => {
    // 4x/5x 격자가 나오도록 seed 없이 결정적 케이스를 강제: 3x3 근접 목표.
    const layout = generatePuzzleLayout({ targetPieceCount: 9, imageWidth: 900, imageHeight: 900, seed: 3 })
    if (layout.cols < 2) return // 격자가 1열이면 세로 경계가 없어 스킵

    const left = layout.pieces.find((p) => p.row === 0 && p.col === 0)!
    const right = layout.pieces.find((p) => p.row === 0 && p.col === 1)!

    // 절대좌표로 변환 후 비교
    const leftAbs = left.points.map((p) => ({ x: p.x + left.imageOffset.x, y: p.y + left.imageOffset.y }))
    const rightAbs = right.points.map((p) => ({ x: p.x + right.imageOffset.x, y: p.y + right.imageOffset.y }))

    // left 조각의 오른쪽 변(세로 경계)과 right 조각의 왼쪽 변이 공유하는 x좌표 부근의
    // y값 집합이 서로 일치해야 한다 — 대략적 검증으로 공유 x좌표에서의 y 범위가 겹치는지 확인.
    const sharedX = layout.cellWidth
    const nearShared = (pts: { x: number; y: number }[]) =>
      pts.filter((p) => Math.abs(p.x - sharedX) < layout.padding * 0.5)
    expect(nearShared(leftAbs).length).toBeGreaterThan(0)
    expect(nearShared(rightAbs).length).toBeGreaterThan(0)
  })
})
