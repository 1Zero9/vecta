// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CommandPalette } from "@/components/CommandPalette";
import { GovernanceModal } from "@/components/GovernanceModal";
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
    await user.click(screen.getByRole("button", { name: /Explore Company Tech/ }));
    expect(setActiveTab).toHaveBeenCalledWith("radar");
  });

  it("states the prototype governance boundary without claiming compliance", async () => {
    const user = userEvent.setup();
    render(<GovernanceModal isOpen onClose={vi.fn()} onDataWiped={vi.fn()} />);

    expect(screen.getByText(/does not call an external generative-AI model/)).toBeDefined();
    await user.click(screen.getByRole("tab", { name: "Privacy controls" }));
    expect(screen.getByText(/do not establish production GDPR/)).toBeDefined();
    await user.click(screen.getByRole("tab", { name: "Governance roadmap" }));
    expect(screen.getByText(/not certified to ISO\/IEC 42001/)).toBeDefined();
  });

  it("labels local profiles honestly and creates one through shared form controls", async () => {
    const user = userEvent.setup();
    const onSaveCustomUser = vi.fn();
    render(<UserManagementModal currentUser={DEFAULT_USER} profile={makeProfile()} isOpen onClose={vi.fn()} onSelectPersona={vi.fn()} onSaveCustomUser={onSaveCustomUser} onOpenGovernance={vi.fn()} />);

    expect(screen.getByRole("dialog", { name: "Profiles on this device" })).toBeDefined();
    expect(screen.getByText("Device-local preview")).toBeDefined();
    expect(screen.queryByText(/Recruiter \/ Talent Lead/)).toBeNull();
    await user.click(screen.getByRole("button", { name: "Create local profile" }));
    expect(screen.getByRole("dialog", { name: "Create a local profile" })).toBeDefined();
    await user.type(screen.getByRole("textbox", { name: "Full name" }), "Jordan Smith");
    await user.type(screen.getByRole("textbox", { name: "Email address" }), "jordan@example.com");
    await user.click(screen.getByRole("button", { name: "Save and switch profile" }));
    expect(onSaveCustomUser).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Jordan Smith", email: "jordan@example.com", role: "User" }),
      expect.objectContaining({ full_name: "Jordan Smith" }),
    );
  });

  it("shows a protected hosted account separately from the active career profile", () => {
    render(
      <UserManagementModal
        currentUser={DEFAULT_USER}
        profile={makeProfile()}
        authenticatedAccount={{ id: "account-1", email: "jordan@example.com", name: "Jordan Quinn", persisted: true }}
        profileProtectionState="local-only"
        isOpen
        onClose={vi.fn()}
        onSelectPersona={vi.fn()}
        onSaveCustomUser={vi.fn()}
        onOpenGovernance={vi.fn()}
      />,
    );

    expect(screen.getByText("Protected account connected")).toBeDefined();
    expect(screen.getByText(/Signed in as Jordan Quinn/)).toBeDefined();
    expect(screen.getAllByText("Alex Mercer")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Copy this profile to protected account" })).toBeDefined();
  });

  it("requires confirmation before replacing a protected profile", async () => {
    const user = userEvent.setup();
    const onProtectProfile = vi.fn().mockResolvedValue(undefined);
    render(
      <UserManagementModal
        currentUser={DEFAULT_USER}
        profile={makeProfile({ full_name: "Device Candidate" })}
        protectedProfile={makeProfile({ full_name: "Protected Candidate" })}
        authenticatedAccount={{ id: "account-1", email: "jordan@example.com", name: "Jordan Quinn", persisted: true }}
        profileProtectionState="conflict"
        isOpen
        onClose={vi.fn()}
        onSelectPersona={vi.fn()}
        onSaveCustomUser={vi.fn()}
        onProtectProfile={onProtectProfile}
        onOpenGovernance={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Keep this device profile" }));
    expect(onProtectProfile).not.toHaveBeenCalled();
    expect(screen.getByText(/Replace the protected account copy with Device Candidate/)).toBeDefined();
    await user.click(screen.getByRole("button", { name: "Confirm replacement" }));
    expect(onProtectProfile).toHaveBeenCalledOnce();
  });

  it("requires confirmation before replacing protected saved lists", async () => {
    const user = userEvent.setup();
    const onProtectSavedItems = vi.fn().mockResolvedValue(undefined);
    render(
      <UserManagementModal
        currentUser={DEFAULT_USER}
        profile={makeProfile()}
        savedJobIds={["job-device"]}
        favouriteCompanyIds={["company-device"]}
        protectedSavedItems={{ savedJobIds: ["job-protected"], favouriteCompanyIds: [] }}
        authenticatedAccount={{ id: "account-1", email: "jordan@example.com", name: "Jordan Quinn", persisted: true }}
        savedItemsProtectionState="conflict"
        isOpen
        onClose={vi.fn()}
        onSelectPersona={vi.fn()}
        onSaveCustomUser={vi.fn()}
        onProtectSavedItems={onProtectSavedItems}
        onOpenGovernance={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Keep this device’s saved lists" }));
    expect(onProtectSavedItems).not.toHaveBeenCalled();
    expect(screen.getByText(/Replace the protected role and company lists/)).toBeDefined();
    await user.click(screen.getByRole("button", { name: "Confirm replacement" }));
    expect(onProtectSavedItems).toHaveBeenCalledOnce();
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
