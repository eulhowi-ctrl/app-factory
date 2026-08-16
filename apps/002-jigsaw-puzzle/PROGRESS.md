# PROGRESS — Jigsaw Puzzle (앱 #002)

> 업데이트: 2026-08-16. **다음 세션은 이 파일을 먼저 읽는다.**

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
- [ ] 실기기/에뮬레이터에서 드래그·핀치줌 제스처 실제 동작 확인 (이 서버는 Android SDK 미설치)
- [ ] `npx cap add android` → `android:build` 로 AAB 빌드 검증
- [ ] `docs/PLAY_LISTING.md`, `docs/PUBLISH_CHECKLIST.md` 작성 (001 참고)
- [ ] `public/privacy.html`의 `[CONTACT_EMAIL_OR_URL]` 실제 값으로 교체
- [ ] 번들 이미지(Picsum/Unsplash) 출처 표기 필요 여부 확인
