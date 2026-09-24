import { describe, it, expect } from 'vitest'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { HERO_CONTOUR_SETS, contourRings, contourSvg } from '../app/helpers/contours'

describe('contourRings', () => {
  it('draws one closed ring per step and marks every fifth as major', () => {
    const rings = contourRings({ cx: 100, cy: 100, from: 10, to: 60, step: 10, seed: 0, scaleX: 1, scaleY: 1 })
    expect(rings).toHaveLength(6)
    expect(rings.every(ring => ring.d.startsWith('M') && ring.d.endsWith('Z'))).toBe(true)
    expect(rings.map(ring => ring.major)).toEqual([false, false, false, false, true, false])
  })
})

describe('contourSvg', () => {
  it('splits the hero rings into minor and major files', () => {
    const [hero] = HERO_CONTOUR_SETS
    const count = (svg: string): number => svg.split('<path').length - 1
    expect(count(contourSvg(hero!, false))).toBe(14)
    expect(count(contourSvg(hero!, true))).toBe(3)
    expect(contourSvg(hero!, true)).toContain('viewBox="0 0 760 720"')
  })

  it('keeps the committed SVGs in sync with the helper', () => {
    expect(() => execFileSync('node', [join(process.cwd(), 'scripts/build-contours.mjs'), '--check'])).not.toThrow()
  })
})
