import { describe, expect, it } from "vitest";
import { loadProfileWithDatabase, saveProfileWithDatabase, type D1ProfileDatabase } from "@/lib/d1ProfileStore";
import { makeProfile } from "./fixtures";

interface CapturedStatement {
  query: string;
  values: unknown[];
}

function createDatabase(profileRow: Record<string, unknown> | null = null, evidenceRows: Record<string, unknown>[] = []) {
  const prepared: CapturedStatement[] = [];
  let batched: CapturedStatement[] = [];

  const database = {
    prepare(query: string) {
      const captured = { query, values: [] } as CapturedStatement;
      prepared.push(captured);
      const statement = {
        bind(...values: unknown[]) {
          captured.values = values;
          return statement;
        },
        async first<T>() {
          return profileRow as T | null;
        },
        async all<T>() {
          return { results: evidenceRows as T[] };
        },
      };
      return statement;
    },
    async batch(statements: unknown[]) {
      batched = statements.map((statement) => {
        const index = prepared.findIndex((candidate) => (statement as object) === statementObjects.get(candidate));
        return prepared[index];
      }).filter(Boolean);
    },
  };

  // Associate the small statement doubles with their captured SQL without exposing
  // any production-only D1 methods through the test API.
  const statementObjects = new Map<CapturedStatement, object>();
  const originalPrepare = database.prepare.bind(database);
  database.prepare = ((query: string) => {
    const statement = originalPrepare(query);
    statementObjects.set(prepared.at(-1)!, statement);
    return statement;
  }) as typeof database.prepare;

  return {
    database: database as unknown as D1ProfileDatabase,
    prepared,
    getBatched: () => batched,
  };
}

describe("D1 protected profile store", () => {
  it("scopes every saved profile and evidence statement to the authenticated user", async () => {
    const { database, getBatched } = createDatabase();
    const profile = makeProfile({
      evidence: [{ id: "proof-1", type: "Project", title: "Migration", description: "Delivered it.", claims: ["AWS"] }],
    });

    await saveProfileWithDatabase(database, "authenticated-user", profile, "2026-09-03T10:00:00.000Z");

    const statements = getBatched();
    expect(statements).toHaveLength(3);
    expect(statements.every((statement) => statement.values[0] === "authenticated-user")).toBe(true);
    expect(statements.some((statement) => statement.query.includes("DELETE FROM profile_evidence"))).toBe(true);
  });

  it("loads both profile and evidence with the same authenticated owner key", async () => {
    const { database, prepared } = createDatabase({
      full_name: "Protected Candidate",
      current_title: "Engineer",
      primary_domain: "IT",
      years_experience: 6,
      skills_json: '["AWS"]',
      certifications_json: "[]",
      target_salary_min: null,
      preferred_work_mode: "Remote",
      preferred_locations_json: '["Dublin"]',
      resume_text: "Experience",
      skill_match_overrides_json: "[]",
    }, [{
      id: "proof-1",
      type: "Project",
      title: "Migration",
      organization: null,
      period: null,
      description: "Delivered it.",
      claims_json: '["AWS"]',
    }]);

    const profile = await loadProfileWithDatabase(database, "authenticated-user");

    expect(profile?.full_name).toBe("Protected Candidate");
    expect(profile?.evidence).toHaveLength(1);
    expect(prepared).toHaveLength(2);
    expect(prepared.every((statement) => statement.values[0] === "authenticated-user")).toBe(true);
  });
});
