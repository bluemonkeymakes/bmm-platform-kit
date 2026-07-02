import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "~/lib/utils";

/**
 * Toast — transient, non-blocking feedback. Provider + `useToast()` hook.
 * Token-pure: every variant pulls from the semantic palette, so a brand change
 * re-skins it. Generalised from the showcase-only CopyToast.
 */
type ToastVariant = "default" | "success" | "warning" | "destructive" | "info";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  /** ms before auto-dismiss; 0 keeps it until dismissed. Default 4000. */
  duration?: number;
}

interface ToastRecord extends Required<Omit<ToastOptions, "description">> {
  id: number;
  description?: string;
}

interface ToastContextValue {
  toast: (opts: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => 0,
  dismiss: () => {},
});

const VARIANT_ICON = {
  default: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: XCircle,
  info: Info,
} as const;

const VARIANT_ACCENT: Record<ToastVariant, string> = {
  default: "text-primary",
  success: "text-success-500",
  warning: "text-warning-600",
  destructive: "text-destructive",
  info: "text-info-500",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const counter = useRef(0);
  const timers = useRef<Map<number, number>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const handle = timers.current.get(id);
    if (handle) {
      window.clearTimeout(handle);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "default", duration = 4000 }: ToastOptions) => {
      counter.current += 1;
      const id = counter.current;
      setToasts((list) => [...list, { id, title, description, variant, duration }]);
      if (duration > 0) {
        timers.current.set(
          id,
          window.setTimeout(() => dismiss(id), duration)
        );
      }
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-6 right-6 z-toast flex w-full max-w-sm flex-col gap-2"
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const Glyph = VARIANT_ICON[t.variant];
            return (
              <motion.div
                key={t.id}
                role="status"
                layout
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 12, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="pointer-events-auto flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3.5 shadow-overlay"
              >
                <Glyph className={cn("mt-0.5 size-5 shrink-0", VARIANT_ACCENT[t.variant])} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-800">{t.title}</p>
                  {t.description && (
                    <p className="mt-0.5 text-sm text-neutral-500">{t.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  className="rounded-sm text-neutral-400 outline-none transition-colors hover:text-neutral-800 focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                >
                  <X className="size-4" />
                  <span className="sr-only">Dismiss</span>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
