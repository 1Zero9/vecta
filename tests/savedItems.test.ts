import { describe, expect, it } from "vitest";
import { parseSavedItemsSnapshot, savedItemsAreEquivalent } from "@/lib/savedItems";
import { GET } from "@/app/api/saved-items/route";

describe("protected saved items", () => {
  it("treats ordering and duplicate IDs as equivalent", () => {
    expect(savedItemsAreEquivalent(
      { savedJobIds: ["job-2", "job-1", "job-1"], favouriteCompanyIds: ["company-1"] },
      { savedJobIds: ["job-1", "job-2"], favouriteCompanyIds: ["company-1"] },
    )).toBe(true);
  });

  it("normalizes a valid snapshot", () => {
    const result = parseSavedItemsSnapshot({
      savedJobIds: [" job-2 ", "job-1", "job-1"],
      favouriteCompanyIds: [],
    });
    expect(result.success && result.data.savedJobIds).toEqual(["job-1", "job-2"]);
  });

  it("rejects ownership fields and invalid identifiers", () => {
    expect(parseSavedItemsSnapshot({ savedJobIds: [], favouriteCompanyIds: [], userId: "other" }).success).toBe(false);
    expect(parseSavedItemsSnapshot({ savedJobIds: [""], favouriteCompanyIds: [] }).success).toBe(false);
  });

  it("rejects reads without server-authenticated identity", async () => {
    const response = await GET(new Request("https://vecta.test/api/saved-items"));
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ authenticated: false });
  });
});
