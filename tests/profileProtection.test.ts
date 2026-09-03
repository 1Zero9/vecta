import { describe, expect, it } from "vitest";
import { profilesAreEquivalent } from "@/lib/profileProtection";
import { makeProfile } from "./fixtures";

describe("profile protection comparison", () => {
  it("treats reordered set-like profile data as equivalent", () => {
    const left = makeProfile({
      skills: ["AWS", "Terraform"],
      certifications: ["CKA", "CISSP"],
      preferred_locations: ["Dublin", "Remote"],
      evidence: [{
        id: "evidence-1",
        type: "Project",
        title: "Platform migration",
        description: "Led the migration.",
        claims: ["Reduced cost", "Improved reliability"],
      }],
    });
    const right = makeProfile({
      skills: ["Terraform", "AWS"],
      certifications: ["CISSP", "CKA"],
      preferred_locations: ["Remote", "Dublin"],
      evidence: [{
        id: "evidence-1",
        type: "Project",
        title: "Platform migration",
        description: "Led the migration.",
        claims: ["Improved reliability", "Reduced cost"],
      }],
    });

    expect(profilesAreEquivalent(left, right)).toBe(true);
  });

  it("detects a meaningful local edit", () => {
    expect(profilesAreEquivalent(makeProfile(), makeProfile({ current_title: "Principal Engineer" }))).toBe(false);
  });
});
