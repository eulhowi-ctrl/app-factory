import 'dart:math';
import 'dart:ui';

/// 직소 조각의 한 변(edge)을 [start]→[end] 방향으로 나타내는 점 목록을 생성한다.
///
/// [sign]: 0이면 평평한 직선(외곽 테두리), +1이면 [end] 방향에서 봤을 때
/// 오른쪽으로 볼록한 탭(돌기), -1이면 안쪽으로 들어간 홈(소켓).
/// 인접한 두 조각이 같은 물리적 경계선을 공유할 때, 이 함수가 반환하는
/// 절대좌표 점 목록을 그대로(또는 역순으로) 사용하면 두 조각의 모양이
/// 정확히 맞물린다 — 부호 계산을 조각마다 따로 하지 않아도 되므로 안전하다.
List<Offset> buildEdgeCurve(
  Offset start,
  Offset end, {
  required int sign,
  int samples = 28,
}) {
  if (sign == 0) return [start, end];

  final d = end - start;
  final length = d.distance;
  // 진행방향에 수직인 단위벡터 (항상 절대좌표 기준으로 동일하게 계산되므로
  // start/end를 뒤집어 호출해도 같은 물리적 곡선이 나온다).
  final n = Offset(-d.dy, d.dx) / length;

  final bumpDepth = length * 0.20 * sign;

  // (t, 수직오프셋 배수) 제어점. 0.35~0.65 구간에 잘록한 목 + 둥근 머리 모양을 만든다.
  // -0.30: 목이 살짝 안쪽으로 파임 / 1.15: 머리가 목보다 넓게 부풀어오름.
  const keyT = [0.0, 0.34, 0.40, 0.44, 0.50, 0.56, 0.60, 0.66, 1.0];
  const keyF = [0.0, 0.0, -0.30, 0.95, 1.15, 0.95, -0.30, 0.0, 0.0];

  double interp(double t) {
    for (var i = 0; i < keyT.length - 1; i++) {
      final t0 = keyT[i], t1 = keyT[i + 1];
      if (t >= t0 && t <= t1) {
        final mu = t1 == t0 ? 0.0 : (t - t0) / (t1 - t0);
        final smooth = (1 - cos(mu * pi)) / 2; // cosine smoothstep
        return keyF[i] + (keyF[i + 1] - keyF[i]) * smooth;
      }
    }
    return 0.0;
  }

  final points = <Offset>[];
  for (var i = 0; i <= samples; i++) {
    final t = i / samples;
    final along = start + d * t;
    final offsetAmount = interp(t) * bumpDepth;
    points.add(along + n * offsetAmount);
  }
  return points;
}
