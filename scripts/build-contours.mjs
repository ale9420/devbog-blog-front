#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { HERO_CONTOUR_SETS, contourFileName, contourSvg } from '../app/helpers/contours.ts'

const OUTPUT_DIR = fileURLToPath(new URL('../public/images/contours', import.meta.url))
const check = process.argv.includes('--check')

mkdirSync(OUTPUT_DIR, { recursive: true })

const stale = []
for (const set of HERO_CONTOUR_SETS) {
  for (const major of [false, true]) {
    const file = join(OUTPUT_DIR, contourFileName(set, major))
    const svg = contourSvg(set, major)
    if (check) {
      if (!existsSync(file) || readFileSync(file, 'utf8') !== svg) stale.push(file)
    } else {
      writeFileSync(file, svg)
    }
  }
}

if (stale.length) {
  console.error(`Contour SVGs are out of date, run npm run contours:\n${stale.join('\n')}`)
  process.exit(1)
}
