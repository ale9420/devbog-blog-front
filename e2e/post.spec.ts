import { test, expect } from '@playwright/test'

test('renders the article with content and TOC', async ({ page }) => {
  await page.goto('/blog/understanding-vue-composables')
  await expect(page.locator('h1')).toHaveText('Understanding Vue Composables')
  await expect(page.locator('.bd-article-author-name')).toHaveText('Alejandro Ramirez')
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

test('renders markdown code as a design system code block that copies without prompts', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/blog/understanding-vue-composables', { waitUntil: 'networkidle' })
  const block = page.locator('figure.bd-code')
  await expect(block.locator('.bd-code-lang')).toHaveText('bash')
  await expect(block.locator('.bd-prompt')).toHaveCount(2)
  const copy = block.getByRole('button', { name: 'Copy code' })
  await expect(copy).toHaveText('Copy')
  await copy.click()
  await expect(block.getByRole('button', { name: 'Copied ✓' })).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('npm create nuxt@latest\nnpm run dev')
})

test('emits BlogPosting JSON-LD', async ({ request }) => {
  const html = await (await request.get('/blog/understanding-vue-composables')).text()
  expect(html).toContain('"@type":"BlogPosting"')
})

test('follows the reading with the table of contents', async ({ page }) => {
  await page.goto('/blog/understanding-vue-composables', { waitUntil: 'networkidle' })
  const toc = page.getByRole('navigation', { name: 'In this article' })
  await expect(toc.getByRole('link', { name: 'Getting Started' })).toHaveAttribute('aria-current', 'true')
  await toc.getByRole('link', { name: 'Naming' }).focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#naming$/)
  await expect(toc.getByRole('link', { name: 'Naming' })).toHaveAttribute('aria-current', 'true')
  await expect(page.locator('aside.bd-callout').getByText('Analogy')).toBeVisible()
})

test('copies the article link and announces it', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/blog/understanding-vue-composables', { waitUntil: 'networkidle' })
  await page.locator('.bd-article-actions').getByRole('button', { name: 'Copy link' }).click()
  await expect(page.locator('.bd-article-actions [aria-live="polite"]')).toHaveText('Link copied ✓')
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('/blog/understanding-vue-composables')
})

test('threads replies under their comment and hydrates cleanly', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.text().includes('Hydration')) errors.push(message.text())
  })
  await page.goto('/blog/understanding-vue-composables', { waitUntil: 'networkidle' })
  const thread = page.locator('.bd-comment-thread')
  await expect(thread.getByText('Thanks, glad it helped!')).toBeVisible()
  await expect(page.getByText('Conversation · 2 comments')).toBeVisible()
  expect(errors).toEqual([])
})
