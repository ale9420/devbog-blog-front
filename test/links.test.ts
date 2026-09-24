import { describe, it, expect } from 'vitest'
import { resolveLink } from '../app/helpers/links'

const localize = (path: string): string => `/es${path}`

describe('resolveLink', () => {
  it('keeps external links as they are', () => {
    expect(resolveLink('https://github.com/ale9420', localize)).toEqual({ href: 'https://github.com/ale9420', external: true })
    expect(resolveLink('mailto:hola@bogdev.com.co', localize).external).toBe(true)
  })

  it('localizes site paths and leaves in-page anchors alone', () => {
    expect(resolveLink('/blog', localize)).toEqual({ href: '/es/blog', external: false })
    expect(resolveLink(' #projects ', localize)).toEqual({ href: '#projects', external: false })
  })
})
