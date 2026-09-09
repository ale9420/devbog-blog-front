import { test, expect } from '@playwright/test'

test('lists posts', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { name: 'Understanding Vue Composables', level: 3 })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Linux Server Hardening Guide', level: 3 })).toBeVisible()
})

test('filters by category from the sidebar', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'networkidle' })
  const categoriesSection = page.locator('aside').filter({ has: page.getByRole('heading', { name: 'Categories' }) })
  await categoriesSection.getByRole('button', { name: 'Vue 1' }).click()
  await expect(page).toHaveURL(/category=Vue/)
  await expect(page.getByRole('heading', { name: 'Linux Server Hardening Guide', level: 3 })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Understanding Vue Composables', level: 3 })).toBeVisible()
})
