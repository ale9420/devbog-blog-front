import type { Ref } from 'vue'

export function useCodeBlockCopy(target: Ref<HTMLElement | null>): void {
  const { t } = useI18n()

  function setLabel(button: HTMLButtonElement, copied: boolean): void {
    button.textContent = copied ? t('bd.code.copied') : t('bd.code.copy')
    button.setAttribute('aria-label', copied ? t('bd.code.copied') : t('bd.code.copyAria'))
  }

  function prepare(): void {
    const canCopy = !!navigator.clipboard
    target.value?.querySelectorAll<HTMLButtonElement>('[data-bd-copy]').forEach((button) => {
      setLabel(button, false)
      button.setAttribute('aria-live', 'polite')
      button.hidden = !canCopy
    })
  }

  async function onClick(event: MouseEvent): Promise<void> {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-bd-copy]')
    const code = button?.closest('.bd-code')?.querySelector('code')
    if (!button || !code) return

    const clone = code.cloneNode(true) as HTMLElement
    clone.querySelectorAll('.bd-prompt').forEach((prompt) => prompt.remove())

    try {
      await navigator.clipboard.writeText(clone.textContent ?? '')
      setLabel(button, true)
      setTimeout(() => setLabel(button, false), 1600)
    } catch {
      setLabel(button, false)
    }
  }

  useEventListener(target, 'click', onClick)
  onMounted(prepare)
}
