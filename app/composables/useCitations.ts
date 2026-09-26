import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { BlockCitations, CitationIndex, StrapiBlock } from '~/interfaces'
import { citationBlockKey } from '~/helpers/citations'

const citationIndexKey: InjectionKey<Readonly<Ref<CitationIndex>>> = Symbol('citationIndex')

export function provideCitations(index: Readonly<Ref<CitationIndex>>): void {
  provide(citationIndexKey, index)
}

export function useBlockCitations(block: () => StrapiBlock): ComputedRef<BlockCitations | undefined> {
  const index = inject(citationIndexKey, null)
  return computed(() => {
    if (!index) return undefined
    return { numbers: index.value.numbers, anchored: index.value.anchors[citationBlockKey(block())] ?? [] }
  })
}
