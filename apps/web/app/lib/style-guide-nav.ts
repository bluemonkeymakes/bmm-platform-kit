export interface NavItem {
  label: string;
  to: string;
  /** One-line summary, used on the overview page. */
  blurb: string;
}

export interface NavSection {
  section: string;
  items: NavItem[];
}

export const nav: NavSection[] = [
  {
    section: "Foundations",
    items: [
      {
        label: "Color",
        to: "/style-guide/foundations/color",
        blurb: "HSL token system — neutral backbone, brand scales, feedback roles",
      },
      {
        label: "Typography",
        to: "/style-guide/foundations/typography",
        blurb: "Geist display, Source Sans 3 body, JetBrains Mono code",
      },
      {
        label: "Spacing",
        to: "/style-guide/foundations/spacing",
        blurb: "0.25rem grid, Container sizes, Section rhythm",
      },
      {
        label: "Elevation",
        to: "/style-guide/foundations/elevation",
        blurb: "Three roles — raised, overlay, modal",
      },
      {
        label: "Motion",
        to: "/style-guide/foundations/motion",
        blurb: "FadeIn / stagger wrappers, durations, reduced motion",
      },
      {
        label: "Icons",
        to: "/style-guide/foundations/icons",
        blurb: "Icon wrapper for lucide — four named sizes, usage conventions",
      },
    ],
  },
  {
    section: "Components",
    items: [
      {
        label: "Accordion",
        to: "/style-guide/components/accordion",
        blurb: "Collapsible disclosure sections — single or multiple open",
      },
      {
        label: "Alerts",
        to: "/style-guide/components/alerts",
        blurb: "Info, success, warning, error callouts",
      },
      {
        label: "Avatar",
        to: "/style-guide/components/avatar",
        blurb: "Image with initials or generated fallback, three sizes",
      },
      {
        label: "Badges",
        to: "/style-guide/components/badges",
        blurb: "Four variants for status, tags, and metadata",
      },
      {
        label: "Breadcrumbs",
        to: "/style-guide/components/breadcrumbs",
        blurb: "Location trail, current page emphasized",
      },
      {
        label: "Buttons",
        to: "/style-guide/components/buttons",
        blurb: "Seven variants, four sizes, loading and disabled states",
      },
      {
        label: "Cards",
        to: "/style-guide/components/cards",
        blurb: "Header / Title / Description / Content / Footer anatomy",
      },
      {
        label: "Dialog",
        to: "/style-guide/components/dialog",
        blurb: "Modal overlay for focused tasks and confirmations",
      },
      {
        label: "Dropdown Menu",
        to: "/style-guide/components/dropdown-menu",
        blurb: "Action and option menus, checkbox items",
      },
      {
        label: "Empty State",
        to: "/style-guide/components/empty-state",
        blurb: "Icon, reason, and a way forward",
      },
      {
        label: "Form Field",
        to: "/style-guide/components/form-field",
        blurb: "Label + control + hint/error, library-agnostic",
      },
      {
        label: "Inputs",
        to: "/style-guide/components/inputs",
        blurb: "Input, textarea, select, checkbox, switch, tooltip, spinner",
      },
      {
        label: "Page Header",
        to: "/style-guide/components/page-header",
        blurb: "Masthead — title, description, actions, breadcrumbs",
      },
      {
        label: "Pagination",
        to: "/style-guide/components/pagination",
        blurb: "Windowed pager with ellipses",
      },
      {
        label: "Popover",
        to: "/style-guide/components/popover",
        blurb: "Anchored non-modal panel for secondary UI",
      },
      {
        label: "Radio Group",
        to: "/style-guide/components/radio-group",
        blurb: "Single choice from a small set",
      },
      {
        label: "Sheet",
        to: "/style-guide/components/sheet",
        blurb: "Edge panel built on the Dialog primitive",
      },
      {
        label: "Skeleton",
        to: "/style-guide/components/skeleton",
        blurb: "Loading placeholder, pulse",
      },
      {
        label: "Stat Card",
        to: "/style-guide/components/stat-card",
        blurb: "KPI with value and trend delta",
      },
      {
        label: "Table",
        to: "/style-guide/components/table",
        blurb: "Rows, label-voice header, hover and footer",
      },
      {
        label: "Tabs",
        to: "/style-guide/components/tabs",
        blurb: "Segmented switcher for peer views",
      },
      {
        label: "Toast",
        to: "/style-guide/components/toast",
        blurb: "Transient feedback — useToast(), five variants",
      },
      {
        label: "Toggle",
        to: "/style-guide/components/toggle",
        blurb: "On/off button plus segmented toggle group",
      },
    ],
  },
  {
    section: "Patterns",
    items: [
      {
        label: "Blocks",
        to: "/style-guide/patterns/blocks",
        blurb: "The 15 CMS content blocks and how pages compose them",
      },
    ],
  },
];

/** Flat list for lookups (active title, search). */
export const navFlat: (NavItem & { section: string })[] = nav.flatMap((s) =>
  s.items.map((item) => ({ ...item, section: s.section }))
);
