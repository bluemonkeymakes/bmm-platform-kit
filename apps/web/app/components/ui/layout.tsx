import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

/**
 * Layout primitives. Container + Section encode width / spacing / tone tokens —
 * worth componentizing. The 12-column grid itself is NOT a component: use
 * Tailwind grid utilities on a div (`grid grid-cols-12 gap-6`, `col-span-*`),
 * which the frontend standard explicitly allows. See the Layout page.
 */

/* ───────────────────────── Container ───────────────────────── */
const containerVariants = cva("mx-auto w-full px-6", {
  variants: {
    size: {
      reading: "max-w-[40.625rem]", // 650px — prose measure
      narrow: "max-w-3xl", // 768px
      standard: "max-w-5xl", // 1024px
      wide: "max-w-6xl", // 1152px
      full: "max-w-none",
    },
  },
  defaultVariants: { size: "standard" },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export function Container({ size, className, ...props }: ContainerProps) {
  return <div className={cn(containerVariants({ size }), className)} {...props} />;
}

/* ───────────────────────── HalfContainer (split) ───────────────────────── */
// Content aligns to the standard container's edge and fills to the horizontal
// center; the other half is left for a full-bleed sibling (image, panel).
// At < lg it stacks to full width.
export interface HalfContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "end";
  size?: VariantProps<typeof containerVariants>["size"];
}

export function HalfContainer({ align = "start", size = "standard", className, children, ...props }: HalfContainerProps) {
  return (
    <div className={cn(containerVariants({ size }))}>
      <div
        className={cn(
          "lg:w-1/2",
          align === "start" ? "lg:pr-10" : "lg:ml-auto lg:pl-10",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

/* ───────────────────────── Section ───────────────────────── */
// Vertical rhythm scale — the 4 padding steps from the Section Spacing standard.
// Default lg; xl is the page's one rest point (max one per page).
const sectionVariants = cva("w-full", {
  variants: {
    padding: {
      sm: "py-8 md:py-12", // the visual is the section (hero image/video)
      md: "py-12 md:py-16", // sub-sections inside long detail pages
      lg: "py-16 md:py-24", // default — most content blocks
      xl: "py-24 md:py-32", // climactic: hero / lead / closing CTA — one per page
    },
    tone: {
      default: "bg-neutral-50 text-neutral-800",
      muted: "bg-neutral-100 text-neutral-800",
      brand: "bg-primary text-primary-foreground",
    },
  },
  defaultVariants: { padding: "lg", tone: "default" },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {}

export function Section({ padding, tone, className, ...props }: SectionProps) {
  return <section className={cn(sectionVariants({ padding, tone }), className)} {...props} />;
}
