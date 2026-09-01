import { describe, expect, it } from "vitest";
import { evaluateVectorFit } from "@/lib/fitEngine";
import { makeJob, makeProfile } from "./fixtures";

describe("evaluateVectorFit", () => {
  it("keeps evidence separate from the match percentage", () => {
    const job = makeJob();
    const withoutEvidence = evaluateVectorFit(makeProfile(), job);
    const withEvidence = evaluateVectorFit(makeProfile({
      evidence: [{
        id: "evidence-1",
        type: "Project",
        title: "Cloud platform",
        description: "Delivered a secure Kubernetes platform on AWS.",
        claims: ["AWS", "Kubernetes", "Cloud Security"],
      }],
    }), job);

    expect(withEvidence.overall_score).toBe(withoutEvidence.overall_score);
    expect(withEvidence.evidence_coverage_score).toBeGreaterThan(withoutEvidence.evidence_coverage_score);
    expect(withEvidence.evidence_matches.map((match) => match.claim)).toEqual(
      expect.arrayContaining(["AWS", "Kubernetes", "Cloud Security"]),
    );
  });

  it("marks profile-only matches as unsupported", () => {
    const fit = evaluateVectorFit(makeProfile(), makeJob());
    expect(fit.unsupported_matches).toEqual(expect.arrayContaining(["AWS", "Kubernetes", "CKA"]));
    expect(fit.evidence_matches).toHaveLength(0);
  });

  it("returns low confidence when candidate information is insufficient", () => {
    const fit = evaluateVectorFit(makeProfile({
      years_experience: 0,
      skills: [],
      certifications: [],
      resume_text: "",
    }), makeJob({ req_skills: ["AWS"], preferred_skills: [], certifications: [] }));

    expect(fit.confidence_level).toBe("Low");
    expect(fit.confidence_limitations).toEqual(expect.arrayContaining([
      expect.stringContaining("three specific skills"),
      expect.stringContaining("No résumé"),
      expect.stringContaining("Years of experience"),
    ]));
  });

  it("uses honest gap guidance without asserting unverified experience", () => {
    const fit = evaluateVectorFit(makeProfile(), makeJob({
      req_skills: ["AWS", "Kubernetes", "Rust"],
      preferred_skills: [],
      certifications: [],
    }));
    const rustGuidance = fit.suggested_bridge_answers.find((answer) => answer.gap === "Rust");

    expect(rustGuidance?.talking_point).toContain("development area");
    expect(rustGuidance?.talking_point).not.toContain("actively applied");
    expect(rustGuidance?.talking_point).not.toContain("real-world scenarios");
  });
});
