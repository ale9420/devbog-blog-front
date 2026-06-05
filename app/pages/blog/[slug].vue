<script setup lang="ts">
import { Locale } from "~/interfaces";
import { formatDate } from '~/helpers/formatDate'
import { getInitial } from '~/helpers/string'

const { locale, t } = useI18n();
const route = useRoute();
const slug = route.params.slug as string;
const { useFetchPost, getMediaUrl } = useStrapi();
const { localizePath } = useLocaleUtils();
const { siteUrl } = useSiteUrl();
const { canonicalUrl } = useCanonicalUrl(`/blog/${slug}`);

const { data: post, pending } = useFetchPost(slug, locale.value as Locale);

const coverUrl = computed(() => {
    if (!post.value?.cover) return "";
    return getMediaUrl(post.value.cover);
});

const currentUrl = computed(() => {
    if (typeof window !== "undefined") {
        return window.location.href;
    }
    return "";
});

useSeoMeta({
    title: post.value?.title ? `${post.value.title} - BogDev` : "Post - BogDev",
    ogTitle: post.value?.title || "Blog Post",
    description: post.value?.description || "",
    ogDescription: post.value?.description || "",
    ogImage: coverUrl.value || undefined,
    ogImageAlt: post.value?.title || "Blog post cover image",
    ogUrl: () => canonicalUrl.value,
    ogType: "article",
    articlePublishedTime: post.value?.publishedAt,
    articleAuthor: post.value?.author?.name,
    articleTag:
        post.value?.tags?.data?.map((t: any) => t.attributes?.name) || [],
    twitterCard: "summary_large_image",
    twitterTitle: post.value?.title || "Blog Post",
    twitterDescription: post.value?.description || "",
    twitterImage: coverUrl.value || undefined,
});

const structuredData = computed(() => {
    if (!post.value) return null;
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                "@id": `https://devbog.com/blog/${slug}`,
                headline: post.value.title,
                description: post.value.description,
                image: coverUrl.value,
                datePublished: post.value.publishedAt,
                dateModified: post.value.publishedAt,
                author: {
                    "@type": "Person",
                    name: post.value.author?.name || t("post.anonymous"),
                    url: "https://devbog.com/about",
                },
                publisher: {
                    "@type": "Organization",
                    name: "BogDev",
                    url: "https://devbog.com",
                    logo: {
                        "@type": "ImageObject",
                        url: "https://devbog.com/logo.png",
                    },
                },
                mainEntityOfPage: {
                    "@type": "WebPage",
                    "@id": `https://devbog.com/blog/${slug}`,
                },
                articleSection: post.value.category?.name,
                keywords:
                    post.value.tags?.data
                        ?.map((t: any) => t.attributes?.name)
                        .join(", ") || "",
                wordCount: 0,
            },
            {
                "@type": "BreadcrumbList",
                "@id": `https://devbog.com/blog/${slug}#breadcrumb`,
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: "https://devbog.com",
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Blog",
                        item: "https://devbog.com/blog",
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: post.value.title,
                        item: `https://devbog.com/blog/${slug}`,
                    },
                ],
            },
            {
                "@type": "WebSite",
                "@id": "https://devbog.com/#website",
                url: "https://devbog.com",
                name: "BogDev",
                description: "Personal blog about AI, Software, Linux and more",
                publisher: {
                    "@type": "Organization",
                    "@id": "https://devbog.com/#organization",
                },
                potentialAction: {
                    "@type": "SearchAction",
                    target: {
                        "@type": "EntryPoint",
                        urlTemplate:
                            "https://devbog.com/blog?search={search_term_string}",
                    },
                    "query-input": "required name=search_term_string",
                },
            },
        ],
    };
});

