param(
  [Parameter(Mandatory = $true)]
  [string]$AppDir
)

# 1) package.json 버전 -> android/app/build.gradle 의 versionCode/versionName 동기화
# 2) android/variables.gradle 의 targetSdk/compileSdk 36 강제 (Play 요구, 2026-08-31 마감)
# 주의: Capacitor 7 에서 versionCode/versionName 은 variables.gradle 이 아니라
#        android/app/build.gradle 에 있다. (variables.gradle 에는 SDK 버전만)
$ErrorActionPreference = 'Stop'
$appPath = (Resolve-Path $AppDir).Path

$pkgPath = Join-Path $appPath 'package.json'
$gradlePath = Join-Path $appPath 'android\app\build.gradle'
$varsPath = Join-Path $appPath 'android\variables.gradle'
if (-not (Test-Path $pkgPath)) { throw "package.json 없음: $pkgPath" }
if (-not (Test-Path $gradlePath)) { throw "android/app/build.gradle 없음 — 'npx cap add android' 먼저 실행" }

$pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
$parts = $pkg.version -split '\.'
$major = [int]$parts[0]; $minor = [int]$parts[1]; $patch = [int]$parts[2]
$versionCode = $major * 10000 + $minor * 100 + $patch
$versionName = $pkg.version

# app/build.gradle: versionCode / versionName (공백 구분 형식)
$gradle = Get-Content $gradlePath -Raw
$gradle = $gradle -replace 'versionCode\s*[0-9]+', "versionCode $versionCode"
$gradle = $gradle -replace 'versionName\s*"[^"]*"', "versionName `"$versionName`""
Set-Content $gradlePath $gradle -Encoding UTF8

# variables.gradle: API 36 강제
if (Test-Path $varsPath) {
  $vars = Get-Content $varsPath -Raw
  $vars = $vars -replace '(targetSdkVersion|compileSdkVersion) = \d+', '$1 = 36'
  Set-Content $varsPath $vars -Encoding UTF8
} else {
  Write-Warning 'android/variables.gradle 없음 (targetSdk 36 강제 생략)'
}

Write-Host "→ versionCode=$versionCode, versionName=$versionName, target/compileSdk=36"
