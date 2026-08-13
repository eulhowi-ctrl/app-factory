# 앱 공장 (App Factory)

장삼식 AI 앱 파이프라인 — 클로드 코드로 **주 1개 앱**을 만들어 해외 틈새 수요에서 수익화한다.
인간(본인)은 **소재 선택 + 검수 + 상장**만 한다. 나머지는 AI가 한다.

## 파이프라인
```
수요 발굴 → PRD → 자동코딩 → 검수 → 상장
  (AI)     (AI)    (AI)    (인간)  (웹 자동 + Play 수동)
```

## 시작 방법 (주 1회)
1. `apps/` 폴더에 앱을 만들고 싶으면 → **"새 앱 주간 루프 시작해줘"** (`/new-app-week`)
2. 또는 단일 스테이지만 → `/demand-research`, `/prd`, `/app-scaffold` 등

## 폴더 구조
```
CLAUDE.md          ← 운영 하네스 (게이트·규칙)
templates/         ← react-vite-capacitor 시드, PRD 양식
scripts/           ← new_app / build_android / version_bump / deploy_cloudflare / smoke_check
.claude/skills/    ← demand-research, prd, app-scaffold, build-android, smoke-test, new-app-week
docs/              ← Play 체크리스트, AdMob 셋업, 정책
apps/              ← 앱별 폴더 (candidates.md, PRD.md, 소스) + _accounts.md(계정 장부)
```

## 필수 금지 3가지
- 검수 통과 전 상장 ❌
- 소재를 AI가 단독 결정 ❌
- 서명 키/비밀번호 커밋 ❌

## 초기 계정 (개설 안내는 docs/)
- Google Play Console: $25 1회
- AdMob: 무료 (첫날 개설 권장)
- Cloudflare Pages: 무료
- 도메인: ~$11/년 (선택 권장)
