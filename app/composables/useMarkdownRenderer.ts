import { marked } from 'marked';
import type { Tokens } from 'marked';

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

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

export function useMarkdownRenderer() {
    function renderMarkdown(text: string): string {
        if (!text) return '';
        try {
            return marked.parse(text) as string;
        } catch {
            return text;
        }
    }

    return {
        renderMarkdown,
        slugify,
    };
}
