export interface StrapiMetaSocial {
  id: number
  socialNetwork: 'Facebook' | 'Twitter'
  title: string
  description: string
  image?: {
    data: {
      attributes: {
        url: string
        alternativeText?: string
      }
    }
  }
}

export interface StrapiSEO {
  id: number
  metaTitle: string
  metaDescription: string
  metaImage?: {
    data: {
      attributes: {
        url: string
        alternativeText?: string
        width?: number
        height?: number
      }
    }
  }
  metaSocial?: StrapiMetaSocial[]
  keywords?: string
  metaRobots?: string
  structuredData?: Record<string, unknown>
  metaViewport?: string
  canonicalURL?: string
}
