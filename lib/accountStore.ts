import type { SitesIdentity } from "./sitesIdentity";
import type { StoredAccount } from "./d1AccountStore";

/** Standard Next.js/local fallback. The Sites build aliases this module to D1. */
export async function upsertAuthenticatedAccount(_identity: SitesIdentity): Promise<StoredAccount | null> {
  void _identity;
  return null;
}
