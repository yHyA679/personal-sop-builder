import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/src/lib/utils";

const styles = {
  primary: "bg-accent text-accent-foreground border-accent hover:bg-accent-hover hover:border-accent-hover active:translate-y-px",
  secondary: "bg-surface text-foreground border-border-strong hover:bg-surface-subtle active:translate-y-px",
  ghost: "bg-transparent text-foreground border-transparent hover:bg-surface-subtle",
  destructive: "bg-destructive text-destructive-foreground border-destructive hover:bg-destructive-hover hover:border-destructive-hover active:translate-y-px",
};
const sizes = { sm: "h-9 px-3 text-sm", md: "h-10 px-4 text-sm", lg: "h-11 px-5 text-[15px]" };

export function Button({ className, variant = "primary", size = "md", children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof styles; size?: keyof typeof sizes }) {
  return <button className={cn("inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[9px] border font-medium transition-[background-color,border-color,transform] disabled:cursor-not-allowed disabled:opacity-50", styles[variant], sizes[size], className)} {...props}>{children}</button>;
}

export function ButtonLink({ href, className, variant = "primary", size = "md", children }: { href: string; className?: string; variant?: keyof typeof styles; size?: keyof typeof sizes; children: ReactNode }) {
  return <Link href={href} className={cn("inline-flex shrink-0 items-center justify-center gap-2 rounded-[9px] border font-medium transition-[background-color,border-color,transform]", styles[variant], sizes[size], className)}>{children}</Link>;
}
