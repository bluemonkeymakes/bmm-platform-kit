import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "~/lib/utils";

/**
 * Typography primitives. Font family, scale, line height, and weight live HERE —
 * pages never reach for text-* / font-* utilities. `as` is for semantics/SEO and
 * is fully decoupled from `size` (visual). Weight is a `variant`, never a prop.
 *
 * Marketing family: Heading, Body, Label.  Reading: Prose.  Behavioral: Code.
 */

/* ───────────────────────── Heading ───────────────────────── */
const headingVariants = cva("font-display text-neutral-800", {
  variants: {
    // Heading's own scale (7 steps). Maps to native Tailwind sizes.
    size: {
      sm: "text-xl",
      md: "text-2xl",
      lg: "text-3xl",
      xl: "text-4xl",
      "2xl": "text-5xl",
      "3xl": "text-6xl",
      "4xl": "text-7xl",
    },
    variant: {
      default: "font-medium leading-tight",
      // Display: marketing treatment — tighter tracking, balanced wrap.
      display: "font-medium leading-none tracking-tight text-balance",
      // Inverse: the display treatment for headings on brand-tone (inverted) sections.
      inverse: "font-medium leading-none tracking-tight text-balance text-primary-foreground",
      // Watermark: ghost display numerals/text — oversized backdrops (404 status, section numbers).
      watermark: "font-medium leading-none tracking-tight text-neutral-500/20",
    },
  },
  defaultVariants: { size: "lg", variant: "default" },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: React.ElementType;
}

export function Heading({ as, size, variant, className, ...props }: HeadingProps) {
  const Comp = as ?? "h2";
  return <Comp className={cn(headingVariants({ size, variant }), className)} {...props} />;
}

/* ───────────────────────── Body ───────────────────────── */
const bodyVariants = cva("font-sans", {
  variants: {
    // Body's own scale (6 steps). Smallest step (xs) is the caption case.
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
    },
    variant: {
      default: "text-neutral-700 leading-normal",
      muted: "text-neutral-500 leading-normal",
      // Lead = the deck/subheader: lighter, roomier, balanced wrap.
      lead: "text-neutral-600 leading-relaxed text-pretty",
      // Inverse: body copy on brand-tone (inverted) sections.
      inverse: "text-primary-foreground/80 leading-normal",
    },
  },
  defaultVariants: { size: "base", variant: "default" },
});

export interface BodyProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof bodyVariants> {
  as?: React.ElementType;
  /** Constrain to a comfortable reading measure (~65ch). */
  measure?: boolean;
}

export function Body({ as, size, variant, measure, className, ...props }: BodyProps) {
  const Comp = as ?? "p";
  return (
    <Comp
      className={cn(bodyVariants({ size, variant }), measure && "max-w-measure", className)}
      {...props}
    />
  );
}

/* ───────────────────────── Label ───────────────────────── */
// Eyebrow AND functional field label — same treatment, placement is the caller's.
// Rides the accent face (mono in this baseline).
const labelVariants = cva("font-inconsolata uppercase tracking-wider font-medium", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
    },
    variant: {
      default: "text-neutral-500",
      accent: "text-primary",
    },
  },
  defaultVariants: { size: "sm", variant: "default" },
});

export interface LabelProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof labelVariants> {
  as?: React.ElementType;
  htmlFor?: string;
}

export function Label({ as, size, variant, className, ...props }: LabelProps) {
  const Comp = as ?? "span";
  return <Comp className={cn(labelVariants({ size, variant }), className)} {...props} />;
}

/* ───────────────────────── Code (inline) ───────────────────────── */
// The mono face for inline tokens / commands. The BLOCK variant with copy +
// highlighting is the behavioral CodeBlock component (components/ds/CodeBlock).
export function Code({ className, ...props }: React.ComponentPropsWithoutRef<"code">) {
  return (
    <code
      className={cn(
        "font-inconsolata rounded bg-neutral-100 px-1.5 py-0.5 text-[0.9em] text-neutral-800",
        className,
      )}
      {...props}
    />
  );
}

/* ───────────────────────── Prose (reading scale) ───────────────────────── */
// Wraps rich/CMS/markdown content you can't compose element-by-element. Its own
// READING scale — larger body + generous leading, distinct from the marketing
// Heading/Body scales.
interface ProseProps {
  children?: React.ReactNode;
  className?: string;
  /** Render CMS/markdown HTML (already sanitized). */
  html?: string;
}

const proseClass = cn(
  "max-w-[68ch] text-neutral-700",
  "[&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-neutral-800 [&_h2]:leading-tight [&_h2]:mt-10 [&_h2]:mb-3",
  "[&_h3]:font-display [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-neutral-800 [&_h3]:mt-8 [&_h3]:mb-2",
  "[&_p]:text-lg [&_p]:leading-relaxed [&_p]:my-4",
  "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6",
  "[&_li]:text-lg [&_li]:leading-relaxed [&_li]:my-1",
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
  "[&_strong]:text-neutral-800 [&_strong]:font-medium",
  "[&_code]:font-inconsolata [&_code]:rounded [&_code]:bg-neutral-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em]",
  "[&_blockquote]:border-l-2 [&_blockquote]:border-neutral-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-600",
);

export function Prose({ children, className, html }: ProseProps) {
  if (html)
    return (
      // biome-ignore lint/security/noDangerouslySetInnerHtml: explicit escape hatch for trusted, pre-rendered HTML (e.g. compiled markdown) — never pass user input
      <div className={cn(proseClass, className)} dangerouslySetInnerHTML={{ __html: html }} />
    );
  return <div className={cn(proseClass, className)}>{children}</div>;
}
