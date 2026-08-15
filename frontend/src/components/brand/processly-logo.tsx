import { cn } from "@/src/lib/utils";

export function ProcesslyLogo({
  iconOnly = false,
  size = 32,
  className,
}: {
  iconOnly?: boolean;
  size?: number;
  className?: string;
}) {
  return <span className={cn("inline-flex items-center gap-2.5", className)}>
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className="shrink-0 text-foreground">
      <rect x="2" y="2" width="28" height="28" rx="8" fill="currentColor" />
      <path d="M8.5 21.5L15.5 14.5L22.5 7.5" stroke="var(--brand-accent)" strokeWidth="2.25" strokeLinecap="round" />
      <rect x="6" y="19" width="5" height="5" rx="1.4" fill="var(--background)" />
      <rect x="13" y="12" width="5" height="5" rx="1.4" fill="var(--background)" />
      <rect x="20" y="5" width="5" height="5" rx="1.4" fill="var(--background)" />
    </svg>
    {!iconOnly && <span className="text-[15px] font-semibold tracking-[-.025em]">Processly</span>}
  </span>;
}
