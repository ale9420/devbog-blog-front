interface UseAccountPage {
  errorMessage: (err: unknown) => string
}

export function useAccountPage(title: MaybeRefOrGetter<string>): UseAccountPage {
  const errorMessage = useAuthErrorMessage()

  useSeoMeta({
    title: () => `${toValue(title)} - BogDev`,
    robots: 'noindex, nofollow',
  })

  return { errorMessage }
}
