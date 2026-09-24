import type { ContourOptions, ContourRing, ContourSet } from '../interfaces/design'

const RING_POINTS = 96
const MAJOR_EVERY = 5

export const HERO_CONTOUR_SETS: readonly ContourSet[] = [
  {
    name: 'hero',
    width: 760,
    height: 720,
    options: { cx: 560, cy: 400, from: 36, to: 470, step: 26, seed: 0.6, scaleX: 1.18, scaleY: 0.86 },
  },
  {
    name: 'hero-compact',
    width: 390,
    height: 300,
    options: { cx: 300, cy: 170, from: 24, to: 300, step: 22, seed: 1.4, scaleX: 1.2, scaleY: 0.8 },
  },
]

export function contourRings(options: ContourOptions): ContourRing[] {
  const { cx, cy, from, to, step, seed, scaleX, scaleY } = options
  const rings: ContourRing[] = []
  for (let radius = from, index = 0; radius <= to; radius += step, index++) {
    const points: string[] = []
    for (let point = 0; point <= RING_POINTS; point++) {
      const angle = (point / RING_POINTS) * Math.PI * 2
      const wobble = 1
        + 0.13 * Math.sin(3 * angle + radius / 53 + seed)
        + 0.07 * Math.sin(5 * angle - radius / 31)
        + 0.035 * Math.sin(9 * angle + radius / 17 + seed * 2)
      const x = cx + Math.cos(angle) * radius * wobble * scaleX
      const y = cy + Math.sin(angle) * radius * wobble * scaleY
      points.push(`${x.toFixed(1)} ${y.toFixed(1)}`)
    }
    rings.push({ d: `M${points.join(' L')}Z`, major: index % MAJOR_EVERY === MAJOR_EVERY - 1 })
  }
  return rings
}

export function contourSvg(set: ContourSet, major: boolean): string {
  const paths = contourRings(set.options)
    .filter(ring => ring.major === major)
    .map(ring => `<path d="${ring.d}"/>`)
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${set.width}" height="${set.height}" viewBox="0 0 ${set.width} ${set.height}" fill="none" stroke="#000" stroke-width="1">${paths}</svg>\n`
}

export function contourFileName(set: ContourSet, major: boolean): string {
  return `${set.name}${major ? '-major' : ''}.svg`
}
