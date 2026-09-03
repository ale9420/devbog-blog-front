import { Marked } from 'marked';
import type { Tokens } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import { slugify } from '~/helpers/slugify';

export { slugify };

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function createMarkdownRenderer() {
    const marked = new Marked();
    marked.use({
        renderer: {
            heading(token: Tokens.Heading): string {
                const text = token.text || '';
                const slug = slugify(text);
                return `<h${token.depth} id="${slug}">${text}</h${token.depth}>\n`;
            },
            link(token: Tokens.Link): string {
                const href = token.href || '';
                const title = token.title || '';
                const text = token.text || '';
                const titleAttr = title ? ` title="${title}"` : '';
                const isExternal = href.startsWith('http://') || href.startsWith('https://');
                const attrs = isExternal
                    ? ' target="_blank" rel="noopener noreferrer"'
                    : '';
                return `<a href="${href}"${titleAttr}${attrs}>${text}</a>`;
            },
            codespan(token: Tokens.Codespan): string {
                const text = token.text || '';
                return `<code>${escapeHtml(text)}</code>`;
            },
            code(token: Tokens.Code): string {
                const text = token.text || '';
                const lang = token.lang || '';
                const languageClass = lang ? ` language-${lang}` : '';
                return `<pre><code class="font-mono text-sm${languageClass}">${escapeHtml(text)}</code></pre>\n`;
            },
        },
        gfm: true,
        breaks: true,
    });
    return marked;
}

const scopedMarked = createMarkdownRenderer();

export function useMarkdownRenderer() {
    function renderMarkdown(text: string): string {
        if (!text) return '';
        try {
            const html = scopedMarked.parse(text) as string;
            return DOMPurify.sanitize(html, {
                ADD_TAGS: ['iframe'],
                ADD_ATTR: ['target', 'rel', 'allowfullscreen', 'frameborder', 'scrolling'],
            });
        } catch {
            return text;
        }
    }

    return {
        renderMarkdown,
        slugify,
    };
}
