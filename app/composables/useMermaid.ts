import type { Ref } from 'vue'
import type { Mermaid } from 'mermaid'
import type { MermaidTokens } from '~/helpers/mermaid'
import { MERMAID_CSS, MERMAID_TOKENS, mermaidThemeVariables, mermaidTitle } from '~/helpers/mermaid'

const BLOCK_SELECTOR = '.bd-mermaid'
const DIAGRAM_CLASS = 'bd-mermaid-diagram'
const READY_CLASS = 'bd-mermaid-ready'

let sequence = 0

export function useMermaid(target: Ref<HTMLElement | null>): void {
  const { t } = useI18n()
  const { theme, isDark } = useTheme()

  let run = 0

  function readTokens(): MermaidTokens {
    const style = getComputedStyle(document.documentElement)
    return Object.fromEntries(
      MERMAID_TOKENS.map(name => [name, style.getPropertyValue(`--${name}`).trim()]),
    ) as MermaidTokens
  }

  function showSource(block: HTMLElement): void {
    block.classList.remove(READY_CLASS)
    block.querySelector(`.${DIAGRAM_CLASS}`)?.remove()
  }

  async function renderBlock(mermaid: Mermaid, block: HTMLElement, current: number): Promise<void> {
    const source = block.querySelector('code')?.textContent ?? ''
    try {
      const { svg } = await mermaid.render(`bd-mermaid-${++sequence}`, source)
      if (current !== run) return
      let diagram = block.querySelector<HTMLElement>(`.${DIAGRAM_CLASS}`)
      if (!diagram) {
        diagram = document.createElement('div')
        diagram.className = DIAGRAM_CLASS
        diagram.setAttribute('role', 'img')
        diagram.tabIndex = 0
        block.prepend(diagram)
      }
      diagram.setAttribute('aria-label', mermaidTitle(source) ?? t('bd.mermaid.label'))
      diagram.innerHTML = svg
      block.classList.add(READY_CLASS)
    }
    catch {
      if (current === run) showSource(block)
    }
  }

  async function renderAll(): Promise<void> {
    const blocks = Array.from(target.value?.querySelectorAll<HTMLElement>(BLOCK_SELECTOR) ?? [])
    if (!blocks.length) return

    const current = ++run
    const { default: mermaid } = await import('mermaid')
    if (current !== run) return

    const tokens = readTokens()
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      suppressErrorRendering: true,
      theme: 'base',
      flowchart: { useMaxWidth: false },
      sequence: { useMaxWidth: false },
      fontFamily: tokens['font-mono'],
      themeVariables: mermaidThemeVariables(tokens, isDark.value),
      themeCSS: MERMAID_CSS,
    })

    for (const block of blocks) {
      await renderBlock(mermaid, block, current)
    }
  }

  watch(theme, () => {
    renderAll()
  })

  onMounted(() => {
    renderAll()
  })
}
