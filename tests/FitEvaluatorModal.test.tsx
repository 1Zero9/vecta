// @vitest-environment jsdom

import { fireEvent, render, screen, within } from "@testing-library/react";
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
        onUpdateSkillMatchOverride={vi.fn()}
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

  it("lets the candidate correct and exclude skill matches", () => {
    const onUpdateSkillMatchOverride = vi.fn();
    const job = makeJob({
      req_skills: ["AWS", "Rust"],
      preferred_skills: [],
      certifications: [],
    });
    render(
      <FitEvaluatorModal
        job={job}
        profile={makeProfile({ skills: ["AWS"], resume_text: "" })}
        isOpen
        onClose={vi.fn()}
        onOpenCopilot={vi.fn()}
        onOpenProfile={vi.fn()}
        onUpdateSkillMatchOverride={onUpdateSkillMatchOverride}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Exclude AWS" }));
    fireEvent.click(screen.getByRole("button", { name: "Count as match Rust" }));

    expect(onUpdateSkillMatchOverride).toHaveBeenNthCalledWith(1, job.id, "AWS", "required", "exclude");
    expect(onUpdateSkillMatchOverride).toHaveBeenNthCalledWith(2, job.id, "Rust", "required", "include");
  });
});
