// 아이콘 생성: 33알 염주 SVG → PNG(192/512). 사용: node scripts/make-icons.mjs
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { execSync } from 'node:child_process'

// playwright는 전역 설치본 사용 (앱 의존성에 넣지 않음)
const require = createRequire(execSync('npm root -g').toString().trim() + '/')
const { chromium } = require('playwright')

let svg = readFileSync(new URL('./icon.svg', import.meta.url), 'utf8')
const beads = []
for (let i = 0; i < 33; i++) {
  // 아래쪽(이맘 알 자리) 한 칸은 비운다
  const a = ((i + 0.5) / 34) * 2 * Math.PI + Math.PI / 2 + (2 * Math.PI) / 68
  beads.push(`<circle cx="${(256 + 120 * Math.cos(a)).toFixed(1)}" cy="${(226 + 120 * Math.sin(a)).toFixed(1)}" r="12"/>`)
}
svg = svg.replace('<g fill="#e8f5f0" id="beads"></g>', `<g fill="#e8f5f0">${beads.join('')}</g>`)

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined })
for (const size of [192, 512]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } })
  await page.setContent(`<body style="margin:0">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body>`)
  await page.screenshot({ path: `public/icon-${size}.png` })
  await page.close()
}
await browser.close()
console.log('icons written')
