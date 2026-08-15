import type { Metadata } from "next";
import { AuthShell } from "@/src/features/auth/components/auth-shell";
import { LoginForm } from "@/src/features/auth/components/auth-forms";

export const metadata: Metadata = { title: "Sign in" };
export default function LoginPage() { return <AuthShell eyebrow="Welcome back" title="Sign in to your workspace" description="Pick up where you left off and keep your recurring work clear."><LoginForm /></AuthShell>; }
