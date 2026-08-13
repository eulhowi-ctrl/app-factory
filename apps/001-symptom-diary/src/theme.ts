// 라이트/다크 테마 수동 전환 — data-theme 속성으로 제어
export type Theme = 'auto' | 'light' | 'dark'

const KEY = 'symptomly-theme'

export function getTheme(): Theme {
  const v = localStorage.getItem(KEY)
  return v === 'light' || v === 'dark' || v === 'auto' ? v : 'auto'
}

export function applyTheme(t: Theme): void {
  localStorage.setItem(KEY, t)
  const el = document.documentElement
  if (t === 'auto') delete el.dataset.theme
  else el.dataset.theme = t
}
