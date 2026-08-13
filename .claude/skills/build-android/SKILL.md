---
name: build-android
description: 웹빌드 → cap sync → gradlew.bat bundleRelease → 서명까지 Windows에서 자동화한다. 사전에 Android SDK 설치 필요.
---

# 안드로이드 빌드

## 사전 (1회성)
- Android Studio 설치 + SDK (에뮬레이터 없어도 빌드 가능, 실기기/Pre-launch report로 대체)
- 환경변수 `ANDROID_HOME = %LOCALAPPDATA%\Android\Sdk`
- 앱 폴더 최초 1회: `npx cap add android`

## 절차
1. `scripts/build_android.ps1 -AppDir <앱경로>` 실행
   - 내부: version_bump(versionCode/versionName 동기화 + targetSdk 36 강제) → npm run build → cap sync → bundleRelease
2. AAB 경로 확인: `apps/<앱>/android/app/build/outputs/bundle/release/app-release.aab`
3. 서명 (최초 1회, `docs/POLICY_NOTES.md` 참조):
   - `keytool -genkey -v -keystore upload.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000`
   - `android/keystore.properties` 생성 → `android/app/build.gradle`의 signingConfig에 연결
   - **upload.keystore는 커밋/공유 금지, 클라우드+USB 이중 백업**

## 함정 (Windows)
- PowerShell에서 `.\gradlew.bat` 사용 (유닉스 `./gradlew` 금지)
- `capacitor.config.ts`의 `server.url`이 주석 해제 상태면 릴리즈가 dev 서버를 가리킴 — 금지
- 한글 경로/사용자명은 Gradle 오류 유발 → 앱 프로젝트 경로는 영문 유지

## 게이트
- 빌드 성공 + `smoke_check.ps1` PASS 후에만 상장 단계로
