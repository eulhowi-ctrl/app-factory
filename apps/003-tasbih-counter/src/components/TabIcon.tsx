// 하단 탭 아이콘 — 이모지는 기기마다 달라 보여 SVG로 고정. currentColor로 탭 색을 따른다.
const PATHS: Record<string, React.ReactNode> = {
  counter: (
    <>
      <circle cx="12" cy="10" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2.2 1.6" />
      <path d="M12 16.5v2.5M10.5 22l1.5-3 1.5 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  list: <path d="M5 7h14M5 12h14M5 17h9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
  history: <path d="M6 19v-6M12 19V6M18 19v-9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
}

export function TabIcon({ name }: { name: string }) {
  return (
    <svg className="tab-icon" viewBox="0 0 24 24" aria-hidden="true">
      {PATHS[name]}
    </svg>
  )
}
