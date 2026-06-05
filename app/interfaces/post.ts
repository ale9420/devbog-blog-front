export interface Post {
  id: number
  title: string
  slug: string
  description: string
  content: string
  date: string
  readTime?: number
  tags: string[]
  cover?: string
}
