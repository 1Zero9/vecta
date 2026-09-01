# Vecta Product Roadmap

This roadmap turns Vecta from a strong interactive prototype into a trustworthy, useful recruitment product. Work is ordered by user value and dependency, rather than speculative dates.

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

Before presenting these features as production-ready, the product still needs real authentication, durable data ownership, verified job ingestion, and clearer AI/compliance language.

## Phase 1 — UI foundation and product clarity

**Goal:** Make the prototype coherent, credible, accessible, and easy to evaluate.

### In progress

- Apply the new professional, relaxed light visual system to every screen.
- Standardize navigation, cards, controls, modals, typography, and responsive spacing.
- Remove dark-mode logic and all theme-switching controls.
- Keep the first viewport focused on role discovery and immediate action.

### Next

- Introduce shared UI primitives for buttons, inputs, badges, panels, dialogs, and empty states.
- Add skeleton, error, empty, and success states to each primary workflow.
- Review keyboard access, focus states, semantic headings, contrast, and screen-reader labels.
- Run mobile, tablet, and desktop usability checks on Jobs, Companies, Market, and Pipeline.
- Replace overstated labels such as “live feeds” and “AI generated” where the underlying feature is curated or deterministic.

### Exit criteria

- All primary workflows are usable at 360 px, 768 px, and desktop widths.
- No screen depends on dark-theme styling or low-contrast colour combinations.
- A first-time user can find a role, inspect fit, save it, and add it to the pipeline without guidance.

## Phase 2 — Candidate profile and trustworthy fit

**Goal:** Turn fit scoring into an understandable decision aid based on real candidate information.

### Scope

- Add structured profile onboarding with goals, location, salary expectations, work mode, skills, and experience.
- Support PDF and DOCX résumé upload with explicit review before extracted data is saved.
- Replace loose substring matching with normalized skills, aliases, required/preferred weighting, and evidence references.
- Explain every fit score and allow users to correct mistaken matches.
- Separate résumé quality checks from role-fit scoring.
- Add confidence and “insufficient information” states instead of manufacturing precision.

### Exit criteria

- Users can create, review, update, export, and delete a complete profile.
- Every score can be traced to profile evidence and job requirements.
- Fit results remain useful when a résumé is incomplete or a job description is sparse.

## Phase 3 — Real accounts and durable pipeline

**Goal:** Make Vecta safe to use across sessions and devices.

### Scope

- Add Auth.js or Supabase Auth with Google, GitHub, and magic-link sign-in.
- Define candidate, recruiter, auditor, and administrator permissions.
- Move saved jobs, favourites, profiles, applications, notes, and consent records to server-owned storage.
- Add tenant boundaries and authorization checks to every mutation.
- Implement genuine account export and deletion across browser and database storage.
- Add application reminders, activity history, follow-up dates, and archive/reopen actions.

### Exit criteria

- A user can sign in on another device and recover the same profile and pipeline.
- Data export and deletion cover every persisted record.
- Automated authorization tests prevent cross-account access.

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

| Order | Workstream | Why now | Relative size |
| ---: | --- | --- | :---: |
| 1 | Finish UI foundation and accessibility | Makes every later feature easier to evaluate | M |
| 2 | Profile onboarding and résumé ingest | Supplies the evidence required for useful matching | L |
| 3 | Explainable fit engine | Core product differentiation and trust | L |
| 4 | Authentication and durable data | Required before real user adoption | L |
| 5 | Verified ATS ingestion | Converts the demo catalogue into a useful service | XL |
| 6 | Grounded application assistance | Valuable only after profile evidence is reliable | L |
| 7 | Market and recruiter expansion | Builds on trusted data and proven candidate demand | XL |

## Immediate next sprint

1. Finish the light-theme consistency pass across secondary tabs and modals.
2. Create shared interface primitives and remove duplicated control styles.
3. Correct product language around curated jobs, deterministic drafting, database sync, and compliance.
4. Add a guided candidate-profile completion flow.
5. Write tests for fit scoring, storage, job filtering, and the critical save-to-pipeline journey.
6. Define the production data model and authentication decision before adding more surface features.

## Product principles

- **Calm over clever:** The interface should reduce decision fatigue.
- **Evidence over scores:** Show why a recommendation exists.
- **Assist, do not impersonate:** Never invent achievements on a candidate’s behalf.
- **Provenance by default:** Jobs, salary data, and generated claims need visible sources.
- **Privacy is a system property:** Export and erasure must cover every storage layer.
- **Candidate core first:** Add recruiter complexity only when it strengthens the primary experience.
