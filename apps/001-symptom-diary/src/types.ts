export interface Symptom {
  id: string
  date: string // YYYY-MM-DD (로컬 날짜)
  time: string // HH:mm (로컬 시간)
  name: string
  severity: number // 1~10
  note?: string
  hospital?: string // 병원/의료기관 이름 (증상은 병원과 연관)
  photo?: string // 증상 사진 (base64 dataURL)
}

export interface Med {
  id: string
  date: string
  time: string
  name: string
  dose?: string
  pharmacy?: string // 약국 이름 (약물은 약국과 연관)
  photo?: string // 처방전/약 봉투 사진 (base64 dataURL)
}

/** 복약 스케줄 — 오늘 복용 체크용 (복용 중인 약 + 복용 시각) */
export interface MedSchedule {
  id: string
  name: string
  dose?: string
  times: string[] // HH:mm 복용 시각 목록
  startDate?: string // 복용 시작일 (리필 계산용)
  durationDays?: number // 처방 일수 (리필 계산용)
}

export interface Mood {
  id: string
  date: string
  time: string
  level: 'good' | 'ok' | 'bad'
  note?: string
}

export interface Sleep {
  id: string
  date: string
  hours: number
  quality: number // 1~5
  note?: string
}

export interface Food {
  id: string
  date: string
  meal: string
  note?: string
}

export interface Memo {
  id: string
  date: string
  time: string
  text: string
}

/** 진단·검사 기록 */
export interface DiagRecord {
  id: string
  date: string
  name: string
  result?: string
}

/** 병원 서류 (진단서·진료비 영수증·세부내역 등) */
export interface Doc {
  id: string
  date: string
  name: string
  kind: 'certificate' | 'receipt' | 'details' | 'other'
  hospital?: string
  note?: string
  photo?: string // 서류 사진 id (IndexedDB)
}

export interface AppData {
  symptoms: Symptom[]
  meds: Med[]
  premium: boolean // Phase C에서 IAP로 전환 예정 (시범 빌드는 테스트 토글)
  schedule: MedSchedule[] // 복약 스케줄
  takenByDay: Record<string, string[]> // "YYYY-MM-DD" → ["<scheduleId>@<HH:mm>", ...]
  moods: Mood[]
  sleeps: Sleep[]
  foods: Food[]
  memos: Memo[]
  records: DiagRecord[] // 진단·검사
  docs: Doc[] // 병원 서류
  appointment?: string // 다음 진료일 (YYYY-MM-DD)
}
