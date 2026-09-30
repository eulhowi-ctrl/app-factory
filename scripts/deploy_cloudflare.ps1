param(
  [Parameter(Mandatory = $true)]
  [string]$AppDir,
  [Parameter(Mandatory = $true)]
  [string]$WorkerName
)

# Cloudflare Workers 배포 (정적 자산). Pages 방식(wrangler pages deploy)은 쓰지 않는다:
#   신형 wrangler가 package.json·vite.config.ts를 자동 수정하고 기존 Worker와 이름이 충돌한다.
# 사전: npx wrangler login (1회 인증). 재배포는 같은 WorkerName으로 실행하면 갱신된다.
# 결과 주소: https://<WorkerName>.<계정서브도메인>.workers.dev
$ErrorActionPreference = 'Stop'
$appPath = (Resolve-Path $AppDir).Path

Push-Location $appPath
try {
  # 빌드: 배포물 생성
  npm run build
  if ($LASTEXITCODE -ne 0) { throw '빌드 실패 (npm run build)' }
  if (-not (Test-Path 'dist/index.html')) { throw 'dist/index.html 없음' }

  # 설정: 없으면 최소 wrangler.jsonc 생성 (SPA: 없는 경로는 index.html)
  if (-not (Test-Path 'wrangler.jsonc')) {
    $cfg = @"
{
  "name": "$WorkerName",
  "compatibility_date": "$(Get-Date -Format 'yyyy-MM-dd')",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  }
}
"@
    [IO.File]::WriteAllText((Join-Path $appPath 'wrangler.jsonc'), $cfg, (New-Object Text.UTF8Encoding $false))
    Write-Host 'wrangler.jsonc 생성됨 (커밋 대상)'
  }

  npx wrangler deploy
  if ($LASTEXITCODE -ne 0) { throw 'Cloudflare 배포 실패 (같은 이름의 다른 Worker가 있으면 이름 변경)' }
} finally {
  Pop-Location
}
Write-Host "배포 완료 (위 출력의 workers.dev 주소 확인)"
Write-Host "커스텀 도메인: Cloudflare 대시보드 -> Workers & Pages -> $WorkerName -> Settings -> Domains"
