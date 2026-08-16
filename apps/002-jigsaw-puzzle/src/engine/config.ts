export interface Difficulty {
  id: string
  labelKey: string
  pieceCount: number
}

// 1000피스는 모바일 터치 조작에 부담이 커서 제외하고 축소했다.
export const DIFFICULTIES: Difficulty[] = [
  { id: 'easy', labelKey: 'difficulty.easy', pieceCount: 20 },
  { id: 'normal', labelKey: 'difficulty.normal', pieceCount: 54 },
  { id: 'hard', labelKey: 'difficulty.hard', pieceCount: 96 },
  { id: 'expert', labelKey: 'difficulty.expert', pieceCount: 150 },
]

export interface PuzzleImage {
  id: string
  nameKey: string
  src: string
}

// 무료 번들 이미지 (Picsum Photos 경유 Unsplash 사진, 라이선스 문제 없음).
export const PUZZLE_IMAGES: PuzzleImage[] = [
  { id: 'rock-island', nameKey: 'image.rockIsland', src: '/images/rock_island.jpg' },
  { id: 'puppies-grass', nameKey: 'image.puppiesGrass', src: '/images/puppies_grass.jpg' },
  { id: 'forest-road', nameKey: 'image.forestRoad', src: '/images/forest_road.jpg' },
]
