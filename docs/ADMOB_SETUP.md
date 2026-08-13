# AdMob 셋업

> 목적: 안드로이드 앱 광고 수익. **계정은 첫날부터 개설**해 두어라 (검증 지연이 잦음).
> 웹/PWA에는 광고를 넣지 않는다 — 웹은 유입 퍼널로만 운영 (AdSense는 니치 툴 사이트로 사실상 통과 불가).

## 1. 계정 개설
1. [AdMob](https://admob.google.com) 가입 (Google 계정 연동)
2. 결제 정보·세금 정보 입력 (한국 개인 가능, $100 이상부터 지급)
3. 앱 등록 → 광고 유닛 생성:
   - 배너(adaptive) 1개 — 하단 고정
   - 전면 1개 — 자연스러운 이벤트 후

## 2. 프로덕션 광고 ID 교체
- 템플릿 `src/ads.ts` 상단의 `BANNER_TEST_ID` / `INTERSTITIAL_TEST_ID`를
  AdMob 콘솔에서 생성한 **프로덕션 ID**로 교체한다.
- 배너/전면 표시 호출 주석을 해제하고 `isTesting: false`로 설정.

## 3. AndroidManifest
- `android/app/src/main/AndroidManifest.xml`의 `<application>`에 추가:
  ```xml
  <meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"/>
  ```
- 이후 `npx cap sync android` 재실행.

## 4. 개발 중 규칙
- 개발·테스트는 **테스트 광고 ID + `isTesting: true`** 유지 (실제 노출 차단)
- EEA/UK 사용자 대응: GDPR 동의(consent) 처리 포함 — 플러그인이 지원하므로 기본 활성화

## 5. IAP ("광고 제거" 1회 결제) — 필요 시 추가
- 기본 템플릿에는 미포함 (첫 빌드는 광고 없이 단순화).
- 결제 도입 시 npm에서 조사 후 추가 (후보):
  - `capacitor-billing` (2026-07 기준 v8.1.0, 활발) 
  - `@adplorg/capacitor-in-app-purchase`
- ⚠️ Capacitor 메이저 버전(현재 7)과 호환되는 버전을 확인하고 설치. Play Billing 기반 필수(2026-08-31 시행).

## 6. ⚠️ 필수 금지
- **자기 광고 클릭 / 트래픽 조작** → AdMob 계정 정지 (영구)
- 지급 기준 $100 미만이면 다음 달로 이월
- 계정 검증·은행 인증은 시간이 걸리므로 **첫날 개설** 권장
