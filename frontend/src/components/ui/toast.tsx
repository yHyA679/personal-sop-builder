import type { Toast } from "@/src/lib/types";
import { AlertIcon, CheckIcon } from "./icons";

export function ToastRegion({ toasts }: { toasts: Toast[] }) {
  return <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[80] flex flex-col items-center gap-2 sm:items-end" role="region" aria-label="Notifications" aria-live="polite">
    {toasts.map((toast) => <div key={toast.id} className="toast-in flex w-full max-w-sm items-center gap-3 rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm shadow-[0_12px_30px_var(--shadow-color)]">
      <span className={toast.tone === "error" ? "text-destructive" : "text-accent"}>{toast.tone === "error" ? <AlertIcon /> : <CheckIcon />}</span>
      <span className="font-medium text-foreground">{toast.message}</span>
    </div>)}
  </div>;
}
