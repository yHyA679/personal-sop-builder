"use client";

import { useEffect, useState } from "react";
import { Workspace } from "@/src/components/workspace-header";
import { useApp } from "@/src/components/providers/app-provider";
import { ButtonLink } from "@/src/components/ui/button";
import { PlusIcon, SearchIcon, XIcon } from "@/src/components/ui/icons";
import { EmptySopState, LoadError, NoResults, SopList, SopListSkeleton } from "./sop-list";

export function DashboardView() {
  const { sops, status, loadSops, notify } = useApp(); const [search, setSearch] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => { void loadSops(search).catch((error: unknown) => notify(error instanceof Error ? error.message : "The processes could not be loaded.", "error")); }, 300);
    return () => window.clearTimeout(timer);
  }, [search, loadSops, notify]);
  return <Workspace><main className="mx-auto w-full max-w-[1180px] px-5 pb-16 pt-10 sm:px-8 sm:pt-14"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="font-mono text-xs font-medium uppercase tracking-[.14em] text-accent">Your workspace</p><h1 className="mt-2 text-[2.25rem] font-semibold tracking-[-.05em] sm:text-[2.75rem]">My Processes</h1><p className="mt-2 max-w-lg text-[15px] leading-6 text-muted-foreground">Keep the processes you rely on clear, current, and easy to follow.</p></div><ButtonLink href="/sops/new" size="lg"><PlusIcon />New Process</ButtonLink></div>
    <div className="mt-10 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between"><div className="relative w-full sm:max-w-sm"><SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title or description" className="h-10 w-full rounded-[9px] border border-border-strong bg-surface pl-10 pr-10 text-sm placeholder:text-placeholder hover:border-input-hover focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15" aria-label="Search processes" />{search && <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-surface-subtle hover:text-foreground" aria-label="Clear search"><XIcon size={16} /></button>}</div>{status === "ready" && sops.length > 0 && <p className="text-xs text-muted-foreground">{sops.length} {search.trim() ? "results" : "processes"}</p>}</div>
    <div className="mt-6">{status === "loading" || status === "idle" ? <SopListSkeleton /> : status === "error" ? <LoadError onRetry={() => void loadSops(search)} /> : sops.length === 0 && !search.trim() ? <EmptySopState /> : sops.length === 0 ? <NoResults search={search} onClear={() => setSearch("")} /> : <SopList sops={sops} />}</div>
  </main></Workspace>;
}
