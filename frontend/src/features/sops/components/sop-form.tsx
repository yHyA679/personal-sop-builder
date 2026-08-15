"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useApp } from "@/src/components/providers/app-provider";
import { Button } from "@/src/components/ui/button";
import { ArrowLeftIcon, CheckIcon } from "@/src/components/ui/icons";
import { Workspace } from "@/src/components/workspace-header";
import type { Sop, Step } from "@/src/lib/types";
import { StepEditor } from "./step-editor";

const initialSteps: Step[] = [{ id: -1, content: "", order: 1 }];

export function SopForm({ mode, sop }: { mode: "create" | "edit"; sop?: Sop }) {
  const router = useRouter(); const { createSop, updateSop, notify } = useApp();
  const initial = useMemo(() => ({ title: sop?.title ?? "", description: sop?.description ?? "", steps: sop?.steps ?? initialSteps }), [sop]);
  const [title, setTitle] = useState(initial.title); const [description, setDescription] = useState(initial.description); const [steps, setSteps] = useState(initial.steps); const [errors, setErrors] = useState<{ title?: string; form?: string; steps: Record<number, string> }>({ steps: {} }); const [saving, setSaving] = useState(false);
  const dirty = title !== initial.title || description !== initial.description || JSON.stringify(steps) !== JSON.stringify(initial.steps);
  useEffect(() => { const handler = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); }; window.addEventListener("beforeunload", handler); return () => window.removeEventListener("beforeunload", handler); }, [dirty]);
  function changeTitle(value: string) { setTitle(value); setErrors((current) => ({ ...current, form: undefined, title: value.trim() ? undefined : current.title })); }
  function changeSteps(nextSteps: Step[]) {
    setSteps(nextSteps);
    setErrors((current) => {
      const nextStepErrors = { ...current.steps };
      const liveStepIds = new Set(nextSteps.map((step) => step.id));
      for (const key of Object.keys(nextStepErrors)) {
        const stepId = Number(key);
        const step = nextSteps.find((item) => item.id === stepId);
        if ((!liveStepIds.has(stepId) && stepId !== 0) || step?.content.trim() || (stepId === 0 && nextSteps.length > 0)) delete nextStepErrors[stepId];
      }
      return { ...current, form: undefined, steps: nextStepErrors };
    });
  }
  async function submit(event: FormEvent) { event.preventDefault(); const stepErrors: Record<number, string> = {}; if (steps.length === 0) stepErrors[0] = "Add at least one step."; steps.forEach((step) => { if (!step.content.trim()) stepErrors[step.id] = "Step content is required."; }); const nextErrors = { title: title.trim() ? undefined : "Give this process a clear title.", steps: stepErrors }; setErrors(nextErrors); if (nextErrors.title || Object.keys(stepErrors).length) return; setSaving(true); try { const draft = { title: title.trim(), description: description.trim(), steps: steps.map((step) => ({ ...step, content: step.content.trim() })) }; const saved = mode === "create" ? await createSop(draft) : await updateSop(sop!.id, draft); notify(mode === "create" ? "Process created." : "Changes saved."); router.push(`/sops/${saved.id}`); } catch (value) { const message = value instanceof Error ? value.message : "Your changes could not be saved."; setErrors((current) => ({ ...current, form: message })); notify(message, "error"); } finally { setSaving(false); } }
  const cancelHref = mode === "edit" && sop ? `/sops/${sop.id}` : "/dashboard";
  return <Workspace><form onSubmit={submit}><div className="border-b border-border bg-surface"><div className="mx-auto flex min-h-16 max-w-[1040px] items-center justify-between gap-3 px-5 py-3 sm:px-8"><Link href={cancelHref} className="inline-flex min-w-0 items-center gap-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeftIcon /><span className="truncate">{mode === "create" ? "Back to processes" : "Back to process"}</span></Link><div className="flex shrink-0 items-center gap-2"><Link href={cancelHref} className="hidden h-10 items-center rounded-[9px] border border-border-strong bg-surface px-4 text-sm font-medium hover:bg-surface-subtle sm:inline-flex">Cancel</Link><Button type="submit" disabled={saving}>{saving ? <><span className="size-4 animate-spin rounded-full border-2 border-current/35 border-t-current" />Saving…</> : <><CheckIcon />{mode === "create" ? "Save process" : "Save changes"}</>}</Button></div></div></div>
    <main className="mx-auto grid w-full max-w-[1040px] gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-16"><div className="min-w-0"><div className="mb-10"><p className="font-mono text-xs font-medium uppercase tracking-[.14em] text-accent">{mode === "create" ? "New process" : "Editing process"}</p><h1 className="mt-2 text-[2rem] font-semibold tracking-[-.045em] sm:text-[2.5rem]">{mode === "create" ? "Build a clear process" : "Refine this process"}</h1><p className="mt-3 max-w-xl text-[15px] leading-6 text-muted-foreground">Write for the moment you’ll actually use it: direct, ordered, and easy to scan.</p></div>{errors.form && <div className="mb-6 rounded-[9px] border border-destructive-border bg-destructive-soft px-4 py-3 text-sm text-destructive" role="alert">{errors.form}</div>}<div className="space-y-6"><div><label htmlFor="title" className="mb-2 block text-sm font-medium">Title <span className="text-destructive">*</span></label><input id="title" dir="auto" value={title} onChange={(event) => changeTitle(event.target.value)} placeholder="e.g. Deploy a production release" className="h-12 w-full rounded-[9px] border border-border-strong bg-surface px-4 text-[16px] font-medium placeholder:font-normal placeholder:text-placeholder hover:border-input-hover focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15" aria-invalid={!!errors.title} aria-describedby={errors.title ? "title-error" : undefined} />{errors.title && <p id="title-error" className="mt-1.5 text-xs text-destructive">{errors.title}</p>}</div><div><label htmlFor="description" className="mb-2 block text-sm font-medium">Description <span className="font-normal text-muted-foreground">Optional</span></label><textarea id="description" dir="auto" value={description} onChange={(event) => { setDescription(event.target.value); setErrors((current) => ({ ...current, form: undefined })); }} rows={3} placeholder="What is this process for?" className="w-full resize-y rounded-[9px] border border-border-strong bg-surface px-4 py-3 text-[15px] leading-6 placeholder:text-placeholder hover:border-input-hover focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15" /></div></div><div className="my-10 h-px bg-border" /><StepEditor steps={steps} onChange={changeSteps} errors={errors.steps} /></div>
      <aside className="hidden lg:block"><div className="sticky top-24 border-l border-border pl-5"><p className="text-xs font-semibold uppercase tracking-[.1em] text-muted-foreground">Writing well</p><ul className="mt-4 space-y-4 text-sm leading-5 text-muted-foreground"><li><span className="mb-1 block font-medium text-foreground">Start with a verb</span>Use “Open”, “Check”, or “Send” to make actions unmistakable.</li><li><span className="mb-1 block font-medium text-foreground">One action per step</span>Short steps are easier to follow and reorder.</li><li><span className="mb-1 block font-medium text-foreground">Keep the order honest</span>Drag steps or use the arrow controls to reorder.</li></ul>{dirty && <div className="mt-7 flex items-center gap-2 border-t border-border pt-5 text-xs font-medium text-warning"><span className="size-1.5 rounded-full bg-warning-dot" />Unsaved changes</div>}</div></aside>
    </main></form></Workspace>;
}
