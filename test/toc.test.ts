import { describe, it, expect } from 'vitest'
import { extractHeadings } from '../app/helpers/toc'
import type { StrapiBlock } from '../app/interfaces/strapi-blocks'

describe('extractHeadings', () => {
  it('collects h2 and h3 from rich text blocks in order', () => {
    const blocks = [
      { id: 1, __component: 'shared.rich-text', body: '## Qué es RAG\n\nTexto\n\n### 1. Retrieval\n\n#### Detalle' },
      { id: 2, __component: 'shared.quote', title: 'Cita', body: '## No cuenta' },
      { id: 3, __component: 'shared.rich-text', body: '## En resumen' },
    ] as StrapiBlock[]
    expect(extractHeadings(blocks)).toEqual([
      { id: 'que-es-rag', text: 'Qué es RAG', level: 2 },
      { id: '1-retrieval', text: '1. Retrieval', level: 3 },
      { id: 'en-resumen', text: 'En resumen', level: 2 },
    ])
  })

  it('returns nothing without blocks', () => {
    expect(extractHeadings(undefined)).toEqual([])
  })
})
