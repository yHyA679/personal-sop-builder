"use client";
import { useState, type InputHTMLAttributes } from "react";
import { EyeIcon, EyeOffIcon } from "@/src/components/ui/icons";
import { cn } from "@/src/lib/utils";

export function PasswordInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  return <div className="relative"><input type={visible ? "text" : "password"} className={cn("h-11 w-full rounded-[9px] border border-border-strong bg-surface px-3.5 pr-11 text-[15px] placeholder:text-placeholder hover:border-input-hover focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15 disabled:cursor-not-allowed disabled:bg-surface-subtle", className)} {...props} /><button type="button" onClick={() => setVisible((value) => !value)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:bg-surface-subtle hover:text-foreground" aria-label={visible ? "Hide password" : "Show password"}>{visible ? <EyeOffIcon /> : <EyeIcon />}</button></div>;
}
