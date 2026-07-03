import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "~/lib/utils";

/**
 * Icon — single sizing/contract wrapper around a Lucide icon. Colour is inherited
 * (`currentColor`), so icons follow the surrounding text token automatically and
 * stay dark-aware. Sizes map to the foundation scale: 16 / 20 / 24 / 32.
 */
const iconVariants = cva("inline-block shrink-0", {
  variants: {
    size: {
      xs: "size-4", // 16px
      sm: "size-5", // 20px
      md: "size-6", // 24px
      lg: "size-8", // 32px
    },
  },
  defaultVariants: { size: "sm" },
});

export interface IconProps
  extends Omit<React.SVGProps<SVGSVGElement>, "ref">,
    VariantProps<typeof iconVariants> {
  icon: LucideIcon;
}

export function Icon({ icon: Glyph, size, className, ...props }: IconProps) {
  return <Glyph aria-hidden className={cn(iconVariants({ size }), className)} {...props} />;
}

export { iconVariants };
