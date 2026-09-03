# Vecta Technical Handover

## Product status

Vecta is a Next.js 16 candidate-workspace prototype. The current milestone is Candidate Profile v1: guided onboarding, local résumé extraction, explicit review, claim-level evidence, explainable fit, evidence coverage, and confidence states.

Current identifiers are Vecta **v0.13.0 Preview**, skill taxonomy **v1.1.0**, and export schema **v1**. `package.json` is the application-version source; `lib/skillTaxonomy.ts` owns taxonomy metadata; `lib/version.ts` exposes application and export-schema identifiers. See [VERSIONING.md](VERSIONING.md).

The product name is inspired by the Latin *vecta* — “carried forward” or “conveyed”. The working brand definition is: **Your career, carried forward with clarity.**

The catalogue, market records, and drafting outputs are curated or deterministic. They are not live feeds or model-generated services. The private Sites runtime creates a D1 account record from authenticated platform headers and can store an explicitly reviewed profile snapshot with evidence. Saved roles, favourites, applications, notes, and consent remain device-local.

`UserManagementModal` is a demonstration-persona switcher, local custom-profile form, and protected-profile migration surface. It is not a complete production user-management or administrator system.

Vecta has two future access roles: User and Administrator. Career discipline remains profile data; recruiter and employer vacancy-management workflows are outside the product. See [ACCOUNT_ADMIN_ARCHITECTURE.md](ACCOUNT_ADMIN_ARCHITECTURE.md).

## Runtime and build

- Node.js 22.13 or newer
- npm 10 or newer
- Next.js 16.3.4, React 19.2, TypeScript 5, Tailwind CSS 4
- vinext 1 beta, Vite 8, the Cloudflare Vite plugin, and the Sites plugin for worker-compatible delivery
- Prisma 6.19 with SQLite in development
- PDF.js 6 and Mammoth 1 for browser-side résumé extraction

Use [BUILD.md](BUILD.md) as the operational build checklist.
Use [DEMO_GUIDE.md](DEMO_GUIDE.md) for the approved product walkthrough, reset procedure, fallback paths, and prototype claims.
The owner-only Sites preview is published at <https://vecta-career.dexincognito.chatgpt.site>.

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
    UserAPI --> Sync[lib/profileSync.ts]
    Sync --> Prisma[Next: Prisma / SQLite]
    Sync --> WorkerFallback[Sites: local-first fallback]
    Page --> AccountAPI[/api/account]
    AccountAPI --> Identity[Server-provided Sites identity]
    AccountAPI --> D1[(Sites D1 users)]
    Page --> ProfileAPI[/api/profile]
    ProfileAPI --> Identity
    ProfileAPI --> D1Profiles[(Sites D1 profiles and evidence)]
