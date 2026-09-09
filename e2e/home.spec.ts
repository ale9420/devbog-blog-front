import { test, expect } from '@playwright/test'

test('renders the visually hidden h1 and the featured post', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1.sr-only')).toBeAttached()
  await expect(page.getByRole('heading', { name: 'Understanding Vue Composables', level: 2 })).toBeVisible()
  await expect(page.getByRole('link').filter({ has: page.getByRole('heading', { name: 'Linux Server Hardening Guide', level: 3 }) })).toBeVisible()
})

test('emits WebSite JSON-LD structured data', async ({ page }) => {
  await page.goto('/')
  const script = page.locator('script[type="application/ld+json"]').first()
  const json = await script.textContent()
  const data = JSON.parse(json || '{}')
  const types = data['@graph']?.map((node: { '@type': string }) => node['@type']) || []
  expect(types).toContain('WebSite')
  expect(types).toContain('Organization')
})
