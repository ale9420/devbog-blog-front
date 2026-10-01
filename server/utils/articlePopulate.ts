export const ARTICLE_POPULATE = {
  cover: { populate: '*' },
  coverCredit: true,
  category: { populate: '*' },
  author: { populate: '*' },
  seo: { populate: '*' },
  tags: { fields: ['name', 'slug'] },
  blocks: {
    on: {
      'shared.rich-text': { populate: '*' },
      'shared.quote': { populate: '*' },
      'shared.media': { populate: { file: true, credit: true } },
      'shared.slider': { populate: { items: { populate: { file: true, credit: true } }, files: true } },
    },
  },
  references: true,
  localizations: { fields: ['slug', 'locale', 'publishedAt'] },
}
