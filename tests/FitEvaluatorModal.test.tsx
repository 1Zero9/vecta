// @vitest-environment jsdom

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FitEvaluatorModal } from "@/components/FitEvaluatorModal";
import { makeJob, makeProfile } from "./fixtures";

describe("FitEvaluatorModal", () => {
  it("explains required and preferred weighting and alias sources", () => {
    render(
      <FitEvaluatorModal
        job={makeJob({
          req_skills: ["Amazon Web Services", "Google Cloud Platform"],
          preferred_skills: ["Python / Go"],
          certifications: [],
        })}
        profile={makeProfile({
          skills: ["AWS Security", "Go"],
          resume_text: "",
        })}
        isOpen
        onClose={vi.fn()}
        onOpenCopilot={vi.fn()}
        onOpenProfile={vi.fn()}
      />,
    );

    expect(screen.getByText(/Required skills contribute 75%/)).toBeDefined();

    const requiredCard = screen.getByRole("heading", { name: "Required skills" }).closest("article");
    const preferredCard = screen.getByRole("heading", { name: "Preferred skills" }).closest("article");
    expect(requiredCard).not.toBeNull();
    expect(preferredCard).not.toBeNull();
    expect(within(requiredCard!).getByText("50%")).toBeDefined();
    expect(within(requiredCard!).getByText("via AWS Security")).toBeDefined();
    expect(within(preferredCard!).getByText("100%")).toBeDefined();
    expect(within(preferredCard!).getByText("via Go")).toBeDefined();
  });
});
