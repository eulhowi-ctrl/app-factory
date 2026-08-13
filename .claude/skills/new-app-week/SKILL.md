---
name: new-app-week
description: 주 1개 앱 루프 오케스트레이터. 수요발굴→PRD→코딩→검수→상장 순서와 게이트를 강제한다. 앱이 2개 이상 병렬로 도는 동안 진행 상태를 기록한다.
---

# 주간 루프 (주 1개 앱)

## 스테이지 순서 (게이트 강제)

```
[0] 수요발굴   /demand-research → candidates.md → 인간 선택
[1] PRD        /prd            → PRD.md 승인
[2] 코딩       /app-scaffold   → apps/<앱>/ 에서 3일 분산 (하루 1~1.5h)
[3] 검수       /build-android + /smoke-test → PASS 확인
[4] 상장       /deploy_cloudflare + Play 수동 제출
```

## 게이트
- [3] 검수 PASS 전 [4] 금지
- [0] 인간 선택 전 [1] 금지
- **병렬 규칙**: Play 클로즈드 테스트(12명×14일)가 도는 동안 앱 #2 개발 시작
- 진행 상태는 `apps/<앱>/PROGRESS.md`에 스테이지별 체크 기록

## 인간 역할 (자동화 금지)
- 소재 최종 선택
- PRD 승인
- 검수 게이트 통과/불통과
- Play Console 제출 (수동)

## 마무리
- 주간 종료 시: 무엇이 막혔는지, 새로 배운 파이프라인 규칙을 정리해 제안한다.
- 반복 실수는 `checklist.md` 추가 항목으로 제안 (직접 수정 금지)
