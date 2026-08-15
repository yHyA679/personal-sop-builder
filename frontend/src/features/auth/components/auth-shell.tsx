import type { ReactNode } from "react";
import { Brand } from "@/src/components/brand";
import { GuestRoute } from "@/src/components/auth-gates";
import { CheckIcon } from "@/src/components/ui/icons";
import { ThemeMenu } from "@/src/components/theme-selector";

export function AuthShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return <GuestRoute><main className="min-h-screen bg-surface lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(480px,.95fr)]">
    <section className="relative hidden min-h-screen overflow-hidden border-r border-border bg-auth-panel lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
      <div className="app-grid absolute inset-0 opacity-50" /><div className="relative"><Brand href="/" /></div>
      <div className="relative max-w-xl pb-[8vh]"><p className="mb-5 font-mono text-xs font-medium uppercase tracking-[.16em] text-accent">Clarity, repeated</p><h2 className="max-w-lg text-[clamp(2.5rem,4vw,4.5rem)] font-semibold leading-[1.01] tracking-[-.055em]">Turn repeated work into clear, reusable processes.</h2><p className="mt-7 max-w-md text-lg leading-8 text-muted-foreground">A calm place for the step-by-step workflows that keep your best work consistent.</p></div>
      <div className="relative flex items-center gap-3 text-sm text-muted-foreground"><span className="grid size-6 place-items-center rounded-full bg-accent-soft text-accent"><CheckIcon size={14} /></span>Built for personal workflows, not busywork.</div>
    </section>
    <section className="flex min-h-screen flex-col"><div className="flex items-center justify-between p-6 lg:absolute lg:right-6 lg:top-6 lg:z-10 lg:p-0"><span className="lg:hidden"><Brand href="/" /></span><ThemeMenu /></div><div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-14"><div className="w-full max-w-[430px]"><p className="mb-3 font-mono text-xs font-medium uppercase tracking-[.14em] text-accent">{eyebrow}</p><h1 className="text-[2rem] font-semibold tracking-[-.045em] sm:text-[2.25rem]">{title}</h1><p className="mt-3 text-[15px] leading-6 text-muted-foreground">{description}</p><div className="mt-9">{children}</div></div></div><p className="px-6 pb-6 text-center text-xs text-muted-foreground">Your procedures stay private to your workspace.</p></section>
  </main></GuestRoute>;
}
