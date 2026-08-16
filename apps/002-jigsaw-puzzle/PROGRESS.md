# PROGRESS — Jigsaw Puzzle (앱 #002)

> 업데이트: 2026-08-16 (2차). **다음 세션은 이 파일을 먼저 읽는다.**

## ⚠️ 출시 전 최우선 이슈 (Playwright 실측 검증에서 발견, 2026-08-16)
**모바일 화면(420×860 기준)에서 20피스 중 16개(80%)가 초기 화면 밖에 흩어져 있어 클릭 불가.**
최대 줌아웃(0.2x) + 정확한 방향으로 팬해야 전부 접근 가능한데, 게임 안에 그 방법을 안내하는
힌트가 전혀 없음. 태블릿(1000×1300) 뷰포트에서는 최대줌아웃만으로 전부 보여서 문제없이
완주됨(0:05, 완료 다이얼로그 정상). 난이도가 올라갈수록(150피스) 트레이가 커져서 더 심해짐.
→ 초기 뷰를 트레이 전체가 보이게 자동 맞춤(fit-to-content)하거나 "화면 밖 조각 N개" 안내 추가 권장.
드래그/스냅/배치잠금/완료판정 자체의 로직은 전부 정상 동작 확인됨(문제는 초기 카메라 위치뿐).

## Android SDK 빌드 환경 구축 (2026-08-16)
이 서버(ARM64/aarch64 Oracle VM)에 Android SDK를 새로 설치하고 **디버그 APK 빌드까지 성공**.
- JDK 17 + JDK 21 설치 (Capacitor 최신 네이티브 모듈이 소스/타깃 21 요구)
- Android cmdline-tools, platform-tools, `platforms;android-36`, `build-tools;36.0.0` 설치
- **문제**: `aapt2`가 x86_64 전용 바이너리라 ARM64 호스트에서 `Exec format error`
- **해결**: `qemu-user-static` + `binfmt-support`로 x86_64 에뮬레이션 활성화,
  `dpkg --add-architecture amd64` + `archive.ubuntu.com`(amd64 전용 소스 추가, 기존 ports는
  arm64로 한정) 통해 `libc6:amd64`/`libstdc++6:amd64` 등 설치 → aapt2 정상 동작
- `npx cap add android` → `./gradlew assembleDebug` **BUILD SUCCESSFUL**,
  `app-debug.apk`(8.6MB) 생성 확인. `aapt dump badging`으로 패키지명(`com.appfactory.jigsawpuzzle`)·
  라벨·권한 정상 확인.
- 이 SDK/환경설정은 서버 전역이라 **001-symptom-diary 등 다른 앱의 안드로이드 빌드에도 재사용 가능**.
- AAB(`bundleRelease`)는 서명 키가 없어 아직 미시도 — 상장용 키스토어 준비 후 진행 필요.

## 현재 단계
스테이지 2(코딩) 완료 → **스테이지 3(검수) 전 단계**. 인간 검수 게이트 통과 전 상장 금지.

## 방향 확정 (2026-08-16)
- 최초 Flutter로 구현했다가, 공장 표준 템플릿(react-vite-capacitor) 요청에 따라
  **React + Vite + Capacitor로 전체 재구현**. Flutter판은 이 저장소엔 없음(별도 서버 로컬에만 존재).
- 조각 생성 알고리즘(요철 곡선 생성, 격자 레이아웃, 시드 기반 재현성)은 Flutter판과
  동일한 수학을 TypeScript로 이식 — 렌더링만 Flutter ClipPath → SVG clipPath로 교체.

## 확정 조건 (PRD 승인 — `PRD.md`)
- 플랫폼: 안드로이드 + 웹/PWA (단일 코드베이스, React+Vite+Capacitor)
- 기능 F1~F5: 난이도 4단계 / 이미지 3장 / 요철 조각 드래그·스냅 / 핀치줌·팬 / 완료 표시
- 데이터: 서버·영속 저장 없음 (세션 메모리만)
- 수익화: 미구현 (MVP는 광고 없이 무료 플레이)

## 완료
- [x] 스테이지 0 수요발굴 — **생략**(소재는 인간이 대화 중 직접 지정, `candidates.md` 없음)
- [x] 스테이지 1 PRD 승인
- [x] 스테이지 2 코딩:
  - 엔진: `src/engine/edgeCurve.ts`(요철 곡선), `src/engine/puzzleGenerator.ts`(격자·레이아웃),
    `src/engine/usePuzzleController.ts`(드래그·스냅·타이머 상태)
  - UI: `src/components/HomeScreen.tsx`, `src/components/PuzzleScreen.tsx`, `src/components/PieceSvg.tsx`
  - i18n: en(기본)/ko 2개 언어
  - 번들 이미지 3장 (Picsum/Unsplash 무료 라이선스, `public/images/`)
  - 아이콘(`public/icon-192.png`, `icon-512.png`) 절차적 생성
- [x] 자동 검증: `npm run build` 성공(tsc+vite), `npm test`(vitest) 14/14 통과,
  `vite preview` HTTP 200 서빙 확인(HTML/이미지/manifest)

## 남은 일 (스테이지 3 검수 전 필요)
- [x] ~~실기기/에뮬레이터에서 드래그·핀치줌 제스처 실제 동작 확인~~ → Playwright로 브라우저 실측
  검증 완료 (드래그/스냅/완료 로직 정상, 단 위 ⚠️ 초기 뷰 이슈 발견)
- [x] ~~`npx cap add android` → 빌드 검증~~ → `assembleDebug` 성공, `bundleRelease`(AAB, 서명 필요)는 미완
- [ ] **⚠️ 초기 뷰 화면 밖 조각 이슈 수정** (위 섹션 참고) — 우선순위 최상
- [ ] 실제 안드로이드 기기/에뮬레이터에서 터치(핀치줌) 제스처 확인 (브라우저 마우스로만 검증됨)
- [ ] 릴리스 서명 키스토어 준비 후 `bundleRelease`(AAB) 빌드
- [ ] `docs/PLAY_LISTING.md`, `docs/PUBLISH_CHECKLIST.md` 작성 (001 참고)
- [ ] `public/privacy.html`의 `[CONTACT_EMAIL_OR_URL]` 실제 값으로 교체
- [ ] 번들 이미지(Picsum/Unsplash) 출처 표기 필요 여부 확인
