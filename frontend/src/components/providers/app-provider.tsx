"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ToastRegion } from "@/src/components/ui/toast";
import { ApiError, authApi, createCompleteSop, sopsApi, updateCompleteSop } from "@/src/lib/api";
import { clearAuth, getAccessToken, getRefreshToken, getStoredUser, markRegistrationSuccess, storeAuth, storeUser } from "@/src/lib/auth";
import type { Sop, SopDraft, SopSummary, Toast, User } from "@/src/lib/types";

type AppContextValue = {
  user: User | null;
  authStatus: "checking" | "authenticated" | "unauthenticated";
  sops: SopSummary[];
  status: "idle" | "loading" | "ready" | "error";
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadSops: (search?: string) => Promise<void>;
  getSop: (id: number) => Promise<Sop>;
  createSop: (draft: SopDraft) => Promise<Sop>;
  updateSop: (id: number, draft: SopDraft) => Promise<Sop>;
  deleteSop: (id: number) => Promise<void>;
  notify: (message: string, tone?: Toast["tone"]) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [authStatus, setAuthStatus] = useState<AppContextValue["authStatus"]>("checking");
  const [sops, setSops] = useState<SopSummary[]>([]);
  const [status, setStatus] = useState<AppContextValue["status"]>("idle");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const sopsRequestId = useRef(0);

  useEffect(() => {
    const checkSession = async () => {
      if (!getAccessToken()) { setUser(null); setAuthStatus("unauthenticated"); return; }
      try {
        const currentUser = await authApi.me();
        storeUser(currentUser); setUser(currentUser); setAuthStatus("authenticated");
      } catch {
        clearAuth(); setUser(null); setAuthStatus("unauthenticated");
      }
    };
    void checkSession();
    const expired = () => { setUser(null); setAuthStatus("unauthenticated"); setSops([]); };
    window.addEventListener("auth:expired", expired);
    return () => window.removeEventListener("auth:expired", expired);
  }, []);

  const notify = useCallback((message: string, tone: Toast["tone"] = "success") => {
    const id = ++toastId.current;
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3200);
  }, []);

  const login = useCallback(async (email: string, password: string, remember: boolean) => {
    const result = await authApi.login({ email, password });
    storeAuth(result.accessToken, result.refreshToken, result.user, remember);
    setUser(result.user); setAuthStatus("authenticated");
  }, []);

  const register = useCallback(async (fullName: string, email: string, password: string) => {
    await authApi.register({ fullName, email, password });
    markRegistrationSuccess();
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    try { if (refreshToken) await authApi.logout(refreshToken); }
    finally {
      clearAuth(); setUser(null); setAuthStatus("unauthenticated"); setSops([]); setStatus("idle");
      router.replace("/login");
    }
  }, [router]);

  const loadSops = useCallback(async (search = "") => {
    const requestId = ++sopsRequestId.current;
    setStatus("loading");
    try {
      const result = await sopsApi.list(search);
      if (requestId === sopsRequestId.current) { setSops(result); setStatus("ready"); }
    }
    catch (error) {
      if (requestId === sopsRequestId.current && !(error instanceof ApiError && error.status === 401)) setStatus("error");
      throw error;
    }
  }, []);

  const getSop = useCallback((id: number) => sopsApi.get(id), []);
  const createSop = useCallback((draft: SopDraft) => createCompleteSop(draft), []);
  const updateSop = useCallback((id: number, draft: SopDraft) => updateCompleteSop(id, draft), []);
  const deleteSop = useCallback(async (id: number) => { await sopsApi.remove(id); setSops((current) => current.filter((sop) => sop.id !== id)); }, []);

  const value = useMemo(() => ({ user, authStatus, sops, status, login, register, logout, loadSops, getSop, createSop, updateSop, deleteSop, notify }), [user, authStatus, sops, status, login, register, logout, loadSops, getSop, createSop, updateSop, deleteSop, notify]);
  return <AppContext.Provider value={value}>{children}<ToastRegion toasts={toasts} /></AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used inside AppProvider");
  return value;
}
