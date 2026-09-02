// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CommandPalette } from "@/components/CommandPalette";
import { UserManagementModal } from "@/components/UserManagementModal";
import { DEFAULT_USER } from "@/lib/storage";

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
});
