import qs from 'qs';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const searchQuery = query.q as string;

  if (!searchQuery || searchQuery.length < 3) {
    return [];
  }

  const params = qs.stringify({
    filters: {
      title: {
        $containsi: searchQuery,
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

  setHeader(event, 'Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

  try {
    const response = await $fetch<{ data: any[] }>(
      `${config.public.strapiUrl}/api/articles?${params}`,
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
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
});
