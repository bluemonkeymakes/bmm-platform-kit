import { cn } from "~/lib/utils";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export function H1({ children, className }: TypographyProps) {
  return (
    <h1
      className={cn(
        "font-display text-4xl font-normal leading-snug tracking-tight text-balance sm:text-5xl lg:text-6xl",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className }: TypographyProps) {
  return (
    <h2
      className={cn(
        "font-display text-3xl font-normal leading-snug tracking-tight text-balance sm:text-4xl",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className }: TypographyProps) {
  return (
    <h3 className={cn("font-display text-2xl font-normal leading-snug tracking-tight", className)}>
      {children}
    </h3>
  );
}

export function H4({ children, className }: TypographyProps) {
  return (
    <h4 className={cn("font-display text-xl font-normal leading-snug tracking-tight", className)}>
      {children}
    </h4>
  );
}

export function H5({ children, className }: TypographyProps) {
  return (
    <h5 className={cn("font-display text-lg font-normal leading-snug", className)}>
      {children}
    </h5>
  );
}

export function H6({ children, className }: TypographyProps) {
  return (
    <h6 className={cn("font-display text-base font-normal leading-snug", className)}>
      {children}
    </h6>
  );
}

export function SectionLabel({ children, className }: TypographyProps) {
  return (
    <p
      className={cn(
        "font-sans text-sm font-normal uppercase tracking-widest text-neutral-500",
        className
      )}
    >
      {children}
    </p>
  );
}

export function Lead({ children, className }: TypographyProps) {
  return (
    <p className={cn("font-sans text-lg text-neutral-500 md:text-xl leading-relaxed", className)}>
      {children}
    </p>
  );
}

export function Text({ children, className }: TypographyProps) {
  return (
    <p className={cn("font-sans text-base text-neutral-500 leading-relaxed", className)}>
      {children}
    </p>
  );
}

export function Small({ children, className }: TypographyProps) {
  return (
    <p className={cn("font-sans text-sm text-neutral-500", className)}>
      {children}
    </p>
  );
}

export function InlineCode({ children, className }: TypographyProps) {
  return (
    <code
      className={cn(
        "font-mono text-sm bg-neutral-100 px-1.5 py-0.5 rounded",
        className
      )}
    >
      {children}
    </code>
  );
}

export function Prose({
  children,
  className,
  html,
}: Omit<TypographyProps, "children"> & { children?: React.ReactNode; html?: string }) {
  if (html) {
    return (
      <div
        className={cn("prose prose-neutral dark:prose-invert max-w-none", className)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return (
    <div className={cn("prose prose-neutral dark:prose-invert max-w-none", className)}>
      {children}
    </div>
  );
}
