import { expect, test } from "@playwright/test";

const consent = {
  gdprConsent: true,
  aiActConsent: true,
  analyticsConsent: false,
  consentedAt: "2026-09-01T00:00:00.000Z",
};

test("a candidate completes onboarding and persists the reviewed profile", async ({ page }) => {
  await page.addInitScript((seedConsent) => {
    localStorage.setItem("vecta_consent_settings", JSON.stringify(seedConsent));
    localStorage.setItem("vecta_candidate_profile", JSON.stringify({
      full_name: "",
      current_title: "",
      primary_domain: "IT",
      years_experience: 0,
      skills: [],
      certifications: [],
      preferred_work_mode: "Any",
      preferred_locations: [],
      resume_text: "",
      evidence: [],
      skill_match_overrides: [],
    }));
  }, consent);

  await page.goto("/");
  await page.getByRole("button", { name: /Complete your profile/ }).click();
  await expect(page.getByRole("heading", { name: "Build your Vecta profile" })).toBeVisible();

  await page.getByLabel("Full name").fill("Jamie Rivera");
  await page.getByLabel("Current or most recent role").fill("Platform Engineer");
  await page.getByLabel("Years of experience").fill("5");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel("Preferred locations").fill("Dublin, Remote Europe");
  await page.getByLabel("Preferred work mode").selectOption("Hybrid");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel("Skills and capabilities").fill("Kubernetes, Terraform, OpenTelemetry");
  await page.getByLabel("Certifications and accreditations").fill("CKA");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel("Career history and achievements").fill("Built and operated a Kubernetes platform with Terraform and OpenTelemetry for a distributed engineering team.");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByRole("status")).toContainText("Profile saved. Your role matches have been recalculated.");

  const storedProfile = await page.evaluate(() => JSON.parse(localStorage.getItem("vecta_candidate_profile") ?? "{}"));
  expect(storedProfile).toMatchObject({
    full_name: "Jamie Rivera",
    current_title: "Platform Engineer",
    years_experience: 5,
    preferred_work_mode: "Hybrid",
    preferred_locations: ["Dublin", "Remote Europe"],
    skills: ["Kubernetes", "Terraform", "OpenTelemetry"],
  });
});

test("a candidate reviews, corrects, and restores a fit result", async ({ page }) => {
  await page.addInitScript((seedConsent) => {
    localStorage.setItem("vecta_consent_settings", JSON.stringify(seedConsent));
    localStorage.setItem("vecta_candidate_profile", JSON.stringify({
      full_name: "Morgan Lee",
      current_title: "Platform Engineer",
      primary_domain: "IT",
      years_experience: 6,
      skills: ["Kubernetes", "Terraform", "Python"],
      certifications: [],
      preferred_work_mode: "Hybrid",
      preferred_locations: ["Dublin"],
      resume_text: "Designed and operated production Kubernetes platforms with Terraform and Python automation. ".repeat(5),
      evidence: [],
      skill_match_overrides: [],
    }));
  }, consent);

  await page.goto("/");
  await page.getByRole("textbox", { name: "Search roles" }).fill("Principal MLOps");
  await page.locator('[title="Click to view Vector Fit breakdown and ATS parseability"]').click();
  await expect(page.getByRole("heading", { name: "Vector Match and résumé audit" })).toBeVisible();
  await expect(page.getByText("Taxonomy v1.1.0", { exact: false })).toBeVisible();

  await page.getByRole("button", { name: "Exclude Kubernetes" }).click();
  await expect(page.getByText("Excluded by you")).toBeVisible();
  let overrides = await page.evaluate(() => JSON.parse(localStorage.getItem("vecta_candidate_profile") ?? "{}").skill_match_overrides);
  expect(overrides).toEqual([expect.objectContaining({ job_id: "job-ai-02", requirement: "Kubernetes", decision: "exclude" })]);

  await page.getByRole("button", { name: "Undo correction for Kubernetes" }).click();
  await expect(page.getByRole("button", { name: "Exclude Kubernetes" })).toBeVisible();
  overrides = await page.evaluate(() => JSON.parse(localStorage.getItem("vecta_candidate_profile") ?? "{}").skill_match_overrides);
  expect(overrides).toEqual([]);

  await page.getByRole("button", { name: "Count as match GCP / AWS" }).click();
  await expect(page.getByText("Included by you")).toBeVisible();
  overrides = await page.evaluate(() => JSON.parse(localStorage.getItem("vecta_candidate_profile") ?? "{}").skill_match_overrides);
  expect(overrides).toEqual([expect.objectContaining({ job_id: "job-ai-02", requirement: "GCP / AWS", decision: "include" })]);
});

test("a candidate advances an application and the pipeline persists the stage", async ({ page }) => {
  await page.addInitScript((seedConsent) => {
    localStorage.setItem("vecta_consent_settings", JSON.stringify(seedConsent));
    localStorage.setItem("vecta_application_pipeline", JSON.stringify([{
      id: "track-workflow-test",
      job_id: "job-workflow-test",
      company_name: "Northstar Systems",
      job_title: "Workflow Test Role",
      domain: "IT",
      stage: "saved",
      date_added: "2026-09-01",
      date_updated: "2026-09-01",
      notes: "Ready for review.",
    }]));
  }, consent);

  await page.goto("/");
  await page.getByRole("button", { name: /Pipeline/ }).first().click();
  await expect(page.getByRole("heading", { name: "Workflow Test Role" })).toBeVisible();

  await page.getByTitle("Advance stage").click();
  let storedPipeline = await page.evaluate(() => JSON.parse(localStorage.getItem("vecta_application_pipeline") ?? "[]"));
  expect(storedPipeline[0].stage).toBe("drafting");
  await expect(page.getByRole("status")).toContainText('Moved "Workflow Test Role" to Drafting & Tailoring.');

  await page.getByTitle("Advance stage").click();
  storedPipeline = await page.evaluate(() => JSON.parse(localStorage.getItem("vecta_application_pipeline") ?? "[]"));
  expect(storedPipeline[0].stage).toBe("applied");
  await expect(page.getByRole("status")).toContainText('Moved "Workflow Test Role" to Applied / Submitted.');
  await expect(page.getByText("Applied / Submitted", { exact: true })).toBeVisible();
});
