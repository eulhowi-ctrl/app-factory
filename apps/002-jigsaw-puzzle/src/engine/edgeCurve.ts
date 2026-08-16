export interface Point {
  x: number
  y: number
}

/**
 * 직소 조각의 한 변(edge)을 start→end 방향으로 나타내는 점 목록을 생성한다.
 *
 * sign: 0이면 평평한 직선(외곽 테두리), +1이면 볼록한 탭(돌기), -1이면 안쪽으로
 * 들어간 홈(소켓). 인접한 두 조각이 같은 물리적 경계선을 공유할 때, 이 함수가
 * 반환하는 절대좌표 점 목록을 그대로(또는 역순으로) 사용하면 두 조각의 모양이
 * 정확히 맞물린다 — 부호 계산을 조각마다 따로 하지 않아도 되므로 안전하다.
 * (Flutter판 lib/src/engine/edge_curve.dart 와 동일 알고리즘)
 */
export function buildEdgeCurve(
  start: Point,
  end: Point,
  sign: -1 | 0 | 1,
  samples = 28,
): Point[] {
  if (sign === 0) return [start, end]

  const dx = end.x - start.x
  const dy = end.y - start.y
  const length = Math.hypot(dx, dy)
  // 진행방향에 수직인 단위벡터 (절대좌표 기준으로 고정 — start/end를 뒤집어
  // 호출해도 같은 물리적 곡선이 나온다).
  const nx = -dy / length
  const ny = dx / length

  const bumpDepth = length * 0.2 * sign

  // (t, 수직오프셋 배수) 제어점. 0.35~0.65 구간에 잘록한 목 + 둥근 머리 모양.
  const keyT = [0.0, 0.34, 0.4, 0.44, 0.5, 0.56, 0.6, 0.66, 1.0]
  const keyF = [0.0, 0.0, -0.3, 0.95, 1.15, 0.95, -0.3, 0.0, 0.0]

  function interp(t: number): number {
    for (let i = 0; i < keyT.length - 1; i++) {
      const t0 = keyT[i]
      const t1 = keyT[i + 1]
      if (t >= t0 && t <= t1) {
        const mu = t1 === t0 ? 0 : (t - t0) / (t1 - t0)
        const smooth = (1 - Math.cos(mu * Math.PI)) / 2 // cosine smoothstep
        return keyF[i] + (keyF[i + 1] - keyF[i]) * smooth
      }
    }
    return 0
  }

  const points: Point[] = []
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const alongX = start.x + dx * t
    const alongY = start.y + dy * t
    const off = interp(t) * bumpDepth
    points.push({ x: alongX + nx * off, y: alongY + ny * off })
  }
  return points
}
