# 상장 체크리스트 — Symptomly (스테이지 4)

> 순서대로 진행. ⚠️ 사용자 수동 행동(계정·로그인·설치)은 직접 필요.

## 0. 계정 개설 (가장 먼저, 병행 가능)
- [ ] **Cloudflare** 계정 (무료) → 웹 배포용
- [ ] **Google Play Console** 개인 계정 ($25 1회)
- [ ] **AdMob** 계정 (무료 — 수익화 Phase C용, 첫날 개설 권장)
- [ ] **도메인** (~$11/년, 선택) — Cloudflare DNS에서 관리
- [ ] `apps/_accounts.md`에 개설 상태 기록

## 1. 웹 배포 (가장 빠름)
1. [ ] `npx wrangler login` — 브라우저 로그인 (인터랙티브)
2. [ ] `../../scripts/deploy_cloudflare.ps1 -AppDir <앱경로> -WorkerName symptomly`
3. [ ] `https://symptomly.pages.dev` 접속 확인
4. [ ] (선택) 커스텀 도메인 연결 — Cloudflare 대시보드 → Pages

## 2. 안드로이드 빌드
### 2a. 소프트웨어 설치 (1회)
- [ ] **JDK 17** (Temurin/Adoptium) — 환경변수 JAVA_HOME
- [ ] **Android Studio** + SDK (API 36, build-tools) — `ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk`
- [ ] (에뮬레이터 가속은 BIOS에서 VT — 없으면 실기기/Pre-launch report로 대체)

### 2b. 빌드 파이프라인
- [ ] `npx cap add android` (최초 1회) — 앱 폴더에서
- [ ] 서명: `keytool`로 `upload.keystore` 생성 + `android/keystore.properties` → `.gitignore` 필수
- [ ] `../../scripts/build_android.ps1 -AppDir <앱경로>` → AAB 생성 확인
- [ ] `../../scripts/smoke_check.ps1` → 전부 PASS 확인

## 3. Play Console 상장
### 내부 → 클로즈드 → 프로덕션
- [ ] **내부 테스트(Internal)** 업로드 → 실기기 스모크 + **Pre-launch report** (크래시 0)
- [ ] **클로즈드 테스트(Closed)** — **12명 × 14일** 참여 필수 (테스터 = 해외 커뮤니티에서 모집)
- [ ] Production Access Questionnaire (~10문항) — 테스터 피드백 구체적으로
- [ ] 프로덕션 승격

### 필수 준수 (매 앱)
- [ ] **targetSdk = 36** (자동 강제 — version_bump 확인)
- [ ] 개인정보방침 URL — `privacy.html` 실링크 (상장 전 `<도메인>` 반영)
- [ ] 데이터 안전성 양식(Data safety) — 로컬 저장만, 수집 없음
- [ ] 콘텐츠 등급(IARC) 설문
- [ ] 광고 포함 신고 (AdMob — Phase C에서)
- [ ] 디지털 상품 시 Play Billing (Phase C)

## 4. 상장 후 30일 지표
- [ ] 리뷰·다운로드 / 크래시(Android vitals) / 수익(AdMob)
- [ ] 이 지표로 히트 판단 — 10개 중 일부만 히트해도 회수 구조

## 참고
- **시범 목적**: 인기 아닌 파이프라인 검증 + Play 경험.
- **앱 리스팅 자산**: `docs/PLAY_LISTING.md` (이름·설명·스크린샷 스펙)
- **블로그/랜딩**: `docs/blog-intro.md` (배포 후 게시)
