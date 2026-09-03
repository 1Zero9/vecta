import { describe, expect, it } from "vitest";
import { loadSavedItemsWithDatabase, saveSavedItemsWithDatabase, type D1SavedItemsDatabase } from "@/lib/d1SavedItemsStore";

interface Capture { query: string; values: unknown[]; statement?: object; }

function createDatabase(hasSet = true) {
  const captures: Capture[] = [];
  let batched: Capture[] = [];
  const database = {
    prepare(query: string) {
      const capture: Capture = { query, values: [] };
      captures.push(capture);
      const statement = {
        bind(...values: unknown[]) { capture.values = values; return statement; },
        async first<T>() { return (hasSet ? { user_id: "authenticated-user" } : null) as T | null; },
        async all<T>() {
          if (query.includes("saved_jobs")) return { results: [{ job_id: "job-1" }] as T[] };
          return { results: [{ company_id: "company-1" }] as T[] };
        },
      };
      capture.statement = statement;
      return statement;
    },
    async batch(statements: object[]) {
      batched = statements.map((statement) => captures.find((capture) => capture.statement === statement)!).filter(Boolean);
    },
  };
  return { database: database as unknown as D1SavedItemsDatabase, captures, getBatched: () => batched };
}

describe("D1 saved-item store", () => {
  it("preserves an explicit empty protected snapshot", async () => {
    const { database, getBatched } = createDatabase();
    await saveSavedItemsWithDatabase(database, "authenticated-user", { savedJobIds: [], favouriteCompanyIds: [] }, "2026-09-03T12:00:00.000Z");
    const statements = getBatched();
    expect(statements).toHaveLength(3);
    expect(statements.every((statement) => statement.values[0] === "authenticated-user")).toBe(true);
  });

  it("scopes the marker and both saved lists to the authenticated owner", async () => {
    const { database, captures } = createDatabase();
    const snapshot = await loadSavedItemsWithDatabase(database, "authenticated-user");
    expect(snapshot).toEqual({ savedJobIds: ["job-1"], favouriteCompanyIds: ["company-1"] });
    expect(captures).toHaveLength(3);
    expect(captures.every((statement) => statement.values[0] === "authenticated-user")).toBe(true);
  });

  it("distinguishes no protected snapshot from a protected empty snapshot", async () => {
    const { database, captures } = createDatabase(false);
    await expect(loadSavedItemsWithDatabase(database, "authenticated-user")).resolves.toBeNull();
    expect(captures).toHaveLength(1);
  });
});
