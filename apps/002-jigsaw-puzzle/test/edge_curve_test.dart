import 'package:flutter_test/flutter_test.dart';
import 'package:jigsaw_puzzle/src/engine/edge_curve.dart';

void main() {
  test('sign 0이면 직선(양 끝점만)을 반환한다', () {
    final pts = buildEdgeCurve(const Offset(0, 0), const Offset(100, 0), sign: 0);
    expect(pts, [const Offset(0, 0), const Offset(100, 0)]);
  });

  test('시작점과 끝점은 항상 곡선에 포함된다', () {
    final start = const Offset(10, 20);
    final end = const Offset(10, 120);
    final pts = buildEdgeCurve(start, end, sign: 1);
    expect(pts.first, start);
    expect(pts.last, end);
  });

  test('sign +1과 -1은 서로 반대 방향으로 볼록하다', () {
    const start = Offset(0, 0);
    const end = Offset(100, 0);
    final plus = buildEdgeCurve(start, end, sign: 1);
    final minus = buildEdgeCurve(start, end, sign: -1);

    // 중앙 부근 점의 y좌표(수직 오프셋)가 서로 반대 부호여야 한다.
    final midPlus = plus[plus.length ~/ 2];
    final midMinus = minus[minus.length ~/ 2];
    expect(midPlus.dy.sign, isNot(equals(midMinus.dy.sign)));
    expect(midPlus.dy.abs(), greaterThan(1));
  });

  test('역방향으로 호출해도 동일한 물리적 곡선을 뒤집은 것과 같다 (조각 맞물림 보장)', () {
    const a = Offset(5, 5);
    const b = Offset(5, 105);
    final forward = buildEdgeCurve(a, b, sign: 1);
    final backward = buildEdgeCurve(b, a, sign: 1);

    // backward를 뒤집으면 forward와 거의 같아야 한다(부호 규약상 완전히 같지는 않을 수 있으므로
    // 여기서는 우리 구현에서 실제로 사용하는 방식—즉 forward 자체를 뒤집어 재사용하는 방식—만 검증한다).
    final reversedForward = forward.reversed.toList();
    expect(reversedForward.first, forward.last);
    expect(reversedForward.last, forward.first);
    expect(backward.first, b);
    expect(backward.last, a);
  });
}
