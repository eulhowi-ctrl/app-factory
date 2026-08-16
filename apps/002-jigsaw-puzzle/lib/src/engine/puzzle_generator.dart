import 'dart:math';
import 'dart:ui';

import 'edge_curve.dart';

/// 한 조각의 정적 레이아웃 정보 (이미지/난이도가 정해지면 변하지 않음).
class PieceLayout {
  final int row;
  final int col;

  /// 조각의 로컬 좌표계(패딩 포함, (0,0)이 패딩된 캔버스의 좌상단) 기준 Path.
  final Path localPath;

  /// 원본 이미지 기준, 이 조각의 패딩 포함 렌더 영역 좌상단 좌표.
  /// 조각 위젯을 그릴 때 이 값만큼 이미지를 반대로 이동시키면 올바른 부분이 노출된다.
  final Offset imageOffset;

  /// 보드 위에서 이 조각이 놓여야 할 정답 위치(좌상단, 패딩 포함).
  final Offset targetTopLeft;

  const PieceLayout({
    required this.row,
    required this.col,
    required this.localPath,
    required this.imageOffset,
    required this.targetTopLeft,
  });
}

class PuzzleLayout {
  final int rows;
  final int cols;
  final double cellWidth;
  final double cellHeight;
  final double padding;
  final double imageWidth;
  final double imageHeight;
  final List<PieceLayout> pieces;

  const PuzzleLayout({
    required this.rows,
    required this.cols,
    required this.cellWidth,
    required this.cellHeight,
    required this.padding,
    required this.imageWidth,
    required this.imageHeight,
    required this.pieces,
  });

  double get pieceCanvasWidth => cellWidth + padding * 2;
  double get pieceCanvasHeight => cellHeight + padding * 2;

  int get pieceCount => pieces.length;
}

/// 목표 조각 개수에 가장 가까운 (rows, cols)를 이미지 가로세로비에 맞춰 계산.
(int, int) resolveGrid(int targetPieceCount, double aspectRatio) {
  // cols/rows ≈ aspectRatio, rows*cols ≈ targetPieceCount
  final rows = sqrt(targetPieceCount / aspectRatio).round().clamp(1, 1000);
  final cols = (targetPieceCount / rows).round().clamp(1, 1000);
  return (rows, cols);
}

/// [seed]가 같으면 항상 같은 레이아웃을 생성한다 (테스트/재현성을 위해).
PuzzleLayout generatePuzzleLayout({
  required int targetPieceCount,
  required double imageWidth,
  required double imageHeight,
  int? seed,
}) {
  final (rows, cols) = resolveGrid(targetPieceCount, imageWidth / imageHeight);
  final rng = Random(seed);

  final cellWidth = imageWidth / cols;
  final cellHeight = imageHeight / rows;
  final padding = min(cellWidth, cellHeight) * 0.28;

  // 내부 경계선 부호: vSign[r][c] = row r, col c와 c+1 사이의 세로 경계.
  // hSign[r][c] = row r과 r+1 사이, col c의 가로 경계.
  final vSign = List.generate(
    rows,
    (_) => List.generate(cols - 1, (_) => rng.nextBool() ? 1 : -1),
  );
  final hSign = List.generate(
    rows - 1,
    (_) => List.generate(cols, (_) => rng.nextBool() ? 1 : -1),
  );

  // 각 경계선의 절대좌표 곡선을 한 번만 계산해 두 조각이 동일한 점을 공유하게 한다.
  final vCurves = List.generate(rows, (r) {
    return List.generate(cols - 1, (c) {
      final x = (c + 1) * cellWidth;
      final top = Offset(x, r * cellHeight);
      final bottom = Offset(x, (r + 1) * cellHeight);
      return buildEdgeCurve(top, bottom, sign: vSign[r][c]);
    });
  });
  final hCurves = List.generate(rows - 1, (r) {
    return List.generate(cols, (c) {
      final y = (r + 1) * cellHeight;
      final left = Offset(c * cellWidth, y);
      final right = Offset((c + 1) * cellWidth, y);
      return buildEdgeCurve(left, right, sign: hSign[r][c]);
    });
  });

  List<Offset> flatEdge(Offset a, Offset b) => buildEdgeCurve(a, b, sign: 0);

  final pieces = <PieceLayout>[];
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      final topLeft = Offset(c * cellWidth, r * cellHeight);

      // 시계방향: 상단(L→R) → 우측(T→B) → 하단(R→L) → 좌측(B→T)
      final topEdge = r == 0
          ? flatEdge(topLeft, topLeft + Offset(cellWidth, 0))
          : hCurves[r - 1][c];
      final rightEdge = c == cols - 1
          ? flatEdge(
              topLeft + Offset(cellWidth, 0), topLeft + Offset(cellWidth, cellHeight))
          : vCurves[r][c];
      final bottomEdge = r == rows - 1
          ? flatEdge(
              topLeft + Offset(cellWidth, cellHeight), topLeft + Offset(0, cellHeight))
          : hCurves[r][c].reversed.toList();
      final leftEdge = c == 0
          ? flatEdge(topLeft + Offset(0, cellHeight), topLeft)
          : vCurves[r][c - 1].reversed.toList();

      // 원본 이미지 좌표계 → 패딩된 조각 로컬 좌표계로 변환.
      final imageOffset = topLeft - Offset(padding, padding);
      Offset toLocal(Offset p) => p - imageOffset;

      final path = Path()..moveTo(toLocal(topEdge.first).dx, toLocal(topEdge.first).dy);
      for (final e in [topEdge, rightEdge, bottomEdge, leftEdge]) {
        for (final p in e.skip(1)) {
          final lp = toLocal(p);
          path.lineTo(lp.dx, lp.dy);
        }
      }
      path.close();

      pieces.add(PieceLayout(
        row: r,
        col: c,
        localPath: path,
        imageOffset: imageOffset,
        targetTopLeft: imageOffset,
      ));
    }
  }

  return PuzzleLayout(
    rows: rows,
    cols: cols,
    cellWidth: cellWidth,
    cellHeight: cellHeight,
    padding: padding,
    imageWidth: imageWidth,
    imageHeight: imageHeight,
    pieces: pieces,
  );
}
