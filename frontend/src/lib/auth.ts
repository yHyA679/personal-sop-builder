import type { User } from "./types";

const ACCESS_TOKEN_KEY = "personal-sop-builder.access-token";
const REFRESH_TOKEN_KEY = "personal-sop-builder.refresh-token";
const USER_KEY = "personal-sop-builder.user";
const REGISTRATION_MESSAGE_KEY = "personal-sop-builder.registration-success";

function canUseStorage() {
  return typeof window !== "undefined";
}

function read(key: string) {
  return canUseStorage() ? window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key) : null;
}

export function getAccessToken() {
  return read(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return read(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (!canUseStorage()) return null;
  const value = read(USER_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as User;
  } catch {
    return null;
  }
}

export function storeAuth(accessToken: string, refreshToken: string | undefined, user?: User, persistent = true) {
  if (!canUseStorage()) return;
  clearAuth();
  const storage = persistent ? window.localStorage : window.sessionStorage;
  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  if (user) storage.setItem(USER_KEY, JSON.stringify(user));
}

export function storeAccessToken(accessToken: string) {
  if (!canUseStorage()) return;
  const storage = window.localStorage.getItem(ACCESS_TOKEN_KEY) ? window.localStorage : window.sessionStorage;
  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function storeUser(user: User) {
  if (!canUseStorage()) return;
  const storage = window.localStorage.getItem(ACCESS_TOKEN_KEY) ? window.localStorage : window.sessionStorage;
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);
}

export function hasAuthTokens() {
  return Boolean(getAccessToken());
}

export function markRegistrationSuccess() {
  if (canUseStorage()) window.sessionStorage.setItem(REGISTRATION_MESSAGE_KEY, "true");
}

export function consumeRegistrationSuccess() {
  if (!canUseStorage()) return false;
  const present = window.sessionStorage.getItem(REGISTRATION_MESSAGE_KEY) === "true";
  window.sessionStorage.removeItem(REGISTRATION_MESSAGE_KEY);
  return present;
}
