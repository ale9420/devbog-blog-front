import { describe, it, expect } from 'vitest'
import { slugify } from '~/helpers/slugify'

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('strips punctuation', () => {
    expect(slugify('AI, Linux & Vue!')).toBe('ai-linux-vue')
  })

  it('collapses repeated dashes and trims edges', () => {
    expect(slugify('  a -- b  ')).toBe('a-b')
  })

  it('produces ids matching markdown heading anchors', () => {
    expect(slugify('My personal lab: AI without the cloud')).toBe('my-personal-lab-ai-without-the-cloud')
  })
})
