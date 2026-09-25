import type { Ref } from 'vue'
import type { InstanceError } from '~/interfaces'
import { followUrl, normalizeInstance } from '~/helpers/fediverse'

interface FediverseInstance {
  instance: Ref<string>
  error: Ref<InstanceError | null>
  preview: Readonly<Ref<string | undefined>>
  open: () => void
}

export function useFediverseInstance(target: () => string): FediverseInstance {
  const instance = ref('')
  const error = ref<InstanceError | null>(null)

  const preview = computed<string | undefined>(() => normalizeInstance(instance.value).domain)

  function open(): void {
    const result = normalizeInstance(instance.value)
    error.value = result.error ?? null
    if (!result.domain) return
    instance.value = result.domain
    window.open(followUrl(result.domain, target()), '_blank', 'noopener,noreferrer')
  }

  watch(instance, () => {
    error.value = null
  })

  return { instance, error, preview, open }
}
