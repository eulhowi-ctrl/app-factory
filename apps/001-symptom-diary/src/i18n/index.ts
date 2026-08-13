import i18n, { type Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { LANG_CODES, RTL_LANGS } from './languages'
import en from './en.json'
import ja from './ja.json'
import zh from './zh.json'
import es from './es.json'
import fr from './fr.json'
import de from './de.json'
import pt from './pt.json'
import it from './it.json'
import ko from './ko.json'
import th from './th.json'
import vi from './vi.json'
import id from './id.json'
import tr from './tr.json'
import ru from './ru.json'
import ar from './ar.json'
import hi from './hi.json'

// i18next는 resources.<언어>.<namespace> 구조를 요구한다 — translation 아래에 감싸야 함.
const locales: Resource = {
  en: { translation: en },
  ja: { translation: ja },
  zh: { translation: zh },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  pt: { translation: pt },
  it: { translation: it },
  ko: { translation: ko },
  th: { translation: th },
  vi: { translation: vi },
  id: { translation: id },
  tr: { translation: tr },
  ru: { translation: ru },
  ar: { translation: ar },
  hi: { translation: hi },
}

const STORAGE_KEY = 'symptomly-lang'

function applyDir(lng: string): void {
  document.documentElement.dir = RTL_LANGS.has(lng) ? 'rtl' : 'ltr'
}

export function currentLang(): string {
  return i18n.language
}

export function changeLang(code: string): void {
  void i18n.changeLanguage(code).then(() => {
    localStorage.setItem(STORAGE_KEY, code)
    applyDir(code)
  })
}

// 우선순위: 저장된 선택 → 브라우저 언어 → en
const stored = localStorage.getItem(STORAGE_KEY)
const browserLang = (navigator.language || 'en').split('-')[0]
const initLng =
  stored && LANG_CODES.has(stored) ? stored : LANG_CODES.has(browserLang) ? browserLang : 'en'

void i18n
  .use(initReactI18next)
  .init({
    resources: locales,
    lng: initLng,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })
  .then(() => applyDir(initLng))

export default i18n
