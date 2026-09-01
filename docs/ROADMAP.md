# Vecta Product Roadmap

This roadmap turns Vecta from a strong interactive prototype into a trustworthy, useful recruitment product. Work is ordered by user value and dependency, rather than speculative dates.

**Last reconciled:** 1 September 2026

## Product direction

Vecta should help specialist candidates answer three questions with less effort:

1. Which roles are genuinely worth my attention?
2. Why am I a good fit, and where are the gaps?
3. What is the next useful action for each application?

The near-term focus is the candidate experience. Recruiter and enterprise workflows remain valuable, but should follow a reliable jobs, profile, fit, and pipeline foundation.

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
| 1 | Fit and profile reliability | Active | Match-correction controls, taxonomy expansion/versioning, real-world résumé fixtures, and broader browser coverage. |
| 2 | UI and delivery hardening | Active | Shared interface primitives, remaining empty/error/loading states, accessibility and responsive checks, repository lint cleanup, and a Sites-compatible deployment output. |
| 3 | Accounts, user management, and admin operations | Not started | Authentication, self-service account management, role-based authorization, server-owned records, an auditable admin workbench, cross-device recovery, and complete export/erasure. |
| 4 | Verified opportunity data | Not started | ATS ingestion, provenance, normalization, deduplication, freshness checks, and monitoring. |
| 5 | Grounded application assistance | Not started | Evidence-grounded generation, user review, version history, and audit records. |
| 6 | Market and recruiter expansion | Deferred | Sourced market data and a validated recruiter product boundary. |

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

### Remaining

- Introduce shared UI primitives for buttons, inputs, badges, panels, dialogs, and empty states.
- Add skeleton, error, empty, and success states to Companies, Market, Pipeline, profile, and governance workflows.
- Review keyboard access, focus states, semantic headings, contrast, and screen-reader labels.
- Run mobile, tablet, and desktop usability checks on Jobs, Companies, Market, and Pipeline.
- Replace overstated labels such as “live feeds” and “AI generated” where the underlying feature is curated or deterministic.
- Clean up the repository-wide lint baseline.
- Add a Sites-compatible build output or explicitly select another production hosting target.

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
- [ ] Add polished empty states to the remaining workspaces, anonymized real-world résumé fixtures, and broader end-to-end coverage.

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

**Status:** Not started. The current account modal switches demonstration personas and must not be treated as production user management.

### Identity and access

- Add Auth.js or Supabase Auth with Google, GitHub, and magic-link sign-in.
- Define candidate, recruiter, auditor, and administrator permissions.
- Add email verification, session management, recovery, optional MFA, rate limits, and abuse protection.
- Enforce least-privilege role checks on the server rather than relying on hidden interface controls.
- Support tenant or organisation membership only after its ownership model is defined.

### User management system

- Provide self-service account settings for identity, contact details, profile preferences, notification preferences, and connected sign-in methods.
- Let users inspect and revoke active sessions and trusted devices.
- Support account status, verified contact state, role or workspace membership, and clear recovery paths.
- Provide complete account export, deletion, and retention-state visibility.
- Add user-visible security history for sign-ins, sensitive profile changes, exports, and deletion requests.

### Admin system and workbench

- Build a separate admin-only workspace with user search, account status, roles, memberships, verification state, and support history.
- Allow authorised operators to suspend, restore, or restrict accounts; revoke sessions; resend verification; and initiate approved recovery workflows.
- Require a reason, audit entry, and elevated confirmation for high-impact actions. Avoid silent impersonation; use time-limited, visible support access only if it is later proven necessary.
- Add role and permission management with protection against removing the final administrator or escalating beyond the operator’s own authority.
- Provide operational queues for user reports, deletion/export requests, consent issues, stale-job reports, ingestion failures, and data-quality review.
- Expose service-health summaries and job-ingestion status without leaking private candidate data.
- Record immutable audit events for administrator access, searches, exports, role changes, suspensions, recovery actions, and data operations.

### Durable candidate data and pipeline

- Move saved jobs, favourites, profiles, applications, notes, and consent records to server-owned storage.
- Add tenant boundaries and authorization checks to every mutation.
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

## Phase 6 — Market and recruiter intelligence

**Goal:** Expand beyond the candidate core once the underlying data is credible.

### Scope

- Add sourced compensation datasets with geography, currency, sample size, and update date.
- Build salary distributions, location comparisons, and purchasing-power views.
- Validate recruiter workflows and decide whether they belong in the same product or a separate workspace.
- Add structured hiring rubrics and calibration packs with explicit provenance.
- Explore semantic job search only after normalized job and profile data are established.

## Delivery sequence

| Order | Workstream | Status | Relative size |
| ---: | --- | --- | :---: |
| 1 | Finish UI foundation and accessibility | Active hardening | M |
| 2 | Profile onboarding and résumé ingest | Feature slice complete | L |
| 3 | Explainable fit engine | Active hardening | L |
| 4 | Accounts, user management, admin workbench, and durable data | Not started | XL |
| 5 | Verified ATS ingestion | Not started | XL |
| 6 | Grounded application assistance | Not started | L |
| 7 | Market and recruiter expansion | Deferred | XL |

## Immediate next sprint

1. Add user correction controls for mistaken skill matches and explicit exclusions.
2. Expand and version the skill taxonomy using observed job and profile language.
3. Extend end-to-end coverage to profile onboarding, fit review, and pipeline-stage changes.
4. Create shared interface primitives and finish empty, error, loading, focus, and responsive states.
5. Validate résumé extraction against anonymized real-world PDF and DOCX samples when suitable fixtures are available.
6. Correct remaining product language around curated jobs, deterministic drafting, database sync, and compliance.
7. Choose and implement the production hosting path; the current standard Next.js output is not compatible with the configured Sites bundle contract.
8. Define the production data model, authentication choice, user-management boundaries, administrator roles, and admin-workbench action matrix before adding more persistent features.

### Dependencies and decisions

- Real-world parser validation needs anonymized PDF and DOCX samples that may be safely retained as test fixtures.
- Production deployment needs either a Sites-compatible worker build or an explicit alternative hosting target.
- Durable persistence should not expand until authentication, ownership, authorization, administrator powers, audit retention, export, and erasure boundaries are agreed together.

## Product principles

- **Calm over clever:** The interface should reduce decision fatigue.
- **Evidence over scores:** Show why a recommendation exists.
- **Assist, do not impersonate:** Never invent achievements on a candidate’s behalf.
- **Provenance by default:** Jobs, salary data, and generated claims need visible sources.
- **Privacy is a system property:** Export and erasure must cover every storage layer.
- **Candidate core first:** Add recruiter complexity only when it strengthens the primary experience.
