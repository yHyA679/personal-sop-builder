"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useApp } from "@/src/components/providers/app-provider";
import { Button } from "@/src/components/ui/button";
import { AlertIcon, ArrowRightIcon, CheckIcon } from "@/src/components/ui/icons";
import { consumeRegistrationSuccess } from "@/src/lib/auth";
import { PasswordInput } from "./password-input";

const fieldClass = "h-11 w-full rounded-[9px] border border-border-strong bg-surface px-3.5 text-[15px] placeholder:text-placeholder hover:border-input-hover focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15 disabled:cursor-not-allowed disabled:bg-surface-subtle";

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: ReactNode }) {
  return <div><label htmlFor={id} className="mb-2 block text-sm font-medium">{label}</label>{children}{error && <p id={`${id}-error`} className="mt-1.5 text-xs text-destructive">{error}</p>}</div>;
}

function FormError({ message }: { message: string }) {
  return <div className="flex items-start gap-2.5 rounded-[9px] border border-destructive-border bg-destructive-soft px-3.5 py-3 text-sm leading-5 text-destructive" role="alert"><AlertIcon className="mt-0.5 shrink-0" size={17} />{message}</div>;
}

function Spinner() {
  return <span className="size-4 animate-spin rounded-full border-2 border-current/35 border-t-current" />;
}

export function LoginForm() {
  const router = useRouter();
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setRegistered(consumeRegistrationSuccess()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password, remember);
      router.push("/dashboard");
    } catch (value) {
      setError(value instanceof Error ? value.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return <form onSubmit={submit} className="space-y-5" noValidate>
    {registered && <div className="flex items-start gap-2.5 rounded-[9px] border border-accent-border bg-accent-soft px-3.5 py-3 text-sm leading-5 text-accent" role="status"><CheckIcon className="mt-0.5 shrink-0" size={17} />Account created. Sign in to continue.</div>}
    {error && <FormError message={error} />}
    <Field label="Email address" id="email"><input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} className={fieldClass} disabled={submitting} /></Field>
    <Field label="Password" id="password"><PasswordInput id="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={submitting} /></Field>
    <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-muted-foreground"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="size-4 rounded border-border-strong accent-accent" />Keep me signed in</label>
    <Button type="submit" size="lg" className="w-full" disabled={submitting}>{submitting ? <><Spinner />Signing in…</> : <>Sign in <ArrowRightIcon /></>}</Button>
    <p className="pt-1 text-center text-sm text-muted-foreground">New here? <Link href="/register" className="font-medium text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-foreground">Create an account</Link></p>
  </form>;
}

export function RegisterForm() {
  const router = useRouter();
  const { register } = useApp();
  const [values, setValues] = useState({ fullName: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const change = (field: keyof typeof values, value: string) => setValues((current) => ({ ...current, [field]: value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const errors: Record<string, string> = {};
    if (!values.fullName.trim()) errors.fullName = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Enter a valid email address.";
    if (values.password.length < 8) errors.password = "Use at least 8 characters.";
    if (values.confirm !== values.password) errors.confirm = "Passwords do not match.";
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;
    setSubmitting(true);
    try {
      await register(values.fullName, values.email, values.password);
      router.push("/login");
    } catch (value) {
      setError(value instanceof Error ? value.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return <form onSubmit={submit} className="space-y-5" noValidate>
    {error && <FormError message={error} />}
    <Field label="Full name" id="fullName" error={fieldErrors.fullName}><input id="fullName" autoComplete="name" placeholder="Your name" value={values.fullName} onChange={(event) => change("fullName", event.target.value)} className={fieldClass} disabled={submitting} aria-invalid={!!fieldErrors.fullName} aria-describedby={fieldErrors.fullName ? "fullName-error" : undefined} /></Field>
    <Field label="Email address" id="email" error={fieldErrors.email}><input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={(event) => change("email", event.target.value)} className={fieldClass} disabled={submitting} aria-invalid={!!fieldErrors.email} aria-describedby={fieldErrors.email ? "email-error" : undefined} /></Field>
    <Field label="Password" id="password" error={fieldErrors.password}><PasswordInput id="password" autoComplete="new-password" placeholder="Create a password" value={values.password} onChange={(event) => change("password", event.target.value)} disabled={submitting} aria-invalid={!!fieldErrors.password} aria-describedby={fieldErrors.password ? "password-error" : undefined} /><p className="mt-1.5 text-xs text-muted-foreground">At least 8 characters. A mix of words and numbers works well.</p></Field>
    <Field label="Confirm password" id="confirm" error={fieldErrors.confirm}><PasswordInput id="confirm" autoComplete="new-password" placeholder="Repeat your password" value={values.confirm} onChange={(event) => change("confirm", event.target.value)} disabled={submitting} aria-invalid={!!fieldErrors.confirm} aria-describedby={fieldErrors.confirm ? "confirm-error" : undefined} /></Field>
    <Button type="submit" size="lg" className="w-full" disabled={submitting}>{submitting ? <><Spinner />Creating account…</> : <>Create account <ArrowRightIcon /></>}</Button>
    <p className="pt-1 text-center text-sm text-muted-foreground">Already have an account? <Link href="/login" className="font-medium text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-foreground">Sign in</Link></p>
  </form>;
}
