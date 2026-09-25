export default defineEventHandler((event) => {
  const locale = getQuery(event).lang === 'es' ? 'es' : 'en'
  return sendFeed(event, { locale })
})
