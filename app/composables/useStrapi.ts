import qs from 'qs';
import { toValue, type MaybeRef } from 'vue';
import type {
  StrapiAbout,
  RawStrapiArticle,
  PostListItem,
  StrapiPost,
  SearchPostResult, StrapiPaginatedResponse, PaginationMeta 
, Locale, CategoryCount, BlogSort} from "~/interfaces";
import { defaultLocale } from "~/interfaces";

/**
 * Strapi data access for client pages. Every helper below goes through
 * this app's Nitro server routes (/api/*) — the Strapi URL and API token
 * are never used from the browser. These are plain functions (not
 * composables), returned from the useStrapi() factory.
 */
export function useStrapi() {
  const config = useRuntimeConfig();

  function fetchPosts(params?: {
    page?: MaybeRef<number | undefined>;
    pageSize?: MaybeRef<number | undefined>;
    locale?: MaybeRef<Locale | undefined>;
    category?: MaybeRef<string | undefined>;
    tag?: MaybeRef<string | undefined>;
    search?: MaybeRef<string | undefined>;
    sort?: MaybeRef<BlogSort | undefined>;
    content?: MaybeRef<boolean | undefined>;
  }) {
    const buildQuery = () => {
      return qs.stringify({
        page: toValue(params?.page),
        pageSize: toValue(params?.pageSize),
        locale: toValue(params?.locale),
        category: toValue(params?.category) || undefined,
        tag: toValue(params?.tag) || undefined,
        search: toValue(params?.search) || undefined,
        sort: toValue(params?.sort) || undefined,
        content: toValue(params?.content) ? '1' : undefined,
      }, { skipNulls: true });
    };

    return useAsyncData(() => `posts-${buildQuery() || 'default'}`, async () => {
      const response = await $fetch<StrapiPaginatedResponse<RawStrapiArticle[]>>(
        `/api/posts?${buildQuery()}`,
      );

      const data: PostListItem[] = response.data.map((post) => ({
        id: post.id,
        documentId: post.documentId,
        title: post.title,
        slug: post.slug,
        description: post.description,
        publishedAt: post.publishedAt,
        readTime: post.readTime,
        tags: post.tags,
        cover: post.cover,
        category: post.category,
        author: post.author,
        seo: post.seo ?? undefined,
        snippet: post.snippet ?? undefined,
      }));

      return {
        data,
        pagination: response.meta.pagination,
      };
    }, {
      transform: (result) => result,
      default: (): { data: PostListItem[]; pagination: PaginationMeta } => ({
        data: [],
        pagination: { total: 0, page: 1, pageSize: 6, pageCount: 1 },
      }),
    });
  }

  function fetchPost(slug: string, locale?: Locale) {
    return useAsyncData<StrapiPost | null>(`post-${slug}-${locale}`, async () => {
      const query = qs.stringify({
        locale: locale || undefined,
      }, { skipNulls: true });

      const response = await $fetch<RawStrapiArticle | null>(
        `/api/posts/${slug}?${query}`,
      );

      if (!response) return null;

      const post: StrapiPost = {
        id: response.id,
        documentId: response.documentId,
        title: response.title,
        slug: response.slug,
        description: response.description,
        content: response.content,
        publishedAt: response.publishedAt,
        readTime: response.readTime,
        tags: response.tags,
        cover: response.cover,
        category: response.category,
        author: response.author,
        seo: response.seo ?? undefined,
        blocks: response.blocks ?? [],
        references: response.references ?? [],
      };
      return post;
    });
  }

  async function searchPosts(queryStr: string, locale?: Locale, content = false): Promise<SearchPostResult[]> {
    return $fetch<SearchPostResult[]>('/api/search', {
      query: { q: queryStr, locale, content: content ? '1' : undefined },
    });
  }

  function fetchCategories(locale?: Locale) {
    return useAsyncData(`categories-${locale || defaultLocale}`, async () => {
      const query = qs.stringify({
        locale: locale || undefined,
      }, { skipNulls: true })

      return $fetch<CategoryCount[]>(
        `/api/categories?${query}`,
      )
    }, {
      default: () => [],
    })
  }

  function fetchAbout(locale?: Locale) {
    return useAsyncData<StrapiAbout>(
      `about-${locale || defaultLocale}`,
      async () => {
        const query = qs.stringify({
          locale: locale || undefined,
        }, { skipNulls: true });

        return $fetch<StrapiAbout>(`/api/about?${query}`);
      },
    );
  }

  function getMediaUrl(
    url: string | { url: string } | undefined | null,
  ): string {
    if (!url) return "";
    const urlStr = typeof url === "object" ? url.url : url;
    if (urlStr.startsWith("http")) return urlStr;
    return `${config.public.strapiUrl}${urlStr}`;
  }

  return {
    fetchPosts,
    fetchPost,
    fetchCategories,
    fetchAbout,
    searchPosts,
    getMediaUrl,
  };
}
