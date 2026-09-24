import { describe, it, expect } from 'vitest'
import { followUrl, normalizeInstance } from '../app/helpers/fediverse'

describe('normalizeInstance', () => {
  it('accepts a plain domain', () => {
    expect(normalizeInstance('mastodon.social')).toEqual({ domain: 'mastodon.social' })
  })

  it('normalizes full URLs, handles, case and spaces around', () => {
    expect(normalizeInstance('  https://Mastodon.Social/@ana/123  ')).toEqual({ domain: 'mastodon.social' })
    expect(normalizeInstance('@ana@fosstodon.org')).toEqual({ domain: 'fosstodon.org' })
    expect(normalizeInstance('ana@hachyderm.io')).toEqual({ domain: 'hachyderm.io' })
    expect(normalizeInstance('mastodon.social/')).toEqual({ domain: 'mastodon.social' })
    expect(normalizeInstance('mastodon.social.')).toEqual({ domain: 'mastodon.social' })
    expect(normalizeInstance('social.example.com:8443/about')).toEqual({ domain: 'social.example.com' })
  })

  it('converts internationalized domains to punycode', () => {
    expect(normalizeInstance('mastodón.example')).toEqual({ domain: 'xn--mastodn-q0a.example' })
  })

  it('reports empty and invalid input', () => {
    expect(normalizeInstance('   ')).toEqual({ error: 'empty' })
    expect(normalizeInstance('mastodon')).toEqual({ error: 'invalid' })
    expect(normalizeInstance('mastodon social')).toEqual({ error: 'invalid' })
    expect(normalizeInstance('@ana')).toEqual({ error: 'invalid' })
    expect(normalizeInstance('-bad-.social')).toEqual({ error: 'invalid' })
    expect(normalizeInstance('192.168.0.1')).toEqual({ error: 'invalid' })
    expect(normalizeInstance('a@b@c.social')).toEqual({ error: 'invalid' })
  })
})

describe('followUrl', () => {
  it('opens the remote follow flow of the instance', () => {
    expect(followUrl('mastodon.social', 'https://api.bogdev.com.co/fediverse/user/devbog')).toBe(
      'https://mastodon.social/authorize_interaction?uri=https%3A%2F%2Fapi.bogdev.com.co%2Ffediverse%2Fuser%2Fdevbog',
    )
  })
})
