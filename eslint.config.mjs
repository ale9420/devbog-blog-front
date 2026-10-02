import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    files: ['**/*.ts', '**/*.vue', '**/*.js', '**/*.mjs'],
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    ignores: ['test/**', 'docs/**', 'vitest.config.ts'],
  },
)
