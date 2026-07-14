# Design-system notes — token model, primitive diffs & porting rules

The web app uses a two-layer CSS token model:

- **`app/system/theme.css` is the contract.** It defines the roles, scales, and
  z-ladder, and it is meant to travel unchanged between projects. Treat it as
  vendored: don't edit it here.
- **`app/brand/` is the swap surface.** It holds this project's actual values
  (color ramps, fonts, effects). Re-branding means editing this directory and
  nothing else.

The model is deliberately **two-tier, with no surface-alias tokens**: components
consume palette stops directly (`bg-neutral-50`) rather than going through
semantic aliases (`bg-background`). That keeps one indirection out of the system
and makes the token lint (`npm run lint:tokens`) able to prove purity mechanically.

This doc catalogues where these primitives **differ from the upstream reference
design system** they were ported from, why, and the rule for handling each diff
when porting a component in either direction. It's the companion to the browsable
`/style-guide` routes. If you're just consuming the kit, you mostly need the
[porting checklist](#porting-checklist-either-direction) at the end.

## Architecture (identical to the reference — no diff)

```
app/app.css            entry — chains the imports below
├── brand/fonts.css    @fontsource imports + --brand-font-* choices   (SWAP)
├── system/theme.css   the @theme contract — roles, scales, ladder    (TRAVELS)
├── brand/brand.css    HSL values for every role/scale, :root + .dark (SWAP)
└── brand/effects.css  signature decorative surfaces                  (SWAP)
```

`system/theme.css` is the shared contract. **Never edit it here.** If you need a
new role, scale stop, or ladder step, add it to the contract deliberately and
re-copy, rather than patching this project's copy in place — otherwise the next
sync silently reverts you.

The contract currently provides, beyond the obvious roles and scales: two
z-ladder steps worth knowing (`z-raised` 10, for content lifted above a
decorative layer *inside* the same component, and `z-tooltip` 75), the
`scrollbar-app` thin-scrollbar utility, `--container-measure` wired into
`Container size="reading"` (so `max-w-measure` replaces any arbitrary
`max-w-[40.625rem]`), the shared `PageIntro` + `SpecimenSection` showcase
primitives in `components/ds/`, and a `CardTitle` size axis. `lint:tokens` flags
Tailwind's **numeric `z-50`** as well: the whole numeric z scale is banned, named
ladder steps only.

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
**ramp stops** deliberately sit at reference-equivalent (inverted) lightness:
anchoring the ramp to the darker base made text reds unreadable (~2:1) until
repositioned. Verbatim-ported components therefore carry **no `dark:` feedback
overrides at all** (e.g. RuleRow renders DON'T text as plain
`text-destructive-700`, which the inverted dark ramp lightens to 72% L).
Lesson for future ramps: a brand may move the base role, but scale stops must
keep the reference's perceptual positioning or verbatim-ported components break.

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

**Former select-don't-restyle exception (resolved):** `Heading` used to bake
`text-neutral-800` with no inverse option, so headings on `tone="brand"`
sections (BlockStats, BlockCTA) passed `className="text-primary-foreground"`
at the call site. That is fixed at the source: `Heading`/`Body` now ship
`variant="inverse"` (plus `Heading` `variant="watermark"` for ghost backdrop
numerals), and the call-site overrides have been removed. Kept here as the
worked example of the rule: when a component can't express your intent, add a
variant to the component rather than restyling it from the outside.

**Avatar colors:** `app/brand/avatar-colors.ts` holds hex values by design —
it's brand swap surface (boring-avatars needs literal colors). Swap for the
kit's palette when the brand firms up.

### 11. Motion library

The reference imports `framer-motion`; this kit uses the successor package
`motion` (`import { motion } from "motion/react"`). **Handling:** rewrite the
import line when porting. The API is otherwise compatible, and both honor
reduced motion (contract media query + `MotionConfig`).

### 12. No shadcn alias tokens

Stock shadcn ships neutral alias tokens (`--background`, `--card`, …). This kit
does **not** use them: it consumes palette stops directly everywhere, per the
two-tier model at the top of this doc. Don't reintroduce alias tokens when
porting a component in from stock shadcn — map them to the palette instead
(`bg-background` → `bg-neutral-50`). `lint:tokens` will not catch this for you,
because an alias is a legal CSS variable. It's a review rule.

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
