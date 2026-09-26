import type { StrapiBlock } from '../interfaces/strapi-blocks'
import type {
  ApaSegment,
  CitationIndex,
  NumberedReference,
  ReferenceIdentifier,
  StrapiReference,
  StrapiReferenceType,
} from '../interfaces/strapi-reference'

const KEY = '[a-z0-9][a-z0-9-]*'
const GROUP = `\\[(@${KEY}(?:\\s*;\\s*@${KEY})*)\\](?!\\()`
const CITATION_PATTERN = new RegExp(GROUP, 'g')
const CODE_PATTERN = /^[ \t]*(```|~~~)[^\n]*\n[\s\S]*?(?:^[ \t]*\1[ \t]*$|(?![\s\S]))|`+[^`\n]+`+/gm
const ARXIV_URL = /^https?:\/\/(?:www\.)?arxiv\.org\/(?:abs|pdf)\/([^?#]+?)(?:\.pdf)?\/?(?:[?#].*)?$/i
const ITALIC_CONTAINER: readonly StrapiReferenceType[] = ['journal', 'conference', 'chapter']
const CLOSING_PUNCTUATION = /[.?!]$/

export const CITATION_RULE = new RegExp(`^${GROUP}`)

export function citationBlockKey(block: StrapiBlock): string {
  return `${block.__component}-${block.id}`
}

export function splitCitationGroup(group: string): string[] {
  return group.split(';').map(part => part.trim().slice(1))
}

export function citedKeys(markdown: string): string[] {
  const prose = markdown.replace(CODE_PATTERN, '')
  const keys: string[] = []
  for (const match of prose.matchAll(CITATION_PATTERN)) keys.push(...splitCitationGroup(match[1]!))
  return keys
}

function citingBlocks(blocks: StrapiBlock[] | null | undefined): { key: string, body: string }[] {
  return (blocks ?? []).flatMap((block) => {
    if (block.__component !== 'shared.rich-text' && block.__component !== 'shared.quote') return []
    return block.body ? [{ key: citationBlockKey(block), body: block.body }] : []
  })
}

export function citationOrder(blocks: StrapiBlock[] | null | undefined, references: StrapiReference[] | null | undefined): string[] {
  const known = new Set((references ?? []).map(reference => reference.key))
  const order = new Set<string>()
  for (const { body } of citingBlocks(blocks)) {
    for (const key of citedKeys(body)) if (known.has(key)) order.add(key)
  }
  return [...order]
}

export function numberReferences(blocks: StrapiBlock[] | null | undefined, references: StrapiReference[] | null | undefined): NumberedReference[] {
  const order = citationOrder(blocks, references)
  const byKey = new Map((references ?? []).map(reference => [reference.key, reference]))
  const cited = order.map((key, index) => ({ number: index + 1, cited: true, reference: byKey.get(key)! }))
  const uncited = (references ?? [])
    .filter(reference => !order.includes(reference.key))
    .map((reference, index) => ({ number: order.length + index + 1, cited: false, reference }))
  return [...cited, ...uncited]
}

export function buildCitationIndex(blocks: StrapiBlock[] | null | undefined, references: StrapiReference[] | null | undefined): CitationIndex {
  const numbers: Record<string, number> = {}
  for (const entry of numberReferences(blocks, references)) {
    if (entry.cited) numbers[entry.reference.key] = entry.number
  }
  const anchors: Record<string, string[]> = {}
  const anchored = new Set<string>()
  for (const { key: blockKey, body } of citingBlocks(blocks)) {
    for (const key of citedKeys(body)) {
      if (!(key in numbers) || anchored.has(key)) continue
      anchored.add(key)
      anchors[blockKey] = [...(anchors[blockKey] ?? []), key]
    }
  }
  return { numbers, anchors }
}

export function referenceHref(reference: StrapiReference): string | undefined {
  const doi = reference.doi?.trim()
  if (doi) return `https://doi.org/${doi}`
  return reference.url?.trim() || undefined
}

export function referenceIdentifier(reference: StrapiReference): ReferenceIdentifier | null {
  const doi = reference.doi?.trim()
  if (doi) return { text: `doi.org/${doi}`, href: `https://doi.org/${doi}` }
  const url = reference.url?.trim()
  if (!url) return null
  const arxiv = ARXIV_URL.exec(url)
  if (arxiv) return { text: `arXiv:${arxiv[1]}`, href: url }
  return { text: url.replace(/^https?:\/\/(?:www\.)?/i, '').replace(/\/$/, ''), href: url }
}

export function referenceVenue(reference: StrapiReference): string {
  const label = reference.venueLabel?.trim()
  const venue = label || [reference.container?.trim(), reference.year.trim()].filter(Boolean).join(' · ')
  return venue.toUpperCase()
}

function withPeriod(text: string): string {
  return CLOSING_PUNCTUATION.test(text) ? text : `${text}.`
}

export function formatApa(reference: StrapiReference): ApaSegment[] {
  const title = reference.title.trim()
  const container = reference.container?.trim()
  const volume = reference.volume?.trim()
  const issue = reference.issue?.trim()
  const pages = reference.pages?.trim()
  const volumeIssue = `${volume ?? ''}${issue ? `(${issue})` : ''}`
  const details = [volumeIssue, pages].filter(Boolean).join(', ')
  const segments: ApaSegment[] = [
    { kind: 'text', text: `${reference.authors.trim()} (${reference.year.trim()}). ` },
    { kind: 'title', text: title, href: referenceHref(reference) },
  ]
  if (!CLOSING_PUNCTUATION.test(title)) segments.push({ kind: 'text', text: '.' })
  if (container) {
    const kind = ITALIC_CONTAINER.includes(reference.type) ? 'container' : 'text'
    segments.push({ kind: 'text', text: ' ' })
    segments.push({ kind, text: container })
    const tail = details ? `, ${withPeriod(details)}` : withPeriod(container).slice(container.length)
    if (tail) segments.push({ kind: 'text', text: tail })
  }
  else if (details) {
    segments.push({ kind: 'text', text: ` ${withPeriod(details)}` })
  }
  return segments
}

export function apaText(reference: StrapiReference): string {
  return formatApa(reference).map(segment => segment.text).join('')
}

export function latestAccessedAt(references: StrapiReference[] | null | undefined): string | null {
  const dates = (references ?? []).map(reference => reference.accessedAt).filter((date): date is string => Boolean(date))
  return dates.length ? dates.reduce((latest, date) => (date > latest ? date : latest)) : null
}

export function formatAccessDate(date: string): string {
  const parts = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).formatToParts(new Date(date))
  const part = (type: Intl.DateTimeFormatPartTypes): string => parts.find(p => p.type === type)?.value ?? ''
  return `${part('day')}.${part('month')}.${part('year')}`
}
