import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "~/lib/utils";
import { useCopyToast } from "~/components/ds/CopyToast";

/**
 * Tracks the most recently copied key so a row of swatches only flashes the
 * stop that was actually clicked. The provider handles the clipboard write and
 * the confirmation toast; the returned `copiedKey` drives the inline check.
 */
function useCopyKey() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { copy: copyToClipboard } = useCopyToast();
  async function copy(key: string, value: string) {
    const ok = await copyToClipboard(value);
    if (!ok) return;
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1200);
  }
  return { copiedKey, copy };
}

interface SwatchProps {
  variable: string;
  label: string;
  textClass?: string;
  className?: string;
}

export function TokenSwatch({ variable, label, textClass, className }: SwatchProps) {
  const { copiedKey, copy } = useCopyKey();
  const copied = copiedKey === variable;
  return (
    <button
      type="button"
      onClick={() => copy(variable, `var(${variable})`)}
      title={`Copy var(${variable})`}
      className="group flex flex-col gap-1.5 text-left outline-none"
    >
      <div
        className={cn("relative h-12 w-full rounded-lg border border-neutral-200/50", className)}
        style={{ background: `hsl(var(${variable}))` }}
      >
        {/* Subtle corner affordance — fades in on hover, confirms on copy */}
        <span
          className={cn(
            "absolute top-1 right-1 flex size-5 items-center justify-center rounded-md bg-neutral-800/15 text-white backdrop-blur-sm transition-opacity",
            copied ? "opacity-100" : "opacity-0 group-hover:opacity-70 group-focus-visible:opacity-70"
          )}
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
        </span>
      </div>
      <div>
        <p className={cn("text-xs font-medium font-inconsolata", textClass)}>{label}</p>
        <p className="text-xs text-neutral-500 font-inconsolata">{variable}</p>
      </div>
    </button>
  );
}

interface ScaleRowProps {
  name: string;
  stops: { stop: string; variable: string; use: string }[];
}

export function ScaleRow({ name, stops }: ScaleRowProps) {
  const { copiedKey, copy } = useCopyKey();
  return (
    <div>
      <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider font-inconsolata mb-2">{name}</p>
      <div className="grid grid-cols-5 md:grid-cols-10 gap-1">
        {stops.map(({ stop, variable, use }) => {
          const copied = copiedKey === variable;
          return (
            <button
              key={stop}
              type="button"
              onClick={() => copy(variable, `var(${variable})`)}
              title={`${use} — click to copy var(${variable})`}
              className="group flex flex-col gap-1 text-left outline-none"
            >
              <div
                className={cn(
                  "relative h-10 rounded-md border transition-colors",
                  copied ? "border-neutral-800/40" : "border-neutral-200/30 group-hover:border-neutral-800/30 group-focus-visible:border-neutral-800/30"
                )}
                style={{ background: `hsl(var(${variable}))` }}
              >
                <span
                  className={cn(
                    "absolute inset-0 flex items-center justify-center rounded-md bg-neutral-800/10 transition-opacity",
                    copied ? "opacity-100" : "opacity-0"
                  )}
                >
                  {copied && <Check className="size-3 text-white drop-shadow" />}
                </span>
              </div>
              {/* Style-guide meta tool only — 0.625rem is below the production text-xs floor */}
              <p className="text-2xs text-center text-neutral-500 font-inconsolata leading-none">{stop}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
