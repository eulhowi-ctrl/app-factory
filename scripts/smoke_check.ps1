param(
  [Parameter(Mandatory = $true)]
  [string]$AppDir
)

# 자동 스모크 — 기계 판정만 수행. 인간 검수(PRD 대조/UX)는 별도 단계.
$ErrorActionPreference = 'Stop'
$appPath = (Resolve-Path $AppDir).Path
$fail = 0

function Check([string]$label, [bool]$ok) {
  if ($ok) { Write-Host "[PASS] $label" }
  else { Write-Host "[FAIL] $label"; $script:fail++ }
}

$dist = Join-Path $appPath 'dist'
Check 'dist/index.html 존재' (Test-Path (Join-Path $dist 'index.html'))
Check 'PWA manifest 존재' (Test-Path (Join-Path $dist 'manifest.webmanifest'))

# 프로덕션 빌드가 dev server.url을 참조하면 안 됨 (주석 제거 후 검사)
$cap = Get-Content (Join-Path $appPath 'capacitor.config.ts') -Raw
$capClean = $cap -replace '//[^\n]*', ''
Check 'server.url 미오염(릴리즈)' ($capClean -notmatch 'server\s*:')

# AAB 존재
$aabCount = @(Get-ChildItem (Join-Path $appPath 'android\app\build\outputs\bundle\release\*.aab') -ErrorAction SilentlyContinue).Count
Check 'AAB 생성됨' ($aabCount -gt 0)

# 버전 동기화(app/build.gradle) + API 36(variables.gradle)
$gradlePath = Join-Path $appPath 'android\app\build.gradle'
$varsPath = Join-Path $appPath 'android\variables.gradle'
if (Test-Path $gradlePath) {
  $pkg = Get-Content (Join-Path $appPath 'package.json') -Raw | ConvertFrom-Json
  $gradle = Get-Content $gradlePath -Raw
  $verPattern = [regex]::Escape(('"{0}"' -f $pkg.version))
  Check 'versionName 동기화' ($gradle -match $verPattern)
  Check 'versionCode 양수' ($gradle -match 'versionCode\s+[1-9]\d*')
} else {
  Write-Host '[SKIP] android/app/build.gradle 없음 (아직 cap add 전)'
}
if (Test-Path $varsPath) {
  $vars = Get-Content $varsPath -Raw
  Check 'targetSdk=36 (Play 요구)' ($vars -match 'targetSdkVersion = 36')
} else {
  Write-Host '[SKIP] android/variables.gradle 없음'
}

Write-Host ''
if ($fail -eq 0) { Write-Host '✅ 스모크 전체 통과' }
else { Write-Host "❌ 실패 $fail 건 — 상장 금지" }
exit $fail
