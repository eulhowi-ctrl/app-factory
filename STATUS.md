# APP FACTORY 상태판 (새 세션의 첫 진입점)

> 새 세션은 이 파일 → 활성 앱 `PROGRESS.md` → `git log -5` 순으로 읽고 시작한다. 규칙: `CLAUDE.md`의 "세션 인계 규칙".
> 마지막 갱신: 2026-10-01 (세션 종료 시 반드시 갱신)

## 활성 앱
**001 Symptomly** (`apps/001-symptom-diary/`) — 스테이지 4(상장) 진행 중. 상세는 그 폴더의 `PROGRESS.md`.

## 🔴 차단
- **Play Console 개발자(개인) 본인인증 미완료** → '앱 만들기'부터 막힘 (사용자만 해결 가능)

## 확정 사항
- 패키지 ID: `com.appfactory.symptomdiary` **그대로 사용 확정** (2026-10-01, 사용자 결정). AAB 업로드 후 변경 불가
- 웹: https://symptomly.symptomly.workers.dev (Cloudflare Workers, 배포 완료)
- 개인정보처리방침: https://symptomly.symptomly.workers.dev/privacy.html (연락처 eulhowi@gmail.com)
- 재배포: `scripts/deploy_cloudflare.ps1 -AppDir apps/001-symptom-diary -WorkerName symptomly`
- Android 도구는 전부 `E:\android` (C: 여유 1.4GB). 환경변수 등록됨
- 키스토어(저장소 밖, 커밋 금지): `E:\app-factory-keys\symptomly\` (+ 백업 `C:\Users\wieul\app-factory-keys-backup\symptomly\`). 비밀번호는 그 폴더의 `keystore.properties` 안. **아직 클라우드/USB 백업 없음 — 사용자 작업**

## 다음 할 일 — Claude가 지금 할 수 있는 일 (차단과 무관)
1. **AAB 빌드 재실행** (`scripts/build_android.ps1 -AppDir apps/001-symptom-diary`). 직전 시도는 `version_bump.ps1`의 BOM 버그로 Gradle 실패 → 스크립트·오염 파일 수정은 끝났고 **재실행만 남음**(사용자가 중간에 중단시킴). 성공하면 `smoke_check.ps1`까지
2. 스토어 그래픽: 스크린샷 6장은 촬영했으나 **임시 폴더**(scratchpad)에만 있음 → 저장소 `apps/001-symptom-diary/store/`로 옮겨 보관 필요. 아이콘 512×512 PNG, 피처 그래픽 1024×500은 미제작
3. 클로즈드 테스트 테스터 모집 글 초안 (r/androiddev, r/AndroidAppsPromo 등 품앗이 커뮤니티)
4. 공장 스크립트 점검: `new_app.ps1`·`build_android.ps1`·`smoke_check.ps1`에 같은 BOM 문제(`Set-Content -Encoding UTF8`)가 있는지

## 다음 할 일 — 사용자만 할 수 있는 일
1. Play Console 개발자 본인인증 완료 → 완료되면 알려주기
2. 인증 후 앱 엔트리 생성 (입력값: `apps/001-symptom-diary/PROGRESS.md`의 "Play Console 앱 엔트리 입력값")
3. 광고 사용 여부 결정 (Play '광고' 선언에 영향, 시범 빌드는 광고 off)
4. 키스토어를 클라우드 또는 USB에 별도 백업 (분실 시 업데이트 불가)
5. 클로즈드 테스트 테스터 12명 이상 × 14일 모집

## 환경 주의 (같은 실수 방지)
- C: 여유 1.4GB뿐 → 무거운 설치·캐시는 E:에. 새 터미널부터 JAVA_HOME 등 환경변수 적용
- Cloudflare는 Workers 방식만. `wrangler pages deploy`(4.144)는 package.json·vite.config.ts를 멋대로 고친다
- PowerShell 5에서 `Set-Content -Encoding UTF8`은 BOM을 붙인다 → Gradle 파일이 깨진다. BOM 없이 저장할 것
- Bash 도구 입력에서 백슬래시가 변형된다(`\a`→벨 문자). Python으로 윈도우 경로를 쓸 땐 `chr(92)` 사용 후 결과 확인
- `wrangler login`은 독립 프로세스(`Start-Process cmd /c`)로 띄우고 포트 8976이 열린 뒤 Chrome으로 URL을 연다(사용자는 Chrome 사용)

## 앱 목록
| # | 앱 | 단계 | 상태 |
|---|---|---|---|
| 001 | Symptomly (증상 다이어리) | 4 상장 | 🔴 Play 본인인증 대기 |
| 002 | Jigsaw Puzzle | 3 검수 전 | ⏸ 보류 — 모바일 초기 화면에서 조각 80%가 화면 밖(최우선 수정), 실기기 터치 미확인 |
