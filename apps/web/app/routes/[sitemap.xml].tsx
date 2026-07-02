import type { LoaderFunctionArgs } from "react-router";
import { getArticles } from "~/lib/directus.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const siteUrl = process.env.SITE_URL || "http://localhost:3001";
  const articles = await getArticles();

  const staticRoutes: Array<{
    url: string;
    priority: string;
    changefreq: string;
    lastmod?: string;
  }> = [
    { url: "/", priority: "1.0", changefreq: "weekly" },
    { url: "/about", priority: "0.8", changefreq: "monthly" },
    { url: "/articles", priority: "0.8", changefreq: "weekly" },
    { url: "/contact", priority: "0.7", changefreq: "monthly" },
    { url: "/privacy", priority: "0.3", changefreq: "yearly" },
    { url: "/terms", priority: "0.3", changefreq: "yearly" },
    { url: "/style-guide", priority: "0.3", changefreq: "monthly" },
    { url: "/style-guide/foundations/color", priority: "0.3", changefreq: "monthly" },
    { url: "/style-guide/foundations/typography", priority: "0.3", changefreq: "monthly" },
    { url: "/style-guide/foundations/spacing", priority: "0.3", changefreq: "monthly" },
    { url: "/style-guide/foundations/elevation", priority: "0.3", changefreq: "monthly" },
    { url: "/style-guide/foundations/motion", priority: "0.3", changefreq: "monthly" },
    { url: "/style-guide/components/buttons", priority: "0.3", changefreq: "monthly" },
    { url: "/style-guide/components/badges", priority: "0.3", changefreq: "monthly" },
    { url: "/style-guide/components/cards", priority: "0.3", changefreq: "monthly" },
    { url: "/style-guide/components/inputs", priority: "0.3", changefreq: "monthly" },
    { url: "/style-guide/patterns/blocks", priority: "0.3", changefreq: "monthly" },
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
