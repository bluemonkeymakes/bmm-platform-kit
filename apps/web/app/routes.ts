import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("about", "routes/about.tsx"),
  route("articles", "routes/articles._index.tsx"),
  route("articles/:slug", "routes/articles.$slug.tsx"),
  route("contact", "routes/contact.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("terms", "routes/terms.tsx"),
  route("style-guide", "routes/style-guide.tsx"),
  route("sitemap.xml", "routes/[sitemap.xml].tsx"),
  route("*", "routes/$.tsx"),
] satisfies RouteConfig;
