import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface CopyToastValue {
  /**
   * Write `value` to the clipboard and surface a confirmation toast.
   * Pass `label` to show friendlier text (e.g. "code snippet") instead of the
   * raw value — useful when the value is long or multi-line.
   */
  copy: (value: string, label?: string) => Promise<boolean>;
}

const CopyToastContext = createContext<CopyToastValue>({
  copy: async () => false,
});

interface ToastState {
  /** What renders in the toast — either the raw value or a friendly label. */
  display: string;
  /** Whether to render `display` as code (raw token) or plain text (label). */
  asCode: boolean;
  id: number;
}

export function CopyToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const counter = useRef(0);
  const timer = useRef<number | null>(null);

  const copy = useCallback(async (value: string, label?: string) => {
    try {
      await navigator.clipboard.writeText(value);
      counter.current += 1;
      setToast({ display: label ?? value, asCode: !label, id: counter.current });
      return true;
    } catch {
      // Clipboard blocked (insecure context / permissions). Signal failure so
      // callers can fall back; no toast, since nothing was copied.
      return false;
    }
  }, []);

  // Auto-dismiss — re-armed whenever a new toast id appears.
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed to toast.id on purpose — same-content re-copies must restart the timer, other toast fields must not
  useEffect(() => {
    if (!toast) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2000);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [toast?.id]);

  return (
    <CopyToastContext.Provider value={{ copy }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-toast flex justify-center px-4"
      >
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              role="status"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="pointer-events-auto flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 shadow-overlay"
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-success-500/15">
                <Check className="size-3.5 text-success-500" />
              </span>
              <span className="text-sm text-neutral-800">
                Copied{" "}
                {toast.asCode ? (
                  <code className="font-inconsolata text-primary">{toast.display}</code>
                ) : (
                  <span className="font-medium">{toast.display}</span>
                )}{" "}
                to clipboard
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CopyToastContext.Provider>
  );
}

export function useCopyToast() {
  return useContext(CopyToastContext);
}
