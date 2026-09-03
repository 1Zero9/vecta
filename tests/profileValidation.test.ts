import { describe, expect, it } from "vitest";
import { parseCandidateProfile } from "@/lib/profileValidation";
import { makeProfile } from "./fixtures";

describe("protected profile validation", () => {
  it("accepts a complete candidate profile", () => {
    expect(parseCandidateProfile(makeProfile()).success).toBe(true);
  });

  it("rejects browser-supplied ownership fields", () => {
    expect(parseCandidateProfile({ ...makeProfile(), user_id: "another-user" }).success).toBe(false);
  });

  it("rejects invalid experience and oversized collections", () => {
    expect(parseCandidateProfile(makeProfile({ years_experience: -1 })).success).toBe(false);
    expect(parseCandidateProfile(makeProfile({ skills: Array.from({ length: 201 }, (_, index) => `Skill ${index}`) })).success).toBe(false);
  });
});
