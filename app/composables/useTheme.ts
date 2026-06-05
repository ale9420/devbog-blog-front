export function useTheme() {
  const colorMode = useColorMode()

  const isDark = computed(() => {
    return (
      colorMode.value === "dark" ||
      (colorMode.value === "system" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    )
  })

  function toggle() {
    colorMode.preference = isDark.value ? "light" : "dark"
  }

  return {
    preference: computed(() => colorMode.preference),
    value: computed(() => colorMode.value),
    isDark,
    toggle,
  }
}
