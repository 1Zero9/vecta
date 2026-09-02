// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import ErrorPage from "@/app/error";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("workspace error recovery", () => {
  afterEach(() => vi.restoreAllMocks());

  it("protects implementation details and lets the user retry", async () => {
    const user = userEvent.setup();
    const reset = vi.fn();
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(<ErrorPage error={Object.assign(new Error("private stack detail"), { digest: "ref-123" })} reset={reset} />);

    expect(screen.getByRole("alert").textContent).toContain("Your locally saved profile and pipeline have not been removed.");
    expect(screen.queryByText("private stack detail")).toBeNull();
    expect(screen.getByText("Reference: ref-123")).toBeDefined();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledOnce();
  });
});
