# 앱 후보 목록 — 2026-09-26 (앱 #003용)

> 방법: 리서치 에이전트 2개 병렬 — ① Reddit·Hacker News "이런 앱 있었으면 / 대체 앱 찾음" ② 앱스토어 1~3점 리뷰·서비스 종료·"X 대체 앱"·해외 지역 틈새.
> 필터: ① 서버 불필요(localStorage/IndexedDB) ② 주 1개 생산 가능(기능 ≤5) ③ 안드로이드+웹 단일코드 ④ 광고/일회결제 수익화 ⑤ 의료·금융 조언 책임 없음
> 제외: 이미 만든 앱(증상 다이어리, 직소 퍼즐) + 2026-08-10 목록의 후보들.
>
> **증거 표기**: **[V]** = 페이지를 직접 열어 내용 확인 / **[S]** = 검색 결과 제목·요약만 확인(페이지 미개봉).
> ⚠️ 이 환경에서 Reddit·HN·Play 직접 접속이 막혀 있어, Reddit 링크는 전부 [S]입니다. 게시 날짜도 미확인.
>
> 채점(1~5) = 증거 확실성 + 수익성 + 난이도 종합.

## ⭐ 인간 추천 상위 3

### 1. 뜨개질·코바늘 단수 카운터 + 프로젝트 노트 — 5/5
- **문제**: 단수 카운터라는 기본 기능까지 구독으로 잠근 앱들에 뜨개인들이 반발 중.
- **증거**:
  - [V] https://knitandnote.com/blog/the-news-is-finally-out/ — Knit&Note, 단수 카운터·하이라이터를 구독에 포함시킨다고 공지
  - [V] https://apps.apple.com/us/app/my-row-counter-knit-crochet/id1342608792?see-all=reviews&platform=iphone — "그 기능 쓰려면 구독해야 해서 짜증"
  - [S] https://www.reddit.com/r/craftsnark/comments/1o645my/knitnote_paywalling_rowcounters_and_more/ — "knit&note paywalling rowcounters"
  - [S] https://www.reddit.com/r/casualknitting/comments/1r0jnbh/looking_for_a_free_or_one_time_payment/ — "무료 또는 1회 결제 대안 찾음"
- **경쟁**: Knit&Note(월 구독), knitCompanion(연 $20), YarnPal(체험 후 유료), My Row Counter(구독) — 기본 기능 유료화가 불만
- **수익**: 강함 — "1회 결제" 명시 요구. 프로젝트 3개 초과 등 1회 해금
- **난이도**: 낮음 — ① 프로젝트 목록 ② 프로젝트별 다중 카운터(단·반복) ③ 화면 켜짐 유지 + 큰 버튼/볼륨키 카운트 ④ 노트·사진 ⑤ 로컬 백업
- **플랫폼**: 안드로이드(볼륨키·화면 유지). 웹도 기본 동작 가능
- **지역·언어**: 영어권 우선, 일본(뜨개 인구 큼) 현지화 여지

### 2. 광고 없는 타스비(Dhikr) 카운터 — 5/5
- **문제**: 기도용 디지털 염주 앱이 기도 중에 광고(도박·선정적 광고 포함)를 띄우고, 광고 오터치로 카운트가 초기화됨.
- **증거**:
  - [V] https://apps.apple.com/us/app/tasbih-counter-lite-dhikr-app/id1501329079 — "광고가 부적절해 삭제", "광고 오터치로 40,000+ 카운트 리셋"
  - [V] https://play.google.com/store/apps/details?id=com.muslimidia.tasbih — 10만+ 다운로드, "광고가 너무 많음"
  - [S] https://play.google.com/store/apps/details?id=com.sevapp.smart_tasbeeh — "지크르 중 러미(도박) 광고, 여성 모델 광고"
  - [S] https://apps.apple.com/us/app/tasbih-counter-pro-dhikr-app/id1341100401 — "Pro 결제했는데도 광고… 카지노"
