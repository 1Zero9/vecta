import { describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/account/route";
import { upsertAccountWithDatabase, type D1PreparedStatementLike } from "@/lib/d1AccountStore";
import { readSitesIdentity } from "@/lib/sitesIdentity";

describe("Sites account identity", () => {
  it("requires both server-provided identity headers", () => {
    expect(readSitesIdentity(new Headers({ "oai-authenticated-user-id": "user-1" }))).toBeNull();
  });

  it("decodes an optional authenticated display name", () => {
    const identity = readSitesIdentity(new Headers({
      "oai-authenticated-user-id": "user-1",
      "oai-authenticated-user-email": "person@example.com",
      "oai-authenticated-user-full-name": "Jordan%20Quinn",
      "oai-authenticated-user-full-name-encoding": "percent-encoded-utf-8",
    }));

    expect(identity).toEqual({ id: "user-1", email: "person@example.com", name: "Jordan Quinn" });
  });

  it("rejects an account request without authenticated headers", async () => {
    const response = await POST(new Request("https://vecta.test/api/account", { method: "POST" }));
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ authenticated: false });
  });

  it("upserts only the server identity and preserves server-owned access fields", async () => {
    const first = vi.fn().mockResolvedValue({
      id: "user-1",
      email: "person@example.com",
      display_name: "Jordan Quinn",
      status: "active",
      created_at: "2026-09-03T10:00:00.000Z",
      last_seen_at: "2026-09-03T10:00:00.000Z",
    });
    const statement: D1PreparedStatementLike = {
      bind: vi.fn(function () { return statement; }),
      first,
    };
    const prepare = vi.fn().mockReturnValue(statement);

    const account = await upsertAccountWithDatabase(
      { prepare },
      { id: "user-1", email: "person@example.com", name: "Jordan Quinn" },
      "2026-09-03T10:00:00.000Z",
    );

    expect(prepare.mock.calls[0][0]).toContain("VALUES (?, ?, ?, 'User', 'active'");
    expect(statement.bind).toHaveBeenCalledWith(
      "user-1",
      "person@example.com",
      "Jordan Quinn",
      "2026-09-03T10:00:00.000Z",
      "2026-09-03T10:00:00.000Z",
      "2026-09-03T10:00:00.000Z",
    );
    expect(account).toMatchObject({ id: "user-1", email: "person@example.com", name: "Jordan Quinn" });
  });
});
