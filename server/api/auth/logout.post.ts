export default defineEventHandler((event): { ok: true } => {
  preventCaching(event)
  assertSameOrigin(event)
  clearSessionCookie(event)
  return { ok: true }
})
