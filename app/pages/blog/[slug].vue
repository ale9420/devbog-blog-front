<script setup lang="ts">
import type { Category, CitationIndex, Locale, NumberedReference, TocHeading } from "~/interfaces";
import { buildCitationIndex, numberReferences } from "~/helpers/citations";
import { isCategory } from "~/helpers/categories";
import { formatDotDate } from "~/helpers/formatDate";
import { mastodonShareUrl } from "~/helpers/share";
import { extractHeadings } from "~/helpers/toc";

const { locale, t } = useI18n();
const route = useRoute();
const slug = route.params.slug as string;
const { fetchPost, getMediaUrl } = useStrapi();
const { localizePath } = useLocaleUtils();
const categoryLabel = useCategoryLabel();
const { siteUrl } = useSiteUrl();
const { canonicalUrl } = useCanonicalUrl(`/blog/${slug}`);
const headerSection = useHeaderSection();
const config = useRuntimeConfig();

const { data: post } = await fetchPost(slug, locale.value as Locale);

watch(() => categoryLabel(post.value?.category), (label) => {
    headerSection.value = label;
}, { immediate: true });

onBeforeUnmount(() => {
    headerSection.value = "";
});

const coverUrl = computed(() => {
    if (!post.value?.cover) return "";
    return getMediaUrl(post.value.cover);
});

const seoImageUrl = computed(() => {
    const metaImage = post.value?.seo?.metaImage;
    return getMediaUrl(metaImage?.url || metaImage?.data?.attributes?.url);
});

const shareImageUrl = computed(() => seoImageUrl.value || coverUrl.value || `${siteUrl.value}/og-image.png`);

const shareImageAlt = computed(() => post.value?.cover?.alternativeText || post.value?.title || "Blog post cover image");

const category = computed<Category | undefined>(() => {
    const slug = post.value?.category?.slug;
    return isCategory(slug) ? slug : undefined;
});
const references = computed<NumberedReference[]>(() => numberReferences(post.value?.blocks, post.value?.references));
const citationIndex = computed<CitationIndex>(() => buildCitationIndex(post.value?.blocks, post.value?.references));
const headings = computed<TocHeading[]>(() => {
    const blockHeadings = extractHeadings(post.value?.blocks);
    if (!references.value.length) return blockHeadings;
    return [...blockHeadings, { id: "references", text: t("post.references.title"), level: 2 }];
});
const articleUrl = computed<string>(() => post.value?.seo?.canonicalURL || canonicalUrl.value);
const mastodonUrl = computed<string>(() => mastodonShareUrl(post.value?.title ?? "", articleUrl.value));
const publishedDate = computed<string>(() => formatDotDate(post.value?.publishedAt));
const federated = computed<boolean>(() => locale.value === config.public.fediverseLocale);
const prose = ref<HTMLElement | null>(null);

provideCitations(citationIndex);
useMarkAsRead(prose, computed(() => post.value?.documentId));

useSeoMeta({
    title: () => post.value?.seo?.metaTitle || (post.value?.title ? `${post.value.title} - BogDev` : "Post - BogDev"),
    ogTitle: () => post.value?.seo?.metaTitle || post.value?.title || "Blog Post",
    description: () => post.value?.seo?.metaDescription || post.value?.description || "",
    ogDescription: () => post.value?.seo?.metaDescription || post.value?.description || "",
    ogImage: () => shareImageUrl.value,
    ogImageAlt: () => shareImageAlt.value,
    ogUrl: () => post.value?.seo?.canonicalURL || canonicalUrl.value,
    ogType: "article",
    articlePublishedTime: () => post.value?.publishedAt,
    articleAuthor: () => post.value?.author?.name ? [post.value.author.name] : undefined,
    articleTag: () =>
        post.value?.seo?.keywords
            ?.split(",")
            .map((k: string) => k.trim())
            .filter(Boolean) ||
        post.value?.tags ||
        [],
    twitterCard: "summary_large_image",
    twitterTitle: () => post.value?.seo?.metaTitle || post.value?.title || "Blog Post",
    twitterDescription: () => post.value?.seo?.metaDescription || post.value?.description || "",
    twitterImage: () => shareImageUrl.value,
    twitterImageAlt: () => shareImageAlt.value,
});

useHead({
    meta: () => post.value?.seo?.metaRobots
        ? [{ name: "robots", content: post.value.seo.metaRobots }]
        : [],
});