- **경쟁**: 광고 범벅 클론 수백 개, 깨끗하고 믿을 만한 앱은 드묾
- **수익**: "평생 1회 결제로 광고 제거"를 사용자가 직접 요구 → "영원히 광고 없음" 1회 결제. **광고 수익 모델은 부적합**(광고가 불만의 핵심)
- **난이도**: 매우 낮음 — ① 큰 탭 카운터+진동 ② 목표 프리셋(33/99/100) ③ 기록·연속일 ④ 다크모드 ⑤ 위젯(선택)
- **플랫폼**: 안드로이드(대상 시장 점유율 압도적, 햅틱·위젯)
- **지역·언어**: 인도네시아·말레이시아·터키·중동·파키스탄 — ID/TR/AR(RTL) 현지화. 기존 공장에 아랍어 RTL 경험 있음(001)
- **정책**: 종교 콘텐츠 — 문구·번역 정확성 주의

### 3. 오프라인 외상 장부 (인니 "buku hutang" / 브라질 "caderneta de fiado") — 4.5/5
- **문제**: 동네 가게의 손님 외상을 종이 장부로 관리. 인기 앱 BukuKas(500만+ 사용자)가 종료됐고, 대체 앱은 광고 범벅이거나 클라우드 계정을 강요함.
- **증거**:
  - [V] https://www.cnbcindonesia.com/tech/20230515080100-37-437245/bukukas-tutup-walau-dulu-punya-rp-114-triliun-nasib-lummo — "BukuKas는 2023-05-26 이후 사용 불가", 사용자는 엑셀로 내보내야 했음
  - [V] https://play.google.com/store/apps/details?id=com.ilgnergames.cadernodefiado&hl=pt_BR — 브라질 "100% 오프라인" 외상 앱, 다운로드 100+·광고 포함(2026-08 업데이트) → 수요는 있고 시장은 얇음
  - [S] https://katadata.co.id/digital/startup/6461bf505f278/startup-didukung-jeff-bezos-lummo-disebut-tutup-bisnis-dan-kaji-merger — Lummo 폐업 보도
- **경쟁**: BukuWarung, SI APIK(인도네시아 중앙은행), 브라질 소형 앱 몇 개. "서비스 종료로 데인 사용자" → 로컬 우선이 판매 포인트
- **수익**: 사업자라 PDF·엑셀 내보내기·백업에 1회 결제 의지. 배너도 허용
- **난이도**: 낮음~중간 — ① 손님 ② 외상·입금 기록 ③ 손님별 잔액 ④ WhatsApp 공유로 독촉(서버 없음) ⑤ CSV 내보내기
- **플랫폼**: 안드로이드(인니·브라질 소상공인 압도적)
- **지역·언어**: 인도네시아어(ID) + 포르투갈어(PT-BR) 한 코드베이스
- **정책**: 기록 도구일 뿐 금융 조언 아님

## 그 외 후보

### 4. "문 잠갔나?" 사진 인증 체크리스트 — 4/5
- **문제**: 외출 후 문·가스레인지 걱정 → 사진을 찍지만 카메라롤에 묻힘.
- **증거**: [S] https://www.reddit.com/r/SomebodyMakeThis/comments/1w6ajc9/anyone_else_leave_the_house_and_immediately_panic/ · [S] https://www.reddit.com/r/LifeProTips/comments/1nkxwhi/lpt_how_to_always_remember_if_you_locked_the_door/ · [S] https://www.reddit.com/r/ADHD/comments/1ae3icq/i_left_my_gas_stove_on_for_8_while_hours/
- **경쟁**: 소수 신생 앱(주로 iOS), 안드로이드 공백 여부는 미확인
- **수익**: 매일 열어 광고 적합 + 체크리스트 여러 개 1회 해금
- **난이도**: 매우 낮음(4기능: 체크 항목·항목별 타임스탬프 사진·오늘의 인증 화면·24시간 자동삭제)
- **플랫폼**: 안드로이드(카메라·위젯) / **지역**: 보편. 강박증 등 의료 표현 회피

