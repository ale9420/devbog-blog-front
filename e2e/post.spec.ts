import { test, expect } from '@playwright/test'

test('renders the article with content and TOC', async ({ page }) => {
  await page.goto('/blog/understanding-vue-composables')
  await expect(page.locator('h1')).toHaveText('Understanding Vue Composables')
  await expect(page.getByText('Alejandro Ramirez')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Getting Started' })).toBeVisible()
  await expect(page.locator('a[href="#getting-started"]')).toBeVisible()
})

test('server-renders SEO meta with the article cover as share image', async ({ request }) => {
  const html = await (await request.get('/blog/understanding-vue-composables')).text()
  expect(html).toContain('<title>Vue Composables</title>')
  expect(html).toMatch(/<meta property="og:image" content="[^"]*\/uploads\/cover-vue\.png">/)
  expect(html).toMatch(/<meta name="twitter:image" content="[^"]*\/uploads\/cover-vue\.png">/)
  expect(html).not.toContain('/og-image.png')
})
