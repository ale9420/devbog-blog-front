import qs from 'qs';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const baseUrl = "https://devbog.com";

  setHeader(event, "Content-Type", "application/rss+xml; charset=utf-8");
  setHeader(event, "Cache-Control", "public, s-maxage=1800, stale-while-revalidate=3600");

  const headers: Record<string, string> = {};
  if (config.strapiApiToken) {
    headers["Authorization"] = `Bearer ${config.strapiApiToken}`;
  }

  try {
    const params = qs.stringify({
      pagination: { pageSize: 50 },
      populate: ['cover', 'category', 'author'],
      sort: 'publishedAt:desc',
    });

    const response = await $fetch<{ data: any[] }>(
      `${config.public.strapiUrl}/api/articles?${params}`,
      { headers },
    );
    const posts = response.data || [];

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>BogDev - Personal Blog</title>
    <description>Exploring AI, Software Development, Linux, and more. A personal space for thoughts, tutorials, and experiments from Bogotá, Colombia.</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>BogDev</generator>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/feed.xml"/>
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/es/feed.xml"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/feed.xml"/>
    <xhtml:link rel="self" hreflang="en" href="${baseUrl}/feed.xml"/>
    <xhtml:link rel="self" hreflang="es" href="${baseUrl}/es/feed.xml"/>
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
        return `<item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${description}]]></description>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:language>${itemLocale === "es" ? "es" : "en"}</dc:language>
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
