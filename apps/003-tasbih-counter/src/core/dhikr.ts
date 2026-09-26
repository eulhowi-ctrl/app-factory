// 지크르 정의. 프리셋은 코드에 고정, 사용자 정의는 저장소에 보관.

export interface Dhikr {
  id: string
  /** 아랍어 원문 (사용자 정의는 빈 문자열 가능) */
  arabic: string
  /** 로마자 음역 */
  translit: string
  /** 프리셋: i18n 키(`meaning.<id>`)로 뜻 표시. 사용자 정의: 이름 직접 입력 */
  customName?: string
  /** 한 바퀴 목표. null = 무제한 */
  target: number | null
  /** 연속 모드: 단계별 지크르 id 목록 (각 단계 목표는 stepTargets) */
  sequence?: string[]
  stepTargets?: number[]
  custom?: boolean
}

export const PRESETS: Dhikr[] = [
  {
    id: 'after-salah',
    arabic: 'سُبْحَانَ ٱللَّٰهِ · ٱلْحَمْدُ لِلَّٰهِ · ٱللَّٰهُ أَكْبَرُ',
    translit: 'Tasbih after salah',
    target: null,
    sequence: ['subhanallah', 'alhamdulillah', 'allahuakbar'],
    stepTargets: [33, 33, 34],
  },
  { id: 'subhanallah', arabic: 'سُبْحَانَ ٱللَّٰهِ', translit: 'SubhanAllah', target: 33 },
  { id: 'alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', translit: 'Alhamdulillah', target: 33 },
  { id: 'allahuakbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', translit: 'Allahu Akbar', target: 33 },
  { id: 'lailahaillallah', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', translit: 'La ilaha illallah', target: 100 },
  { id: 'astaghfirullah', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', translit: 'Astaghfirullah', target: 100 },
  {
    id: 'subhanallahiwabihamdihi',
    arabic: 'سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ',
    translit: 'SubhanAllahi wa bihamdihi',
    target: 100,
  },
  {
    id: 'salawat',
    arabic: 'ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ',
    translit: 'Allahumma salli ala Muhammad',
    target: 100,
  },
]

export const FREE_CUSTOM_LIMIT = 3

export function allDhikrs(custom: Dhikr[]): Dhikr[] {
  return [...PRESETS, ...custom]
}

export function findDhikr(id: string, custom: Dhikr[]): Dhikr | undefined {
  return allDhikrs(custom).find((d) => d.id === id)
}

export function isSequence(d: Dhikr): boolean {
  return !!d.sequence && d.sequence.length > 0
}

/** 현재 카운트가 기록될 실제 지크르 id (연속 모드는 단계의 지크르) */
export function activeDhikrId(d: Dhikr, step: number): string {
  return isSequence(d) ? d.sequence![step] : d.id
}

/** 현재 단계/바퀴의 목표 */
export function currentTarget(d: Dhikr, step: number): number | null {
  return isSequence(d) ? d.stepTargets![step] : d.target
}
