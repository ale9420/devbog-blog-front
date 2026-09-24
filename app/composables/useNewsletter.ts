import type { NewsletterResult } from '~/interfaces'
import type { SubscribeResponse } from '~/interfaces/newsletter'
import { asApiError } from '~/helpers/apiError'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useNewsletter(): { subscribe: (email: string) => Promise<NewsletterResult> } {
  const { t, locale } = useI18n()

  async function subscribe(email: string): Promise<NewsletterResult> {
    const value = email.trim()
    if (!EMAIL_PATTERN.test(value)) {
      return { status: 'error', message: t('bd.newsletter.invalid'), invalid: true }
    }

    try {
      await $fetch<SubscribeResponse>('/api/newsletter/subscribe', {
        method: 'POST',
        body: { email: value, locale: locale.value },
      })
      return { status: 'success', message: t('bd.newsletter.success'), invalid: false }
    } catch (err) {
      const e = asApiError(err)
      const statusCode = e.response?.status || e.statusCode
      if (statusCode === 409) {
        return { status: 'success', message: t('bd.newsletter.already'), invalid: false }
      }
      if (statusCode === 400) {
        return { status: 'error', message: t('bd.newsletter.invalid'), invalid: true }
      }
      return { status: 'error', message: t('bd.newsletter.error'), invalid: false }
    }
  }

  return { subscribe }
}
