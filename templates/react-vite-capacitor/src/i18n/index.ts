import i18n, { type Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'

// 앱마다 추가 언어를 여기 등록한다. 기본은 영어(해외 틈새 대상).
// ⚠️ i18next는 resources.<언어>.<namespace> 구조를 요구한다 — translation 아래에 감싸야 함.
const locales: Resource = {
  en: { translation: en },
}

const browserLang = (navigator.language || 'en').split('-')[0]

void i18n.use(initReactI18next).init({
  resources: locales,
  lng: browserLang in locales ? browserLang : 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
