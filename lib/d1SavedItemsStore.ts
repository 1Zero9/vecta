import type { D1DatabaseLike, D1PreparedStatementLike } from "./d1AccountStore";
import type { SavedItemsSnapshot } from "./savedItems";

interface D1ListResult<T> { results: T[]; }

interface D1ReadableStatement extends D1PreparedStatementLike {
  bind(...values: unknown[]): D1ReadableStatement;
  all<T>(): Promise<D1ListResult<T>>;
}

export interface D1SavedItemsDatabase extends D1DatabaseLike {
  prepare(query: string): D1ReadableStatement;
  batch(statements: D1PreparedStatementLike[]): Promise<unknown>;
}

export async function loadSavedItemsWithDatabase(
  database: D1SavedItemsDatabase,
  userId: string,
): Promise<SavedItemsSnapshot | null> {
  const set = await database.prepare("SELECT user_id FROM saved_item_sets WHERE user_id = ?")
    .bind(userId).first<{ user_id: string }>();
  if (!set) return null;

  const [jobs, companies] = await Promise.all([
    database.prepare("SELECT job_id FROM saved_jobs WHERE user_id = ? ORDER BY job_id")
      .bind(userId).all<{ job_id: string }>(),
    database.prepare("SELECT company_id FROM favourite_companies WHERE user_id = ? ORDER BY company_id")
      .bind(userId).all<{ company_id: string }>(),
  ]);

  return {
    savedJobIds: jobs.results.map((row) => row.job_id),
    favouriteCompanyIds: companies.results.map((row) => row.company_id),
  };
}

export async function saveSavedItemsWithDatabase(
  database: D1SavedItemsDatabase,
  userId: string,
  snapshot: SavedItemsSnapshot,
  now = new Date().toISOString(),
): Promise<void> {
  const statements: D1PreparedStatementLike[] = [
    database.prepare(`
      INSERT INTO saved_item_sets (user_id, created_at, updated_at) VALUES (?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET updated_at = excluded.updated_at
    `).bind(userId, now, now),
    database.prepare("DELETE FROM saved_jobs WHERE user_id = ?").bind(userId),
    database.prepare("DELETE FROM favourite_companies WHERE user_id = ?").bind(userId),
    ...snapshot.savedJobIds.map((jobId) => database.prepare(
      "INSERT INTO saved_jobs (user_id, job_id, created_at) VALUES (?, ?, ?)",
    ).bind(userId, jobId, now)),
    ...snapshot.favouriteCompanyIds.map((companyId) => database.prepare(
      "INSERT INTO favourite_companies (user_id, company_id, created_at) VALUES (?, ?, ?)",
    ).bind(userId, companyId, now)),
  ];

  await database.batch(statements);
}
