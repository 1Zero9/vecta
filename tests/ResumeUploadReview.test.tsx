// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ResumeUploadReview } from "@/components/ResumeUploadReview";

const extractionMocks = vi.hoisted(() => ({
  extractResume: vi.fn(),
}));

vi.mock("@/lib/resumeExtraction", () => ({
  extractResume: extractionMocks.extractResume,
}));

describe("ResumeUploadReview", () => {
  beforeEach(() => {
    extractionMocks.extractResume.mockReset();
  });

  it("lets the user review, edit, and selectively apply extracted details", async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    extractionMocks.extractResume.mockResolvedValue({
      fileName: "candidate.docx",
      text: "Cloud security specialist with seven years of delivery experience.",
      wordCount: 9,
      suggestedSkills: ["AWS", "Kubernetes"],
      suggestedCertifications: ["CISSP", "CKA"],
      suggestedYearsExperience: 7,
    });

    render(
      <ResumeUploadReview
        currentSkills={["AWS"]}
        currentCertifications={["CISSP"]}
        currentYearsExperience={3}
        onApply={onApply}
      />,
    );

    await user.upload(
      screen.getByLabelText(/Choose a PDF or DOCX résumé/),
      new File(["docx"], "candidate.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }),
    );

    expect(await screen.findByText("candidate.docx")).toBeDefined();
    expect(screen.queryByRole("button", { name: "AWS" })).toBeNull();
    expect(screen.queryByRole("button", { name: "CISSP" })).toBeNull();

    await user.click(screen.getByRole("button", { name: /Kubernetes/ }));
    fireEvent.change(screen.getByLabelText("Extracted résumé text"), {
      target: { value: "Reviewed and corrected résumé text." },
    });
    await user.click(screen.getByRole("button", { name: "Apply reviewed details" }));

    expect(onApply).toHaveBeenCalledWith({
      text: "Reviewed and corrected résumé text.",
      skills: ["AWS"],
      certifications: ["CISSP", "CKA"],
      yearsExperience: 7,
    });
    expect(await screen.findByText("Reviewed details applied")).toBeDefined();
  });

  it("shows a readable extraction failure and returns to the upload state", async () => {
    const user = userEvent.setup();
    extractionMocks.extractResume.mockRejectedValue(
      new Error("We could not find readable text in this PDF. It may be scanned or image-based."),
    );

    render(
      <ResumeUploadReview
        currentSkills={[]}
        currentCertifications={[]}
        currentYearsExperience={0}
        onApply={vi.fn()}
      />,
    );

    await user.upload(
      screen.getByLabelText(/Choose a PDF or DOCX résumé/),
      new File(["scan"], "scan.pdf", { type: "application/pdf" }),
    );

    expect((await screen.findByRole("alert")).textContent).toContain("It may be scanned or image-based.");
    await waitFor(() => {
      expect(screen.getByText("Choose a PDF or DOCX résumé")).toBeDefined();
    });
  });
});
