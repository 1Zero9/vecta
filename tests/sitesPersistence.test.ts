import { describe, expect, it } from "vitest";
import { PrismaClient } from "@/lib/prismaClient.sites";

describe("Sites persistence boundary", () => {
  it("returns the local-first fallback for unsupported SQLite operations", async () => {
    const client = new PrismaClient();

    await expect(client.user.findUnique()).resolves.toBeNull();
    await expect(client.user.upsert()).resolves.toBeNull();
    await expect(client.consentLog.create()).resolves.toBeNull();
  });
});
