// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";
import { PipelineBoard } from "@/components/PipelineBoard";
import { DialogShell } from "@/components/ui/dialog-shell";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

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

  it("labels shared fields and closes dialogs with Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <DialogShell titleId="test-dialog" title="Edit record" description="Update the saved details." onClose={onClose}>
        <Field id="record-name" label="Record name" hint="Use a recognisable title.">
          <Input id="record-name" aria-describedby="record-name-hint" />
        </Field>
      </DialogShell>,
    );

    expect(screen.getByRole("dialog", { name: "Edit record" })).toBeDefined();
    expect(screen.getByRole("textbox", { name: "Record name" }).getAttribute("aria-describedby")).toBe("record-name-hint");
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("explains missing application fields before adding to the pipeline", async () => {
    const user = userEvent.setup();
    const onAddCustomApplication = vi.fn();
    render(
      <PipelineBoard
        pipeline={[]}
        onUpdateStage={vi.fn()}
        onUpdateNotes={vi.fn()}
        onRemoveApplication={vi.fn()}
        onAddCustomApplication={onAddCustomApplication}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Add Application" }));
    await user.click(screen.getByRole("button", { name: "Add to pipeline" }));
    expect(screen.getByText("Enter a job title.")).toBeDefined();
    expect(screen.getByText("Enter a company name.")).toBeDefined();

    await user.type(screen.getByRole("textbox", { name: "Job title" }), "Security Engineer");
    await user.type(screen.getByRole("textbox", { name: "Company" }), "Northstar Systems");
    await user.click(screen.getByRole("button", { name: "Add to pipeline" }));
    expect(onAddCustomApplication).toHaveBeenCalledWith(expect.objectContaining({
      job_title: "Security Engineer",
      company_name: "Northstar Systems",
    }));
  });
});
