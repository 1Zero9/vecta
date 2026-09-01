# Vecta Technical Handover

## Product status

Vecta is a Next.js 16 candidate-workspace prototype. The current milestone is Candidate Profile v1: guided onboarding, local résumé extraction, explicit review, claim-level evidence, explainable fit, evidence coverage, and confidence states.

Current identifiers are Vecta **v0.4.0 Preview**, skill taxonomy **v1.1.0**, and export schema **v1**. `package.json` is the application-version source; `lib/skillTaxonomy.ts` owns taxonomy metadata; `lib/version.ts` exposes application and export-schema identifiers. See [VERSIONING.md](VERSIONING.md).

The product name is inspired by the Latin *vecta* — “carried forward” or “conveyed”. The working brand definition is: **Your career, carried forward with clarity.**

The catalogue, market records, and drafting outputs are curated or deterministic. They are not live feeds or model-generated services. Candidate state is primarily device-local until authentication and durable ownership are implemented.

`UserManagementModal` is currently a demonstration-persona switcher and local custom-profile form. It is not a production identity, user-management, or administrator system.

## Runtime and build

- Node.js 22.13 or newer
- npm 10 or newer
- Next.js 16.3.4, React 19.2, TypeScript 5, Tailwind CSS 4
- Prisma 6.19 with SQLite in development
- PDF.js 6 and Mammoth 1 for browser-side résumé extraction

Use [BUILD.md](BUILD.md) as the operational build checklist.
Use [DEMO_GUIDE.md](DEMO_GUIDE.md) for the approved product walkthrough, reset procedure, fallback paths, and prototype claims.

## Architecture

```mermaid
flowchart TD
    Page[app/page.tsx] --> Jobs[JobBoard]
    Page --> Onboarding[ProfileOnboardingModal]
    Page --> Profile[ProfileDrawer]
    Page --> Fit[FitEvaluatorModal]
    Page --> Pipeline[PipelineBoard]
    Onboarding --> Resume[ResumeUploadReview]
    Onboarding --> Evidence[ProfileEvidenceManager]
    Profile --> Evidence
    Resume --> ResumeEngine[lib/resumeExtraction.ts]
    Fit --> FitEngine[lib/fitEngine.ts]
    Jobs --> Filters[lib/jobFiltering.ts]
    Page --> PipelineLogic[lib/pipeline.ts]
    Page --> Storage[lib/storage.ts]
    Storage --> Local[(Browser localStorage)]
    Page -. optional sync .-> UserAPI[/api/user]
    UserAPI --> Prisma[Prisma / SQLite]
```

## Important files

| Area | File | Responsibility |
| --- | --- | --- |
| Application shell | `app/page.tsx` | Owns active views, local state, modals, and persistence callbacks. |
| Interface foundations | `components/ui/*` | Shared buttons, panels, badges, and recovery-oriented empty states. |
| Guided profile | `components/ProfileOnboardingModal.tsx` | Four-step candidate onboarding and final save boundary. |
| Résumé review | `components/ResumeUploadReview.tsx` | File selection, extraction state, suggestions, and explicit apply action. |
| Evidence editor | `components/ProfileEvidenceManager.tsx` | Adds, edits, removes, and links evidence to profile claims. |
| Fit explanation | `components/FitEvaluatorModal.tsx` | Score breakdown, confidence, evidence coverage, gaps, and ATS feedback. |
| Fit logic | `lib/fitEngine.ts` | Deterministic matching, evidence lookup, confidence, and ATS checks. |
| Skill normalization | `lib/skillMatching.ts` | Compound alternatives, bounded résumé matching, candidate overrides, and match provenance. |
| Skill taxonomy | `lib/skillTaxonomy.ts` | Versioned canonical concepts and explicit aliases observed in job/profile language. |
| Release identifiers | `lib/version.ts`, `package.json` | Product and export-schema versions exposed to the UI and exports. |
| Job filtering | `lib/jobFiltering.ts` | Pure search, discipline, location, work-mode, and seniority filtering. |
| Pipeline logic | `lib/pipeline.ts` | Converts a selected job into a new saved-stage application. |
| Résumé parsing | `lib/resumeExtraction.ts` | Local PDF/DOCX extraction and deterministic skill/certification suggestions. |
| Profile quality | `lib/profileCompletion.ts` | Weighted completeness and missing profile areas. |
| Persistence | `lib/storage.ts` | Local save/load, backward-compatible profile hydration, export, and erasure. |
| Types | `lib/types.ts` | Candidate, evidence, job, application, and result contracts. |

