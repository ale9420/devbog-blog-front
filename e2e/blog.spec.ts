import { test, expect } from '@playwright/test'

test('lists posts', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { name: 'Blog', level: 1 })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Understanding Vue Composables', level: 3 })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Linux Server Hardening Guide', level: 3 })).toBeVisible()
  await expect(page.getByText('▲')).toHaveCount(0)
})

test('filters by category from the chips', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'networkidle' })
  const categories = page.getByRole('group', { name: 'Filter by category' })
  await categories.getByRole('button', { name: /Software/ }).click()
  await expect(page).toHaveURL(/category=software/)
  await expect(categories.getByRole('button', { name: /Software/ })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('heading', { name: 'Linux Server Hardening Guide', level: 3 })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Understanding Vue Composables', level: 3 })).toBeVisible()
  await page.getByRole('button', { name: 'Remove filter Software' }).click()
  await expect(page).toHaveURL(/\/blog$/)
  await expect(page.getByRole('heading', { name: 'Linux Server Hardening Guide', level: 3 })).toBeVisible()
})

test('searches titles from three letters and keeps the term in the URL', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'networkidle' })
  const search = page.getByRole('searchbox', { name: 'Search articles' })
  await search.fill('vu')
  await page.waitForTimeout(500)
  await expect(page).toHaveURL(/\/blog$/)
  await search.fill('vue')
  await expect(page).toHaveURL(/search=vue/)
  await expect(page.getByRole('status').filter({ hasText: '01 result' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Linux Server Hardening Guide', level: 3 })).toHaveCount(0)
  await page.getByRole('button', { name: 'Clear filters' }).first().click()
  await expect(search).toHaveValue('')
  await expect(page.getByRole('heading', { name: 'Linux Server Hardening Guide', level: 3 })).toBeVisible()
})

test('shows the empty state and clears the filters', async ({ page }) => {
  await page.goto('/blog?category=privacidad', { waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { name: 'No articles found', level: 2 })).toBeVisible()
  await page.locator('.bd-blog-empty').getByRole('button', { name: 'Clear filters' }).click()
  await expect(page).toHaveURL(/\/blog$/)
  await expect(page.getByRole('heading', { name: 'Understanding Vue Composables', level: 3 })).toBeVisible()
})

test('paginates inside a labelled nav', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'networkidle' })
  const pagination = page.getByRole('navigation', { name: 'Pagination' })
  await expect(pagination.getByRole('link', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page')
  await expect(pagination).toContainText('Page 01 of 01')
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('resolves the filters from the URL on the server', async ({ page }) => {
    await page.goto('/blog?category=linux&search=linux')
    await expect(page.getByRole('heading', { name: 'Linux Server Hardening Guide', level: 3 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Understanding Vue Composables', level: 3 })).toHaveCount(0)
    await expect(page.getByRole('group', { name: 'Filter by category' }).getByRole('button', { name: /Linux/ })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('searchbox', { name: 'Search articles' })).toHaveValue('linux')
  })
})
