# Vecta

Vecta is a light-only recruitment workspace for specialist candidates in AI, cybersecurity, governance, and cloud/IT. It combines a curated role catalogue, a local-first candidate profile, explainable fit estimates, résumé review, evidence linking, and an application pipeline.

The name is inspired by the Latin *vecta* — “carried forward” or “conveyed”. For the product, it means bringing experience, evidence, and ambition together to carry a career forward with clarity.

This repository is currently a product prototype. Job and market records are curated demonstration data, drafting is deterministic, and local browser storage is the primary candidate-data store. Authentication, durable multi-device ownership, and verified job ingestion remain roadmap work.

## Current capabilities

- Search and filter curated roles across four specialist disciplines.
- Complete a guided candidate profile with preferences, skills, credentials, and career evidence.
- Parse PDF and DOCX résumés in the browser, review extracted text, and explicitly accept suggested updates.
- Link employment, project, and certification evidence to individual profile claims.
- Compare a profile with a role using deterministic skills, seniority, and domain scoring.
- See evidence coverage, unsupported claims, confidence limitations, and insufficient-information states.
- Save roles and manage applications through a local pipeline.
- Export or erase locally stored candidate data.

## Technology

- Next.js 16 App Router, React 19, and TypeScript
- Tailwind CSS 4 with a professional light-only visual system
- Prisma 6 with SQLite for optional development synchronization
- PDF.js and Mammoth for local PDF/DOCX text extraction
- Browser `localStorage` for the prototype’s device-local profile and pipeline state
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
npm run lint
```

`npm test` runs the unit and component suite. `npm run test:e2e` runs the first Chromium candidate journey against a production server. `npm run build` performs production compilation and TypeScript checking. See [docs/BUILD.md](docs/BUILD.md) for coverage details, the focused quality gate, and the current repository-wide lint baseline.

## Key project areas

```text
app/                              Next.js routes, APIs, metadata, and page orchestration
components/ProfileOnboardingModal Guided profile flow
components/ResumeUploadReview     Local résumé extraction review
components/ProfileEvidenceManager Claim-to-evidence editor
components/FitEvaluatorModal      Fit, confidence, evidence, and ATS explanation
lib/fitEngine.ts                  Deterministic fit and confidence calculations
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

Résumé files are parsed in the browser and are not uploaded by the current implementation. Extracted content is only added to the profile after review, and the profile is only persisted after the user saves it. Export and erasure include the stored résumé text and evidence records.

This is a prototype privacy model, not a claim of production compliance. Production use still requires authentication, server-side authorization, retention controls, operational security, and a complete legal review.

## Documentation

- [Build and validation](docs/BUILD.md)
- [User guide](docs/USER_GUIDE.md)
- [Technical handover](docs/HANDOVER.md)
- [Product roadmap](docs/ROADMAP.md)
