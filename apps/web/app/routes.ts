import { type RouteConfig, route, index, layout, prefix } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("about", "routes/about.tsx"),
  route("articles", "routes/articles._index.tsx"),
  route("articles/:slug", "routes/articles.$slug.tsx"),
  route("contact", "routes/contact.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("terms", "routes/terms.tsx"),
  ...prefix("style-guide", [
    layout("routes/style-guide/_layout.tsx", [
      index("routes/style-guide/index.tsx"),
      route("foundations/color", "routes/style-guide/foundations.color.tsx"),
      route("foundations/typography", "routes/style-guide/foundations.typography.tsx"),
      route("foundations/spacing", "routes/style-guide/foundations.spacing.tsx"),
      route("foundations/elevation", "routes/style-guide/foundations.elevation.tsx"),
      route("foundations/motion", "routes/style-guide/foundations.motion.tsx"),
      route("components/buttons", "routes/style-guide/components.buttons.tsx"),
      route("components/badges", "routes/style-guide/components.badges.tsx"),
      route("components/cards", "routes/style-guide/components.cards.tsx"),
      route("components/inputs", "routes/style-guide/components.inputs.tsx"),
      route("patterns/blocks", "routes/style-guide/patterns.blocks.tsx"),
    ]),
  ]),
  route("sitemap.xml", "routes/[sitemap.xml].tsx"),
  route("*", "routes/$.tsx"),
] satisfies RouteConfig;
