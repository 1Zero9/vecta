// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { JobBoard } from "@/components/JobBoard";
import { makeJob, makeProfile } from "./fixtures";

function renderBoard(overrides: Partial<ComponentProps<typeof JobBoard>> = {}) {
  const job = makeJob();
  const props: ComponentProps<typeof JobBoard> = {
    jobs: [job],
    profile: makeProfile(),
    savedJobIds: [],
    trackedJobIds: [],
    onToggleSaveJob: vi.fn(),
    onOpenFitEvaluator: vi.fn(),
    onOpenCopilot: vi.fn(),
    onTrackInPipeline: vi.fn(),
    activeDomain: "ALL",
    setActiveDomain: vi.fn(),
    ...overrides,
  };

  return { job, props, ...render(<JobBoard {...props} />) };
}

describe("JobBoard", () => {
  it("explains an empty saved list and restores the full catalogue", async () => {
    const user = userEvent.setup();
    renderBoard();

    await user.click(screen.getByRole("button", { name: "Saved (0)" }));
    expect(screen.getByRole("heading", { name: "No saved roles yet" })).toBeDefined();
    expect(screen.getByText(/Save promising roles as you browse/)).toBeDefined();

    await user.click(screen.getByRole("button", { name: "Show all roles" }));
    expect(screen.getByRole("heading", { name: "Senior Platform Engineer" })).toBeDefined();
  });

  it("offers a useful reset when a search has no matches", async () => {
    const user = userEvent.setup();
    renderBoard();

    await user.type(screen.getByRole("textbox", { name: "Search roles" }), "marine biology");
    expect(screen.getByRole("heading", { name: "No roles match these filters" })).toBeDefined();

    await user.click(screen.getByRole("button", { name: "Reset filters" }));
    expect(screen.getByRole("heading", { name: "Senior Platform Engineer" })).toBeDefined();
  });

  it("distinguishes a new pipeline action from an already tracked role", async () => {
    const user = userEvent.setup();
    const onTrackInPipeline = vi.fn();
    const { job, props, rerender } = renderBoard({ onTrackInPipeline });

    await user.click(screen.getByRole("button", { name: `Track ${job.title} in pipeline` }));
    expect(onTrackInPipeline).toHaveBeenCalledWith(job);

    rerender(<JobBoard {...props} trackedJobIds={[job.id]} />);
    expect(screen.getByRole("button", { name: `View ${job.title} in pipeline` }).textContent).toContain("Tracked");
  });

  it("handles a catalogue with no available roles", () => {
    renderBoard({ jobs: [] });

    expect(screen.getByRole("heading", { name: "No vacancies available yet" })).toBeDefined();
    expect(screen.queryByRole("button", { name: "Reset filters" })).toBeNull();
  });
});
