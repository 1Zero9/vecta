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

To exercise the worker-compatible Sites adapter locally:

```bash
npm run dev:sites
```

The Sites adapter intentionally disables native Prisma/SQLite synchronization. Candidate data remains in browser storage, matching the hosted preview's documented local-first boundary.

## Production validation

```bash
npm test
npm run test:coverage
npm run test:e2e
npm run build
npm run build:sites
```

`npm test` runs the fast unit and component suite once. `npm run test:watch` keeps it running during development, and `npm run test:coverage` produces an HTML report in `coverage/`. `npm run test:e2e` starts the built application on port 3100 and runs the Chromium candidate journeys; install its browser once with `npx playwright install chromium`. A successful standard production build completes compilation and TypeScript checking. A successful Sites build emits `dist/server/index.js`, the client assets, and the copied hosting manifest. The Sites build script disables Wrangler's automatic `.env` loading so local values are never copied into the packaged worker artifact.

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
  lib/profileSync.ts \
  lib/prismaClient.sites.ts \
  lib/types.ts
```

## Current validation status

- Production build: passing.
- Candidate Profile v1 focused lint: passing.
- Automated unit and component suite: 57 tests across 17 files, passing.
- Playwright core workflows: 4 Chromium end-to-end tests, passing.
- Current V8 coverage: 82.24% statements, 71.55% branches, 93.05% functions, and 87.06% lines across the selected domain modules. Skill normalization has 100% statement, branch, function, and line coverage.
- Production dependency audit (`npm audit --omit=dev`): no known vulnerabilities. The full development audit reports three high-severity findings in Prisma CLI's `deepmerge-ts` chain; resolving them requires a separately tested Prisma major-version migration.
- Repository-wide `npm run lint`: currently reports legacy errors and warnings in older screens. It is not yet a passing quality gate.
- Onboarding validation, candidate-profile editing, evidence-grounded drafting, governance boundaries, résumé upload/review, job empty states, pipeline actions, shared status notices, loading presentation, error recovery, dialog focus containment, global-search keyboard access, and local-profile creation have automated coverage. Browser journeys cover onboarding persistence, fit review and reversible corrections, role-to-pipeline tracking, and pipeline-stage persistence with visible confirmation.
- Responsive workspace audit: Jobs, Companies, Market, and Pipeline verified at 360 px, 768 px, and 1440 px with no page-level horizontal overflow.

## Common failures

| Symptom | Action |
| --- | --- |
| Prisma client is out of date | Run `npx prisma generate`. |
| Local database schema is missing | Set `DATABASE_URL` and run `npx prisma db push`. |
| PDF parser engine warning | Upgrade Node.js to 22.13 or newer and reinstall with `npm ci`. |
| A scanned PDF extracts no text | This is expected without OCR; use manual paste. |
| Port 3000 is occupied | Use the alternative URL printed by `npm run dev`. |
| Stale dependencies in a running dev server | Stop the server, run `npm ci`, and restart it. |
| Sites build cannot find a Vite native binding | Use the supported Node.js version, reinstall with `npm ci`, and rerun `npm run build:sites`. |
| Hosted profile or consent sync returns `offline: true` | Expected in v0.10.0: the Sites build excludes native SQLite and uses browser storage as the primary store. |
| Sites publish says the default `fetch` handler is missing | Confirm `@cloudflare/vite-plugin` is installed and registered for the `rsc` environment, then rebuild and save a new version. Do not retry the unchanged archive. |

## Release checklist

1. Run `npm ci` in a clean environment.
2. Run `npx prisma generate`.
3. Run `npm test` and `npm run test:coverage`.
4. Run `npm run build`.
5. Run `npm run build:sites` and confirm `dist/server/index.js` exists.
6. Run `npm run test:e2e`.
7. Run the focused lint command above.
8. Confirm the root route and read-only catalogue APIs return successful responses in the intended runtime.
9. Run the core walkthrough in [DEMO_GUIDE.md](DEMO_GUIDE.md), including one match correction and reset.
10. Confirm `package.json`, the header/footer, fit audit, exports, and [VERSIONING.md](VERSIONING.md) show the intended versions.
11. Review roadmap and user-facing language for feature-status changes.
