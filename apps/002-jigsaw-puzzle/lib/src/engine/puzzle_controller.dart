import 'dart:math';
import 'dart:ui';

import 'package:flutter/foundation.dart';

import 'puzzle_generator.dart';

/// 조각 하나의 런타임 상태 (드래그로 이동하는 위치, 정답 배치 여부).
class PieceState {
  final PieceLayout layout;
  Offset position;
  bool placed;

  PieceState(this.layout, this.position, {this.placed = false});
}

/// 퍼즐 한 판의 진행 상태를 관리한다. 조각 위치 이동, 스냅 판정, 완료 감지를 담당.
class PuzzleController extends ChangeNotifier {
  final PuzzleLayout layout;
  final double snapThreshold;

  late final List<PieceState> pieces;
  late final Size worldSize;

  final Stopwatch _stopwatch = Stopwatch();
  bool _completed = false;

  PuzzleController({
    required this.layout,
    this.snapThreshold = 28,
    int? seed,
  }) {
    _scatter(seed);
    _stopwatch.start();
  }

  bool get isComplete => _completed;
  Duration get elapsed => _stopwatch.elapsed;
  int get placedCount => pieces.where((p) => p.placed).length;

  void _scatter(int? seed) {
    final rng = Random(seed);
    final boardWidth = layout.imageWidth;
    final boardHeight = layout.imageHeight;
    final cw = layout.pieceCanvasWidth;
    final ch = layout.pieceCanvasHeight;

    final trayCols = max(1, (boardWidth / (cw * 1.15)).floor());
    final trayTop = boardHeight + 40;
    final trayRows = (layout.pieces.length / trayCols).ceil();
    final trayHeight = trayRows * (ch * 1.15) + 40;

    worldSize = Size(
      max(boardWidth, trayCols * cw * 1.15),
      trayTop + trayHeight,
    );

    final order = List.generate(layout.pieces.length, (i) => i)..shuffle(rng);

    pieces = [];
    for (var i = 0; i < layout.pieces.length; i++) {
      final slot = order[i];
      final gridR = slot ~/ trayCols;
      final gridC = slot % trayCols;
      final jitterX = (rng.nextDouble() - 0.5) * (cw * 0.15);
      final jitterY = (rng.nextDouble() - 0.5) * (ch * 0.15);
      final pos = Offset(
        gridC * cw * 1.15 + jitterX,
        trayTop + gridR * ch * 1.15 + jitterY,
      );
      pieces.add(PieceState(layout.pieces[i], pos));
    }
  }

  void movePiece(PieceState piece, Offset delta) {
    if (piece.placed) return;
    piece.position += delta;
    notifyListeners();
  }

  void bringToFront(PieceState piece) {
    pieces.remove(piece);
    pieces.add(piece);
    notifyListeners();
  }

  void endDrag(PieceState piece) {
    if (piece.placed) return;
    final target = piece.layout.targetTopLeft;
    if ((piece.position - target).distance <= snapThreshold) {
      piece.position = target;
      piece.placed = true;
      if (pieces.every((p) => p.placed)) {
        _completed = true;
        _stopwatch.stop();
      }
    }
    notifyListeners();
  }
}
