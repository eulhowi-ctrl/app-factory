# PROGRESS — Symptomly (시범 앱 #1, 기존명: Symptom Diary)

> 업데이트: 2026-09-30. **다음 세션은 이 파일을 먼저 읽는다.**

## 현재 단계
스테이지 3(검수) 통과 완료 → **스테이지 4(상장) 진행 중**. Play Console 결제($25) 완료.
다음 세션 첫 할 일: 아래 "2026-09-30 세션" 항목의 미완료 액션부터 이어서 진행.

## 2026-09-30 세션 (약 1.5개월 공백 후 재개)
- [x] 로컬(Windows)에 저장소 재클론: `C:\Users\wieul\projects\app-factory`
- [x] `npm install` + `npm run build` 성공 확인 (vite 7.3.6, `dist/` 생성됨) — 웹 빌드는 문제 없음
- [x] 로컬 환경 점검: JDK 17 설치는 되어 있으나(`JAVA_HOME` 세팅됨) PATH 미등록 상태, `ANDROID_HOME` 없음, Android SDK 로컬 미설치 → 안드로이드 빌드 전 PATH 등록 + SDK 설치 필요
- [ ] **다음 즉시 할 일**: `npx wrangler login` (브라우저 인증) → 미완료. 완료되면 `deploy_cloudflare.ps1`로 배포해 `privacy.html` URL 확보
- [ ] Play Console에서 앱 엔트리 생성(이름 Symptomly/영어/앱/무료) — 아직 미수행
- 테스터 모집 전략 논의 완료: Play 클로즈드테스트 12명×14일 요건은 실사용자가 아니라 **개발자 품앗이(교환) 커뮤니티**(Reddit r/androiddev, r/AndroidAppsPromo, Discord/Telegram "20 testers exchange" 그룹) + 지인 동원으로 채우는 게 표준 관행. 가짜 계정/봇은 계정 정지 위험 있어 금지. 실타겟 커뮤니티(r/ChronicIllness 등)는 상장 후 실사용자 유입용으로 아껴둘 것.

## 방향 확정 (2026-08-11)
**시범 목적 그대로 출시.** 성공 기준 = 파이프라인 검증 + Play 검수 경험 + 30일 지표. 인기는 목표 아님.
(사용자 결정: 한국어 스튜디오급 건강앱과 UI 비교는 정면 승부가 아니므로, 이 앱은 시범용으로 출시)

## 확정 조건 (PRD 승인됨 — `PRD.md`)
- 플랫폼: 안드로이드 + 웹/PWA (단일 코드베이스, React+Vite+Capacitor)
- 기능 F1~F5: 증상 기록 / 약물 기록 / 타임라인 / CSV·PDF 내보내기 / 프리미엄 통계
- 데이터: localStorage 전용, 서버 없음, **의료 고지 표시**
- 수익화: AdMob 배너 + "광고 제거+통계" 1회 IAP (시범 빌드는 광고 off, 프리미엄은 테스트 토글)

## 완료
- [x] 스테이지 0 수요발굴 → 001 선택 (`../_candidates/2026-08-10-candidates.md`)
- [x] 스테이지 1 PRD 승인
- [x] 스테이지 2 코딩 + 웹 빌드 검증 (vite 7.3.6, HTTP 200 서빙 확인)
- [x] 버그 수정: Share 탭 프리미엄 해금 버튼 동작 / JSX fragment 구문 오류
- [x] **버그 수정(i18n): resources를 `{ en }`로 넣어 번역이 전부 키로 표시됨** → `{ en: { translation: en } }`로 감싸 해결. 공장 템플릿(`templates/react-vite-capacitor/src/i18n/index.ts`)에도 동일 수정 반영 — 다음 앱은 안 걸림
- [x] **Phase 1 — i18n 16개 언어** (en·ja·zh·es·fr·de·pt·it·ko·th·vi·id·tr·ru·ar·hi) + Settings 언어 선택기 + 선택 영속화 + 아랍어 RTL. 키 구조 자동 검증 16/16 통과
- [x] **Phase 2 — 약 기능 DB** (`src/meds.ts`, 흔한 약 98종) — 이름→카테고리+한 줄 효과. Log 입력 시 미리보기 + Timeline 표시.
- [x] **약 설명 16개 언어화** (`src/medsText.ts` + `medsInfo1/2.ts`) — 카테고리 42개·설명 78문장 × 15개 언어. 언어 선택에 따라 약 설명도 해당 언어로 표시. 자동 검증 통과(78/78)
- [x] **Phase 3 — 약 이름 자동완성 + OCR 버튼** — Log에서 약 이름 입력 시 드롭다운 자동완성(98종), "처방전 스캔" 버튼 → 카메라/파일 → tesseract.js OCR → 인식된 약 이름 칩 탭으로 입력. i18n 키 2개 추가(16개 언어)
- [x] **한국어 약 이름 지원** (`src/medAliases.ts`) — 98종 전부 한국어 제네릭명 별칭 추가. "프레드니손", "이부프로펜" 등 한국어 입력도 자동완성·인식됨. 검증 8/8 통과
- [x] **벤치마크 기반 디자인 반영** — ① 홈 대시보드(스트릭·14일 미니차트·상위증상·오늘 복약 체크) ② 복약 스케줄(설정에서 관리) ③ 병원 이름 기록(Log입력·Timeline/Share 표시) ④ Share 탭 '의사 방문 요약' 카드형 재구성. i18n 키 12개 추가 → 77개/16개 언어
- [x] **논리 정정**: 증상→병원, 약물→약국 필드로 교정 (Log·Timeline·Share). i18n pharmacy 키 3개 추가 → 80개/16개 언어
- [x] **시각 디자인** (A~D): ① 헤더 teal 그라데이션 카드 + 홈 히어로 스탯 ② 미니 차트 막대 강도별 색(저/중/고) ③ 하단 탭 활성 배경 필 ④ 제목 타이포 강조. 다크모드 대응
- [x] **배치1 — 기록·입력**: Log 6종(증상/약물/기분/수면/식사/메모), 증상 자동완성+다중 추가, 증상·약물 사진 첨부, Timeline 6종 통합 표시. i18n +15키 → 95개/16개 언어
- [x] **배치2 — 통계**: 히트맵(월간 캘린더), 약물vs증상 상관 차트, 복약 순응도(7일)
- [x] **배치3 — 복약**: 약 DB 확장(+26종→124종), 약 상호작용 경고, 리필 예정일, 복약 리마인더(웹 알림), 처방·증상 사진 Timeline 표시
- [x] **배치4 — 의사공유**: PDF 프로페셔널 리포트, 병원 방문 이력, 진단·검사 기록(Log 7종), 예약일 설정·표시, 개인정보 마스킹
- [x] **배치5 — 데이터**: PIN 기반 AES-GCM 암호화+잠금화면, 백업/복원(JSON), 항목별 삭제
- [x] **배치6 — UX·성장**: 온보딩 가이드, PWA 설치 배너, 라이트/다크 수동 전환, SEO 메타+JSON-LD, Play 리스팅 스펙(docs), 블로그 초안(docs), 브랜드 아이콘 개선
- **i18n: 145키 × 16개 언어 검증 통과**

