import { createWorker, type Worker } from 'tesseract.js'
import { MEDS } from './meds'

/**
 * 처방전/약 라벨 OCR (선택 기능).
 * ⚠️ on-device OCR — 첫 사용 시 언어 모델(영어)을 CDN에서 다운로드하므로 네트워크 필요.
 * ⚠️ 손글씨 인식은 부정확. 인쇄된 라벨·컴퓨터 출력 처방전 대상.
 */
let workerPromise: Promise<Worker> | null = null

async function getWorker(): Promise<Worker> {
  if (!workerPromise) {
    workerPromise = createWorker('eng')
  }
  return workerPromise
}

/** 이미지(Blob/File)에서 텍스트 인식 */
export async function ocrImage(image: Blob): Promise<string> {
  const worker = await getWorker()
  const { data } = await worker.recognize(image)
  return data.text
}

/** OCR 텍스트에서 약 DB와 일치하는 약 이름 추출 */
export function extractMedNames(text: string, limit = 8): string[] {
  const lower = text.toLowerCase()
  const found = new Set<string>()
  for (const name of Object.keys(MEDS)) {
    if (lower.includes(name)) found.add(name)
  }
  return [...found].slice(0, limit)
}
