const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useFocusTrap(
  container: Ref<HTMLElement | undefined>,
  active: Ref<boolean>,
) {
  let previouslyFocused: HTMLElement | null = null
  let isTrapActive = false

  function getFocusableElements(): HTMLElement[] {
    if (!container.value) return []
    return Array.from(
      container.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((el) => el.offsetParent !== null || el === document.activeElement)
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key !== "Tab" || !container.value) return

    const focusable = getFocusableElements()
    if (focusable.length === 0) return

    const first = focusable[0]!
    const last = focusable[focusable.length - 1]!
    const current = document.activeElement as HTMLElement | null

    if (!current || !container.value.contains(current)) {
      e.preventDefault()
      first.focus()
      return
    }

    if (e.shiftKey && current === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && current === last) {
      e.preventDefault()
      first.focus()
    }
  }

  watch(active, (isActive) => {
    if (isActive && !isTrapActive) {
      previouslyFocused = document.activeElement as HTMLElement | null
      document.addEventListener("keydown", handleKeydown)
      isTrapActive = true
    } else if (!isActive && isTrapActive) {
      document.removeEventListener("keydown", handleKeydown)
      isTrapActive = false
      previouslyFocused?.focus?.()
      previouslyFocused = null
    }
  })

  onUnmounted(() => {
    if (isTrapActive) {
      document.removeEventListener("keydown", handleKeydown)
    }
  })
}
