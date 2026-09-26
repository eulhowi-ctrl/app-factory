import i18n, { type Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from './ar.json'
import en from './en.json'
import id from './id.json'
import ko from './ko.json'
import tr from './tr.json'

// ⚠️ i18next는 resources.<언어>.<namespace> 구조를 요구한다 — translation 아래에 감싸야 함.
export const locales: Resource = {
  en: { translation: en },
  id: { translation: id },
  tr: { translation: tr },
  ar: { translation: ar },
  ko: { translation: ko },
}

export const LANG_LABELS: Record<string, string> = {
  en: 'English',
  id: 'Bahasa Indonesia',
  tr: 'Türkçe',
  ar: 'العربية',
  ko: '한국어',
}

export function deviceLang(): string {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language || 'en']
  for (const l of langs) {
    const code = l.split('-')[0].toLowerCase()
    if (code === 'ms') return 'id' // 말레이어 사용자는 인도네시아어가 가장 가깝다
    if (code in locales) return code
  }
  return 'en'
}

void i18n.use(initReactI18next).init({
  resources: locales,
  lng: deviceLang(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
