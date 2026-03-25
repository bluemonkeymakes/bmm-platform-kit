import type { LoaderFunctionArgs } from "react-router";
import { getArticles } from "~/lib/directus.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const siteUrl = process.env.SITE_URL || "http://localhost:3001";
  const articles = await getArticles();

  const staticRoutes = [
    { url: "/", priority: "1.0", changefreq: "weekly" },
    { url: "/about", priority: "0.8", changefreq: "monthly" },
    { url: "/articles", priority: "0.8", changefreq: "weekly" },
    { url: "/contact", priority: "0.7", changefreq: "monthly" },
    { url: "/privacy", priority: "0.3", changefreq: "yearly" },
    { url: "/terms", priority: "0.3", changefreq: "yearly" },
  ];

  const articleRoutes = articles.map((a) => ({
    url: `/articles/${a.slug}`,
    priority: "0.6",
    changefreq: "monthly" as const,
    lastmod: a.date_published,
  }));

  const allRoutes = [...staticRoutes, ...articleRoutes];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (r) => `  <url>
    <loc>${siteUrl}${r.url}</loc>
    <priority>${r.priority}</priority>
    <changefreq>${r.changefreq}</changefreq>${
      "lastmod" in r && r.lastmod ? `\n    <lastmod>${r.lastmod.split("T")[0]}</lastmod>` : ""
    }
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
