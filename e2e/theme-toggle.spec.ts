import { test, expect } from '@playwright/test'

test('toggles dark mode and persists across reload', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.locator('html')).not.toHaveClass(/dark/)
  await page.getByRole('button', { name: 'Toggle theme' }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  const colorMode = await page.evaluate(() => localStorage.getItem('devbog-color-mode'))
  expect(colorMode).toBe('dark')
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
})
