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
    ],
  },
  {
    section: "Components",
    items: [
      {
        label: "Buttons",
        to: "/style-guide/components/buttons",
        blurb: "Seven variants, four sizes, loading and disabled states",
      },
      {
        label: "Badges",
        to: "/style-guide/components/badges",
        blurb: "Four variants for status, tags, and metadata",
      },
      {
        label: "Cards",
        to: "/style-guide/components/cards",
        blurb: "Header / Title / Description / Content / Footer anatomy",
      },
      {
        label: "Inputs",
        to: "/style-guide/components/inputs",
        blurb: "Input, textarea, label, error states, tooltip, spinner, separator",
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
