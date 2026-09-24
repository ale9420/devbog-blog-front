import { describe, it, expect, vi } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import BlogTableOfContents from '~/components/blog/TableOfContents.vue'
import BlogCopyLinkButton from '~/components/blog/CopyLinkButton.vue'
import BlogCommentSection from '~/components/blog/CommentSection.vue'
import StrapiRichTextBlock from '~/components/strapi/RichTextBlock.vue'

registerEndpoint('/api/comments/flat', () => ({
  data: [
    { id: 1, content: 'Great article.', blockedThread: false, removed: false, author: { name: 'Ana Reader' }, createdAt: '2026-02-03T10:00:00.000Z', threadOf: null },
    { id: 2, content: 'Thanks!', blockedThread: false, removed: false, author: { name: 'Alejandro Ramirez' }, createdAt: '2026-02-04T10:00:00.000Z', threadOf: { id: 1 } },
  ],
}))

describe('BlogTableOfContents', () => {
  it('links every heading and marks the first as current', async () => {
    const wrapper = await mountSuspended(BlogTableOfContents, {
      props: { headings: [{ id: 'que-es', text: 'Qué es', level: 2 }, { id: 'retrieval', text: 'Retrieval', level: 3 }] },
    })
    expect(wrapper.get('nav').attributes('aria-label')).toBe('In this article')
    const links = wrapper.findAll('a')
    expect(links.map(link => link.attributes('href'))).toEqual(['#que-es', '#retrieval'])
    expect(links[0]!.attributes('aria-current')).toBe('true')
    expect(links[1]!.classes()).toContain('bd-toc-sub')
    await links[1]!.trigger('click')
    expect(links[1]!.attributes('aria-current')).toBe('true')
  })

  it('renders nothing without headings', async () => {
    const wrapper = await mountSuspended(BlogTableOfContents, { props: { headings: [] } })
    expect(wrapper.find('nav').exists()).toBe(false)
  })
})

describe('BlogCopyLinkButton', () => {
  it('copies the link and announces it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const wrapper = await mountSuspended(BlogCopyLinkButton, { props: { url: 'https://bogdev.com.co/blog/rag' } })
    expect(wrapper.get('button').text()).toBe('Copy link')
    expect(wrapper.get('[aria-live="polite"]').text()).toBe('')
    await wrapper.get('button').trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith('https://bogdev.com.co/blog/rag')
    expect(wrapper.get('button').text()).toBe('Link copied ✓')
    expect(wrapper.get('[aria-live="polite"]').text()).toBe('Link copied ✓')
  })
})

describe('BlogCommentSection', () => {
  it('shows replies under their comment with dotted dates', async () => {
    const wrapper = await mountSuspended(BlogCommentSection, { props: { slug: 'rag', documentId: 'doc-rag' } })
    await vi.waitFor(() => expect(wrapper.findAll('.bd-comment')).toHaveLength(2))
    expect(wrapper.get('.bd-home-eyebrow').text()).toBe('Conversation · 2 comments')
    const group = wrapper.get('.bd-comment-group')
    expect(group.get('.bd-comment-name').text()).toBe('Ana Reader')
    expect(group.get('.bd-comment-thread .bd-comment-name').text()).toBe('Alejandro Ramirez')
    expect(group.get('.bd-comment-date').text()).toBe('03.02.2026')
    expect(group.get('.bd-comment-thread').find('button').exists()).toBe(false)
  })
})

describe('StrapiRichTextBlock', () => {
  it('renders GitHub alerts as design system callouts', async () => {
    const wrapper = await mountSuspended(StrapiRichTextBlock, {
      props: { block: { id: 1, __component: 'shared.rich-text', body: '> [!NOTE] Analogy\n> A **recipe**.\n\n> [!WARNING]\n> Careful.\n\n> Plain quote.' } },
    })
    const callouts = wrapper.findAll('aside.bd-callout')
    expect(callouts).toHaveLength(2)
    expect(callouts[0]!.attributes('role')).toBe('note')
    expect(callouts[0]!.get('.bd-callout-label').text()).toBe('◆ Analogy')
    expect(callouts[0]!.get('.bd-callout-body').html()).toContain('<strong>recipe</strong>')
    expect(callouts[1]!.get('.bd-callout-label').text()).toBe('▲ Warning')
    expect(wrapper.get('blockquote').text()).toBe('Plain quote.')
  })
})
