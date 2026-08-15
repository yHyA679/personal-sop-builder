"use client";

import { useLayoutEffect, useRef, useState, type ChangeEvent } from "react";
import { Button } from "@/src/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon, GripIcon, PlusIcon, TrashIcon } from "@/src/components/ui/icons";
import type { Step } from "@/src/lib/types";
import { cn } from "@/src/lib/utils";

let nextTemporaryStepId = -2;

function StepTextarea({ id, value, invalid, onChange }: { id: string; value: string; invalid: boolean; onChange: (value: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const resize = (element: HTMLTextAreaElement) => {
    element.style.height = "0px";
    element.style.height = `${Math.min(element.scrollHeight, 160)}px`;
  };
  useLayoutEffect(() => { if (ref.current) resize(ref.current); }, [value]);
  const change = (event: ChangeEvent<HTMLTextAreaElement>) => { resize(event.currentTarget); onChange(event.target.value); };
  return <textarea ref={ref} id={id} dir="auto" rows={1} value={value} onChange={change} placeholder="Describe what needs to happen…" className="scrollbar-thin min-h-9 max-h-40 w-full resize-none overflow-y-auto bg-transparent py-1 text-[15px] leading-6 placeholder:text-placeholder focus:outline-none" aria-invalid={invalid} aria-describedby={invalid ? `${id}-error` : undefined} />;
}

export function StepEditor({ steps, onChange, errors = {} }: { steps: Step[]; onChange: (steps: Step[]) => void; errors?: Record<number, string> }) {
  const [dragged, setDragged] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const normalize = (items: Step[]) => items.map((step, index) => ({ ...step, order: index + 1 }));
  const move = (from: number, to: number) => {
    if (to < 0 || to >= steps.length || from === to) return;
    const next = [...steps]; const [item] = next.splice(from, 1); next.splice(to, 0, item); onChange(normalize(next));
  };
  const add = () => onChange([...steps, { id: nextTemporaryStepId--, content: "", order: steps.length + 1 }]);

  return <div><div className="mb-4 flex items-end justify-between gap-4"><div><h2 className="text-lg font-semibold tracking-[-.025em]">Procedure steps</h2><p className="mt-1 text-sm leading-5 text-muted-foreground">This is the order the steps will be performed.</p></div><span className="hidden font-mono text-xs text-muted-foreground sm:block">{steps.length} {steps.length === 1 ? "STEP" : "STEPS"}</span></div>
    <ol className="space-y-2.5">{steps.map((step, index) => <li key={step.id} onDragOver={(event) => { event.preventDefault(); setOver(index); }} onDrop={(event) => { event.preventDefault(); if (dragged !== null) move(dragged, index); setDragged(null); setOver(null); }} className={cn("group grid min-w-0 grid-cols-[38px_minmax(0,1fr)_auto] items-start rounded-xl border bg-surface transition-[border-color,opacity,transform,box-shadow] focus-within:border-accent sm:grid-cols-[42px_minmax(0,1fr)_auto]", errors[step.id] ? "border-destructive" : "border-border", dragged === index && "scale-[.995] opacity-55 shadow-lg", over === index && dragged !== index && "border-accent ring-2 ring-accent/15")}>
      <div className="flex min-h-14 items-center justify-center self-stretch border-r border-border text-sm font-semibold tabular-nums text-accent">{String(index + 1).padStart(2, "0")}</div>
      <div className="min-w-0 px-2 py-2.5 sm:px-4"><label htmlFor={`step-${step.id}`} className="sr-only">Step {index + 1}</label><StepTextarea id={`step-${step.id}`} value={step.content} invalid={!!errors[step.id]} onChange={(value) => onChange(steps.map((item) => item.id === step.id ? { ...item, content: value } : item))} />{errors[step.id] && <p id={`step-${step.id}-error`} className="pb-1 text-xs text-destructive">{errors[step.id]}</p>}</div>
      <div className="flex min-h-14 items-center gap-0 pr-1 sm:gap-0.5 sm:pr-2"><div className="flex items-center"><button type="button" onClick={() => move(index, index - 1)} disabled={index === 0} className="rounded-md p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground disabled:cursor-not-allowed disabled:opacity-25 sm:p-1.5" aria-label={`Move step ${index + 1} up`}><ChevronUpIcon /></button><button type="button" onClick={() => move(index, index + 1)} disabled={index === steps.length - 1} className="rounded-md p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground disabled:cursor-not-allowed disabled:opacity-25 sm:p-1.5" aria-label={`Move step ${index + 1} down`}><ChevronDownIcon /></button></div><span draggable onDragStart={(event) => { setDragged(index); event.dataTransfer.effectAllowed = "move"; }} onDragEnd={() => { setDragged(null); setOver(null); }} className="hidden cursor-grab rounded-md p-1.5 text-muted-foreground active:cursor-grabbing sm:block" title="Drag to reorder" aria-hidden="true"><GripIcon /></span><button type="button" onClick={() => onChange(normalize(steps.filter((item) => item.id !== step.id)))} className="rounded-md p-1 text-muted-foreground hover:bg-destructive-soft hover:text-destructive sm:p-1.5" aria-label={`Remove step ${index + 1}`}><TrashIcon /></button></div>
    </li>)}</ol>
    {steps.length === 0 && <div className="rounded-xl border border-dashed border-border-strong bg-surface px-5 py-8 text-center text-sm text-muted-foreground">No steps yet. Add the first action in this procedure.</div>}
    <Button type="button" variant="secondary" className="mt-3 w-full border-dashed" onClick={add}><PlusIcon />Add step</Button>
  </div>;
}