- [x] **사진 아카이브 (A·B·C)**: ① 사진을 IndexedDB로 이전(localStorage 5MB 한계 해결, 기존 사진 자동 마이그레이션) ② 보관함 탭 + 전체화면 뷰어(Lightbox) ③ 과거 기록 CSV 일괄 업로드. i18n +5키 → 150개/16개 언어

## 스테이지 4(상장) — 진행 중
- [x] `docs/PUBLISH_CHECKLIST.md` 작성, `docs/PLAY_LISTING.md`·`blog-intro.md` 준비
- [x] Play Console 계정 개설 + $25 결제 (2026-09-30 이전, 사용자 확인)
- [x] 웹 빌드 성공 확인 (2026-09-30, 로컬)
- [x] Cloudflare wrangler login + 웹 배포 완료 (2026-09-30). 기존 Worker `symptomly`(8/14 옛 빌드)를 `wrangler deploy`로 갱신. 라이브 JS 해시 = 로컬 빌드 일치 확인
  - 웹: https://symptomly.symptomly.workers.dev
  - **개인정보처리방침 URL(Play용): https://symptomly.symptomly.workers.dev/privacy.html** (→ /privacy 로 리다이렉트 후 200)
  - 배포 방식은 Pages가 아니라 Workers(`wrangler.jsonc`). `deploy_cloudflare.ps1`(Pages)은 이 앱에 안 맞음 — `wrangler pages deploy`가 프로젝트 파일을 자동 수정하니 쓰지 말 것. 재배포: `npm run build && npx wrangler deploy`
- [ ] **다음 세션 시작점: Play Console 앱 엔트리 생성**
- [x] 로컬 Android 환경 구축 (2026-09-30): C: 여유 1.4GB뿐이라 전부 **E:ndroid**에 설치 — JDK 21(Temurin), SDK(platform 35·36, build-tools 34·36), Gradle 캐시(`GRADLE_USER_HOME`). 사용자 환경변수 JAVA_HOME/ANDROID_HOME/GRADLE_USER_HOME + PATH 등록(기존 JAVA_HOME은 없는 JDK17 폴더를 가리켜 교체). `npx cap add android` + `assembleDebug` 성공(app-debug.apk 8.3MB). 새 터미널부터 적용
  - 패키지 ID `com.appfactory.symptomdiary` (Play 업로드 후 변경 불가)
- [x] 개인정보처리방침에 연락처(eulhowi@gmail.com) 추가 + 재배포. `deploy_cloudflare.ps1`을 Workers 방식으로 수정(파라미터 `-WorkerName`)
- [ ] 키스토어 생성(이중 백업 필수) → `build_android.ps1`로 AAB 빌드
- [ ] 클로즈드 테스트 12명×14일 (opt-in 링크는 AAB를 트랙에 업로드해야 생성됨)
- [ ] AdMob·도메인 (선택)

## 검수 (스테이지 3) — ✅ 통과 (2026-08-12)
- [x] F1 증상 기록 / F2 약물 기록 / F3 타임라인 / F4 CSV·PDF / F5 프리미엄+월별트렌드+그래프
- [x] UI 리디자인(하단 탭·카드·빈상태) + i18n 버그 수정 + 월별 그래프 추가 + 앱명 Symptomly 확정
- 미확인: **안드로이드 빌드** (JDK+Android SDK 미설치) — 스테이지 4에서 진행

## 다음 할 일 (스테이지 3 통과 후)
1. 웹 배포: `../../scripts/deploy_cloudflare.ps1` (Cloudflare 계정 필요)
2. JDK 17 + Android Studio/SDK 설치 → `npx cap add android` → `../../scripts/build_android.ps1` → AAB
3. 계정 개설: Play Console $25 / AdMob / Cloudflare / 도메인 (`../_accounts.md`에 체크)

## 미해결
- Cloudflare wrangler 브라우저 인증 미완료
- Play Console 앱 엔트리 아직 미생성
- AdMob/Cloudflare/도메인 계정 미개설 (Play Console만 완료)

## 실행 환경
- 개발 서버: 앱 폴더에서 `npm run dev` → `http://localhost:5173/`
- 하네스: `../../CLAUDE.md` / 스킬: `../../.claude/skills/`
