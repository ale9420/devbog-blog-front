export interface StrapiMediaFile {
  url: string
  alternativeText?: string
  caption?: string
  width?: number
  height?: number
}

export interface StrapiRichText {
  id: number
  __component: 'shared.rich-text'
  body: string
}

export interface StrapiQuote {
  id: number
  __component: 'shared.quote'
  body: string
  title?: string
}

export interface StrapiMedia {
  id: number
  __component: 'shared.media'
  file: StrapiMediaFile
}

export interface StrapiSlider {
  id: number
  __component: 'shared.slider'
  files: StrapiMediaFile[]
}

export type StrapiBlock = StrapiRichText | StrapiQuote | StrapiMedia | StrapiSlider
