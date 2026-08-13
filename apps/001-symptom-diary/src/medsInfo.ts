// 약 설명 문장 번역 병합 (파트 1 + 파트 2)
import { INFOS_PART1, type InfoTrans } from './medsInfo1'
import { INFOS_PART2 } from './medsInfo2'

export type { InfoTrans }

export const INFOS: Record<string, Partial<InfoTrans>> = {
  ...INFOS_PART1,
  ...INFOS_PART2,
}
