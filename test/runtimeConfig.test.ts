import { describe, expect, it } from 'vitest'
import { missingRuntimeSettings } from '../app/helpers/runtimeConfig'

const complete = {
  strapiApiToken: 'token',
  smtpHost: 'smtp-relay.brevo.com',
  smtpUser: 'login',
  smtpPass: 'key',
  newsletterFrom: 'BogDev <no-reply@bogdev.com.co>',
}

describe('missingRuntimeSettings', () => {
  it('returns nothing when every required value is set', () => {
    expect(missingRuntimeSettings(complete)).toEqual([])
  })

  it('names the NUXT_* variable of each empty or missing value', () => {
    expect(missingRuntimeSettings({ ...complete, strapiApiToken: '', smtpPass: '  ', newsletterFrom: undefined })).toEqual([
      'NUXT_STRAPI_API_TOKEN',
      'NUXT_SMTP_PASS',
      'NUXT_NEWSLETTER_FROM',
    ])
  })
})
