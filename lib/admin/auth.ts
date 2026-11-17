import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "portfolio_admin";
const SESSION_DAYS = 7;

/** The admin panel is enabled only when ADMIN_PASSWORD is set. */
export function adminEnabled(): boolean {
  return typeof process.env.ADMIN_PASSWORD === "string" && process.env.ADMIN_PASSWORD.length > 0;
}

function sessionToken(): string {
  return createHmac("sha256", process.env.ADMIN_PASSWORD ?? "")
    .update("portfolio-admin-session-v1")
    .digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyPassword(input: string): boolean {
  if (!adminEnabled()) return false;
  return safeEqual(input, process.env.ADMIN_PASSWORD as string);
}

export function isAuthenticated(): boolean {
  if (!adminEnabled()) return false;
  const value = cookies().get(SESSION_COOKIE)?.value;
  if (!value) return false;
  return safeEqual(value, sessionToken());
}

export function setSession(): void {
  cookies().set(SESSION_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
  });
}

export function clearSession(): void {
  cookies().delete(SESSION_COOKIE);
}

/** Call at the top of every server action that changes data. */
export function requireAdmin(): void {
  if (!isAuthenticated()) throw new Error("Not signed in. Reload the page and sign in again.");
}
