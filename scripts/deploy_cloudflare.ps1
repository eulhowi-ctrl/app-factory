param(
  [Parameter(Mandatory = $true)]
  [string]$AppDir,
  [Parameter(Mandatory = $true)]
  [string]$ProjectName
)

# Cloudflare Pages 배포.
# 사전: npx wrangler login (1회 인증). 프로젝트는 최초 배포 시 자동 생성된다.
$ErrorActionPreference = 'Stop'
$appPath = (Resolve-Path $AppDir).Path

if (-not (Test-Path (Join-Path $appPath 'dist'))) {
  throw 'dist/ 없음 — "npm run build" 먼저 실행'
}

Push-Location $appPath
try {
  npx wrangler pages deploy dist --project-name $ProjectName
  if ($LASTEXITCODE -ne 0) { throw 'Cloudflare 배포 실패' }
} finally {
  Pop-Location
}
Write-Host "✅ 배포 완료: https://$ProjectName.pages.dev"
Write-Host "(커스텀 도메인 연결은 Cloudflare 대시보드 → Pages → 해당 프로젝트)"
