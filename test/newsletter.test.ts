import { describe, it, expect } from 'vitest'
import { blogUrl, confirmUrl, isNewsletterToken, newsletterLanguage, unsubscribeHeaders, unsubscribeUrl } from '../app/helpers/newsletter'

const SITE = 'https://bogdev.com.co'

describe('newsletterLanguage', () => {
  it('keeps Spanish and falls back to English', () => {
    expect(newsletterLanguage('es')).toBe('es')
    expect(newsletterLanguage('en')).toBe('en')
    expect(newsletterLanguage('fr')).toBe('en')
    expect(newsletterLanguage(undefined)).toBe('en')
  })
})

describe('isNewsletterToken', () => {
  it('accepts UUIDs and base64url tokens only', () => {
    expect(isNewsletterToken('3f2504e0-4f89-41d3-9a0c-0305e82c3301')).toBe(true)
    expect(isNewsletterToken('Zm9vYmFyLWJhei1xdXV4LTEyMzQ1Njc4OTAtX0FCQ0RFRg')).toBe(true)
    expect(isNewsletterToken('short')).toBe(false)
    expect(isNewsletterToken('has spaces in it, sadly')).toBe(false)
    expect(isNewsletterToken('a'.repeat(129))).toBe(false)
    expect(isNewsletterToken(['3f2504e0-4f89-41d3-9a0c-0305e82c3301'])).toBe(false)
  })
})

describe('newsletter links', () => {
  it('builds absolute links in the subscriber language', () => {
    expect(confirmUrl(SITE, 'es', 'tok-1234567890abcdef')).toBe('https://bogdev.com.co/es/confirm?token=tok-1234567890abcdef')
    expect(confirmUrl(`${SITE}/`, 'en', 'tok-1234567890abcdef')).toBe('https://bogdev.com.co/confirm?token=tok-1234567890abcdef')
    expect(blogUrl(SITE, 'es')).toBe('https://bogdev.com.co/es/blog')
    expect(blogUrl(SITE, 'en')).toBe('https://bogdev.com.co/blog')
    expect(unsubscribeUrl(SITE, 'es', 'tok_1234567890abcdef')).toBe('https://bogdev.com.co/es/newsletter/unsubscribe?token=tok_1234567890abcdef')
  })

  it('adds the RFC 8058 one-click unsubscribe headers', () => {
    expect(unsubscribeHeaders(SITE, 'tok_1234567890abcdef')).toEqual({
      'List-Unsubscribe': '<https://bogdev.com.co/api/newsletter/unsubscribe?token=tok_1234567890abcdef>',
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    })
  })
})
