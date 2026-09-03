import type { SitesIdentity } from "./sitesIdentity";

interface D1ResultRow {
  id: string;
  email: string;
  display_name: string | null;
  status: "active" | "suspended";
  created_at: string;
  last_seen_at: string;
}

export interface D1PreparedStatementLike {
  bind(...values: unknown[]): D1PreparedStatementLike;
  first<T>(): Promise<T | null>;
}

export interface D1DatabaseLike {
  prepare(query: string): D1PreparedStatementLike;
}

export interface StoredAccount {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  lastSeenAt: string;
  status: "active" | "suspended";
}

const upsertAccountSql = `
  INSERT INTO users (id, email, display_name, role, status, created_at, updated_at, last_seen_at)
  VALUES (?, ?, ?, 'User', 'active', ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET
    email = excluded.email,
    display_name = COALESCE(excluded.display_name, users.display_name),
    updated_at = excluded.updated_at,
    last_seen_at = excluded.last_seen_at
  RETURNING id, email, display_name, status, created_at, last_seen_at
`;

export async function upsertAccountWithDatabase(
  database: D1DatabaseLike,
  identity: SitesIdentity,
  now = new Date().toISOString(),
): Promise<StoredAccount> {
  const row = await database
    .prepare(upsertAccountSql)
    .bind(identity.id, identity.email, identity.name, now, now, now)
    .first<D1ResultRow>();

  if (!row) throw new Error("The account record could not be created.");

  return {
    id: row.id,
    email: row.email,
    name: row.display_name,
    createdAt: row.created_at,
    lastSeenAt: row.last_seen_at,
    status: row.status,
  };
}
