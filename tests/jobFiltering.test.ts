import { describe, expect, it } from "vitest";
import { filterJobs } from "@/lib/jobFiltering";
import { makeJob } from "./fixtures";

const defaults = {
  activeDomain: "ALL" as const,
  seniority: "ALL" as const,
  workMode: "ALL" as const,
  savedOnly: false,
  savedJobIds: [] as string[],
  query: "",
};

describe("filterJobs", () => {
  const jobs = [
    makeJob(),
    makeJob({ id: "security", title: "Security Architect", domain: "Security", work_mode: "Remote", req_skills: ["NIS2"], governance_standards: ["ISO 27001"] }),
  ];

  it("combines domain, work-mode, and saved filters", () => {
    const result = filterJobs(jobs, {
      ...defaults,
      activeDomain: "Security",
      workMode: "Remote",
      savedOnly: true,
      savedJobIds: ["security"],
    });
    expect(result.map((job) => job.id)).toEqual(["security"]);
  });

  it("searches titles, companies, skills, summaries, and standards case-insensitively", () => {
    expect(filterJobs(jobs, { ...defaults, query: "iso 27001" }).map((job) => job.id)).toEqual(["security"]);
    expect(filterJobs(jobs, { ...defaults, query: "KUBERNETES" }).map((job) => job.id)).toEqual(["job-test"]);
  });

  it("returns an empty collection when no role matches", () => {
    expect(filterJobs(jobs, { ...defaults, query: "quantum biology" })).toEqual([]);
  });
});
