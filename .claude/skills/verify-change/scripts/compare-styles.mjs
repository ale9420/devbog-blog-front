import { readFileSync, writeFileSync } from 'node:fs'
import { chromium } from '@playwright/test'

const WIDTHS = [375, 800, 1280]
const [mode, ...args] = process.argv.slice(2)

async function capture(baseUrl, output, paths) {
  const result = {}
  const browser = await chromium.launch()
  for (const width of WIDTHS) {
    for (const path of paths) {
      const page = await browser.newPage({ viewport: { width, height: 900 } })
      await page.goto(baseUrl + path, { waitUntil: 'networkidle' })
      result[`${width} ${path}`] = await page.evaluate(() => {
        const names = Array.from(getComputedStyle(document.body)).sort()
        return Array.from(document.querySelectorAll('main *')).map((element) => {
          const style = getComputedStyle(element)
          return Object.fromEntries(names.map(name => [name, style.getPropertyValue(name)]))
        })
      })
      await page.close()
    }
  }
  await browser.close()
  writeFileSync(output, JSON.stringify(result))
  console.log(`captured ${Object.values(result).reduce((total, list) => total + list.length, 0)} elements into ${output}`)
}

function compare(beforeFile, afterFile) {
  const before = JSON.parse(readFileSync(beforeFile, 'utf8'))
  const after = JSON.parse(readFileSync(afterFile, 'utf8'))
  let differences = 0
  for (const [key, elements] of Object.entries(before)) {
    const other = after[key] ?? []
    if (elements.length !== other.length) console.log(`${key}: ${elements.length} elements before, ${other.length} after`)
    elements.forEach((style, index) => {
      const changed = Object.keys(style).filter(name => style[name] !== other[index]?.[name])
      if (changed.length) {
        differences++
        console.log(`${key} #${index}: ${changed.slice(0, 5).map(name => `${name} ${style[name]} -> ${other[index]?.[name]}`).join(', ')}`)
      }
    })
  }
  console.log(`${differences} elements with different computed styles`)
  process.exitCode = differences ? 1 : 0
}

if (mode === 'capture') await capture(args[0], args[1], args.slice(2).length ? args.slice(2) : ['/', '/blog'])
else if (mode === 'compare') compare(args[0], args[1])
else console.log('usage: capture <baseUrl> <out.json> [paths...] | compare <before.json> <after.json>')
