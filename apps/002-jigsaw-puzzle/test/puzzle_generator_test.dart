import 'package:flutter_test/flutter_test.dart';
import 'package:jigsaw_puzzle/src/engine/puzzle_generator.dart';

void main() {
  test('resolveGrid는 목표 피스 수에 근접하고 이미지 비율을 반영한다', () {
    final (rows, cols) = resolveGrid(54, 4 / 3);
    expect(rows * cols, closeTo(54, 12));
    expect(cols / rows, closeTo(4 / 3, 0.6));
  });

  for (final target in [20, 54, 96, 150]) {
    test('난이도 $target피스: 실제 생성된 조각 수가 목표와 크게 다르지 않다', () {
      final layout = generatePuzzleLayout(
        targetPieceCount: target,
        imageWidth: 1024,
        imageHeight: 768,
        seed: 42,
      );
      expect(layout.pieceCount, layout.rows * layout.cols);
      expect(layout.pieceCount, closeTo(target, target * 0.3 + 4));
    });
  }

  test('같은 seed면 항상 같은 레이아웃(조각 개수·격자)을 생성한다', () {
    final a = generatePuzzleLayout(
        targetPieceCount: 54, imageWidth: 1024, imageHeight: 768, seed: 7);
    final b = generatePuzzleLayout(
        targetPieceCount: 54, imageWidth: 1024, imageHeight: 768, seed: 7);
    expect(a.rows, b.rows);
    expect(a.cols, b.cols);
    for (var i = 0; i < a.pieces.length; i++) {
      expect(a.pieces[i].targetTopLeft, b.pieces[i].targetTopLeft);
    }
  });

  test('모든 조각의 targetTopLeft는 격자 위치와 패딩으로부터 정확히 계산된다', () {
    final layout = generatePuzzleLayout(
        targetPieceCount: 20, imageWidth: 800, imageHeight: 600, seed: 1);
    for (final piece in layout.pieces) {
      expect(piece.targetTopLeft.dx, closeTo(piece.col * layout.cellWidth - layout.padding, 0.01));
      expect(piece.targetTopLeft.dy, closeTo(piece.row * layout.cellHeight - layout.padding, 0.01));
    }
  });

  test('각 조각의 로컬 Path는 비어있지 않은 영역을 가진다', () {
    final layout = generatePuzzleLayout(
        targetPieceCount: 20, imageWidth: 800, imageHeight: 600, seed: 1);
    for (final piece in layout.pieces) {
      final bounds = piece.localPath.getBounds();
      expect(bounds.width, greaterThan(0));
      expect(bounds.height, greaterThan(0));
    }
  });
}
