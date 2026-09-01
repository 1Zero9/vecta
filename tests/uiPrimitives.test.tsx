// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";
import { PipelineBoard } from "@/components/PipelineBoard";

describe("shared interface foundations", () => {
  it("provides a keyboard-ready button with a safe default type", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Continue</Button>);

    const button = screen.getByRole("button", { name: "Continue" });
    expect(button.getAttribute("type")).toBe("button");
    await user.tab();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("announces a reusable empty state and exposes its recovery action", () => {
    render(<EmptyState title="Nothing here yet" description="Add the first item." action={<Button>Add item</Button>} />);
    expect(screen.getByRole("status")).toBeDefined();
    expect(screen.getByRole("heading", { name: "Nothing here yet" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Add item" })).toBeDefined();
  });

  it("gives an empty pipeline one clear starting point", () => {
    render(
      <Panel>
        <PipelineBoard
          pipeline={[]}
          onUpdateStage={vi.fn()}
          onUpdateNotes={vi.fn()}
          onRemoveApplication={vi.fn()}
          onAddCustomApplication={vi.fn()}
        />
      </Panel>,
    );

    expect(screen.getByRole("heading", { name: "Your pipeline is ready for its first role" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Export CSV" }).hasAttribute("disabled")).toBe(true);
  });
});

