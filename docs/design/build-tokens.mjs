#!/usr/bin/env node
// Genera tokens.css desde tokens.json del sistema de diseño BogDev.
// Uso: node build-tokens.mjs [entrada=tokens.json] [salida=tokens.css]
import { readFileSync, writeFileSync } from 'node:fs'

const input = process.argv[2] ?? new URL('./tokens.json', import.meta.url).pathname
const output = process.argv[3] ?? new URL('./tokens.css', import.meta.url).pathname
const d = JSON.parse(readFileSync(input, 'utf8'))

const themes = d.color.themes.map((t) => t.id)
const resolve = (v) => (typeof v === 'string' ? v.replace(/\{([\w-]+)\}/g, 'var(--$1)') : v)
const pick = (t, theme) => resolve(typeof t.value === 'object' ? t.value[theme] : t.value)

const themed = [...d.color.tokens, ...(d.shadow?.tokens ?? [])]
const flat = [...(d.spacing?.tokens ?? []), ...(d.radius?.tokens ?? []), ...(d.layout?.tokens ?? [])]

const lines = ['/* BogDev — generado desde tokens.json con build-tokens.mjs. No editar a mano. */']
themes.forEach((theme, i) => {
  lines.push(i === 0 ? `:root,\n[data-theme="${theme}"] {` : `[data-theme="${theme}"] {`)
  themed.forEach((t) => lines.push(`  --${t.name}: ${pick(t, theme)};`))
  lines.push(`  color-scheme: ${theme === 'dia' ? 'light' : 'dark'};`, '}')
})
lines.push(':root {')
flat.forEach((t) => lines.push(`  --${t.name}: ${t.value};`))
Object.entries(d.type?.families ?? {}).forEach(([k, v]) => lines.push(`  --font-${k}: ${v};`))
;(d.type?.groups ?? []).forEach((g) => g.styles.forEach((s) => {
  lines.push(`  --text-${s.name}: ${s.fontWeight} ${s.fontSize}/${s.lineHeight} var(--font-${g.family});`)
}))
lines.push('}')
writeFileSync(output, lines.join('\n') + '\n')
console.log(`tokens.css: ${themed.length} tokens por tema × ${themes.length} temas, ${flat.length} tokens fijos`)
