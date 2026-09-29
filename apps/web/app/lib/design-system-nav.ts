export interface NavItem {
  label: string;
  to: string;
  /** One-line summary, used on the overview page. */
  blurb: string;
}

/**
 * The four layers of /design-system (ADR-021). Primitives are forked from the
 * starter and hold every visual decision; components and blocks are the
 * project's own, composed from primitives.
 */
export type Layer = "foundations" | "primitives" | "components" | "blocks";

export const LAYERS: { layer: Layer; title: string; to: string; blurb: string }[] = [
  {
    layer: "foundations",
    title: "Foundations",
    to: "/design-system/foundations",
    blurb: "The tokens every other layer consumes: color, type, spacing, elevation, motion, icons.",
  },
  {
    layer: "primitives",
    title: "Primitives",
    to: "/design-system/primitives",
    blurb: "Forked from the starter. Every visual decision lives here: variants, sizes, states.",
  },
  {
    layer: "components",
    title: "Components",
    to: "/design-system/components",
    blurb: "The project's own components, composed from primitives with layout classes only.",
  },
  {
    layer: "blocks",
    title: "Blocks",
    to: "/design-system/blocks",
    blurb: "Whole page sections (hero, CTA band, FAQ, steps) built from primitives and components.",
  },
];

export interface NavSection {
  section: string;
  layer: Layer;
  items: NavItem[];
}

