import { describe, expect, it } from "vitest";
import { applySkillMatchOverrides, getSkillConcepts, matchSkillRequirement, skillsOverlap } from "@/lib/skillMatching";
import { SKILL_TAXONOMY, SKILL_TAXONOMY_VERSION } from "@/lib/skillTaxonomy";
import { APP_VERSION } from "@/lib/version";

describe("skill matching", () => {
  it("normalizes explicit aliases and spelling variants", () => {
    expect(skillsOverlap("AWS Security", "Amazon Web Services")).toBe(true);
    expect(skillsOverlap("K8s", "Kubernetes")).toBe(true);
    expect(skillsOverlap("Threat Modeling", "Threat Modelling")).toBe(true);
  });

  it("matches any explicit alternative in a compound requirement", () => {
    const result = matchSkillRequirement("Python / Go", ["Go"], "", "required");
    expect(result).toMatchObject({ matched: true, matchedBy: "Go", normalizedAs: "go" });
    expect(getSkillConcepts("LangChain / LangGraph")).toEqual(["langchain", "langgraph"]);
  });

  it("does not use unsafe substring matching for short skills", () => {
    expect(skillsOverlap("Go", "Google Cloud Platform")).toBe(false);
    expect(skillsOverlap("AI", "AI Governance")).toBe(false);
    expect(matchSkillRequirement("Google Cloud Platform", ["Go"], "", "required").matched).toBe(false);
  });

  it("finds bounded aliases in résumé text", () => {
    expect(matchSkillRequirement(
      "Amazon Web Services",
      [],
      "Designed production workloads on AWS and Kubernetes.",
      "required",
    )).toMatchObject({ matched: true, matchedBy: "Résumé text", normalizedAs: "amazon web services" });
  });

  it("applies job-specific candidate corrections", () => {
    const matches = [
      matchSkillRequirement("AWS", ["AWS"], "", "required"),
      matchSkillRequirement("Rust", [], "", "preferred"),
    ];
    const corrected = applySkillMatchOverrides(matches, [
      { job_id: "job-1", requirement: "AWS", priority: "required", decision: "exclude" },
      { job_id: "job-1", requirement: "Rust", priority: "preferred", decision: "include" },
      { job_id: "another-job", requirement: "AWS", priority: "required", decision: "include" },
    ], "job-1");

    expect(corrected[0]).toMatchObject({ matched: false, userDecision: "exclude" });
    expect(corrected[1]).toMatchObject({ matched: true, matchedBy: "User correction", userDecision: "include" });
  });

  it("matches vocabulary added from the current job and profile catalogue", () => {
    expect(skillsOverlap("Azure AD", "Microsoft Entra ID")).toBe(true);
    expect(skillsOverlap("OTel", "OpenTelemetry")).toBe(true);
    expect(skillsOverlap("Vector DBs", "Vector Databases")).toBe(true);
    expect(skillsOverlap("TPRM", "Third-Party Risk")).toBe(true);
  });

  it("publishes independently traceable product and taxonomy versions", () => {
    expect(APP_VERSION).toBe("0.6.0");
    expect(SKILL_TAXONOMY_VERSION).toBe("1.1.0");
    expect(Object.keys(SKILL_TAXONOMY.aliases).length).toBeGreaterThanOrEqual(30);
  });
});
