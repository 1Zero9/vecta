import type { AccountRole } from "./types";

/**
 * Local and legacy profile data is never an authorization source. Older
 * candidate, recruiter, and specialist labels all migrate to a standard user.
 */
export function normalizeAccountRole(value: unknown): AccountRole {
  return value === "Administrator" ? "Administrator" : "User";
}
