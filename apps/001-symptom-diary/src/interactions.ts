// 흔한 유의미한 약 상호작용 (참고용). ⚠️ 진단 대체 아님 — 반드시 의사·약사와 확인.
import { canonicalName } from './meds'

export interface Interaction {
  a: string
  b: string
  note: string
}

const PAIRS: [string, string, string][] = [
  ['warfarin', 'aspirin', 'Bleeding risk — confirm with your doctor'],
  ['warfarin', 'ibuprofen', 'Increased bleeding risk'],
  ['warfarin', 'naproxen', 'Increased bleeding risk'],
  ['warfarin', 'diclofenac', 'Increased bleeding risk'],
  ['aspirin', 'ibuprofen', 'Stomach bleeding risk'],
  ['aspirin', 'naproxen', 'Stomach bleeding risk'],
  ['aspirin', 'clopidogrel', 'Increased bleeding risk'],
  ['sertraline', 'ibuprofen', 'GI bleeding risk'],
  ['fluoxetine', 'ibuprofen', 'GI bleeding risk'],
  ['escitalopram', 'ibuprofen', 'GI bleeding risk'],
  ['duloxetine', 'ibuprofen', 'GI bleeding risk'],
  ['methotrexate', 'ibuprofen', 'Methotrexate toxicity risk'],
  ['methotrexate', 'aspirin', 'Methotrexate toxicity risk'],
  ['lisinopril', 'spironolactone', 'High potassium risk'],
  ['losartan', 'spironolactone', 'High potassium risk'],
  ['clopidogrel', 'omeprazole', 'May reduce antiplatelet effect'],
  ['gabapentin', 'pregabalin', 'Excessive drowsiness risk'],
  ['tramadol', 'sertraline', 'Serotonin syndrome risk'],
  ['tramadol', 'fluoxetine', 'Serotonin syndrome risk'],
]

/** 스케줄/복용 중인 약 이름 목록에서 상호작용 쌍 찾기 */
export function findInteractions(names: string[]): Interaction[] {
  const canon = names.map(canonicalName)
  const found: Interaction[] = []
  for (const [a, b, note] of PAIRS) {
    if (canon.includes(a) && canon.includes(b)) found.push({ a, b, note })
  }
  return found
}
