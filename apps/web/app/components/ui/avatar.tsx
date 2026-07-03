import BoringAvatar from "boring-avatars";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { avatarColors, avatarVariant } from "~/brand/avatar-colors";
import { cn } from "~/lib/utils";

const avatarVariants = cva(
  "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-neutral-100 font-medium text-neutral-600",
  {
    variants: {
      size: {
        sm: "size-7 text-xs",
        md: "size-9 text-sm",
        lg: "size-12 text-base",
        xl: "size-24 text-2xl",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const SIZE_PX = { sm: 28, md: 36, lg: 48, xl: 96 } as const;

export interface AvatarProps
  extends Omit<React.ComponentProps<"span">, "children">,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  /** Seed for the default generated avatar (and source of initials). */
  name?: string;
  /** Initials to show instead of a generated avatar (opt out of boring-avatars). */
  fallback?: string;
}

/**
 * Avatar. By default an entity with a `name` renders a deterministic
 * boring-avatars graphic (https://boringavatars.com) — the studio default
 * unless otherwise defined. Precedence: a real `src` image wins; then an
 * explicit `fallback` (initials); otherwise the generated avatar from `name`.
 */
export function Avatar({
  className,
  size = "md",
  src,
  alt = "",
  name,
  fallback,
  ...props
}: AvatarProps) {
  const [failed, setFailed] = React.useState(false);
  const px = SIZE_PX[size ?? "md"];

  let inner: React.ReactNode;
  if (src && !failed) {
    inner = (
      <img src={src} alt={alt} className="size-full object-cover" onError={() => setFailed(true)} />
    );
  } else if (fallback) {
    // Initials are presentational; the name (when known) is the accessible label.
    inner = name ? (
      <span role="img" aria-label={name}>
        <span aria-hidden>{fallback}</span>
      </span>
    ) : (
      <span aria-hidden>{fallback}</span>
    );
  } else if (name) {
    // Default: boring-avatars, seeded by the name and themed by the brand palette.
    // The generated svg carries role="img" with no name — hide it, label the wrapper.
    inner = (
      <span role="img" aria-label={name} className="block size-full">
        <span aria-hidden className="block size-full">
          <BoringAvatar name={name} variant={avatarVariant} colors={avatarColors} size={px} />
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        avatarVariants({ size }),
        name && !src && !fallback && "bg-transparent",
        className,
      )}
      {...props}
    >
      {inner}
    </span>
  );
}

export { avatarVariants };