### 5. 교실 자리 배치표 ("같이 앉으면 안 되는" 규칙) — 4/5
- **문제**: 교사가 분리 조건을 지키는 무료·무로그인 자리 섞기 도구를 원함.
- **증거**: [S] https://www.reddit.com/r/Teachers/comments/1vz1wu9/best_free_seating_chart_maker/ · [S] https://www.reddit.com/r/Teachers/comments/1ane6y3/am_i_the_only_one_who_finds_seating_plans/ · [S] https://www.reddit.com/r/Teachers/comments/1s2jg33/free_seating_chart_app/
- **경쟁**: LMS 내장 기능, seatingchartmaker.app(무료판 제한), iPad 전용 앱
- **수익**: 중간 — 소액 1회 결제, 웹 광고 허용. 학교가 계정 가입을 막는 경우가 많아 "로그인 없음"이 장점
- **난이도**: 낮음~중간(4기능: 명단 붙여넣기·교실 격자·제약+섞기(백트래킹)·인쇄/대체교사용 보기)
- **플랫폼**: 웹/PWA 우선(교실 PC·프로젝터) / **지역**: 한국 "자리 바꾸기" 수요와도 맞음

### 6. 집 물품 보험용 인벤토리 (Encircle 대체) — 4/5
- **문제**: 무료 홈 인벤토리 앱 Encircle이 2025-12 종료 → 방별 사진 목록 + PDF 내보내기 대체재 필요.
- **증거**: [V] https://contentsproof.com/blog/encircle-alternative-free-home-inventory · [S] https://www.reddit.com/r/Home/comments/1njohhk/home_inventory_applications/ · [S] https://www.reddit.com/r/Cleaningandtidying/comments/1oi2xn9/home_inventory_app/
- **경쟁**: Sortly(개수 제한·유료), Scanlily·Vorby(AI 유료), HomeBox(셀프호스팅이라 어려움)
- **수익**: 중~상 — PDF 내보내기 1회 해금
- **난이도**: 중간(5기능). IndexedDB 사진 용량 관리 + ZIP 백업 필수
- **플랫폼**: 안드로이드(카메라) / **지역**: 미국·캐나다(보험 문화)

### 7. 오프라인 로열티 카드 지갑 (Stocard 대체) — 4/5
- **문제**: 멤버십 바코드 지갑 Stocard가 Klarna(결제 앱)에 흡수 → 카드 지갑만 원한 사용자가 핀테크 계정을 강요당함.
- **증거**: [V] https://alternativeto.net/software/stocard/about — "Klarna에 인수되어 종료" · [V] https://www.emarketer.com/content/klarna-launches-loyalty-feature-hone-on-engagement-sales-growth (2022-06) · [S] https://choice.community/t/stocard-being-replaced-by-klarna-app/33022
- **경쟁**: Catima(오픈소스, 투박), SuperCards, Cardabase
- **수익**: 매일 사용 → 소형 배너 + "광고 제거+백업" 1회
- **난이도**: 낮음(4기능). 카메라 스캔은 Capacitor ML Kit 바코드 플러그인 필요
- **플랫폼**: 안드로이드(계산대 사용) / **지역**: 독일·EU·호주. **주의**: 종료가 2022~2023년이라 이미 대체재가 자리 잡았을 가능성

### 8. 한 폰으로 하는 여행 정산기 (Splitwise 제한 대응) — 3.5/5
- **문제**: Splitwise 무료판이 하루 3~5건 제한 + 광고, 검색·환율은 Pro 전용.
- **증거**: [V] https://split-circle.com/en/blog/splitwise-alternatives-2026 · [V] https://partytab.app/blog/best-splitwise-alternatives (둘 다 경쟁사 블로그)
- **경쟁**: 신규 대안 다수(대부분 계정·동기화 필요). 틈새 = "총무 1명이 폰 하나로, 계정 없이"
- **난이도**: 중간(5기능: 인원·불균등 분할·수동 환율·최소 송금 정산·이미지 공유)
- **플랫폼**: 둘 다 / **지역**: 한국 N빵·일본 割り勘 현지화

### 9. 자동차 정비 기록 (계정·구독 없음) — 3.5/5
- **증거**: [S] https://www.reddit.com/r/Audi/comments/1sr0mwr/i_found_that_all_car_maintenance_trackers_on/ · [S] https://www.reddit.com/r/Cartalk/comments/1nfes55/app_for_tracking_car_maintenance/ · [S] https://www.reddit.com/r/Cartalk/comments/1nqypoo/how_do_you_all_keep_track_of_your_cars/
- **경쟁**: Carfax(계정), Drivvo·Fuelio(광고·Pro) — 붐비지만 파편화. **B 에이전트는 불만 증거 부족으로 제외** 판정
- **난이도**: 낮음(5기능) / **플랫폼**: 안드로이드 / **지역**: 한국어판 공백 가능

