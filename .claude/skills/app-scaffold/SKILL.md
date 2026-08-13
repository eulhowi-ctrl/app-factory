---
name: app-scaffold
description: 앱 디렉토리 생성 + 템플릿 복사 + 기본 구조 코딩을 시작한다. PRD 승인 후에만 실행.
---

# 앱 스캐폴딩 + 코딩

## 사전 조건
- PRD.md가 완성·승인된 상태 (미승인이면 /prd 먼저)

## 절차

1. **디렉토리 생성**: `scripts/new_app.ps1 -Name <영문슬러그>` 실행 → `apps/<nnn>-<slug>/`
2. **의존성**: `npm install`
3. **프로젝트 설정**:
   - `capacitor.config.ts`: `appId`(고유, `com.<공장도메인>.<slug>` 형식), `appName`
   - `index.html`: title/description(영어 기본 + SEO 키워드)
   - `vite.config.ts` manifest name/short_name
   - `src/i18n/en.json`: 실문구로 교체 (영어 기본)
   - `public/privacy.html`: [DATE], [앱이름], [연락처] 채우기
4. **PRD 코딩**: `PRD.md`를 구현한다. 기능별 반복 (기능 1 → 빌드/확인 → 기능 2...)
5. **컴포넌트 분리**: 단일 파일에 몰아넣지 않는다. 화면/기능별로 분리.
6. **광고**(PRD에 있으면): `src/ads.ts`의 프로덕션 ID 교체 + 배너/전면 표시 위치 연결.

## 금지
- PRD 승인 전 코딩 금지
- 서버/백엔드 추가 (PRD에 명시된 경우 외)
- server.url 활성화로 릴리즈 준비 (프로덕션은 정적 파일만)
