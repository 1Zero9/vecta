# Vecta

Vecta is a light-only recruitment workspace for specialist candidates in AI, cybersecurity, governance, and cloud/IT. It combines a curated role catalogue, a local-first candidate profile, explainable fit estimates, résumé review, evidence linking, and an application pipeline.

Current release: **Vecta v0.15.0 Preview** · Skill taxonomy **v1.1.0** · Export schema **v1**.

The name is inspired by the Latin *vecta* — “carried forward” or “conveyed”. For the product, it means bringing experience, evidence, and ambition together to carry a career forward with clarity.

This repository is currently a product prototype. Job and market records are curated demonstration data and drafting is deterministic. The private Sites build creates a server-owned account from authenticated visitor headers and lets that person explicitly protect a reviewed profile, evidence, saved lists, and application pipeline in D1. Consent history, complete data rights, self-service account management, an auditable admin workbench, and verified job ingestion remain roadmap work.

The local and production Next.js builds pass. A separate vinext/Vite/Cloudflare build powers an owner-only [hosted preview](https://vecta-career.dexincognito.chatgpt.site). Its authenticated profile API uses D1; legacy optional Prisma synchronization remains disabled in the Worker build.

## Current capabilities

- Search and filter curated roles across four specialist disciplines.
- Complete a guided candidate profile with preferences, skills, credentials, and career evidence.
- Parse PDF and DOCX résumés in the browser, review extracted text, and explicitly accept suggested updates.
- Link employment, project, and certification evidence to individual profile claims.
- Compare a profile with a role using deterministic skills, seniority, and domain scoring.
- Match common skill aliases and score required requirements more heavily than preferred ones.
- Correct false-positive or missed skill matches for an individual role without creating unsupported evidence.
- See evidence coverage, unsupported claims, confidence limitations, and insufficient-information states.
- Save roles and manage applications through the browser working copy, with explicit protected snapshots on Sites.
- Export or erase locally stored candidate data.
- Connect the authenticated private Sites visitor to a server-owned account record without trusting browser-provided identity or roles.
- Review and explicitly copy the active profile, résumé text, evidence, preferences, and role-specific fit corrections to that protected account, with a confirmation step for conflicts.
- Protect saved-role and favourite-company lists, including intentional empty lists, with the same reviewed migration and conflict controls.

## Technology

- Next.js 16 App Router, React 19, and TypeScript
- Tailwind CSS 4 with a professional light-only visual system
- Prisma 6 with SQLite for optional development synchronization
- vinext, Vite, and the Sites plugin for the worker-compatible hosted build
- PDF.js and Mammoth for local PDF/DOCX text extraction
- Browser `localStorage` for active working copies and the device-local pipeline
- Cloudflare D1 for authenticated Sites accounts and explicitly protected profiles and saved lists
- Vitest, Testing Library, and V8 coverage for deterministic logic and core profile interactions

## Local setup

### Requirements

- Node.js 22.13 or newer
- npm 10 or newer

### Install and run

```bash
npm ci
npx prisma generate
npm run dev
```

Open the local URL printed by Next.js. It normally begins at `http://localhost:3000`, but Next.js will choose another port when that port is occupied.

The optional Prisma development database uses `DATABASE_URL`. For local SQLite, use:

```dotenv
DATABASE_URL="file:./dev.db"
```

Then initialize it with:

```bash
npx prisma db push
```

The main candidate workflow still works through local browser storage if database synchronization is unavailable.

## Build and validation

```bash
npm test
npm run test:coverage
npm run test:e2e
npm run build
npm run build:sites
npm run lint
```

`npm test` runs the unit and component suite. `npm run test:e2e` runs the core Chromium candidate journeys against a production server. `npm run build` validates the standard Next.js application; `npm run build:sites` emits the Sites bundle at `dist/server/index.js`. See [docs/BUILD.md](docs/BUILD.md) for the complete release sequence, coverage details, and current lint baseline.

## Key project areas

```text
app/                              Next.js routes, APIs, metadata, and page orchestration
components/ProfileOnboardingModal Guided profile flow
components/ResumeUploadReview     Local résumé extraction review
components/ProfileEvidenceManager Claim-to-evidence editor
components/FitEvaluatorModal      Fit, confidence, evidence, and ATS explanation
lib/fitEngine.ts                  Deterministic fit and confidence calculations
lib/skillMatching.ts              Alias normalization and boundary-safe requirement matching
lib/jobFiltering.ts               Search and filter rules for the role catalogue
lib/pipeline.ts                   Safe, testable job-to-pipeline insertion
lib/resumeExtraction.ts           Browser PDF/DOCX extraction and suggestions
lib/profileCompletion.ts          Profile completeness calculation
lib/storage.ts                    Device-local persistence, export, and erasure
data/                              Curated demonstration datasets
tests/                             Unit coverage for the candidate workflow
docs/                              Build, user, handover, and roadmap documentation
```

## Privacy model

Résumé files are parsed in the browser and are not uploaded as files. Extracted content is added only after review. On the hosted preview, a signed-in user can separately confirm copying the resulting text, profile evidence, saved roles, and favourite companies to D1. Current export and erasure controls cover browser data only; complete protected-account export and deletion remain Phase 3 work.

This is a prototype privacy model, not a claim of production compliance. Production use still requires authentication, server-side authorization, retention controls, operational security, and a complete legal review.

## Documentation

- [Demo guide](docs/DEMO_GUIDE.md)
- [Versioning and releases](docs/VERSIONING.md)
- [Account and admin architecture](docs/ACCOUNT_ADMIN_ARCHITECTURE.md)
- [Build and validation](docs/BUILD.md)
- [User guide](docs/USER_GUIDE.md)
- [Technical handover](docs/HANDOVER.md)
- [Product roadmap](docs/ROADMAP.md)