### 10. 카우치투5K 인터벌 러닝 코치 (진짜 무료/1회) — 3.5/5
- **증거**: [S] https://www.reddit.com/r/C25K/comments/106phy9/c25k_app_isnt_free_past_day_4_anymore_but_just/ · [S] https://www.reddit.com/r/C25K/comments/1qu6fov/what_free_c25k_app_are_we_all_using/ · [S] https://www.reddit.com/r/beginnerrunning/comments/1l2l7o4/whats_the_best_free_c25k_app/
- **경쟁**: Just Run(무료·호평), NHS C25K(무료)
- **리스크**: 화면 꺼진 상태 백그라운드 타이머·음성 → Capacitor 포그라운드 서비스 필요, 주 1개 빌드에 기술 리스크
- **플랫폼**: 안드로이드 필수 / **지역**: 한국어판 공백 가능(미확인)

### 11. 수족관 수질·관리 기록 — 3/5
- **증거**: [S] https://www.reddit.com/r/ReefTank/comments/1ct1n20/what_parameter_tracking_app_do_you_use_and_what/ · [S] https://www.reddit.com/r/PlantedTank/comments/1cwdsas/aquarium_apps/
- **경쟁**: Aquarium Note 등 기존 앱 + 인디 앱 다수 / **난이도**: 낮음(5기능) / **플랫폼**: 안드로이드

### 12. 식물 물주기 알림 (알림 유료화 없음) — 3/5
- **증거**: [V] https://apps.apple.com/us/app/planta-plant-garden-care/id1410126781?see-all=reviews — "구독 가치 없음" · [S] https://www.reddit.com/r/houseplants/comments/1kwq79u/plant_app/ — Greg "돈 내야 알림" · [S] https://alternativeto.net/software/planta
- **경쟁**: 매우 붐빔(Planta, Greg, PictureThis, 1회 결제 앱도 이미 존재) / **난이도**: 매우 낮음

### 13. 단식 타이머 (전체 기록 무료) — 3/5
- **증거**: [V] https://thedolceway.com/blog/zero-fasting-app-alternative · [S] https://easyfasting.net/blog/best-free-fasting-app (둘 다 경쟁사 블로그)
- **경쟁**: 붐빔 / **정책**: 웰니스 인접 — 건강 효과 문구 금지

### 14. "어디 뒀더라?" 물건 위치 기록 — 3/5
- **증거**: [S] https://www.reddit.com/r/Homeorganization/comments/1sqrya6/how_do_you_actually_remember_where_things_are/ · [S] https://www.reddit.com/r/ADHD/comments/1mq51pd/how_do_you_keep_track_of_where_you_put_things/
- **경쟁**: 인디 앱·QR 박스 앱 다수 / **메모**: #6(인벤토리)과 코드베이스 공유 가능

### 15. 헬스 운동 기록 (루틴 개수 제한 없음) — 2.5/5
- **증거**: [V] https://www.boostcamp.app/alternatives/strong (경쟁사 글) · [S] https://alternativeto.net/software/strong
- **경쟁**: 포화(Hevy, FitNotes, Boostcamp) / **난이도**: 4시간 빌드에 빠듯

## 검토 후 제외
사워도우 기록(앱 6개 이상 존재), 보드게임 점수판(무료 무광고 앱 포화), 전선관 벤딩 계산기(기존 앱 만족), 목공 재단 계산기(무료 도구 다수), 닭·계란 기록(2026년 신규 앱 포화), 인니 아리산 추첨(불만 증거 없음), 일본 쓰레기 배출일 달력(지자체 앱 존재), 보증서 관리(포화), 한국 경조사비 장부(신규 앱 다수, 불만 증거 없음).

## 다음 단계
**인간이 1개 선택** → `/prd`로 PRD 작성 → 승인 후 `apps/003-<이름>/` 스캐폴드.
