// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProfileOnboardingModal } from "@/components/ProfileOnboardingModal";
import { makeProfile } from "./fixtures";

describe("ProfileOnboardingModal", () => {
  it("validates required profile details before saving the four-step flow", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSave = vi.fn();

    render(
      <ProfileOnboardingModal
        profile={makeProfile({
          full_name: "",
          current_title: "",
          years_experience: 0,
          preferred_locations: [],
          skills: [],
          certifications: [],
          resume_text: "",
        })}
        onClose={onClose}
        onSave={onSave}
      />,
    );

    expect(screen.getByRole("dialog", { name: "Build your Vecta profile" })).toBeDefined();
    expect(document.body.style.overflow).toBe("hidden");
    expect(screen.getByRole("navigation", { name: "Profile setup progress" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Direction: Where you are heading" }).getAttribute("aria-current")).toBe("step");

    await user.click(screen.getByRole("button", { name: /Continue/ }));
    expect((await screen.findByRole("alert")).textContent).toContain("Add your name");

    await user.type(screen.getByRole("textbox", { name: "Full name" }), "Morgan Casey");
    await user.type(
      screen.getByRole("textbox", { name: "Current or most recent role" }),
      "Cloud Security Lead",
    );
    await user.click(screen.getByRole("button", { name: /Continue/ }));
    expect(screen.getByRole("heading", { name: "Define the right opportunity." })).toBeDefined();

    await user.click(screen.getByRole("button", { name: /Continue/ }));
    expect((await screen.findByRole("alert")).textContent).toContain("preferred location");
    await user.type(screen.getByRole("textbox", { name: /Preferred locations/ }), "Dublin, Remote");
    await user.click(screen.getByRole("button", { name: /Continue/ }));

    expect(screen.getByRole("heading", { name: "What do you bring?" })).toBeDefined();
    await user.type(screen.getByRole("textbox", { name: /Skills and capabilities/ }), "AWS, Azure");
    await user.click(screen.getByRole("button", { name: /Continue/ }));
    expect((await screen.findByRole("alert")).textContent).toContain("at least three skills");
    await user.type(screen.getByRole("textbox", { name: /Skills and capabilities/ }), ", Terraform");
    await user.click(screen.getByRole("button", { name: /Continue/ }));

    expect(screen.getByRole("heading", { name: "Add evidence, not just keywords." })).toBeDefined();
    await user.click(screen.getByRole("button", { name: "Save profile" }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        full_name: "Morgan Casey",
        current_title: "Cloud Security Lead",
        preferred_locations: ["Dublin", "Remote"],
        skills: ["AWS", "Azure", "Terraform"],
      }),
    );
    expect(onClose).toHaveBeenCalledOnce();
  });
});
