import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: 4,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'html',
  use: { baseURL: 'http://127.0.0.1:3210', colorScheme: 'light' },
  webServer: [
    {
      command: 'node e2e/mock-strapi.mjs',
      port: 4310,
      reuseExistingServer: !process.env.CI,
      timeout: 15_000,
    },
    {
      command: 'HOST=127.0.0.1 STRAPI_URL=http://127.0.0.1:4310 NUXT_PUBLIC_STRAPI_URL=http://127.0.0.1:4310 PORT=3210 npm run dev',
      port: 3210,
      reuseExistingServer: !process.env.CI,
      timeout: 240_000,
    },
  ],
})
