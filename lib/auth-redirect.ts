import type { Role } from "@prisma/client";

/** Default post-login destination by marketplace role. */
export function dashboardPathForRole(role: Role | string | undefined | null): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "PROVIDER":
      return "/provider";
    case "AMBASSADOR":
      return "/ambassador";
    default:
      return "/account";
  }
}

/** Prefer a safe deep-link callback; otherwise send the user to their role home. */
export function resolvePostLoginPath(
  role: Role | string | undefined | null,
  callbackUrl?: string | null,
): string {
  const fallback = dashboardPathForRole(role);
  if (!callbackUrl) return fallback;

  // Only allow same-origin relative paths
  if (!callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) return fallback;
  if (callbackUrl.startsWith("/login") || callbackUrl.startsWith("/api/auth")) return fallback;

  // Generic account landing should yield to role dashboards
  if (callbackUrl === "/account" || callbackUrl === "/account/") return fallback;

  return callbackUrl;
}
