import type { RawStrapiArticle, StrapiPost } from '../interfaces/strapi-post'
import { publishedTranslations } from './translations'

export function toStrapiPost(article: RawStrapiArticle): StrapiPost {
  return {
    id: article.id,
    documentId: article.documentId,
    title: article.title,
    slug: article.slug,
    description: article.description,
    content: article.content,
    publishedAt: article.publishedAt,
    readTime: article.readTime,
    tags: article.tags,
    cover: article.cover,
    coverCredit: article.coverCredit,
    category: article.category,
    author: article.author,
    seo: article.seo ?? undefined,
    blocks: article.blocks ?? [],
    references: article.references ?? [],
    translations: publishedTranslations(article.localizations),
  }
}
