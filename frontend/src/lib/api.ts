import { clearAuth, getAccessToken, getRefreshToken, storeAccessToken } from "./auth";
import type { Sop, SopDraft, SopSummary, Step, User } from "./types";

const configuredApiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api").replace(/\/$/, "");
const apiBaseUrl = () => typeof window === "undefined" ? configuredApiUrl : "/backend-api";
let refreshRequest: Promise<string> | null = null;

export class ApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly details?: string[]) {
    super(message);
    this.name = "ApiError";
  }
}

async function readResponse(response: Response) {
  if (response.status === 204) return undefined;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return undefined;
  return response.json() as Promise<unknown>;
}

function errorFromPayload(status: number, payload: unknown) {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message: unknown }).message;
    if (Array.isArray(message)) return new ApiError(message.join(" "), status, message.map(String));
    if (typeof message === "string") return new ApiError(message, status);
  }
  return new ApiError(status === 0 ? "Could not connect to the server." : "Something went wrong. Please try again.", status);
}

function expireSession() {
  clearAuth();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth:expired"));
    if (!window.location.pathname.startsWith("/login")) window.location.replace("/login");
  }
}

async function refreshAccessToken() {
  if (refreshRequest) return refreshRequest;
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new ApiError("Your session has expired.", 401);
  refreshRequest = (async () => {
    let response: Response;
    try {
      response = await fetch(`${apiBaseUrl()}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      throw new ApiError("Could not reconnect to the server.", 0);
    }
    const payload = await readResponse(response);
    if (!response.ok || !payload || typeof payload !== "object" || !("accessToken" in payload)) throw errorFromPayload(response.status, payload);
    const accessToken = String((payload as { accessToken: unknown }).accessToken);
    storeAccessToken(accessToken);
    return accessToken;
  })().finally(() => { refreshRequest = null; });
  return refreshRequest;
}

async function request<T>(path: string, options: RequestInit = {}, authenticated = true, retryOnUnauthorized = true): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (authenticated) {
    const token = getAccessToken();
    if (!token) { expireSession(); throw new ApiError("Please sign in to continue.", 401); }
    headers.set("Authorization", `Bearer ${token}`);
  }
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl()}${path}`, { ...options, headers });
  } catch {
    throw new ApiError("Could not connect to the server. Check that the API is running.", 0);
  }
  if (response.status === 401 && authenticated && retryOnUnauthorized) {
    try {
      const token = await refreshAccessToken();
      headers.set("Authorization", `Bearer ${token}`);
      return request<T>(path, { ...options, headers }, true, false);
    } catch (error) {
      expireSession();
      throw error;
    }
  }
  const payload = await readResponse(response);
  if (!response.ok) throw errorFromPayload(response.status, payload);
  return payload as T;
}

export type LoginResponse = { accessToken: string; refreshToken?: string; user: User };
export const authApi = {
  register: (data: { fullName: string; email: string; password: string }) => request<User>("/auth/register", { method: "POST", body: JSON.stringify(data) }, false, false),
  login: (data: { email: string; password: string }) => request<LoginResponse>("/auth/login", { method: "POST", body: JSON.stringify(data) }, false, false),
  me: () => request<User>("/users/me"),
  logout: (refreshToken: string) => request<void>("/auth/logout", { method: "POST", body: JSON.stringify({ refreshToken }) }, false, false),
};

export const sopsApi = {
  list: (search = "") => request<SopSummary[]>(`/sops${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""}`),
  get: (id: number) => request<Sop>(`/sops/${id}`),
  createBase: (data: Pick<SopDraft, "title" | "description">) => request<Omit<Sop, "steps">>("/sops", { method: "POST", body: JSON.stringify(data) }),
  updateBase: (id: number, data: Pick<SopDraft, "title" | "description">) => request<Omit<Sop, "steps">>(`/sops/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id: number) => request<void>(`/sops/${id}`, { method: "DELETE" }),
};

export const stepsApi = {
  create: (sopId: number, content: string) => request<Step>(`/sops/${sopId}/steps`, { method: "POST", body: JSON.stringify({ content }) }),
  update: (stepId: number, content: string) => request<Step>(`/steps/${stepId}`, { method: "PATCH", body: JSON.stringify({ content }) }),
  remove: (stepId: number) => request<void>(`/steps/${stepId}`, { method: "DELETE" }),
  reorder: (sopId: number, stepIds: number[]) => request<Step[]>(`/sops/${sopId}/steps/reorder`, { method: "PATCH", body: JSON.stringify({ stepIds }) }),
};

export async function createCompleteSop(draft: SopDraft) {
  const created = await sopsApi.createBase({ title: draft.title, description: draft.description });
  try {
    for (const step of draft.steps) await stepsApi.create(created.id, step.content);
    return await sopsApi.get(created.id);
  } catch (error) {
    await sopsApi.remove(created.id).catch(() => undefined);
    throw error;
  }
}

export async function updateCompleteSop(id: number, draft: SopDraft) {
  const current = await sopsApi.get(id);
  await sopsApi.updateBase(id, { title: draft.title, description: draft.description });
  const draftIds = new Set(draft.steps.filter((step) => step.id > 0).map((step) => step.id));
  for (const step of current.steps) if (!draftIds.has(step.id)) await stepsApi.remove(step.id);
  const finalSteps: Step[] = [];
  for (const step of draft.steps) {
    if (step.id <= 0) finalSteps.push(await stepsApi.create(id, step.content));
    else {
      const previous = current.steps.find((item) => item.id === step.id);
      finalSteps.push(previous?.content === step.content ? step : await stepsApi.update(step.id, step.content));
    }
  }
  await stepsApi.reorder(id, finalSteps.map((step) => step.id));
  return sopsApi.get(id);
}
