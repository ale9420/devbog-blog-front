import { describe, expect, it } from 'vitest'
import type { TagCount } from '~/interfaces/strapi-post'
import { popularTags, sortTags, tagLabel } from '~/helpers/tags'

const tags: TagCount[] = [
  { slug: 'vue', name: 'Vue', count: 3 },
  { slug: 'linux', name: 'Linux', count: 2 },
  { slug: 'docker', name: 'Docker', count: 1 },
]

describe('sortTags', () => {
  it('puts the most used tags first and breaks ties by name', () => {
    const sorted = sortTags([
      { slug: 'vue', name: 'Vue', count: 1 },
      { slug: 'ai', name: 'AI', count: 1 },
      { slug: 'linux', name: 'Linux', count: 4 },
    ])
    expect(sorted.map(tag => tag.slug)).toEqual(['linux', 'ai', 'vue'])
  })
})

describe('popularTags', () => {
  it('keeps the first tags up to the limit', () => {
    expect(popularTags(tags, 2).map(tag => tag.slug)).toEqual(['vue', 'linux'])
  })

  it('keeps the active tag visible even when it is outside the limit', () => {
    expect(popularTags(tags, 2, 'docker').map(tag => tag.slug)).toEqual(['vue', 'linux', 'docker'])
    expect(popularTags(tags, 2, 'vue').map(tag => tag.slug)).toEqual(['vue', 'linux'])
  })

  it('ignores an active tag that does not exist', () => {
    expect(popularTags(tags, 2, 'cobol').map(tag => tag.slug)).toEqual(['vue', 'linux'])
  })
})

describe('tagLabel', () => {
  it('shows the tag name and falls back to the slug', () => {
    expect(tagLabel(tags, 'linux')).toBe('Linux')
    expect(tagLabel(tags, 'cobol')).toBe('cobol')
  })
})
