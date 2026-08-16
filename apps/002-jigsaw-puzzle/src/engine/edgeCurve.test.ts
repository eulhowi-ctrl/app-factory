import { describe, expect, it } from 'vitest'
import { buildEdgeCurve } from './edgeCurve'

describe('buildEdgeCurve', () => {
  it('sign 0이면 직선(양 끝점만)을 반환한다', () => {
    const pts = buildEdgeCurve({ x: 0, y: 0 }, { x: 100, y: 0 }, 0)
    expect(pts).toEqual([
      { x: 0, y: 0 },
      { x: 100, y: 0 },
    ])
  })

  it('시작점과 끝점은 항상 곡선에 포함된다', () => {
    const start = { x: 10, y: 20 }
    const end = { x: 10, y: 120 }
    const pts = buildEdgeCurve(start, end, 1)
    expect(pts[0]).toEqual(start)
    expect(pts[pts.length - 1]).toEqual(end)
  })

  it('sign +1과 -1은 서로 반대 방향으로 볼록하다', () => {
    const start = { x: 0, y: 0 }
    const end = { x: 100, y: 0 }
    const plus = buildEdgeCurve(start, end, 1)
    const minus = buildEdgeCurve(start, end, -1)

    const midPlus = plus[Math.floor(plus.length / 2)]
    const midMinus = minus[Math.floor(minus.length / 2)]
    expect(Math.sign(midPlus.y)).not.toBe(Math.sign(midMinus.y))
    expect(Math.abs(midPlus.y)).toBeGreaterThan(1)
  })

  it('역방향으로 호출하면 끝점이 뒤바뀐 곡선을 반환한다 (조각 맞물림에 사용)', () => {
    const a = { x: 5, y: 5 }
    const b = { x: 5, y: 105 }
    const forward = buildEdgeCurve(a, b, 1)
    const backward = buildEdgeCurve(b, a, 1)

    expect(backward[0]).toEqual(b)
    expect(backward[backward.length - 1]).toEqual(a)
    const reversedForward = [...forward].reverse()
    expect(reversedForward[0]).toEqual(forward[forward.length - 1])
    expect(reversedForward[reversedForward.length - 1]).toEqual(forward[0])
  })
})
