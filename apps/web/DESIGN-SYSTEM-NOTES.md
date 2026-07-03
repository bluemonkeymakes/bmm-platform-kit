# Design-system migration notes — primitive diffs & handling rules

The web app follows the **bmm-design-system** architecture
(`~/Dev-local/bluemonkeymakes/design-system`): a two-layer CSS token model where
`app/system/theme.css` is the **contract that travels unchanged** across every
project and `app/brand/` is the **swap surface** holding this project's values.
Canonical standards: `standards/design-system-principles.md`, ADR-007 (direct
palette over semantic tokens), ADR-008 (design-system starter) in the BMM docs
site.

This doc catalogues where this project's **primitives differ** from the design
system, why, and the rule for handling each diff when porting components in
either direction. It is the companion to the browsable `/style-guide` routes.

## Architecture (identical to the DS — no diff)

```
app/app.css            entry — chains the imports below
├── brand/fonts.css    @fontsource imports + --brand-font-* choices   (SWAP)
├── system/theme.css   the @theme contract — roles, scales, ladder    (TRAVELS)
├── brand/brand.css    HSL values for every role/scale, :root + .dark (SWAP)
└── brand/effects.css  signature decorative surfaces                  (SWAP)
```

`system/theme.css` is byte-identical to the DS copy. **Never edit it here** —
upstream changes to the contract should be re-copied from the DS, and additions
you need should be contributed upstream first (Design System Contribution SOP).

**Last re-sync: DS commit `de3a7ff`.** That sync brought: two new z-ladder
steps (`z-raised` 10 — content lifted above a decorative layer inside the same
component; `z-tooltip` 75), the `scrollbar-app` thin-scrollbar utility for
in-app scroll surfaces, `--container-measure` wired into `Container
size="reading"` (`max-w-measure` replaces `max-w-[40.625rem]`), the shared
`PageIntro` + `SpecimenSection` showcase primitives in `components/ds/` (every
`/style-guide` route heads with them), a `CardTitle` size axis, and a stricter
`lint:tokens` that now also flags Tailwind's **numeric `z-50`** (the whole
numeric z scale is banned — named ladder steps only).

## Token migration map (what happened to the old shadcn aliases)

The kit previously used shadcn-style semantic aliases. Those utilities no
longer exist; this is the mapping that was applied, and the mapping to use for
any un-migrated snippet you paste in from an older shadcn-based project:

| Old alias | New class | Note |
|---|---|---|
| `bg-background` | `bg-neutral-50` | opacity modifiers carry over (`/95`, `/80`, `/60`) |
| `text-background` | `text-neutral-50` | inverse text on dark fills |
| `text-foreground` | `text-neutral-800` | body text |
| `bg-foreground` | `bg-neutral-800` | |
| `border-foreground/20` | `border-neutral-800/20` | |
| `bg-card` | `bg-neutral-50` | + `border border-neutral-200 shadow-raised` is the card recipe |
| `text-card-foreground` | `text-neutral-800` | |
| `bg-muted` | `bg-neutral-100` | |
| `text-muted-foreground` | `text-neutral-500` | |
| `bg-secondary` | `bg-neutral-100` | |
| `text-secondary-foreground` | `text-neutral-800` | |
| `bg-accent` (hover fill) | `bg-neutral-100` | the shadcn "accent" was a gray hover fill, **not** this system's accent role |
| `text-accent-foreground` | `text-neutral-800` | |
| `border-border` / `border-input` | `border-neutral-200` | bare `border` also works — base layer sets it |
| `bg-border` | `bg-neutral-200` | separators |
| `bg-primary`, `text-primary-foreground`, `bg-destructive`, `ring-ring` | unchanged | these are roles the contract keeps |
| `shadow-xs` | `shadow-raised` | default Tailwind shadow ramp is **cleared** by the contract |
| `shadow-md` / `shadow-lg` | `shadow-overlay` / `shadow-raised` | pick by intent: raised < overlay < modal |
| `hover:shadow-xl` | `hover:shadow-overlay` | |
| `z-50` (sticky header) | `z-sticky` | named z ladder: raised 10 · dropdown 30 · sticky 40 · overlay 50 · modal 60 · toast 70 · tooltip 75 · cursor 80 |
| `z-50` (popover) | `z-overlay` | |
| `z-50` (tooltip) | `z-tooltip` | |
| `z-10` (content above a decorative layer) | `z-raised` | |
| `popover` tokens | dropped | were never used |

