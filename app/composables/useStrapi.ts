import qs from 'qs';
import { toValue, type MaybeRef } from 'vue';
import type {
  StrapiAbout,
  RawStrapiArticle,
  PostListItem,
  StrapiPost,
  SearchPostResult,
} from "~/interfaces";
import type { StrapiPaginatedResponse, PaginationMeta } from "~/interfaces";
import { Locale, defaultLocale } from "~/interfaces";

export function useStrapi() {
  const config = useRuntimeConfig();

  function useFetchPosts(params?: {
    page?: MaybeRef<number | undefined>;
    pageSize?: number;
    locale?: MaybeRef<Locale | undefined>;
    category?: MaybeRef<string | undefined>;
    tag?: MaybeRef<string | undefined>;
  }) {
    const buildQuery = () => {
      return qs.stringify({
        page: toValue(params?.page),
        pageSize: params?.pageSize,
        locale: toValue(params?.locale),
        category: toValue(params?.category) || undefined,
        tag: toValue(params?.tag) || undefined,
      }, { skipNulls: true });
    };

    const query = buildQuery();
    const key = `posts-${query || 'default'}`;
    return useAsyncData(key, async () => {
      const response = await $fetch<StrapiPaginatedResponse<RawStrapiArticle[]>>(
        `/api/posts?${buildQuery()}`,
      );

      const data: PostListItem[] = response.data.map((post) => ({
        id: post.id,
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
      }));

      return {
        data,
        pagination: response.meta.pagination,
      };
    }, {
      watch: [
        () => toValue(params?.page),
        () => toValue(params?.locale),
        () => toValue(params?.category),
        () => toValue(params?.tag),
      ],
      transform: (result) => result,
      default: (): { data: PostListItem[]; pagination: PaginationMeta } => ({
        data: [],
        pagination: { total: 0, page: 1, pageSize: 6, pageCount: 1 },
      }),
    });
  }

  function useFetchPost(slug: string, locale?: Locale) {
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
      };
      return post;
    });
  }

  async function searchPosts(queryStr: string): Promise<SearchPostResult[]> {
    return $fetch<SearchPostResult[]>('/api/search', {
      query: { q: queryStr },
    });
  }

  function useFetchCategories(locale?: Locale) {
    return useAsyncData(`categories-${locale || defaultLocale}`, async () => {
      const query = qs.stringify({
        locale: locale || undefined,
      }, { skipNulls: true })

      return $fetch<Array<{ id: number; name: string; count: number }>>(
        `/api/categories?${query}`,
      )
    }, {
      default: () => [],
    })
  }

  function useFetchAbout(locale?: Locale) {
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
    useFetchPosts,
    useFetchPost,
    useFetchCategories,
    useFetchAbout,
    searchPosts,
    getMediaUrl,
  };
}
