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

  it("matches aliases while keeping required and preferred scores separate", () => {
    const fit = evaluateVectorFit(makeProfile({
      skills: ["AWS Security", "K8s", "Threat Modeling", "Go"],
      resume_text: "",
    }), makeJob({
      req_skills: ["Amazon Web Services", "Kubernetes", "Threat Modelling", "Google Cloud Platform"],
      preferred_skills: ["Python / Go"],
      certifications: [],
    }));

    expect(fit.matching_required_skills).toEqual([
      "Amazon Web Services",
      "Kubernetes",
      "Threat Modelling",
    ]);
    expect(fit.missing_required_skills).toEqual(["Google Cloud Platform"]);
    expect(fit.matching_preferred_skills).toEqual(["Python / Go"]);
    expect(fit.required_skills_score).toBe(75);
    expect(fit.preferred_skills_score).toBe(100);
    expect(fit.skills_score).toBe(81);
  });

  it("gives required skills most of the skills-alignment weight", () => {
    const requiredOnly = evaluateVectorFit(makeProfile({ skills: ["AWS", "Kubernetes"], resume_text: "" }), makeJob({
      req_skills: ["AWS", "Kubernetes"],
      preferred_skills: ["Rust", "Go"],
      certifications: [],
    }));
    const preferredOnly = evaluateVectorFit(makeProfile({ skills: ["Rust", "Go"], resume_text: "" }), makeJob({
      req_skills: ["AWS", "Kubernetes"],
      preferred_skills: ["Rust", "Go"],
      certifications: [],
    }));

    expect(requiredOnly.skills_score).toBe(75);
    expect(preferredOnly.skills_score).toBe(25);
    expect(requiredOnly.overall_score).toBeGreaterThan(preferredOnly.overall_score);
  });

  it("recalculates fit from candidate corrections without changing other jobs", () => {
    const job = makeJob({ id: "job-corrected", req_skills: ["AWS", "Rust"], preferred_skills: [], certifications: [] });
    const fit = evaluateVectorFit(makeProfile({
      skills: ["AWS"],
      resume_text: "",
      skill_match_overrides: [
        { job_id: job.id, requirement: "AWS", priority: "required", decision: "exclude" },
        { job_id: job.id, requirement: "Rust", priority: "required", decision: "include" },
      ],
    }), job);

    expect(fit.matching_required_skills).toEqual(["Rust"]);
    expect(fit.missing_required_skills).toEqual(["AWS"]);
    expect(fit.required_skills_score).toBe(50);
    expect(fit.skill_matches).toEqual(expect.arrayContaining([
      expect.objectContaining({ requirement: "AWS", userDecision: "exclude", matched: false }),
      expect.objectContaining({ requirement: "Rust", userDecision: "include", matched: true }),
    ]));
  });
});