const structuredData = computed(() => {
    if (!post.value) return null;

    if (post.value.seo?.structuredData) {
        return post.value.seo.structuredData;
    }

    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BlogPosting",
                "@id": `${siteUrl.value}/blog/${slug}`,
                headline: post.value.title,
                description: post.value.description,
                image: shareImageUrl.value,
                datePublished: post.value.publishedAt,
                dateModified: post.value.publishedAt,
                author: {
                    "@type": "Person",
                    name: post.value.author?.name || t("post.anonymous"),
                    url: `${siteUrl.value}/about`,
                },
                publisher: {
                    "@type": "Organization",
                    name: "BogDev",
                    url: siteUrl.value,
                    logo: {
                        "@type": "ImageObject",
                        url: `${siteUrl.value}/logo.png`,
                    },
                },
                mainEntityOfPage: {
                    "@type": "WebPage",
                    "@id": `${siteUrl.value}/blog/${slug}`,
                },
                articleSection: categoryLabel(post.value.category) || undefined,
                keywords: (post.value.tags || []).join(", "),
                wordCount: 0,
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${siteUrl.value}/blog/${slug}#breadcrumb`,
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: siteUrl.value,
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Blog",
                        item: `${siteUrl.value}/blog`,
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: post.value.title,
                        item: `${siteUrl.value}/blog/${slug}`,
                    },
                ],
            },
            {
                "@type": "WebSite",
                "@id": `${siteUrl.value}/#website`,
                url: siteUrl.value,
                name: "BogDev",
                description: "Personal blog about AI, Software, Linux and more",
                publisher: {
                    "@type": "Organization",
                    "@id": `${siteUrl.value}/#organization`,
                },
                potentialAction: {
                    "@type": "SearchAction",
                    target: {
                        "@type": "EntryPoint",
                        urlTemplate:
                            `${siteUrl.value}/blog?search={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                },
            },
        ],
    };
});

useHead({
    script: () => structuredData.value
        ? [
              {
                  type: "application/ld+json",
                  innerHTML: JSON.stringify(structuredData.value),
              },
          ]
        : [],
});
</script>

<template>
    <div class="bd-article-page">
        <template v-if="post">
            <header class="bd-article-head">
                <div class="bd-article-kicker">
                    <BdCategoryTag v-if="category" :category="category" />
                    <time v-if="publishedDate" class="bd-meta" :datetime="post.publishedAt ?? undefined">{{ publishedDate }}</time>
                    <span v-if="post.readTime" class="bd-meta">{{ t("blog.readTime", { minutes: post.readTime }) }}</span>
                </div>
                <h1 class="bd-article-title bd-wide">{{ post.title }}</h1>
                <p v-if="post.description" class="bd-article-lead">{{ post.description }}</p>
                <div class="bd-article-byline">
                    <div class="bd-article-author">
                        <BlogAuthorBadge :author="post.author" />
                        <div class="bd-article-author-text">
                            <span class="bd-article-author-name">{{ post.author?.name || t("post.anonymous") }}</span>
                            <span class="bd-meta bd-home-eyebrow bd-article-place">{{ t("bd.header.hud.city") }} · {{ t("bd.header.hud.coords") }}</span>
                        </div>
                    </div>
                    <div class="bd-article-actions">
                        <BlogCopyLinkButton :url="articleUrl" />
                        <BdButton :href="mastodonUrl" variant="text" size="sm" target="_blank" rel="noopener noreferrer" :aria-label="t('post.shareOn', { network: 'Mastodon' })">
                            Mastodon <span aria-hidden="true">↗</span>
                        </BdButton>
                    </div>
                </div>
                <BlogFediverseBar v-if="federated && post.documentId" :slug="slug" :document-id="post.documentId" />
            </header>

            <figure v-if="coverUrl" class="bd-article-figure">
                <div class="bd-article-cover">
                    <NuxtImg
                        :src="coverUrl"
                        :alt="post.cover?.alternativeText || post.title"
                        width="1200"
                        height="675"
                        format="webp"
                        loading="eager"
                        fetchpriority="high"
                        decoding="async"
                    />
                </div>
                <figcaption v-if="post.coverCredit" class="bd-article-cover-credit">
                    <BdFigureCredit :credit="post.coverCredit" />
                </figcaption>
            </figure>
            <div v-else class="bd-article-cover bd-article-cover-empty" aria-hidden="true" />

            <div class="bd-article-body">
                <BlogTableOfContents class="bd-article-toc" :headings="headings" />

                <article class="bd-article-content">
                    <div ref="prose" class="bd-prose">
                        <StrapiBlocksRenderer :blocks="post.blocks" />
                    </div>

                    <BlogReferences :entries="references" />

                    <div class="bd-article-after">
                        <div v-if="post.tags?.length" class="bd-article-tags">
                            <span class="bd-eyebrow bd-home-eyebrow">{{ t("post.tags") }}</span>
                            <NuxtLink
                                v-for="tag in post.tags"
                                :key="tag"
                                :to="{ path: localizePath('/blog'), query: { tag } }"
                                class="bd-chip bd-blog-tag"
                            >
                                #{{ tag }}
                            </NuxtLink>
                        </div>
                        <BlogReadingPath v-if="category && post.documentId" :category="category" :current-document-id="post.documentId" />
                        <BlogAuthorCard :author="post.author" />
                        <BlogBuyMeACoffee />
                    </div>
                </article>

                <BlogShareButtons class="bd-article-share" :title="post.title" :url="articleUrl" />
            </div>

            <BlogCommentSection :slug="slug" :document-id="post.documentId" :federated="federated && Boolean(post.documentId)" />

            <BlogRelatedPosts :current-post-id="post.id" :category="post.category" />
        </template>

        <div v-else class="bd-latest-empty bd-article-missing">
            <h1 class="bd-latest-empty-title">{{ t("post.postNotFound") }}</h1>
            <p class="bd-article-lead">{{ t("post.articleDoesNotExist") }}</p>
            <BdButton :href="localizePath('/blog')" arrow>{{ t("post.backToBlog") }}</BdButton>
        </div>
    </div>
</template>
