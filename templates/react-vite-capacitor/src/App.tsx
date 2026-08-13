import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { initAds } from './ads'

function App() {
  const { t } = useTranslation()

  useEffect(() => {
    // 안드로이드(WebView)에서만 실제로 광고를 초기화한다. 웹에선 no-op.
    void initAds()
  }, [])

  return (
    <main className="container">
      <h1>{t('app.title')}</h1>
      <p>{t('app.subtitle')}</p>
    </main>
  )
}

export default App
