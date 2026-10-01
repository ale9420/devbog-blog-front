import { SESSION_COOKIE, SESSION_MAX_AGE } from './auth'
import { READ_STORAGE_KEY } from './readArticles'
import { THEME_STORAGE_KEY } from './theme'

export const PRIVACY_NOTICE_STORAGE_KEY = 'bd-privacy-notice'

export interface SiteCookie {
  name: string
  maxAgeDays: number
}

type NoticeStorage = Pick<Storage, 'getItem' | 'setItem'>

export const SITE_COOKIES: SiteCookie[] = [
  { name: SESSION_COOKIE, maxAgeDays: SESSION_MAX_AGE / (60 * 60 * 24) },
]

export const BROWSER_STORAGE_KEYS: string[] = [THEME_STORAGE_KEY, PRIVACY_NOTICE_STORAGE_KEY, READ_STORAGE_KEY]

function browserStorage(): NoticeStorage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null
  }
}

export function isPrivacyNoticeDismissed(storage: NoticeStorage | null = browserStorage()): boolean {
  try {
    return storage?.getItem(PRIVACY_NOTICE_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function dismissPrivacyNotice(storage: NoticeStorage | null = browserStorage()): boolean {
  if (!storage) return false
  try {
    storage.setItem(PRIVACY_NOTICE_STORAGE_KEY, '1')
    return true
  } catch {
    return false
  }
}
