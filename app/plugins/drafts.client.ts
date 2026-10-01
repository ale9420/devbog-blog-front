export default defineNuxtPlugin(() => {
  const { isEditor } = useAuth()
  const { count, refresh } = useDraftCount()

  onNuxtReady(() => {
    watch(isEditor, (editor) => {
      if (editor) refresh()
      else count.value = null
    }, { immediate: true })
  })
})
