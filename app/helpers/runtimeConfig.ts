export const REQUIRED_RUNTIME_SETTINGS = {
  strapiApiToken: 'NUXT_STRAPI_API_TOKEN',
  smtpHost: 'NUXT_SMTP_HOST',
  smtpUser: 'NUXT_SMTP_USER',
  smtpPass: 'NUXT_SMTP_PASS',
  newsletterFrom: 'NUXT_NEWSLETTER_FROM',
} as const

export type RequiredRuntimeSetting = keyof typeof REQUIRED_RUNTIME_SETTINGS

export function missingRuntimeSettings(config: Partial<Record<RequiredRuntimeSetting, unknown>>): string[] {
  return (Object.keys(REQUIRED_RUNTIME_SETTINGS) as RequiredRuntimeSetting[])
    .filter(key => typeof config[key] !== 'string' || !(config[key] as string).trim())
    .map(key => REQUIRED_RUNTIME_SETTINGS[key])
}
