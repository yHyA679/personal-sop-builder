"use client";

import { ButtonLink } from "@/src/components/ui/button";
import { useSop } from "@/src/features/sops/hooks/use-sop";
import { SopListSkeleton } from "./sop-list";
import { SopForm } from "./sop-form";

export function EditSopView({ id }: { id: number }) {
  const { sop, status, error } = useSop(id);
  if (status === "loading") return <main className="mx-auto max-w-4xl px-6 py-20"><SopListSkeleton /></main>;
  if (!sop) return <main className="grid min-h-screen place-items-center px-6 text-center"><div><p className="font-mono text-xs text-accent">{status === "not-found" ? "404 / PROCESS" : "LOAD ERROR"}</p><h1 className="mt-3 text-2xl font-semibold">{status === "not-found" ? "Process not found" : "Couldn’t load this process"}</h1><p className="mt-2 text-sm text-muted-foreground">{status === "not-found" ? "It may have been deleted or moved." : error}</p><ButtonLink href="/dashboard" className="mt-6">Back to processes</ButtonLink></div></main>;
  return <SopForm mode="edit" sop={sop} />;
}
