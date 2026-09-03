# Vecta Product Roadmap

This roadmap turns Vecta from a strong interactive prototype into a trustworthy, useful recruitment product. Work is ordered by user value and dependency, rather than speculative dates.

**Last reconciled:** 3 September 2026

## Product direction

Vecta should help specialist candidates answer three questions with less effort:

1. Which roles are genuinely worth my attention?
2. Why am I a good fit, and where are the gaps?
3. What is the next useful action for each application?

Vecta is a candidate product: people use it to find roles and manage their own career search. Vacancy publishing and recruiter workspaces are outside the product boundary. A separate administrator workbench will support Vecta operations.

## Current foundation

The prototype already provides:

- A responsive, light-only application shell with jobs as the primary working surface.
- Curated job, company, salary, and talent-archetype datasets.
- Local candidate profiles, saved roles, favourites, and application pipeline state.
- Deterministic fit scoring and ATS résumé checks.
- Template-based application and interview preparation.
- Local data export and erasure controls, plus optional Prisma synchronization.

Before presenting these features as production-ready, the product still needs real authentication, self-service user management, an auditable admin workbench, durable data ownership, verified job ingestion, and clearer AI/compliance language.

## Remaining roadmap at a glance

| Priority | Workstream | Current state | What remains |
| ---: | --- | --- | --- |
| 1 | Fit and profile reliability | Active | Real-world résumé fixtures and ongoing measured taxonomy maintenance. |
| 2 | UI and delivery hardening | Active | Remaining legacy controls, accessibility and responsive checks, and repository lint cleanup. The owner-only hosted preview is operational. |
| 3 | Accounts, user management, and admin operations | In progress | Product roles and security boundaries are defined; authenticated identity, server-owned records, the auditable admin workbench, cross-device recovery, and complete export/erasure remain. |
| 4 | Verified opportunity data | Not started | ATS ingestion, provenance, normalization, deduplication, freshness checks, and monitoring. |
| 5 | Grounded application assistance | Not started | Evidence-grounded generation, user review, version history, and audit records. |
| 6 | Candidate market intelligence | Deferred | Sourced compensation and role-market data with provenance and useful candidate comparisons. |

## Phase 1 — UI foundation and product clarity

**Goal:** Make the prototype coherent, credible, accessible, and easy to evaluate.

**Status:** Core visual refresh complete; hardening remains.

### Completed

- [x] Apply the professional, relaxed light visual system across the application shell.
- [x] Remove dark-mode logic and theme-switching controls.
- [x] Apply the Vecta logo, extracted mark, favicon, PWA icons, metadata, and brand definition.
- [x] Keep the first viewport focused on role discovery and immediate action.
- [x] Add useful job empty states, recovery actions, tracked-role state, and save-to-pipeline feedback.
- [x] Cover the first role-search-to-pipeline journey in Chromium.
- [x] Introduce shared button, panel, badge, and empty-state foundations and use them across Jobs, Pipeline, Companies, and Market.
- [x] Add a single recovery-oriented empty pipeline state, clearer Companies/Market empty results, global visible focus, and semantic fit/archetype controls.
- [x] Add shared input, textarea, select, field, and dialog foundations; apply them to profile onboarding and manually tracked applications.
- [x] Add explicit application-field validation, Escape dismissal, focus restoration, labelled dialog descriptions, and normalized saved values.
- [x] Add a calm hydration and route-loading shell, a recoverable application error boundary, shared status notices, and specific confirmation for privacy, saved-role, saved-company, pipeline-stage, notes, and removal actions.
- [x] Move global search, profile switching, governance, fit review, and application preparation onto the shared dialog foundation with focus containment, Escape dismissal, background scroll locking, and focus restoration.
- [x] Make search results and demo-profile cards semantic keyboard actions, restore the documented Cmd/Ctrl+K shortcut, and label governance/application tabs for assistive technology.
- [x] Move the candidate profile drawer and onboarding shell onto the shared dialog foundation, convert their evidence and résumé-review controls, and expose mobile setup steps and profile strength to assistive technology.
- [x] Replace claims of live or verified data, external AI generation, and regulatory conformity with accurate curated-data, deterministic-feature, and prototype-governance boundaries.
- [x] Remove invented achievements and metrics from application and STAR templates; use saved evidence or explicit prompts that require user verification.
- [x] Verify Jobs, Companies, Market, and Pipeline at 360 px, 768 px, and 1440 px without page-level horizontal overflow.
- [x] Add a Sites-compatible vinext/Vite/Cloudflare Worker build with an explicit local-first persistence fallback.
- [x] Package, publish, and verify the owner-only Sites preview.

### Remaining

- Extend state-specific handling when real network-backed Companies, Market, profile, and governance operations replace the current local and curated workflows.
- Continue keyboard, focus, heading, contrast, and screen-reader reviews as server-backed workflows are introduced.
- Continue interaction-level mobile checks as new server-backed states and workflows are introduced.
- Clean up the repository-wide lint baseline.

### Exit criteria

