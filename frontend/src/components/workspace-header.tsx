"use client";

import { Brand } from "./brand";
import { useApp } from "./providers/app-provider";
import { ChevronDownIcon, LogoutIcon } from "./ui/icons";
import { ThemeOptions } from "./theme-selector";

export function WorkspaceHeader() {
  const { user, logout } = useApp();
  if (!user) return null;
  const initials = user.fullName.split(" ").map((name) => name[0]).slice(0, 2).join("");
  return <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm"><div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5 sm:px-8"><Brand /><details className="group relative"><summary className="flex cursor-pointer list-none items-center gap-2 rounded-[9px] p-1.5 pr-2.5 text-sm hover:bg-surface-subtle [&::-webkit-details-marker]:hidden"><span className="grid size-8 place-items-center rounded-lg bg-avatar-background text-xs font-semibold text-avatar-foreground">{initials}</span><span className="hidden max-w-36 truncate font-medium sm:block">{user.fullName}</span><ChevronDownIcon className="text-muted-foreground transition-transform group-open:rotate-180" /></summary><div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-surface-raised p-1.5 shadow-[0_14px_40px_var(--shadow-color)]"><div className="border-b border-border px-3 py-2.5"><p className="truncate text-sm font-medium">{user.fullName}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p></div><div className="border-b border-border py-1.5"><p className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[.12em] text-muted-foreground">Theme</p><ThemeOptions /></div><button onClick={() => void logout()} className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-surface-subtle hover:text-foreground"><LogoutIcon />Log out</button></div></details></div></header>;
}

export function Workspace({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen"><WorkspaceHeader />{children}</div>;
}