Dark mode needs no `dark:` companion for surface classes — the neutral scale
**inverts** in `.dark` (50 darkest → 900 lightest), so `bg-neutral-50` is the
page surface in both themes.

## Primitive diffs vs the design system — the callouts

Each entry: what differs, why, and the handling rule.

### 1. Fonts

| Role | This project | Design system |
|---|---|---|
| sans (body) | Source Sans 3 Variable | Open Sans |
| display (headings) | Geist Variable | Archivo Variable |
| mono | JetBrains Mono Variable | Inconsolata Variable |

**Handling:** fonts are brand — components on both sides only ever say
`font-sans` / `font-display` / `font-mono` (`font-inconsolata` is a contract
alias for mono), so ported components re-typeface automatically. Never name a
family in a component.

**Divergence:** this kit additionally applies `font-display` to `h1–h6` and
mono to `code/kbd/pre/samp` via a base-layer rule in `app.css` (the DS applies
display type per-component through its Typography set). A DS component ported
here renders the same; a component written here that *relies* on the base rule
(a raw `<h3>` with no font class) will fall back to `font-sans` in the DS —
put `font-display` on the class list when writing portable components.

### 2. Neutral scale — pure-white surface

`--neutral-50` here is `0 0% 100%` (pure white; dark: `222 47% 6%`), preserving
the kit's original look. The DS tints its page surface (`220 24% 98%`).
**Handling:** nothing to do — the stop name is the contract, the value is
brand. Don't "fix" a ported component that looks slightly flatter here; that's
the brand difference.

### 3. Primary — monochrome slate that inverts

This project's primary is the shadcn slate-navy: base `222 47% 11%` (light) →
**near-white `210 40% 98%` (dark)** — a monochrome brand where dark-mode
primary buttons are white-on-dark. The DS primary is a blue that stays
chromatic in dark (`214 50% 55%`).
**Handling:** components using `bg-primary text-primary-foreground` port
cleanly. But mid-scale stops (`primary-400…600`) are *desaturated slate* here,
not a vivid hue — a DS component that leans on `primary-500` for a colorful
tint will read as gray. If a design needs a chromatic pop in this project, use
the **accent** scale instead.

### 4. Accent — newly introduced, and a false friend

The old shadcn `accent` token was a gray hover fill (mapped away to
`neutral-100`). The DS `accent` role (a real brand accent) had no counterpart
here, so this migration **introduced** one: a blue ramp seeded from the kit's
dark-mode focus ring (`212 100% 67%`). The DS's accent is amber.
**Handling:** `bg-accent` in old shadcn snippets ≠ `bg-accent` in this system.
When pasting shadcn code, translate to `bg-neutral-100`; when porting DS
components, `accent-*` just works (blue here, amber there). Nothing in the app
uses the new accent yet — it's available headroom.

### 5. Feedback states — info/success/warning adopted, destructive kept

The kit had no info/success/warning scales; the DS values were adopted
**verbatim** (they're cross-project stable by convention — red means error
everywhere). Destructive keeps the kit's original red: base `0 84% 60%` light /
`0 63% 31%` dark (the DS runs `0 70% 50%` / `0 60% 55%`).
**Handling:** none for info/success/warning. For destructive, only the dark
*base role* diverges (darker buttons; white on 31% red ≈ 8:1). The dark
**ramp stops** deliberately sit at DS-equivalent (inverted) lightness —
anchoring the ramp to the darker base made text reds unreadable (~2:1) until
repositioned. Since the `de3a7ff` sync, verbatim-ported components carry **no
`dark:` feedback overrides at all** (e.g. RuleRow renders DON'T text as plain
`text-destructive-700`, which the inverted dark ramp lightens to 72% L).
Lesson for future ramps: a brand may move the base role, but scale stops must
keep the DS's perceptual positioning or verbatim-ported components break.

### 6. Focus ring

