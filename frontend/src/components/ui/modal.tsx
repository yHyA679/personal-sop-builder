"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { XIcon } from "./icons";

export function Modal({ open, onClose, title, description, children }: { open: boolean; onClose: () => void; title: string; description?: string; children: ReactNode }) {
  const panelRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const panel = panelRef.current;
    const focusable = () => Array.from(panel?.querySelectorAll<HTMLElement>('button, a, input, textarea, [tabindex]:not([tabindex="-1"])') ?? []).filter((element) => !element.hasAttribute("disabled"));
    focusable()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const items = focusable();
        if (!items.length) return;
        const first = items[0]; const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; previousFocus?.focus(); };
  }, [open, onClose]);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-overlay p-0 backdrop-blur-[1px] sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="dialog-title" className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-border bg-surface-raised p-5 shadow-[0_24px_70px_var(--shadow-color)] sm:rounded-2xl sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div><h2 id="dialog-title" className="text-lg font-semibold tracking-[-.02em]">{title}</h2>{description && <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>}</div>
        <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-subtle hover:text-foreground" aria-label="Close dialog"><XIcon /></button>
      </div>
      {children}
    </section>
  </div>;
}
