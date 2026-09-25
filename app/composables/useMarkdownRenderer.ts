import { Marked } from 'marked';
import type { Tokens } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { slugify } from '~/helpers/slugify';
import type { CalloutTone } from '~/interfaces';
import { escapeHtml, renderCodeBlockHtml } from '~/helpers/code';
import { parseCalloutMarker, renderCalloutHtml } from '~/helpers/callout';
import { renderMermaidBlockHtml } from '~/helpers/mermaid';

export { slugify };

const inlineSanitizeOptions: sanitizeHtml.IOptions = {
    allowedTags: ['a', 'strong', 'em', 'code'],
    allowedAttributes: { a: ['href', 'title', 'target', 'rel'] },
};

const sanitizeOptions: sanitizeHtml.IOptions = {
    allowedTags: [
        ...sanitizeHtml.defaults.allowedTags,
        'iframe',
        'img',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'button',
    ],
    allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        a: ['href', 'title', 'target', 'rel'],
        iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'allow', 'title', 'referrerpolicy'],
        img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
        code: ['class'],
        pre: ['class'],
        button: ['type', 'class', 'data-bd-copy', 'hidden'],
        aside: ['role'],
        '*': ['id', 'class'],
    },
    allowedIframeDomains: ['youtube.com', 'www.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com', 'vimeo.com', 'player.vimeo.com'],
    transformTags: {
        a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
    },
};

function createMarkdownRenderer(calloutLabel: (tone: CalloutTone) => string) {
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
                if (token.lang === 'mermaid') return renderMermaidBlockHtml(token.text || '');
                return renderCodeBlockHtml(token.text || '', token.lang || '');
            },
            blockquote(token: Tokens.Blockquote): string {
                const callout = parseCalloutMarker(token.text || '');
                if (!callout) return `<blockquote>\n${this.parser.parse(token.tokens)}</blockquote>\n`;
                const body = marked.parse(callout.body, { async: false });
                return renderCalloutHtml(callout.tone, callout.title ?? calloutLabel(callout.tone), body);
            },
        },
        gfm: true,
        breaks: true,
    });
    return marked;
}

export function useMarkdownRenderer() {
    const { t } = useI18n();
    const scopedMarked = createMarkdownRenderer(tone => t(`bd.callout.${tone}`));

    function renderMarkdown(text: string): string {
        if (!text) return '';
        try {
            const html = scopedMarked.parse(text) as string;
            return sanitizeHtml(html, sanitizeOptions);
        } catch {
            return text;
        }
    }

    function renderInlineMarkdown(text: string): string {
        if (!text) return '';
        try {
            const html = scopedMarked.parseInline(text) as string;
            return sanitizeHtml(html, inlineSanitizeOptions);
        } catch {
            return escapeHtml(text);
        }
    }

    return {
        renderMarkdown,
        renderInlineMarkdown,
        slugify,
    };
}
