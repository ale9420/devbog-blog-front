import { afterEach, describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { AuthUser } from '~/interfaces'
import BdAccountMenu from '~/components/bd/BdAccountMenu.vue'
import BdMenuSheet from '~/components/bd/BdMenuSheet.vue'

function signInAs(user: AuthUser | null): void {
  useState<AuthUser | null>('auth-user').value = user
  useState<boolean>('auth-resolved').value = true
}

const reader: AuthUser = { username: 'lectora', email: 'lectora@example.com', role: 'reader', createdAt: null }
const editor: AuthUser = { username: 'alejandro', email: 'alejandro@example.com', role: 'editor', createdAt: null }

describe('BdAccountMenu', () => {
  afterEach(() => signInAs(null))

  it('links to sign in without a session, keeping the current page as redirect', async () => {
    signInAs(null)
    const wrapper = await mountSuspended(BdAccountMenu, { route: '/blog?tag=vue' })
    const link = wrapper.get('a.bd-chip')
    expect(link.text()).toBe('Sign in')
    expect(link.attributes('href')).toBe('/account/sign-in?redirect=/blog?tag=vue')
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('shows an icon link with a label in the compact variant', async () => {
    signInAs(null)
    const wrapper = await mountSuspended(BdAccountMenu, { props: { compact: true } })
    expect(wrapper.get('a.bd-iconbtn').attributes('aria-label')).toBe('Sign in to your account')
  })

  it('opens a menu with the account and sign out for a reader', async () => {
    signInAs(reader)
    const wrapper = await mountSuspended(BdAccountMenu)
    const toggle = wrapper.get('button.bd-account-toggle')
    expect(toggle.attributes('aria-label')).toBe('Your account menu, lectora')
    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(toggle.get('.bd-account-avatar').text()).toBe('L')
    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('true')
    const panel = wrapper.get(`#${toggle.attributes('aria-controls')}`)
    expect(panel.isVisible()).toBe(true)
    expect(panel.findAll('a').map(a => [a.text(), a.attributes('href')])).toEqual([['My account', '/account']])
    expect(panel.get('button').text()).toBe('Sign out')
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(toggle.attributes('aria-expanded')).toBe('false')
  })

  it('adds drafts for editors', async () => {
    signInAs(editor)
    const wrapper = await mountSuspended(BdAccountMenu)
    expect(wrapper.classes()).toContain('bd-account-editor')
    await wrapper.get('button.bd-account-toggle').trigger('click')
    expect(wrapper.findAll('.bd-account-panel a').map(a => a.attributes('href'))).toEqual(['/account', '/drafts'])
  })
})

describe('BdMenuSheet account link', () => {
  afterEach(() => signInAs(null))

  it('offers sign in without a session and the account with one', async () => {
    signInAs(null)
    const anonymous = await mountSuspended(BdMenuSheet, { props: { open: false } })
    expect(anonymous.get('.bd-sheet-account').attributes('href')).toBe('/account/sign-in')
    expect(anonymous.get('.bd-sheet-account').text()).toContain('Sign in')

    signInAs(reader)
    const signedIn = await mountSuspended(BdMenuSheet, { props: { open: false } })
    expect(signedIn.get('.bd-sheet-account').attributes('href')).toBe('/account')
    expect(signedIn.get('.bd-sheet-account').text()).toContain('My account')
  })
})
