import qs from 'qs';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const strapiUrl = config.public.strapiUrl.replace(/\/$/, "");
  const siteUrl = "https://devbog.com";

  setHeader(event, "Content-Type", "application/xml");
  setHeader(event, "Cache-Control", "public, s-maxage=3600, stale-while-revalidate=7200");

  try {
    const params = qs.stringify({
      pagination: { pageSize: 1000 },
      populate: ['cover', 'category'],
      sort: 'publishedAt:desc',
    });

    const response = await $fetch<{ data: any[] }>(
      `${strapiUrl}/api/articles?${params}`,
    );
    const posts = response.data || [];

    const staticPages = [
      { path: "/", changefreq: "daily", priority: "1.0" },
      { path: "/blog", changefreq: "daily", priority: "0.9" },
      { path: "/about", changefreq: "weekly", priority: "0.7" },
    ];

    const generateUrlEntry = (
      path: string,
      changefreq: string,
      priority: string,
      lastmod?: string,
    ) => {
      const enUrl = `${siteUrl}${path}`;
      const esUrl = `${siteUrl}/es${path === "/" ? "" : path}`;

      return `<url>
    <loc>${enUrl}</loc>
    <lastmod>${lastmod || new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>`;
    };

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${staticPages.map((page) => generateUrlEntry(page.path, page.changefreq, page.priority)).join("\n  ")}
  ${posts
    .map((post) => {
      const lastmod = new Date(post.updatedAt || post.publishedAt)
        .toISOString()
        .split("T")[0];
      return generateUrlEntry(`/blog/${post.slug}`, "monthly", "0.8", lastmod);
    })
    .join("\n  ")}
</urlset>`;

    return sitemap;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to generate sitemap",
    });
  }
});
