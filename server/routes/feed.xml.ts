import qs from 'qs';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.siteUrl;

  setHeader(event, "Content-Type", "application/rss+xml; charset=utf-8");
  setHeader(event, "Cache-Control", "public, s-maxage=1800, stale-while-revalidate=3600");

  const headers: Record<string, string> = {};
  if (config.strapiApiToken) {
    headers["Authorization"] = `Bearer ${config.strapiApiToken}`;
  }

  try {
    const query = getQuery(event);
    const lang = query.lang as string | undefined;
    const locale = lang === 'es' ? 'es' : 'en';

    const params = qs.stringify({
      pagination: { pageSize: 50 },
      populate: ['cover', 'category', 'author'],
      sort: 'publishedAt:desc',
      locale,
    });

    const response = await $fetch<{ data: any[] }>(
      `${config.public.strapiUrl}/api/articles?${params}`,
      { headers },
    );
    const posts = response.data || [];

    const feedUrl = locale === 'es' ? `${baseUrl}/es/feed.xml` : `${baseUrl}/feed.xml`;
    const altFeedUrl = locale === 'es' ? `${baseUrl}/feed.xml` : `${baseUrl}/es/feed.xml`;

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <channel>
    <title>BogDev - Personal Blog${locale === 'es' ? ' (Español)' : ''}</title>
    <description>Exploring AI, Software Development, Linux, and more. A personal space for thoughts, tutorials, and experiments from Bogotá, Colombia.</description>
    <link>${baseUrl}${locale === 'es' ? '/es' : ''}</link>
    <language>${locale === 'es' ? 'es-co' : 'en-us'}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    <atom:link href="${altFeedUrl}" rel="alternate" type="application/rss+xml" hreflang="${locale === 'es' ? 'en' : 'es'}"/>
    <generator>BogDev</generator>
    ${posts
      .map((post) => {
        const coverUrl = post.cover?.url
          ? post.cover.url.startsWith("http")
            ? post.cover.url
            : `${config.public.strapiUrl}${post.cover.url}`
          : "";
        const pubDate = post.publishedAt
          ? new Date(post.publishedAt).toUTCString()
          : new Date().toUTCString();
        const description = post.description || "";

        const itemLocale = post.locale || "en";
        const postUrl = `${baseUrl}${itemLocale === 'es' ? '/es' : ''}/blog/${post.slug}`;
        const altPostUrl = `${baseUrl}${itemLocale === 'es' ? '' : '/es'}/blog/${post.slug}`;
        return `<item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${description}]]></description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:language>${itemLocale}</dc:language>
      <xhtml:link rel="alternate" hreflang="${itemLocale}" href="${postUrl}"/>
      <xhtml:link rel="alternate" hreflang="${itemLocale === 'es' ? 'en' : 'es'}" href="${altPostUrl}"/>
      ${post.category?.name ? `<category><![CDATA[${post.category.name}]]></category>` : ""}
      ${coverUrl ? `<enclosure url="${coverUrl}" type="image/jpeg"/>` : ""}
    </item>`;
      })
      .join("\n")}
  </channel>
</rss>`;

    return rss;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to generate RSS feed",
    });
  }
});
