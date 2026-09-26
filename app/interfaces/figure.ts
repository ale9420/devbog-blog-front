export type CreditRole = 'author' | 'source' | 'license' | 'modifications'

export interface LicenseInfo {
  labelKey: string
  href?: string
}

export interface CreditPart {
  role: CreditRole
  text?: string
  labelKey?: string
  href?: string
}
