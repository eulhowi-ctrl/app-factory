/// 난이도 단계 (1000피스는 모바일 터치 조작에 부담이 커서 제외하고 축소했다).
class Difficulty {
  final String label;
  final int pieceCount;

  const Difficulty(this.label, this.pieceCount);

  static const easy = Difficulty('쉬움 (20피스)', 20);
  static const normal = Difficulty('보통 (54피스)', 54);
  static const hard = Difficulty('어려움 (96피스)', 96);
  static const expert = Difficulty('전문가 (150피스)', 150);

  static const all = [easy, normal, hard, expert];
}

/// 번들 이미지 (Picsum Photos 경유 무료 사진 — Unsplash 라이선스, 앱에 기본 포함).
class PuzzleImage {
  final String name;
  final String assetPath;

  const PuzzleImage(this.name, this.assetPath);

  static const all = [
    PuzzleImage('바위섬', 'assets/images/rock_island.jpg'),
    PuzzleImage('잔디밭 강아지', 'assets/images/puppies_grass.jpg'),
    PuzzleImage('숲길', 'assets/images/forest_road.jpg'),
  ];
}
