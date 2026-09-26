# PROGRESS — Tasbih Counter (앱 #003)

> 업데이트: 2026-09-26. **다음 세션은 이 파일을 먼저 읽는다.**

## 현재 단계
스테이지 2(코딩) 완료 → **스테이지 3(검수) 대기**. 인간 검수 게이트 통과 전 상장 금지.
검수는 **별도 세션**에서 진행 (CLAUDE.md: 작성·검수 컨텍스트 분리).

## 확정 조건 (PRD 승인 2026-09-26 — `PRD.md`)
- 플랫폼: 안드로이드 + 웹/PWA (React+Vite+Capacitor)
- 기능 F1~F5: 큰 탭 카운터 / 지크르 프리셋·연속 모드 / 기록·연속일 / 설정(5개 언어·RTL·백업) / Pro 1회 결제(테스트 토글)
- 데이터: localStorage 전용, 서버·계정·분석 SDK 없음
- 수익화: **광고 없음(AdMob 의존성 제거)**, Pro 1회 결제 — 시범 빌드는 테스트 토글

## 완료
- [x] 스테이지 0 수요발굴 → 인간이 #2 선택 (`../_candidates/2026-09-26-candidates.md`, 백로그 `../_candidates/BACKLOG.md`)
- [x] 스테이지 1 PRD 승인
- [x] 스테이지 2 코딩
  - 순수 로직: `src/core/` — `dhikr.ts`(프리셋 8종), `state.ts`(탭·되돌리기·초기화·연속 모드 전이), `stats.ts`(연속일·30일), `storage.ts`(검증 포함 복원), `backup.ts`(JSON·CSV)
  - UI: `src/components/` — Counter / DhikrList / DhikrEditor / History / Settings / Onboarding / Modal / ProgressRing / TabIcon
  - 플랫폼: `src/platform/` — 진동(네이티브 Haptics, 웹 vibrate)·클릭음 / 화면 켜짐(Wake Lock API) / 파일 내보내기(웹 다운로드, 안드로이드 Filesystem+Share)
  - i18n: en / id / tr / ar(RTL) / ko — 81키 × 5개 언어 구조 검증 통과. 말레이어 기기 → 인도네시아어
  - 아이콘: `scripts/make-icons.mjs`로 33알 염주 SVG → `public/icon-192/512.png`
  - `npx cap add android` 완료 (네이티브 프로젝트 생성만, 빌드는 미실행)

## 자동 검증 결과 (2026-09-26, 이 세션)
- `npm run build` ✅ (tsc + vite, JS 319kB / gzip 102kB)
- `npm test` ✅ vitest 15/15 — 연속 모드 33→33→34 전이, 단계 경계 되돌리기, 초기화 시 기록 보존, 무료 3개 제한, 연속일, 백업 왕복·손상 파일 거부, CSV 이스케이프
- Playwright 브라우저 실측 ✅ 31/31 (390×844 모바일, 360×640 소형) — 새로고침 후 카운트 유지, 짧게 누르면 초기화 안 됨/길게 누르면 확인창, 100탭 1라운드 완료, 사용자 지크르 3개 후 추가 비활성, 기록 합계, CSV·JSON 내보내기, 백업 복원·잘못된 파일 거부, 다크모드, 아랍어 RTL, 기기 언어 자동(id/ms/tr), 가로 넘침 없음, 콘솔 에러 0

## 검증 불가 (이 환경)
- **안드로이드 빌드(APK/AAB)** — Android SDK 미설치. 002를 빌드했던 서버 또는 로컬 PC에서 `/build-android`
- `scripts/smoke_check.ps1` — PowerShell(Windows) 필요
- **실기기 전용 동작**: Haptics 진동 세기, 화면 켜짐 유지, 안드로이드 공유 시트로 파일 저장, 백업 파일 선택기
- **종교 문구·번역 정확성** — 아랍어 원문은 표준 지크르만 사용했으나, id/tr/ar 번역은 원어민 검수 권장 (PRD 6절)

## 남은 일 (스테이지 3 검수)
- [ ] 별도 세션에서 `/smoke-test` + 인간 체크리스트
- [ ] 안드로이드 빌드 + 실기기 스모크 (진동·화면 켜짐·파일 공유)
- [ ] `public/privacy.html`의 `[CONTACT_EMAIL_OR_URL]` 실제 값으로 교체
- [ ] 번역 원어민 검수 (id / tr / ar)
- [ ] Play Billing 연동 (Pro 실결제) — 상장 전 필수, 지금은 테스트 토글

## 실행 환경
- 개발 서버: `npm run dev` → `http://localhost:5173/`
- 테스트: `npm test`
- 아이콘 재생성: `node scripts/make-icons.mjs` (전역 playwright 사용)