export const nav: NavSection[] = [
  {
    section: "Foundations",
    layer: "foundations",
    items: [
      {
        label: "Color",
        to: "/design-system/foundations/color",
        blurb: "HSL token system — neutral backbone, brand scales, feedback roles",
      },
      {
        label: "Typography",
        to: "/design-system/foundations/typography",
        blurb: "Geist display, Source Sans 3 body, JetBrains Mono code",
      },
      {
        label: "Spacing",
        to: "/design-system/foundations/spacing",
        blurb: "0.25rem grid, Container sizes, Section rhythm",
      },
      {
        label: "Elevation",
        to: "/design-system/foundations/elevation",
        blurb: "Three roles — raised, overlay, modal",
      },
      {
        label: "Motion",
        to: "/design-system/foundations/motion",
        blurb: "FadeIn / stagger wrappers, durations, reduced motion",
      },
      {
        label: "Icons",
        to: "/design-system/foundations/icons",
        blurb: "Icon wrapper for lucide — four named sizes, usage conventions",
      },
    ],
  },
  {
    section: "Primitives",
    layer: "primitives",
    items: [
      {
        label: "Layout",
        to: "/design-system/primitives/layout",
        blurb: "Container sizes, HalfContainer, Section tone × padding",
      },
      {
        label: "Tooltip",
        to: "/design-system/primitives/tooltip",
        blurb: "Wrapper for the common case, composable parts when needed",
      },
      {
        label: "Accordion",
        to: "/design-system/primitives/accordion",
        blurb: "Collapsible disclosure sections — single or multiple open",
      },
      {
        label: "Alerts",
        to: "/design-system/primitives/alerts",
        blurb: "Info, success, warning, error callouts",
      },
      {
        label: "Avatar",
        to: "/design-system/primitives/avatar",
        blurb: "Image with initials or generated fallback, three sizes",
      },
      {
        label: "Badges",
        to: "/design-system/primitives/badges",
        blurb: "Four variants for status, tags, and metadata",
      },
      {
        label: "Breadcrumbs",
        to: "/design-system/primitives/breadcrumbs",
        blurb: "Location trail, current page emphasized",
      },
      {
        label: "Buttons",
        to: "/design-system/primitives/buttons",
        blurb: "Seven variants, four sizes, loading and disabled states",
      },
      {
        label: "Cards",
        to: "/design-system/primitives/cards",
        blurb: "Header / Title / Description / Content / Footer anatomy",
      },
      {
        label: "Dialog",
        to: "/design-system/primitives/dialog",
        blurb: "Modal overlay for focused tasks and confirmations",
      },
      {
        label: "Dropdown Menu",
        to: "/design-system/primitives/dropdown-menu",
        blurb: "Action and option menus, checkbox items",
      },
      {
        label: "Empty State",
        to: "/design-system/primitives/empty-state",
        blurb: "Icon, reason, and a way forward",
      },
      {
        label: "Form Field",
        to: "/design-system/primitives/form-field",
        blurb: "Label + control + hint/error, library-agnostic",
      },
      {
        label: "Inputs",
        to: "/design-system/primitives/inputs",
        blurb: "Input, textarea, select, checkbox, switch, tooltip, spinner",
      },
      {
        label: "Page Header",
        to: "/design-system/primitives/page-header",
        blurb: "Masthead — title, description, actions, breadcrumbs",
      },
      {
        label: "Pagination",
        to: "/design-system/primitives/pagination",
        blurb: "Windowed pager with ellipses",
      },
      {
        label: "Popover",
        to: "/design-system/primitives/popover",
        blurb: "Anchored non-modal panel for secondary UI",
      },
      {
        label: "Radio Group",
        to: "/design-system/primitives/radio-group",
        blurb: "Single choice from a small set",
      },
      {
        label: "Sheet",
        to: "/design-system/primitives/sheet",
        blurb: "Edge panel built on the Dialog primitive",
      },
      {
        label: "Skeleton",
        to: "/design-system/primitives/skeleton",
        blurb: "Loading placeholder, pulse",
      },
      {
        label: "Stat Card",
        to: "/design-system/primitives/stat-card",
        blurb: "KPI with value and trend delta",
      },
      {
        label: "Table",
        to: "/design-system/primitives/table",
        blurb: "Rows, label-voice header, hover and footer",
      },
      {
        label: "Tabs",
        to: "/design-system/primitives/tabs",
        blurb: "Segmented switcher for peer views",
      },
      {
        label: "Toast",
        to: "/design-system/primitives/toast",
        blurb: "Transient feedback — useToast(), five variants",
      },
      {
        label: "Toggle",
        to: "/design-system/primitives/toggle",
        blurb: "On/off button plus segmented toggle group",
      },
    ],
  },
  {
    // The kit's own components, composed from primitives (ADR-021).
    section: "Components",
    layer: "components",
    items: [
      {
        label: "Index",
        to: "/design-system/components",
        blurb: "The kit's components, composed from primitives",
      },
      {
        label: "Header",
        to: "/design-system/components/header",
        blurb: "Site header: wordmark, nav, theme toggle, mobile menu",
      },
      {
        label: "Footer",
        to: "/design-system/components/footer",
        blurb: "Site footer: link columns and legal line",
      },
      {
        label: "Article card",
        to: "/design-system/components/article-card",
        blurb: "An article teaser for listings and the articles block",
      },
      {
        label: "Page hero",
        to: "/design-system/components/page-hero",
        blurb: "Inner-page masthead with title and lead",
      },
      {
        label: "Wordmark",
        to: "/design-system/components/wordmark",
        blurb: "The brand wordmark as text, for header and footer",
      },
      {
        label: "Error page",
        to: "/design-system/components/error-page",
        blurb: "404 and 500 surface used by the error boundaries",
      },
    ],
  },
  {
    // One page per CMS block type; each renders the block from typed demo data.
    section: "Blocks",
    layer: "blocks",
    items: [
      {
        label: "Overview",
        to: "/design-system/blocks",
        blurb: "The 15 CMS content blocks and how pages compose them",
      },
      {
        label: "Hero",
        to: "/design-system/blocks/hero",
        blurb: "Full marketing hero — label, headline, subtitle, primary + secondary CTA",
      },
      {
        label: "Hero (simple)",
        to: "/design-system/blocks/hero-simple",
        blurb: "Full marketing hero — label, headline, subtitle, primary + secondary CTA_simple",
      },
      {
        label: "Features",
        to: "/design-system/blocks/features",
        blurb: "2–4 column feature card grid with icons",
      },
      {
        label: "Stats",
        to: "/design-system/blocks/stats",
        blurb: "Headline metrics band — value, label, description",
      },
      {
        label: "Testimonials",
        to: "/design-system/blocks/testimonials",
        blurb: "Quote cards fed from the testimonials collection",
      },
      {
        label: "Articles",
        to: "/design-system/blocks/articles",
        blurb: "Latest articles grid fed from the articles collection",
      },
      {
        label: "Team",
        to: "/design-system/blocks/team",
        blurb: "Team member cards fed from the team collection",
      },
      {
        label: "About",
        to: "/design-system/blocks/about",
        blurb: "About summary section",
      },
      {
        label: "Content",
        to: "/design-system/blocks/content",
        blurb: "Rich-text prose section from the CMS",
      },
      {
        label: "Image and text",
        to: "/design-system/blocks/image-text",
        blurb: "Split image + rich text, image position left/right",
      },
      {
        label: "FAQ",
        to: "/design-system/blocks/faq",
        blurb: "Question/answer accordion list",
      },
      {
        label: "CTA",
        to: "/design-system/blocks/cta",
        blurb: "Closing call-to-action band; accent variant inverts onto the primary fill",
      },
      {
        label: "Contact",
        to: "/design-system/blocks/contact",
        blurb: "Contact info / form embed section",
      },
      {
        label: "Newsletter",
        to: "/design-system/blocks/newsletter",
        blurb: "Email capture band",
      },
      {
        label: "Gallery",
        to: "/design-system/blocks/gallery",
        blurb: "Image gallery grid",
      },
    ],
  },
];

/** Flat list for lookups (active title, search), plus the overview and layer index pages. */
export const navFlat: (NavItem & { section: string })[] = [
  { label: "Overview", to: "/design-system", section: "Start", blurb: "The whole system at a glance" },
  ...LAYERS.filter((l) => l.layer === "foundations" || l.layer === "primitives").map((l) => ({
    label: l.title,
    to: l.to,
    section: "Start",
    blurb: l.blurb,
  })),
  ...nav.flatMap((s) => s.items.map((item) => ({ ...item, section: s.section }))),
];