## Candidate data flow

1. The client hydrates the active profile and pipeline from `localStorage`.
2. Onboarding holds edits in component state until **Save profile**.
3. PDF and DOCX files are read as `ArrayBuffer` values in the browser.
4. Extracted text and suggestions remain temporary until **Apply reviewed details**.
5. Evidence records link a description to selected skill or certification strings.
6. Candidate match corrections are stored against a role ID and requirement, then immediately recalculate role fit.
7. Saving updates browser storage and immediately recalculates role fit.
8. JSON export includes the full profile, résumé text, evidence records, and match corrections; erasure removes them.

The file bytes themselves are not persisted or sent to an API.

## Fit and confidence model

The displayed fit estimate remains:

```text
overall = skills × 0.50 + seniority × 0.25 + domain × 0.25
```

- Skills compare required and preferred job skills with structured profile skills and bounded résumé terms.
- Within skills alignment, required skills contribute 75% and preferred skills contribute 25%. When a role supplies only one category, that category carries the full skills weight.
- A curated alias registry normalizes common equivalents such as AWS/Amazon Web Services, K8s/Kubernetes, and Threat Modeling/Threat Modelling. Compound requirements such as `Python / Go` match either explicit alternative.
- Match provenance records the profile term or résumé source used for each match. Short terms do not use loose substring matching, preventing collisions such as Go/Google Cloud.
- Candidate overrides can include a missed requirement or exclude a false positive for one role. Overrides affect scoring, remain visibly labelled, and do not create evidence.
- Seniority compares years of experience with the role tier.
- Domain gives full credit for a direct discipline match and partial credit for defined adjacent disciplines.
- Evidence does not increase the match percentage. It produces a separate coverage measure for matched claims.
- Confidence is based on structured profile detail, résumé depth, scorable job requirements, and evidence coverage.
- Low-confidence results suppress the precise overall percentage and show an insufficient-information state.

Gap talking points must describe transferable experience and learning plans honestly. They must never assert direct experience that is absent from the profile.

## Persistence boundary

`CandidateProfile.evidence` and `CandidateProfile.skill_match_overrides` are currently part of the browser-stored TypeScript profile. The existing Prisma `Profile` model does not yet persist evidence records, preferred locations, or match corrections. Do not describe the current prototype as multi-device or fully database-backed.

The Phase 3 data-model work should normalize profile evidence with ownership and authorization checks before production use.

## Operational notes

- Scanned/image-only PDFs are not OCR’d and should show a manual-paste fallback.
- Résumé files are limited to 10 MB.
- Older saved profiles are hydrated with empty `preferred_locations`, `evidence`, and `skill_match_overrides` collections.
- PDF parsing uses a worker bundled by the Next.js build.
- Vitest covers 43 domain, persistence, parser-boundary, matching, versioning, interface-foundation, and component scenarios across thirteen test files.
- Four Playwright journeys cover role search and tracking, complete onboarding persistence, fit review with reversible corrections, and persisted pipeline-stage movement.
- Full repository lint still includes legacy issues outside the Candidate Profile v1 files; see [BUILD.md](BUILD.md).

## Next engineering priorities

1. Extend shared foundations to inputs and dialogs, then finish remaining error, loading, success, focus, and responsive states.
2. Validate extraction against anonymized real-world PDF/DOCX samples when safe fixtures are available.
3. Add a Sites-compatible deployment build or choose another production hosting target.
4. Define the production identity and owned-data model, self-service user management, administrator roles, auditable support actions, and admin-workbench boundaries before expanding persistence.
