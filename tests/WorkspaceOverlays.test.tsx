// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CommandPalette } from "@/components/CommandPalette";
import { ProfileDrawer } from "@/components/ProfileDrawer";
import { UserManagementModal } from "@/components/UserManagementModal";
import { DEFAULT_USER } from "@/lib/storage";
import { makeProfile } from "./fixtures";

describe("workspace overlays", () => {
  it("opens global search from the documented keyboard shortcut", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<CommandPalette isOpen={false} onOpen={onOpen} onClose={vi.fn()} jobs={[]} companies={[]} benchmarks={[]} onSelectJob={vi.fn()} setActiveTab={vi.fn()} openProfileDrawer={vi.fn()} />);

    await user.keyboard("{Control>}k{/Control}");
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it("exposes quick navigation as keyboard-ready actions", async () => {
    const user = userEvent.setup();
    const setActiveTab = vi.fn();
    render(<CommandPalette isOpen onOpen={vi.fn()} onClose={vi.fn()} jobs={[]} companies={[]} benchmarks={[]} onSelectJob={vi.fn()} setActiveTab={setActiveTab} openProfileDrawer={vi.fn()} />);

    expect(screen.getByRole("dialog", { name: "Search Vecta" })).toBeDefined();
    await user.click(screen.getByRole("button", { name: /Explore Company Tech Radar/ }));
    expect(setActiveTab).toHaveBeenCalledWith("radar");
  });

  it("labels local profiles honestly and creates one through shared form controls", async () => {
    const user = userEvent.setup();
    const onSaveCustomUser = vi.fn();
    render(<UserManagementModal currentUser={DEFAULT_USER} isOpen onClose={vi.fn()} onSelectPersona={vi.fn()} onSaveCustomUser={onSaveCustomUser} onOpenGovernance={vi.fn()} />);

    expect(screen.getByRole("dialog", { name: "Profiles on this device" })).toBeDefined();
    await user.click(screen.getByRole("button", { name: "Create local profile" }));
    expect(screen.getByRole("dialog", { name: "Create a local profile" })).toBeDefined();
    await user.type(screen.getByRole("textbox", { name: "Full name" }), "Jordan Smith");
    await user.type(screen.getByRole("textbox", { name: "Email address" }), "jordan@example.com");
    await user.click(screen.getByRole("button", { name: "Save and switch profile" }));
    expect(onSaveCustomUser).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Jordan Smith", email: "jordan@example.com" }),
      expect.objectContaining({ full_name: "Jordan Smith" }),
    );
  });

  it("edits and saves a candidate profile from the accessible drawer", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSaveProfile = vi.fn();
    render(<ProfileDrawer profile={makeProfile()} isOpen onClose={onClose} onSaveProfile={onSaveProfile} />);

    expect(screen.getByRole("dialog", { name: "Candidate profile" })).toBeDefined();
    expect(screen.getByRole("heading", { name: "Career direction" })).toBeDefined();
    const name = screen.getByRole("textbox", { name: "Full name" });
    await user.clear(name);
    await user.type(name, "Taylor Quinn");
    await user.type(screen.getByRole("textbox", { name: /Skills/ }), "OpenTelemetry");
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Remove OpenTelemetry" })).toBeDefined();
    await user.click(screen.getByRole("button", { name: "Save profile" }));

    expect(onSaveProfile).toHaveBeenCalledWith(
      expect.objectContaining({ full_name: "Taylor Quinn", skills: expect.arrayContaining(["OpenTelemetry"]) }),
    );
    expect(onClose).toHaveBeenCalledOnce();
  });
});
