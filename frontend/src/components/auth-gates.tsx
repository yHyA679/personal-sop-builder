"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Brand } from "./brand";
import { useApp } from "./providers/app-provider";

function SessionLoading() {
  return <main className="grid min-h-screen place-items-center bg-background"><div className="flex flex-col items-center gap-4"><Brand compact /><span className="size-5 animate-spin rounded-full border-2 border-border-strong border-t-accent" /><span className="sr-only">Checking your session</span></div></main>;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter(); const { authStatus } = useApp();
  useEffect(() => { if (authStatus === "unauthenticated") router.replace("/login"); }, [authStatus, router]);
  if (authStatus !== "authenticated") return <SessionLoading />;
  return children;
}

export function GuestRoute({ children }: { children: ReactNode }) {
  const router = useRouter(); const { authStatus } = useApp();
  useEffect(() => { if (authStatus === "authenticated") router.replace("/dashboard"); }, [authStatus, router]);
  if (authStatus === "checking" || authStatus === "authenticated") return <SessionLoading />;
  return children;
}

export function RootRedirect() {
  const router = useRouter(); const { authStatus } = useApp();
  useEffect(() => { if (authStatus !== "checking") router.replace(authStatus === "authenticated" ? "/dashboard" : "/login"); }, [authStatus, router]);
  return <SessionLoading />;
}