useHead({
    script: structuredData.value
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
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div v-if="pending" class="animate-pulse">
            <div
                class="h-8 bg-[var(--surface-elevated)] rounded w-1/4 mb-4"
            ></div>
            <div
                class="h-12 bg-[var(--surface-elevated)] rounded w-3/4 mb-6"
            ></div>
            <div
                class="h-96 bg-[var(--surface-elevated)] rounded-2xl mb-8"
            ></div>
            <div class="space-y-4">
                <div
                    class="h-4 bg-[var(--surface-elevated)] rounded w-full"
                ></div>
                <div
                    class="h-4 bg-[var(--surface-elevated)] rounded w-full"
                ></div>
                <div
                    class="h-4 bg-[var(--surface-elevated)] rounded w-2/3"
                ></div>
            </div>
        </div>

        <template v-else-if="post">
            <NuxtLink
                :to="localizePath('/blog')"
                class="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--primary)] transition-colors mb-6"
            >
                <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
                {{ t("post.backToBlog") }}
            </NuxtLink>

            <div class="lg:grid lg:grid-cols-4 lg:gap-12">
                <aside class="hidden lg:block">
                    <div class="sticky top-24">
                        <div class="card p-6">
                            <BlogTableOfContents :blocks="post.blocks" />
                        </div>
                    </div>
                </aside>

                <article class="lg:col-span-3">
                    <header class="mb-8">
                        <div v-if="post.category" class="mb-4">
                            <span
                                class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-[var(--primary)]/10 text-[var(--primary)]"
                            >
                                {{ post.category.name }}
                            </span>
                        </div>

                        <h1
                            class="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                        >
                            {{ post.title }}
                        </h1>

                        <p class="text-xl text-[var(--muted)] mb-6">
                            {{ post.description }}
                        </p>

                        <div
                            class="flex flex-wrap items-center gap-4 pb-8 border-b border-[var(--border)]"
                        >
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-12 h-12 rounded-full gradient-bogota flex items-center justify-center text-white font-semibold text-lg"
                                >
                                    {{ getInitial(post.author?.name, "A") }}
                                </div>
                                <div>
                                    <p class="font-medium">
                                        {{
                                            post.author?.name ||
                                            t("post.anonymous")
                                        }}
                                    </p>
                                    <p class="text-sm text-[var(--muted)]">
                                        {{ formatDate(post.publishedAt) }}
                                    </p>
                                </div>
                            </div>

                            <span class="hidden sm:block text-[var(--border)]"
                                >|</span
                            >

                            <div
                                v-if="post.readTime"
                                class="flex items-center gap-1.5 text-[var(--muted)]"
                            >
                                <UIcon
                                    name="i-heroicons-clock"
                                    class="w-5 h-5"
                                />
                                {{
                                    t("blog.readTime", {
                                        minutes: post.readTime,
                                    })
                                }}
                            </div>
                        </div>
                    </header>

                    <NuxtImg
                        v-if="post.cover"
                        :src="coverUrl"
                        :alt="post.title"
                        width="1200"
                        height="500"
                        format="webp"
                        loading="eager"
                        class="w-full h-auto md:h-[500px] object-cover rounded-2xl mb-10 shadow-lg"
                    />

                    <div
                        class="prose prose-devbog dark:prose-invert max-w-none"
                    >
                        <StrapiBlocksRenderer :blocks="post.blocks" />
                    </div>

                    <BlogRelatedPosts
                        :current-post-id="post.id"
                        :category-id="post.category?.id"
                    />

                    <BlogBuyMeACoffee class="mt-12" />

                    <BlogCommentSection
                        :slug="slug"
                        :document-id="post.documentId"
                    />

                    <footer class="mt-12 pt-8 border-t border-[var(--border)]">
                        <div
                            class="flex flex-wrap items-center justify-between gap-4"
                        >
                            <BlogShareButtons
                                :title="post.title"
                                :url="currentUrl"
                            />

                            <NuxtLink
                                :to="localizePath('/blog')"
                                class="text-[var(--primary)] hover:underline"
                            >
                                ← {{ t("post.backToAllPosts") }}
                            </NuxtLink>
                        </div>
                    </footer>
                </article>
            </div>
        </template>

        <div v-else class="text-center py-20">
            <div
                class="w-20 h-20 mx-auto mb-6 rounded-full gradient-bogota-subtle flex items-center justify-center"
            >
                <UIcon
                    name="i-heroicons-exclamation-circle"
                    class="w-10 h-10 text-[var(--muted)]"
                />
            </div>
            <h2 class="text-2xl font-semibold mb-4">
                {{ t("post.postNotFound") }}
            </h2>
            <p class="text-[var(--muted)] mb-6">
                {{ t("post.articleDoesNotExist") }}
            </p>
            <NuxtLink :to="localizePath('/blog')" class="btn-primary">
                {{ t("post.backToBlog") }}
            </NuxtLink>
        </div>
    </div>
</template>
