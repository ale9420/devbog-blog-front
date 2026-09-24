import type { AsyncDataRequestStatus } from '#app'

export function useSettledData<T>(data: Ref<T>, status: Ref<AsyncDataRequestStatus>): ComputedRef<T> {
  const last = shallowRef<T>(data.value)
  watch([data, status], ([value, state]) => {
    if (state !== 'pending') last.value = value
  })
  return computed<T>(() => (status.value === 'pending' ? last.value : data.value))
}
