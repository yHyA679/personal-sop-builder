"use client";

import { useTheme, type ThemePreference } from "./providers/theme-provider";
import { CheckIcon, MoonIcon, SunIcon, SystemIcon } from "./ui/icons";
import { cn } from "@/src/lib/utils";

const themes: Array<{ value: ThemePreference; label: string; icon: typeof SunIcon }> = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: SystemIcon },
];

export function ThemeOptions() {
  const { theme, setTheme } = useTheme();
  return <div className="space-y-0.5" role="group" aria-label="Theme preference">{themes.map(({ value, label, icon: Icon }) => <button key={value} type="button" onClick={(event) => { setTheme(value); event.currentTarget.closest("details")?.removeAttribute("open"); }} aria-pressed={theme === value} className={cn("flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-surface-subtle", theme === value ? "text-foreground" : "text-muted-foreground")}><Icon size={17} /><span className="flex-1">{label}</span>{theme === value && <CheckIcon size={15} className="text-accent" />}</button>)}</div>;
}

export function ThemeMenu() {
  const { theme } = useTheme();
  const ActiveIcon = themes.find((item) => item.value === theme)?.icon ?? SystemIcon;
  return <details className="group relative"><summary className="grid size-9 cursor-pointer list-none place-items-center rounded-[9px] border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-subtle hover:text-foreground [&::-webkit-details-marker]:hidden" aria-label="Choose theme"><ActiveIcon size={17} /></summary><div className="absolute right-0 z-30 mt-2 w-40 rounded-xl border border-border bg-surface-raised p-1.5 shadow-[0_14px_40px_var(--shadow-color)]"><ThemeOptions /></div></details>;
}
