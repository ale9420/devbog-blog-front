import { test, expect } from '@playwright/test'

test('renders a single h1 and the featured post', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Exploring privacy, DIY, AI, software and Linux.')
  await expect(page.getByRole('heading', { name: 'Understanding Vue Composables', level: 2 })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Linux Server Hardening Guide', level: 3 }).getByRole('link', { name: 'Linux Server Hardening Guide' })).toBeVisible()
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

test('filters the latest articles by topic and shows the empty nest', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  const filters = page.getByRole('group', { name: 'Filter by topic' })
  await filters.getByRole('button', { name: /Privacy/ }).click()
  await expect(filters.getByRole('button', { name: /Privacy/ })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('heading', { name: 'No articles on privacy yet', level: 3 })).toBeVisible()
  await page.getByRole('button', { name: 'Show all' }).click()
  await expect(page.getByRole('link', { name: 'Linux Server Hardening Guide' })).toBeVisible()
})

test('links every field guide topic to its blog filter', async ({ page }) => {
  await page.goto('/')
  const hrefs = await page.locator('.bd-guide-card').evaluateAll(cards => cards.map(card => card.getAttribute('href')))
  expect(hrefs).toEqual(['privacidad', 'diy', 'ia', 'software', 'linux'].map(slug => `/blog?category=${slug}`))
})

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('keeps the flock still', async ({ page }) => {
    await page.goto('/')
    const animation = await page.locator('.bd-hero-art .bd-flyer').first().evaluate(node => getComputedStyle(node).animationName)
    expect(animation).toBe('none')
  })
})

test('follows the blog from an instance', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await context.route('https://mastodon.social/**', route => route.fulfill({ status: 200, body: 'ok' }))
  await page.goto('/', { waitUntil: 'networkidle' })
  const section = page.locator('#fediverso')
  await section.getByRole('button', { name: 'Copy the account @bogdev@api.bogdev.com.co' }).click()
  await expect(section.locator('[aria-live="polite"]')).toHaveText('@bogdev@api.bogdev.com.co copied')
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('@bogdev@api.bogdev.com.co')

  await section.getByRole('textbox', { name: 'Or follow from your instance' }).fill('@ana@Mastodon.Social')
  const popupPromise = page.waitForEvent('popup')
  await section.getByRole('button', { name: 'Follow' }).click()
  const popup = await popupPromise
  expect(popup.url()).toBe('https://mastodon.social/authorize_interaction?uri=https%3A%2F%2Fapi.bogdev.com.co%2Ffediverse%2Fuser%2Fdevbog')
})

test('reaches the fediverse section from the header chip', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'networkidle' })
  await page.getByRole('banner').getByRole('link', { name: '@bogdev on the fediverse', exact: true }).click()
  await expect(page).toHaveURL(/\/#fediverso$/)
  await expect(page.getByRole('heading', { name: 'Follow the blog from Mastodon' })).toBeInViewport()
})
