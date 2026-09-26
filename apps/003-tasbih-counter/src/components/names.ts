import type { TFunction } from 'i18next'
import type { Dhikr } from '../core/dhikr'

export function dhikrTitle(d: Dhikr): string {
  return d.custom ? d.customName || d.translit || 'Dhikr' : d.translit
}

export function dhikrMeaning(d: Dhikr, t: TFunction): string {
  return d.custom ? d.translit : t(`meaning.${d.id}`)
}
