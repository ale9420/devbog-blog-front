export default defineEventHandler((event) => {
  const category = feedCategory(getRouterParam(event, 'file'))
  return sendFeed(event, { locale: 'en', category })
})
