import { test, expect } from '@playwright/test'

test('opens from the header button, shows results and closes on Escape', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Search' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('combobox', { name: 'Search posts...' }).fill('composables')
  await expect(page.locator('#search-results')).toBeVisible()
  await expect(page.locator('#search-results')).toContainText('Understanding Vue Composables')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
})

test('toggles with Cmd/Ctrl+K', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.keyboard.press('ControlOrMeta+k')
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('ControlOrMeta+k')
  await expect(page.getByRole('dialog')).toBeHidden()
})
