import 'dart:async';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;

import '../engine/puzzle_controller.dart';
import '../engine/puzzle_generator.dart';
import '../models/puzzle_config.dart';
import '../widgets/piece_widget.dart';

class PuzzleScreen extends StatefulWidget {
  final PuzzleImage image;
  final Difficulty difficulty;

  const PuzzleScreen({super.key, required this.image, required this.difficulty});

  @override
  State<PuzzleScreen> createState() => _PuzzleScreenState();
}

class _PuzzleScreenState extends State<PuzzleScreen> {
  ui.Image? _image;
  PuzzleController? _controller;
  Timer? _ticker;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final data = await rootBundle.load(widget.image.assetPath);
    final codec = await ui.instantiateImageCodec(data.buffer.asUint8List());
    final frame = await codec.getNextFrame();
    final layout = generatePuzzleLayout(
      targetPieceCount: widget.difficulty.pieceCount,
      imageWidth: frame.image.width.toDouble(),
      imageHeight: frame.image.height.toDouble(),
    );
    final controller = PuzzleController(layout: layout);
    controller.addListener(() {
      if (controller.isComplete && mounted) _onComplete();
    });
    setState(() {
      _image = frame.image;
      _controller = controller;
    });
    _ticker = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) setState(() {});
    });
  }

  void _onComplete() {
    _ticker?.cancel();
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('🎉 완성!'),
        content: Text(
          '${widget.difficulty.pieceCount}피스를 '
          '${_formatDuration(_controller!.elapsed)} 만에 완성했습니다!',
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              Navigator.of(context).pop();
            },
            child: const Text('확인'),
          ),
        ],
      ),
    );
  }

  String _formatDuration(Duration d) {
    final m = d.inMinutes;
    final s = d.inSeconds % 60;
    return '$m분 $s초';
  }

  @override
  void dispose() {
    _ticker?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = _controller;
    final image = _image;

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.image.name),
        actions: [
          if (controller != null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Center(
                child: Text(
                  '${controller.placedCount}/${controller.layout.pieceCount}  '
                  '${_formatDuration(controller.elapsed)}',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ),
        ],
      ),
      body: (controller == null || image == null)
          ? const Center(child: CircularProgressIndicator())
          : InteractiveViewer(
              constrained: false,
              minScale: 0.2,
              maxScale: 3.0,
              boundaryMargin: const EdgeInsets.all(200),
              child: SizedBox(
                width: controller.worldSize.width,
                height: controller.worldSize.height,
                // 드래그로 인한 조각 위치 변경(notifyListeners)마다 스택을 다시 그린다.
                child: AnimatedBuilder(
                  animation: controller,
                  builder: (context, _) => Stack(
                    children: [
                      // 보드 영역(정답 배치 구역) 표시
                      Positioned(
                        left: 0,
                        top: 0,
                        child: Container(
                          width: controller.layout.imageWidth,
                          height: controller.layout.imageHeight,
                          decoration: BoxDecoration(
                            border: Border.all(color: Colors.white54, width: 2),
                            color: Colors.black12,
                          ),
                        ),
                      ),
                      ...controller.pieces.map(
                        (p) => _DraggablePiece(
                          key: ValueKey('${p.layout.row}_${p.layout.col}'),
                          state: p,
                          image: image,
                          controller: controller,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
    );
  }
}

class _DraggablePiece extends StatefulWidget {
  final PieceState state;
  final ui.Image image;
  final PuzzleController controller;

  const _DraggablePiece({
    super.key,
    required this.state,
    required this.image,
    required this.controller,
  });

  @override
  State<_DraggablePiece> createState() => _DraggablePieceState();
}

class _DraggablePieceState extends State<_DraggablePiece> {
  bool _dragging = false;

  @override
  Widget build(BuildContext context) {
    final state = widget.state;
    final layout = widget.controller.layout;

    return Positioned(
      left: state.position.dx,
      top: state.position.dy,
      child: GestureDetector(
        onPanStart: state.placed
            ? null
            : (_) {
                setState(() => _dragging = true);
                widget.controller.bringToFront(state);
              },
        onPanUpdate: state.placed
            ? null
            : (details) => widget.controller.movePiece(state, details.delta),
        onPanEnd: state.placed
            ? null
            : (_) {
                setState(() => _dragging = false);
                widget.controller.endDrag(state);
              },
        child: PieceWidget(
          state: state,
          image: widget.image,
          imageWidth: layout.imageWidth,
          imageHeight: layout.imageHeight,
          canvasWidth: layout.pieceCanvasWidth,
          canvasHeight: layout.pieceCanvasHeight,
          isDragging: _dragging,
        ),
      ),
    );
  }
}
