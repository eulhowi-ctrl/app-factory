param(
  [Parameter(Mandatory = $true)]
  [string]$AppDir
)

# 웹빌드 → cap sync → gradlew.bat bundleRelease (Windows 전체 자동화)
$ErrorActionPreference = 'Stop'
$appPath = (Resolve-Path $AppDir).Path

if (-not (Test-Path (Join-Path $appPath 'android'))) {
  throw 'android/ 없음 — 앱 폴더에서 "npx cap add android" 먼저 실행'
}

# 1. 버전 동기화 + API 36 강제
& (Join-Path $PSScriptRoot 'version_bump.ps1') -AppDir $appPath

Push-Location $appPath
try {
  Write-Host '== npm run build =='
  npm run build
  if ($LASTEXITCODE -ne 0) { throw '웹 빌드 실패' }

  Write-Host '== cap sync android =='
  npx cap sync android
  if ($LASTEXITCODE -ne 0) { throw 'cap sync 실패' }

  Write-Host '== gradlew.bat bundleRelease =='
  Push-Location (Join-Path $appPath 'android')
  try {
    & .\gradlew.bat bundleRelease
    if ($LASTEXITCODE -ne 0) { throw 'bundleRelease 실패' }
  } finally {
    Pop-Location
  }
} finally {
  Pop-Location
}

$aab = Get-ChildItem (Join-Path $appPath 'android\app\build\outputs\bundle\release\*.aab') -ErrorAction SilentlyContinue |
  Select-Object -First 1
if (-not $aab) { throw 'AAB 파일을 찾을 수 없음' }
Write-Host "✅ AAB: $($aab.FullName)"
