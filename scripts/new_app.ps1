param(
  [Parameter(Mandatory = $true)]
  [string]$Name,

  [int]$Number
)

# 새 앱 폴더 생성 + react-vite-capacitor 템플릿 복사
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$appsDir = Join-Path $root 'apps'
$templateDir = Join-Path $root 'templates\react-vite-capacitor'

if (-not (Test-Path $templateDir)) { throw "템플릿 없음: $templateDir" }

# 폴더 번호: 지정 없으면 기존 001- 폴더 개수 + 1
if (-not $Number) {
  $existing = @(Get-ChildItem $appsDir -Directory -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match '^\d{3}-' })
  $Number = $existing.Count + 1
}

# 이름 -> 영문 slug (소문자, 알파벳/숫자/하이픈만)
$slug = ($Name.ToLower() -replace '[^a-z0-9]+', '-').Trim('-')
if (-not $slug) { throw '이름을 영문 slug로 변환할 수 없음 (예: -Name water-meter)' }

$target = Join-Path $appsDir ('{0:D3}-{1}' -f $Number, $slug)
if (Test-Path $target) { throw "이미 존재: $target" }

Copy-Item $templateDir $target -Recurse
Write-Host "앱 생성: $target"
Write-Host ""
Write-Host "다음 단계:"
Write-Host "  1) cd `"$target`""
Write-Host "  2) npm install"
Write-Host "  3) capacitor.config.ts 에서 appId/appName 수정"
Write-Host "  4) index.html 의 title/description 수정"
