import { describe, expect, it } from "vitest";
import { addJobToPipeline } from "@/lib/pipeline";
import { makeJob } from "./fixtures";

describe("addJobToPipeline", () => {
  it("creates a saved application with stable role details", () => {
    const job = makeJob({ salary_min: 120000 });
    const result = addJobToPipeline([], job, new Date("2026-09-01T12:00:00Z"));

    expect(result.added).toBe(true);
    expect(result.pipeline[0]).toMatchObject({
      job_id: job.id,
      company_name: job.company_name,
      job_title: job.title,
      stage: "saved",
      date_added: "2026-09-01",
      salary_target: "£120k",
    });
    expect(result.pipeline[0].notes).toContain("curated Jobs");
  });

  it("does not add the same role twice", () => {
    const job = makeJob();
    const first = addJobToPipeline([], job, new Date("2026-09-01T12:00:00Z"));
    const second = addJobToPipeline(first.pipeline, job, new Date("2026-09-02T12:00:00Z"));

    expect(second.added).toBe(false);
    expect(second.pipeline).toBe(first.pipeline);
  });
});
