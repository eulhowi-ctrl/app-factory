---
name: smoke-test
description: 빌드 산출물을 자동 검증(smoke_check.ps1)하고 인간 검수 체크리스트를 생성한다. FAIL 있으면 상장 금지.
---

# 검수

## 자동 (기계 판정 — 스크립트)
1. `scripts/smoke_check.ps1 -AppDir <앱경로>` 실행
2. 결과: 빌드 성공 / dist 존재 / PWA manifest / server.url 미오염 / AAB 존재 / versionName 동기화 / targetSdk=36
3. FAIL 항목은 수정 후 재실행. 숨기지 않는다.

## 인간 (게이트 — 자동화 금지, 컨텍스트 분리)
- **기기 스모크**: 실기기 또는 Play Pre-launch report (크래시 0건)
- **PRD 대조**: PRD.md 기능(F1~F5) 각각 실제 동작 확인 → 항목별 PASS/FAIL
- **UX 최소**: 오류 없음, 버튼 동작, 반응형 확인

## 산출물
- 검수 리포트 (기계 PASS/FAIL + 인간 항목별 PASS/FAIL + 근거)

## 게이트
- **FAIL 1건 이상 = 상장 금지.** PASS 전까지 스테이지 4로 넘어가지 않는다.
- 검수는 작성한 세션에서 하지 않는다 (같은 세션이면 결과물을 방어함).
