import { beforeEach, describe, expect, it, vi } from "vitest";
import { exportAllUserData, getStoredProfile, saveStoredProfile, wipeAllUserData } from "@/lib/storage";
import { makeProfile } from "./fixtures";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return Array.from(this.values.keys())[index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

const memoryStorage = new MemoryStorage();
vi.stubGlobal("window", {});
vi.stubGlobal("localStorage", memoryStorage);

describe("profile storage", () => {
  beforeEach(() => localStorage.clear());

  it("round-trips evidence records", () => {
    const profile = makeProfile({
      evidence: [{
        id: "evidence-1",
        type: "Certification",
        title: "CKA",
        description: "Current Kubernetes administrator credential.",
        claims: ["CKA", "Kubernetes"],
      }],
    });
    saveStoredProfile(profile);
    expect(getStoredProfile().evidence).toEqual(profile.evidence);
  });

  it("hydrates older profiles with safe collection defaults", () => {
    const legacy = makeProfile();
    delete legacy.evidence;
    delete legacy.preferred_locations;
    delete legacy.skill_match_overrides;
    localStorage.setItem("vecta_candidate_profile", JSON.stringify(legacy));

    const hydrated = getStoredProfile();
    expect(hydrated.evidence).toEqual([]);
    expect(hydrated.preferred_locations).toEqual([]);
    expect(hydrated.skill_match_overrides).toEqual([]);
  });

  it("includes evidence in export and removes it during erasure", () => {
    saveStoredProfile(makeProfile({
      evidence: [{ id: "evidence-1", type: "Project", title: "Migration", description: "Moved the platform.", claims: ["AWS"] }],
    }));
    const exported = JSON.parse(exportAllUserData());
    expect(exported.profile.evidence).toHaveLength(1);
    expect(exported).toMatchObject({
      schemaVersion: 1,
      appVersion: "0.2.0",
      skillTaxonomyVersion: "1.1.0",
    });
    wipeAllUserData();
    expect(localStorage.getItem("vecta_candidate_profile")).toBeNull();
  });
});
