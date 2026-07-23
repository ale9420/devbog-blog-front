import qs from 'qs';
import type { StrapiResponse, StrapiPost, StrapiAbout } from "~/interfaces";
import { Locale, defaultLocale } from "~/interfaces";

export function useStrapi() {
  const config = useRuntimeConfig();

  function useFetchPosts(params?: {
    page?: number;
    pageSize?: number;
    locale?: Locale;
  }) {
    const key = `posts-${params?.page || 1}-${params?.locale || defaultLocale}`;
    return useAsyncData(key, async () => {
      const query = qs.stringify({
        page: params?.page,
        pageSize: params?.pageSize,
        locale: params?.locale,
      }, { skipNulls: true });

      const response = await $fetch<{
        data: any[];
        meta: {
          pagination: {
            total: number;
            page: number;
            pageSize: number;
            pageCount: number;
          };
        };
      }>(`/api/posts?${query}`);

      return {
        data: response.data.map((post: any) => ({
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
          seo: post.seo,
        })),
        pagination: response.meta.pagination,
      };
    }, {
      transform: (result) => result,
      default: () => ({ data: [], pagination: { total: 0, page: 1, pageSize: 6, pageCount: 1 } }),
    });
  }

  function useFetchPost(slug: string, locale?: Locale) {
    return useAsyncData(`post-${slug}-${locale}`, async () => {
      const query = qs.stringify({
        locale: locale || undefined,
      }, { skipNulls: true });

      const response = await $fetch<any>(
        `/api/posts/${slug}?${query}`,
      );

      if (!response) return null;

      return {
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
        seo: response.seo,
        blocks: response.blocks,
      };
    });
  }

  async function searchPosts(queryStr: string) {
    const query = qs.stringify({
      filters: {
        title: {
          $containsi: queryStr,
        },
      },
      populate: ['cover', 'category'],
      pagination: {
        pageSize: 10,
      },
    });

    const headers: Record<string, string> = {};
    if (config.strapiApiToken) {
      headers['Authorization'] = `Bearer ${config.strapiApiToken}`;
    }

    const response = await $fetch<StrapiResponse<StrapiPost[]>>(
      `${config.public.strapiUrl}/api/articles?${query}`,
      { headers },
    );
    return response.data.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      description: post.description,
      cover: post.cover ? { url: post.cover.url } : null,
      category: post.category ? { name: post.category.name } : null,
    }));
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
