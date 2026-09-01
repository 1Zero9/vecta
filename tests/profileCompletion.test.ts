import { describe, expect, it } from "vitest";
import { getProfileCompletion } from "@/lib/profileCompletion";
import { makeProfile } from "./fixtures";

describe("getProfileCompletion", () => {
  it("reports a complete, evidence-rich profile", () => {
    const completion = getProfileCompletion(makeProfile({
      evidence: [{
        id: "evidence-1",
        type: "Employment",
        title: "Platform lead",
        description: "Led a cloud platform team.",
        claims: ["Kubernetes"],
      }],
    }));
    expect(completion.score).toBe(100);
    expect(completion.missing).toEqual([]);
  });

  it("identifies missing profile areas without exceeding score bounds", () => {
    const completion = getProfileCompletion(makeProfile({
      full_name: "",
      current_title: "",
      skills: [],
      certifications: [],
      years_experience: 0,
      preferred_locations: [],
      resume_text: "",
      evidence: [],
    }));
    expect(completion.score).toBeGreaterThanOrEqual(0);
    expect(completion.score).toBeLessThanOrEqual(100);
    expect(completion.missing).toEqual(expect.arrayContaining(["current role", "at least three skills", "profile evidence"]));
  });
});
