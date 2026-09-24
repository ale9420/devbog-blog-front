import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  test: {
    projects: [
      {
        resolve: {
          alias: {
            '~': fileURLToPath(new URL('./app', import.meta.url)),
          },
        },
        test: {
          name: 'unit',
          include: ['test/*.test.ts'],
          environment: 'node',
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/**/*.test.ts'],
          environment: 'nuxt',
          environmentOptions: {
            nuxt: {
              domEnvironment: 'happy-dom',
            },
          },
        },
      }),
    ],
  },
})