- All primary workflows are usable at 360 px, 768 px, and desktop widths.
- No screen depends on dark-theme styling or low-contrast colour combinations.
- A first-time user can find a role, inspect fit, save it, and add it to the pipeline without guidance.

## Phase 2 — Candidate profile and trustworthy fit

**Goal:** Turn fit scoring into an understandable decision aid based on real candidate information.

**Status:** Active milestone — Candidate Profile v1 feature slice complete; matching and validation hardening remain.

### Candidate Profile v1

- [x] Add a guided four-step onboarding flow for career direction, experience, location, salary, work mode, skills, certifications, and résumé evidence.
- [x] Calculate profile completeness and expose onboarding from the main jobs workspace.
- [x] Persist onboarding changes through the existing local-first profile store and immediately recalculate role matches.
- [x] Add local PDF and DOCX résumé upload with a review step before extracted information is accepted.
- [x] Let users connect individual profile claims to employment, project, or certification evidence.
- [x] Show linked evidence in fit audits and flag matched claims that still lack support.
- [x] Add confidence explanations and suppress precise fit percentages when information is insufficient.
- [x] Add unit coverage for completion, résumé analysis guardrails, evidence coverage, confidence, fit scoring, storage, job filtering, and pipeline insertion.
- [x] Exercise DOCX, multi-page PDF, and image-only PDF extraction boundaries with synthetic parser fixtures.
- [x] Add component tests for onboarding validation and the résumé upload, review, correction, selection, apply, and failure flow.
- [x] Add distinct empty-catalogue, empty-saved-list, and no-filter-match states with accessible recovery actions.
- [x] Mark tracked roles, explain duplicate tracking, and cover the find-to-pipeline journey in Chromium.
- [x] Normalize common skill aliases, match explicit compound alternatives, prevent short-term substring collisions, and weight required skills above preferred skills.
- [x] Let candidates correct false-positive matches, include missed requirements, undo corrections, and persist those choices per role.
- [x] Add a repeatable product demo guide with a seven-minute walkthrough, short version, reset path, fallback paths, and honest prototype boundaries.
- [x] Establish Vecta v0.2.0, taxonomy v1.1.0, and export schema v1; expose versions in-product, documentation, and data exports.
- [x] Expand the versioned taxonomy with observed identity, observability, vector-database, application-security, governance, resilience, and device-management language.
- [x] Cover complete onboarding, fit review and reversible corrections, role-to-pipeline tracking, and persisted pipeline-stage changes in Chromium.
- [ ] Add anonymized real-world résumé fixtures and broader end-to-end coverage.

### Scope

- Refine structured profile onboarding using observed user behaviour and completion data.
- Support PDF and DOCX résumé upload with explicit review before extracted data is saved.
- Expand the normalized alias registry, keep required/preferred weighting explainable, and connect user corrections to evidence references.
- Explain every fit score and allow users to correct mistaken matches.
- Separate résumé quality checks from role-fit scoring.
- Add confidence and “insufficient information” states instead of manufacturing precision.

### Exit criteria

- Users can create, review, update, export, and delete a complete profile.
- Every score can be traced to profile evidence and job requirements.
- Fit results remain useful when a résumé is incomplete or a job description is sparse.

## Phase 3 — Accounts, user management, admin workbench, and durable pipeline

**Goal:** Make Vecta safe to use across sessions and devices, while giving users control of their accounts and operators the minimum tools needed to support the service.

**Status:** In progress. The User/Administrator boundary and first device-local account state are defined in [ACCOUNT_ADMIN_ARCHITECTURE.md](ACCOUNT_ADMIN_ARCHITECTURE.md). Authenticated identity and durable ownership remain unimplemented.

### Identity and access

- Use the Sites-provided authenticated subject for the private hosted product; confirm a separate external identity path before any public standalone launch.
- Keep exactly two access roles: User and Administrator. Career discipline is profile data, not permission data.
- Add email verification, session management, recovery, optional MFA, rate limits, and abuse protection.
- Enforce least-privilege role checks on the server rather than relying on hidden interface controls.
- Do not introduce employer, recruiter, tenant, or organisation workflows into the candidate product.

### User management system

- Provide self-service account settings for identity, contact details, profile preferences, notification preferences, and connected sign-in methods.
- Let users inspect and revoke active sessions and trusted devices.
- Support account status, verified contact state, role or workspace membership, and clear recovery paths.
- Provide complete account export, deletion, and retention-state visibility.
- Add user-visible security history for sign-ins, sensitive profile changes, exports, and deletion requests.

### Admin system and workbench

- Build a separate admin-only workspace with user search, account status, verification state, and support history.
- Allow authorised operators to suspend, restore, or restrict accounts; revoke sessions; resend verification; and initiate approved recovery workflows.
- Require a reason, audit entry, and elevated confirmation for high-impact actions. Avoid silent impersonation; use time-limited, visible support access only if it is later proven necessary.
- Add administrator assignment and permission management with protection against removing the final administrator or escalating beyond the operator’s own authority.
- Provide operational queues for user reports, deletion/export requests, consent issues, stale-job reports, ingestion failures, and data-quality review.
- Expose service-health summaries and job-ingestion status without leaking private candidate data.
- Record immutable audit events for administrator access, searches, exports, role changes, suspensions, recovery actions, and data operations.