```

## Important files

| Area | File | Responsibility |
| --- | --- | --- |
| Application shell | `app/page.tsx` | Owns active views, local state, modals, and persistence callbacks. |
| Interface foundations | `components/ui/*` | Shared buttons, panels, badges, empty states, form controls, field messaging, keyboard-contained dialog structure, loading skeletons, and status notices. |
| Global search | `components/CommandPalette.tsx` | Cmd/Ctrl+K search, semantic quick navigation, and keyboard-accessible results. |
| Profiles and account copy | `components/UserManagementModal.tsx` | Demo-profile switching, local custom-profile setup, protected-copy review, and explicit conflict resolution; not complete identity management. |
| Account/admin boundary | `docs/ACCOUNT_ADMIN_ARCHITECTURE.md` | Product roles, authentication direction, owned records, admin action limits, and delivery slices. |
| Workspace state | `app/loading.tsx`, `app/error.tsx`, `components/WorkspaceLoading.tsx` | Calm route/hydration loading and recoverable unexpected-error handling. |
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
| Optional synchronization | `lib/profileSync.ts`, `lib/prismaClient.sites.ts` | Keeps Prisma/SQLite available to standard Next development while replacing it with a worker-safe no-op in the Sites build. |
| Hosted account | `app/api/account/route.ts`, `lib/sitesIdentity.ts`, `lib/d1AccountStore.ts` | Reads server-provided Sites identity, creates or refreshes the D1 user record, and enforces account status. |
| Protected profile | `app/api/profile/route.ts`, `lib/profileValidation.ts`, `lib/d1ProfileStore.ts` | Validates a complete profile, derives ownership from authenticated identity, and reads or writes the matching D1 profile and evidence records. |
| D1 schema | `db/schema.ts`, `drizzle/*.sql` | Defines and migrates authenticated users, profiles, and normalized profile evidence. |
| Sites delivery | `vite.config.mts`, `wrangler.jsonc`, `.openai/hosting.json` | Selects vinext's Worker fetch entry and emits the required worker and client assets while preserving the local-first persistence boundary. |
| Types | `lib/types.ts` | Candidate, evidence, job, application, and result contracts. |

## Candidate data flow

1. The client shows a labelled workspace skeleton while it hydrates the active profile and pipeline from `localStorage`, preventing default demonstration state from flashing before saved data is ready.
2. Onboarding holds edits in component state until **Save profile**.
3. PDF and DOCX files are read as `ArrayBuffer` values in the browser.
4. Extracted text and suggestions remain temporary until **Apply reviewed details**.
5. Evidence records link a description to selected skill or certification strings.
6. Candidate match corrections are stored against a role ID and requirement, then immediately recalculate role fit.
7. Saving updates browser storage and immediately recalculates role fit.
8. On Sites, the profile panel fetches the authenticated D1 snapshot and classifies it as absent, matching, or conflicting. Upload or replacement happens only after the user confirms it.
9. JSON export includes the browser profile, résumé text, evidence records, and match corrections; local erasure removes them. Neither action currently covers the D1 snapshot.

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

The authenticated Sites account identity and explicitly protected `CandidateProfile` snapshot are persisted in D1. Evidence uses child records with the authenticated subject in its composite key; profile preferences, résumé text, and match corrections are stored with the owned profile. The API never accepts a user ID or role from the profile payload.

Browser storage remains the active working copy. There is no automatic synchronization: a missing protected copy requires an explicit upload, and divergent copies require a confirmed choice. Saved roles, favourites, applications, notes, and consent remain browser-only. Export and erasure also remain browser-only, so do not describe the account as fully portable or the data-rights workflow as complete.

## Operational notes

- Scanned/image-only PDFs are not OCR’d and should show a manual-paste fallback.
- Résumé files are limited to 10 MB.
- Older saved profiles are hydrated with empty `preferred_locations`, `evidence`, and `skill_match_overrides` collections.
- PDF parsing uses a worker bundled by the Next.js build.
- The Sites build aliases native Prisma to a worker-safe no-op for legacy sync. The authenticated account and protected-profile endpoints use D1.
- Vitest covers 71 domain, identity, protected-profile, persistence, parser-boundary, matching, drafting, versioning, interface-foundation, state-feedback, overlay-accessibility, delivery-boundary, and component scenarios across twenty-one test files.
- Four Playwright journeys cover role search and tracking, complete onboarding persistence, fit review with reversible corrections, and persisted pipeline-stage movement with visible confirmation.
- Jobs, Companies, Market, and Pipeline have been checked at 360 px, 768 px, and 1440 px without document-level horizontal overflow. Search, local profiles, governance, fit review, application preparation, candidate profile, and onboarding now use shared dialogs that lock background scroll, contain Tab focus, close with Escape, and restore the invoking control.
- Full repository lint still includes legacy issues outside the Candidate Profile v1 files; see [BUILD.md](BUILD.md).

## Next engineering priorities

1. Validate extraction against anonymized real-world PDF/DOCX samples when safe fixtures are available.
2. Move saved roles and favourites into authenticated D1 ownership with the same explicit migration and authorization boundary.
3. Clean up the repository-wide lint baseline and make it a release quality gate.
4. Implement complete browser-and-D1 export and deletion before expanding privacy claims.
