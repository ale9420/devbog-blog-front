import { test, expect } from '@playwright/test'

test('marks the current section in the shared header', async ({ page }) => {
  for (const [path, name] of [['/', 'Home'], ['/blog', 'Blog'], ['/about', 'About']] as const) {
    await page.goto(path)
    const nav = page.getByRole('navigation', { name: 'Main' })
    await expect(nav.getByRole('link', { name })).toHaveAttribute('aria-current', 'page')
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(1)
  }
})

test('switches language from the header', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'networkidle' })
  const group = page.getByRole('group', { name: 'Language' })
  await group.getByRole('button', { name: 'Español' }).click()
  await expect(page).toHaveURL(/\/es\/blog$/)
  await expect(page.getByRole('group', { name: 'Idioma' }).getByRole('button', { name: 'Español' })).toHaveAttribute('aria-pressed', 'true')
})

test('shows the reading strip with breadcrumbs and progress on an article', async ({ page }) => {
  await page.goto('/blog/understanding-vue-composables', { waitUntil: 'networkidle' })
  const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' })
  await expect(crumbs).toContainText('Software development')
  await expect(page.getByText(/^Read \d+ %$/)).toBeVisible()
  await expect(page.locator('.bd-progress')).toBeAttached()
  await expect(page.getByRole('button', { name: /^Search/ }).and(page.locator('.bd-chip'))).toHaveCount(0)
})

test('keeps the header on screen while scrolling', async ({ page }) => {
  await page.goto('/blog/understanding-vue-composables', { waitUntil: 'networkidle' })
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await expect(page.locator('.bd-header')).toBeInViewport()
  await expect(page.getByText('Read 100 %')).toBeVisible()
})

test('uses the compact bar on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.getByRole('navigation', { name: 'Main' })).toBeHidden()
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByRole('group', { name: 'Color theme' })).toBeVisible()
})
