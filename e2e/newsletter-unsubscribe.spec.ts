import { test, expect } from '@playwright/test'

test('unsubscribes from the link in the email', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'es-CO' })
  const page = await context.newPage()
  await page.goto('/es/newsletter/unsubscribe?token=unsubscribe-token-confirmed-0001', { waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { level: 1, name: 'Darte de baja' })).toBeVisible()

  const request = page.waitForRequest(req => req.url().endsWith('/api/newsletter/unsubscribe') && req.method() === 'POST')
  await page.getByRole('button', { name: 'Darme de baja' }).click()
  expect((await request).postDataJSON()).toEqual({ token: 'unsubscribe-token-confirmed-0001' })

  const done = page.getByRole('heading', { level: 1, name: 'Listo, te diste de baja' })
  await expect(done).toBeVisible()
  await expect(done).toBeFocused()
  await expect(page.getByRole('link', { name: 'Ir al blog' })).toHaveAttribute('href', '/es/blog')
  await context.close()
})

test('does not unsubscribe just by opening the link', async ({ page }) => {
  const posts: string[] = []
  page.on('request', (req) => {
    if (req.method() === 'POST' && req.url().includes('/api/newsletter/unsubscribe')) posts.push(req.url())
  })
  await page.goto('/newsletter/unsubscribe?token=unsubscribe-token-pending-0001', { waitUntil: 'networkidle' })
  await expect(page.getByRole('button', { name: 'Unsubscribe me' })).toBeVisible()
  expect(posts).toEqual([])
})

test('explains an invalid link', async ({ page }) => {
  await page.goto('/newsletter/unsubscribe?token=bad', { waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { level: 1, name: 'This link is not valid' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'gx_alejandro@hotmail.com' })).toHaveAttribute('href', 'mailto:gx_alejandro@hotmail.com')
  await expect(page.getByRole('button', { name: 'Unsubscribe me' })).toHaveCount(0)
})
