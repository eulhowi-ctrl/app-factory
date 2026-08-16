import 'dart:ui' as ui;

import 'package:flutter/material.dart';

import '../engine/puzzle_controller.dart';

class _PiecePathClipper extends CustomClipper<Path> {
  final Path path;
  const _PiecePathClipper(this.path);

  @override
  Path getClip(Size size) => path;

  @override
  bool shouldReclip(covariant _PiecePathClipper oldClipper) =>
      oldClipper.path != path;
}

/// 조각 하나를 그린다 — ClipPath로 원본 이미지 전체를 조각 모양대로 잘라서 보여준다
/// (실제 픽셀을 자르지 않고 위젯 레벨에서 클리핑하므로 좌표 계산이 단순해진다).
class PieceWidget extends StatelessWidget {
  final PieceState state;
  final ui.Image image;
  final double imageWidth;
  final double imageHeight;
  final double canvasWidth;
  final double canvasHeight;
  final bool isDragging;

  const PieceWidget({
    super.key,
    required this.state,
    required this.image,
    required this.imageWidth,
    required this.imageHeight,
    required this.canvasWidth,
    required this.canvasHeight,
    this.isDragging = false,
  });

  @override
  Widget build(BuildContext context) {
    final layout = state.layout;
    final piece = ClipPath(
      clipper: _PiecePathClipper(layout.localPath),
      child: OverflowBox(
        alignment: Alignment.topLeft,
        maxWidth: double.infinity,
        maxHeight: double.infinity,
        child: Transform.translate(
          offset: -layout.imageOffset,
          child: SizedBox(
            width: imageWidth,
            height: imageHeight,
            child: RawImage(image: image, fit: BoxFit.fill),
          ),
        ),
      ),
    );
    return SizedBox(
      width: canvasWidth,
      height: canvasHeight,
      child: isDragging
          ? DecoratedBox(
              decoration: BoxDecoration(boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.35),
                  blurRadius: 12,
                  offset: const Offset(2, 4),
                ),
              ]),
              child: piece,
            )
          : piece,
    );
  }
}
