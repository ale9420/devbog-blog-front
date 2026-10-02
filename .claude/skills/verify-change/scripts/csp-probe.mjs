import { chromium } from '@playwright/test'

const [baseUrl, ...rest] = process.argv.slice(2)
const paths = rest.length ? rest : ['/', '/es', '/blog', '/blog?view=log', '/about', '/privacy', '/account/sign-in', '/account/sign-up']

if (!baseUrl) {
  console.log('usage: csp-probe.mjs <baseUrl> [paths...]')
  process.exit(1)
}

const browser = await chromium.launch()
const context = await browser.newContext()
await context.addInitScript(() => {
  document.addEventListener('securitypolicyviolation', (event) => {
    console.error(`CSP-VIOLATION ${event.effectiveDirective} ${event.blockedURI}`)
  })
})

let problems = 0
for (const path of paths) {
  const page = await context.newPage()
  const found = []
  page.on('console', (message) => {
    if (message.text().includes('CSP-VIOLATION') || /Content Security Policy/i.test(message.text())) found.push(message.text())
  })
  page.on('pageerror', error => found.push(`pageerror: ${error.message}`))
  const response = await page.goto(baseUrl + path, { waitUntil: 'networkidle' })
  await page.mouse.wheel(0, 20000)
  await page.waitForTimeout(1000)
  problems += found.length
  console.log(`${String(response?.status()).padEnd(4)} ${path.padEnd(48)} ${found.length ? found.join(' | ') : 'ok'}`)
  await page.close()
}
await browser.close()
console.log(`${problems} problems`)
process.exitCode = problems ? 1 : 0
