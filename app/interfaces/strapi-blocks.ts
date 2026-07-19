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

export interface StrapiHero {
  id: number
  __component: 'shared.hero'
  title: string
  subtitle?: string
  avatar?: StrapiMediaFile
}

export interface StrapiTopicCard {
  id: number
  __component: 'shared.topic-card'
  title: string
  description?: string
  icon: 'cpu-chip' | 'code-bracket' | 'command-line' | 'cloud' | 'book-open' | 'globe' | 'shield-check' | 'rocket'
}

export interface StrapiSocialLinks {
  id: number
  __component: 'shared.social-links'
  title?: string
  description?: string
  linkedin?: string
  github?: string
  codeberg?: string
  mastodon?: string
  twitter?: string
}

export interface StrapiTechItem {
  id: number
  name: string
}

export interface StrapiTechStack {
  id: number
  __component: 'shared.tech-stack'
  title?: string
  technologies: StrapiTechItem[]
}

export type StrapiBlock =
  | StrapiRichText
  | StrapiQuote
  | StrapiMedia
  | StrapiSlider
  | StrapiHero
  | StrapiTopicCard
  | StrapiSocialLinks
  | StrapiTechStack
