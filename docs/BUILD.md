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
npm run test:e2e
npm run build
```

`npm test` runs the fast unit and component suite once. `npm run test:watch` keeps it running during development, and `npm run test:coverage` produces an HTML report in `coverage/`. `npm run test:e2e` starts the built application on port 3100 and runs the Chromium candidate journey; install its browser once with `npx playwright install chromium`. A successful production build completes compilation, TypeScript checking, page-data collection, and static-page generation.

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
  lib/skillMatching.ts \
  lib/types.ts
```

## Current validation status

- Production build: passing.
- Candidate Profile v1 focused lint: passing.
- Automated unit and component suite: 35 tests across 12 files, passing.
- Playwright candidate journey: 1 Chromium end-to-end test, passing.
- Current V8 coverage: 80.76% statements, 65.21% branches, 90.27% functions, and 85.41% lines across the selected domain modules. Skill normalization has 100% statement, branch, function, and line coverage.
- Repository-wide `npm run lint`: currently reports legacy errors and warnings in older screens. It is not yet a passing quality gate.
- Onboarding validation, résumé upload/review, job empty states, and pipeline actions have component interaction coverage. The first find-to-pipeline browser journey is covered; broader end-to-end coverage remains roadmap work.

## Common failures

| Symptom | Action |
| --- | --- |
| Prisma client is out of date | Run `npx prisma generate`. |
| Local database schema is missing | Set `DATABASE_URL` and run `npx prisma db push`. |
| PDF parser engine warning | Upgrade Node.js to 22.13 or newer and reinstall with `npm ci`. |
| A scanned PDF extracts no text | This is expected without OCR; use manual paste. |
| Port 3000 is occupied | Use the alternative URL printed by `npm run dev`. |
| Stale dependencies in a running dev server | Stop the server, run `npm ci`, and restart it. |
| Sites deployment reports `Missing dist/server/index.js` | The standard Next.js build is healthy but does not emit the Sites bundle contract. Add a supported worker adapter or select another production host before publishing. |

## Release checklist

1. Run `npm ci` in a clean environment.
2. Run `npx prisma generate`.
3. Run `npm test` and `npm run test:coverage`.
4. Run `npm run build`.
5. Run `npm run test:e2e`.
6. Run the focused lint command above.
7. Confirm the root route returns a successful response.
8. Review roadmap and user-facing language for feature-status changes.