### Durable candidate data and pipeline

- Move saved jobs, favourites, profiles, applications, notes, and consent records to server-owned D1 storage, with R2 reserved for résumé files and other blobs.
- Add authenticated ownership and authorization checks to every query and mutation.
- Implement genuine account export and deletion across browser and database storage.
- Add application reminders, activity history, follow-up dates, and archive/reopen actions.

### Exit criteria

- A user can sign in on another device and recover the same profile and pipeline.
- A user can manage identity, sessions, preferences, security history, export, and deletion without administrator help.
- Administrators can perform only documented support and operational actions, with least-privilege authorization and a complete audit trail.
- Data export and deletion cover every persisted record.
- Automated authorization tests prevent cross-account, cross-tenant, and unauthorised admin access.

## Phase 4 — Verified opportunity data

**Goal:** Replace the demonstration catalogue with fresh, attributable job intelligence.

### Scope

- Build adapters for supported public ATS sources such as Greenhouse, Lever, Ashby, and Workable.
- Store source URL, ingestion time, last verification time, and closure status for every role.
- Deduplicate jobs and normalize company, location, salary, work-mode, skills, and seniority fields.
- Add freshness indicators and a user-facing way to report stale or incorrect listings.
- Introduce scheduled ingestion with health monitoring and failure alerts.
- Keep curated editorial records clearly distinguished from automatically ingested records.

### Exit criteria

- Every displayed vacancy has provenance and a recent verification timestamp.
- Closed roles are removed or marked without manual dataset edits.
- Failed feeds are visible to operators and do not silently serve stale data.

## Phase 5 — Assisted applications

**Goal:** Provide genuinely tailored assistance without inventing candidate experience.

### Scope

- Add an LLM-backed drafting service behind an explicit user action.
- Ground every draft in approved profile evidence and the selected job description.
- Require review for unsupported claims, invented metrics, and missing evidence.
- Provide tone, length, and emphasis controls while preserving the user’s voice.
- Add version history and reusable achievement stories for cover letters, résumé bullets, and STAR preparation.
- Record model, prompt version, source evidence, and user edits for auditability.

### Exit criteria

- Generated content never presents template metrics as candidate facts.
- Users can see which profile evidence supported each draft.
- Drafting failures degrade gracefully without blocking job and pipeline workflows.

## Phase 6 — Candidate market intelligence

**Goal:** Help users make better career decisions once the underlying market data is credible.

### Scope

- Add sourced compensation datasets with geography, currency, sample size, and update date.
- Build salary distributions, location comparisons, and purchasing-power views.
- Add candidate-oriented role archetypes and interview preparation patterns with explicit provenance.
- Explore semantic job search only after normalized job and profile data are established.

## Delivery sequence

| Order | Workstream | Status | Relative size |
| ---: | --- | --- | :---: |
| 1 | Finish UI foundation and accessibility | Active hardening | M |
| 2 | Profile onboarding and résumé ingest | Feature slice complete | L |
| 3 | Explainable fit engine | Active hardening | L |
| 4 | Accounts, user management, admin workbench, and durable data | In progress | XL |
| 5 | Verified ATS ingestion | Not started | XL |
| 6 | Grounded application assistance | Not started | L |
| 7 | Candidate market intelligence | Deferred | L |

## Immediate next sprint

1. Validate résumé extraction against anonymized real-world PDF and DOCX samples when suitable fixtures are available.
2. Implement authenticated Sites identity and the initial D1 user record defined in `ACCOUNT_ADMIN_ARCHITECTURE.md`, with server-side ownership and authorization tests.
3. Clean up the repository-wide lint baseline and make it a release quality gate.
4. Extend state-specific handling when real network-backed Companies, Market, profile, and governance workflows are introduced.
5. Test the Prisma major-version migration needed to clear the current development-only dependency advisory chain.

### Dependencies and decisions

- Real-world parser validation needs anonymized PDF and DOCX samples that may be safely retained as test fixtures.
- The hosted preview is local-first by design. Durable server persistence requires a worker-compatible data store plus the Phase 3 identity, ownership, authorization, export, erasure, and audit model.
- Durable persistence should not expand until authentication, ownership, authorization, administrator powers, audit retention, export, and erasure boundaries are agreed together.

## Product principles

- **Calm over clever:** The interface should reduce decision fatigue.
- **Evidence over scores:** Show why a recommendation exists.
- **Assist, do not impersonate:** Never invent achievements on a candidate’s behalf.
- **Provenance by default:** Jobs, salary data, and generated claims need visible sources.
- **Privacy is a system property:** Export and erasure must cover every storage layer.
- **Candidate product:** Every user-facing workflow helps a person find and manage their own role opportunities.
