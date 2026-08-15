import type { Metadata } from "next";
import { AuthShell } from "@/src/features/auth/components/auth-shell";
import { RegisterForm } from "@/src/features/auth/components/auth-forms";

export const metadata: Metadata = { title: "Create account" };
export default function RegisterPage() { return <AuthShell eyebrow="Start a workspace" title="Create your account" description="Turn the processes in your head into instructions you can trust."><RegisterForm /></AuthShell>; }
