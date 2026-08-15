"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/src/components/providers/app-provider";
import { ApiError } from "@/src/lib/api";
import type { Sop } from "@/src/lib/types";

export function useSop(id: number) {
  const { getSop } = useApp();
  const [sop, setSop] = useState<Sop | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "not-found" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(async () => {
      setStatus("loading"); setError("");
      try { const result = await getSop(id); if (active) { setSop(result); setStatus("ready"); } }
      catch (value) {
        if (!active) return;
        setStatus(value instanceof ApiError && value.status === 404 ? "not-found" : "error");
        setError(value instanceof Error ? value.message : "The process could not be loaded.");
      }
    }, 0);
    return () => { active = false; window.clearTimeout(timer); };
  }, [id, getSop]);

  return { sop, status, error };
}
