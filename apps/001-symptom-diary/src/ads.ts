import { Capacitor } from '@capacitor/core'

/**
 * 광고 모듈 — Android(WebView)에서만 동작한다. 웹/PWA에선 절대 초기화하지 않는다.
 *
 * 테스트 광고 ID: https://developers.google.com/admob/android/test-ads
 * 프로덕션 ID로 교체하려면 아래 상수만 바꾸면 된다.
 * AdMob 계정 개설: docs/ADMOB_SETUP.md
 */
// 시범 빌드(Phase B)는 광고 없음. Phase C에서 AdMob 계정 개설 후 true로 전환.
export const ADS_ENABLED = false
export const AD_ON_NATIVE = Capacitor.isNativePlatform() && ADS_ENABLED

const BANNER_TEST_ID = 'ca-app-pub-3940256099942544/6300978111'
const INTERSTITIAL_TEST_ID = 'ca-app-pub-3940256099942544/1033173712'

export async function initAds(): Promise<void> {
  if (!AD_ON_NATIVE) return
  try {
    const { AdMob } = await import('@capacitor-community/admob')
    await AdMob.initialize()

    // 배너(adaptive, 하단 고정) 예시:
    // await AdMob.showBanner({
    //   adId: BANNER_TEST_ID,
    //   position: 'bottom',
    //   adSize: 'ADAPTIVE_BANNER',
    //   isTesting: true,
    // })

    // 전면 광고 예시 (자연스러운 이벤트 후):
    // await AdMob.prepareInterstitial({ adId: INTERSTITIAL_TEST_ID, isTesting: true })
    // await AdMob.showInterstitial()
  } catch (e) {
    // 광고 실패는 앱 동작을 막지 않는다.
    console.warn('AdMob init skipped:', e)
  }
}
