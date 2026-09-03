import { env } from "cloudflare:workers";
import { upsertAccountWithDatabase, type D1DatabaseLike, type StoredAccount } from "./d1AccountStore";
import type { SitesIdentity } from "./sitesIdentity";

export async function upsertAuthenticatedAccount(identity: SitesIdentity): Promise<StoredAccount | null> {
  const database = (env as unknown as { DB?: D1DatabaseLike }).DB;
  if (!database) return null;
  return upsertAccountWithDatabase(database, identity);
}
