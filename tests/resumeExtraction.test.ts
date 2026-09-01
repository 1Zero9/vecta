import { describe, expect, it } from "vitest";
import { analyzeResumeText, extractResume } from "@/lib/resumeExtraction";

describe("resume text analysis", () => {
  it("finds bounded skills, certifications, and stated experience", () => {
    const analysis = analyzeResumeText(
      "Cloud engineer with 9+ years of experience using AWS, Kubernetes, Terraform and Python. CISSP certified.",
    );
    expect(analysis.suggestedSkills).toEqual(expect.arrayContaining(["AWS", "Kubernetes", "Terraform", "Python"]));
    expect(analysis.suggestedCertifications).toContain("CISSP");
    expect(analysis.suggestedYearsExperience).toBe(9);
  });

  it("does not match short skills inside unrelated words", () => {
    const analysis = analyzeResumeText("Designs and draws secure architecture diagrams.");
    expect(analysis.suggestedSkills).not.toContain("AWS");
  });

  it("rejects unsupported files before parsing", async () => {
    const file = { name: "resume.txt", size: 100 } as File;
    await expect(extractResume(file)).rejects.toThrow("supports PDF and DOCX");
  });

  it("rejects files above the size limit before parsing", async () => {
    const file = { name: "resume.pdf", size: 10 * 1024 * 1024 + 1 } as File;
    await expect(extractResume(file)).rejects.toThrow("smaller than 10 MB");
  });
});
