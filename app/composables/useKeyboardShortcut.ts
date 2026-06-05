/**
 * Registers a global Cmd/Ctrl + key shortcut inside `onMounted` and
 * automatically cleans up the listener on `onUnmounted`.
 *
 * @example
 * ```ts
 * useKeyboardShortcut('k', () => { isSearchOpen.value = true })
 * ```
 */
export function useKeyboardShortcut(key: string, handler: () => void) {
  onMounted(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === key) {
        e.preventDefault()
        handler()
      }
    }
    window.addEventListener('keydown', onKeydown)
    onUnmounted(() => window.removeEventListener('keydown', onKeydown))
  })
}
