export default defineNuxtRouteMiddleware(async () => {
  const { ensure, isEditor } = useAuth()
  await ensure()
  if (isEditor.value) return
  return abortNavigation(createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true }))
})
