# Build and Validation Guide

## Supported environment

- Node.js 22.13 or newer
- npm 10 or newer
- macOS, Linux, or a compatible CI runner

PDF.js 6 sets the effective Node.js minimum for dependency installation. Using an older Node.js release may produce only a warning locally, but it is not the supported build environment.

## Clean installation

```bash
npm ci
npx prisma generate
```

For optional local database synchronization, create `.env` with:

```dotenv
DATABASE_URL="file:./dev.db"
```

Then run:

```bash
npx prisma db push
```

## Development

```bash
npm run dev
```

Use the exact local URL printed by Next.js. The port can change when the default is occupied.

## Production validation

```bash
npm test
npm run test:coverage
npm run build
```

`npm test` runs the fast unit suite once. `npm run test:watch` keeps it running during development, and `npm run test:coverage` produces an HTML report in `coverage/`. A successful production build completes compilation, TypeScript checking, page-data collection, and static-page generation.

For focused validation of Candidate Profile v1:

```bash
npx eslint --quiet \
  components/ProfileOnboardingModal.tsx \
  components/ResumeUploadReview.tsx \
  components/ProfileEvidenceManager.tsx \
  components/FitEvaluatorModal.tsx \
  components/JobBoard.tsx \
  lib/jobFiltering.ts \
  lib/pipeline.ts \
  lib/resumeExtraction.ts \
  lib/profileCompletion.ts \
  lib/fitEngine.ts \
  lib/types.ts
```

## Current validation status

- Production build: passing.
- Candidate Profile v1 focused lint: passing.
- Automated unit and component suite: 24 tests across 9 files, passing.
- Current V8 coverage: 78.42% statements, 67% branches, 89.79% functions, and 84.12% lines across the selected domain modules.
- Repository-wide `npm run lint`: currently reports legacy errors and warnings in older screens. It is not yet a passing quality gate.
- Onboarding validation and résumé upload/review have component interaction coverage. Broader browser integration and end-to-end coverage remain roadmap work.

## Common failures

| Symptom | Action |
| --- | --- |
| Prisma client is out of date | Run `npx prisma generate`. |
| Local database schema is missing | Set `DATABASE_URL` and run `npx prisma db push`. |
| PDF parser engine warning | Upgrade Node.js to 22.13 or newer and reinstall with `npm ci`. |
| A scanned PDF extracts no text | This is expected without OCR; use manual paste. |
| Port 3000 is occupied | Use the alternative URL printed by `npm run dev`. |
| Stale dependencies in a running dev server | Stop the server, run `npm ci`, and restart it. |

## Release checklist

1. Run `npm ci` in a clean environment.
2. Run `npx prisma generate`.
3. Run `npm test` and `npm run test:coverage`.
4. Run `npm run build`.
5. Run the focused lint command above.
6. Confirm the root route returns a successful response.
7. Review roadmap and user-facing language for feature-status changes.
