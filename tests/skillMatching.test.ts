import { describe, expect, it } from "vitest";
import { getSkillConcepts, matchSkillRequirement, skillsOverlap } from "@/lib/skillMatching";

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
});