Light ring is the slate primary (`222 47% 11%`); dark ring is a vivid blue
(`212 100% 67%`) — kept from the kit. The DS uses its primary hue both modes.
**Handling:** none — `ring` stays a CSS-var role in the contract precisely so
this can differ per brand/mode.

### 7. Elevation & radius

Adopted from the DS verbatim: three role shadows (`shadow-raised/overlay/
modal`, deeper in dark) and `--radius: 0.5rem` (same value both projects). The
contract **clears Tailwind's default shadow ramp** — `shadow-md` et al. do not
exist. **Handling:** pick shadows by intent, never by size; if a ported
snippet uses `shadow-sm/md/lg/xl`, translate per the migration map above.

### 8. Dark-mode card surfaces

Previously dark cards (`222 47% 8%`) sat slightly above the dark page
(`222 47% 6%`). Under the two-tier model both are `neutral-50`; cards are
distinguished by `border-neutral-200` + `shadow-raised` (the DS convention).
`neutral-100` (dark: `222 47% 9%`) is the subtle-fill step if a raised surface
is ever needed.

### 9. Brand effects

`app/brand/effects.css` is intentionally empty — the kit ships no signature
surfaces (the DS ships `.marble-blue` / `.btn-marble` / `.amber-to-blue`).
**Handling:** the DS Button's `cta` variant depends on `.btn-marble`; this
kit's `cta` variant uses brand tokens instead. When porting any DS component,
grep it for effects classes and repoint them at tokens or add an equivalent to
`effects.css`.

### 10. Component set — full parity, five brand-adapted exceptions

The kit ships the complete DS component set (accordion, alert, avatar,
breadcrumbs, checkbox, dialog, dropdown-menu, empty-state, form-field, icon,
page-header, pagination, popover, radio-group, select, sheet, skeleton,
stat-card, switch, table, tabs, toast, toggle/toggle-group, typography, layout)
ported verbatim, plus kit-only extras the DS folds elsewhere or lacks:
`textarea`, `label`, `separator`, `spinner`.

**Five components are brand-adapted rather than verbatim** — `button`, `badge`,
`card`, `input`, `tooltip` keep the kit's treatment (e.g. the DS button is
uppercase mono with a marble `cta`; the kit's is sentence-case sans with a
token-based `cta`). Porting UI *between* projects: these five are the files to
diff first.

**Former select-don't-restyle exception (resolved):** DS `Heading` used to bake
`text-neutral-800` with no inverse option, so headings on `tone="brand"`
sections (BlockStats, BlockCTA) passed `className="text-primary-foreground"`
at the call site. The upstream contribution landed (DS commit `fd656ec`):
`Heading`/`Body` now ship `variant="inverse"` (plus `Heading`
`variant="watermark"` for ghost backdrop numerals), and the call-site
overrides have been removed.

**Avatar colors:** `app/brand/avatar-colors.ts` holds hex values by design —
it's brand swap surface (boring-avatars needs literal colors). Swap for the
kit's palette when the brand firms up.

### 11. Motion library

The DS imports `framer-motion`; this kit uses the successor package `motion`
(`import { motion } from "motion/react"`). **Handling:** rewrite the import
line when porting; the API is otherwise compatible. Both projects honor
reduced motion (contract media query + `MotionConfig`).

### 12. Workspace-rule exception no longer applies

`~/Dev-local/bluemonkeymakes/.claude/rules/design-system.md` lists the shadcn
neutral aliases (`--background`, `--card`, …) as "the one accepted exception"
to ADR-007. **This project no longer uses that exception** — it consumes
palette stops directly everywhere. Don't reintroduce alias tokens here.

## Porting checklist (either direction)

1. Colors/spacing/radius/z-index: classes port as-is — the contract is shared.
   Only *values* differ, and they come along automatically.
2. Grep the component for: `shadow-(sm|md|lg|xl)` (translate to roles), brand
   effects classes (repoint), `framer-motion` imports (→ `motion/react` here),
   raw headings relying on this kit's base font rule (add `font-display`).
3. Old shadcn snippets: run the token migration map above first.
4. Run the app typecheck and eyeball both themes — the inverted dark neutral
   scale makes most `dark:` overrides unnecessary; delete ones that survive a
   paste.
