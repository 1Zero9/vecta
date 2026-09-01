import { expect, test } from "@playwright/test";

test("a candidate finds a role and carries it into the pipeline", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "vecta_consent_settings",
      JSON.stringify({
        gdprConsent: true,
        aiActConsent: true,
        analyticsConsent: false,
        consentedAt: "2026-09-01T00:00:00.000Z",
      }),
    );
    localStorage.setItem("vecta_application_pipeline", "[]");
    localStorage.setItem("vecta_saved_jobs", "[]");
  });

  await page.goto("/");

  await expect(page.getByText("Your career, carried forward.")).toBeVisible();
  await page.getByRole("textbox", { name: "Search roles" }).fill("Principal MLOps");
  await expect(page.getByRole("heading", { name: "Principal MLOps & Vector Infrastructure Architect" })).toBeVisible();

  await page.getByRole("button", { name: "Track Principal MLOps & Vector Infrastructure Architect in pipeline" }).click();
  await expect(page.getByRole("heading", { name: "Career Application Vector Pipeline" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Principal MLOps & Vector Infrastructure Architect" })).toBeVisible();

  const storedPipeline = await page.evaluate(() => localStorage.getItem("vecta_application_pipeline"));
  expect(JSON.parse(storedPipeline ?? "[]")[0]).toMatchObject({
    job_id: "job-ai-02",
    stage: "saved",
  });

  await page.getByRole("button", { name: /Jobs/ }).first().click();
  await page.getByRole("button", { name: "View Principal MLOps & Vector Infrastructure Architect in pipeline" }).click();
  await expect(page.getByRole("status")).toContainText("already in your career pipeline");
});
