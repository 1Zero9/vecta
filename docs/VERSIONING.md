# Vecta Versioning and Releases

Version identifiers make demos, exports, matching behaviour, and roadmap progress traceable. Vecta currently publishes three independent identifiers.

| Surface | Current | Source | Meaning |
| --- | --- | --- | --- |
| Product | `0.9.0` | `package.json` | The complete Vecta application milestone. |
| Skill taxonomy | `1.1.0` | `lib/skillTaxonomy.ts` | The canonical skill concepts and explicit aliases used by matching. |
| Export schema | `1` | `lib/version.ts` | The shape of the downloaded user-data bundle. |

The interface labels the product as **Preview** while the product version remains below `1.0.0`.

## Product version policy

Vecta uses semantic versions:

- Increase the patch number for fixes that do not change intended user behaviour.
- Increase the minor number for a coherent new prototype capability or a backwards-compatible workflow change.
- Reserve major version `1` for the first production-ready contract, including agreed authentication, ownership, support, and operational boundaries.

`package.json` is the source of truth. `lib/version.ts` reads it for the interface and data export. Update `package-lock.json` alongside it.

### Milestone history

- `0.9.0` — Evidence-grounded application templates and accurate prototype language for curated data, privacy controls, deterministic fit, and future governance work.
- `0.8.0` — Shared accessible profile drawer and onboarding shell, consistent profile/evidence/résumé controls, mobile-readable setup steps, and semantic profile progress.
- `0.7.0` — Shared, keyboard-contained overlays for search, profile switching, governance, fit review, and application preparation, plus responsive workspace verification.
- `0.6.0` — Calm workspace loading, recoverable application errors, shared status notices, and specific confirmation for saved and pipeline actions.
- `0.5.0` — Shared form and dialog foundations applied to onboarding and manually tracked applications, with accessible validation and keyboard dismissal.
- `0.4.0` — Shared interface foundations, clearer primary-workspace empty states, and improved keyboard focus and semantics.
- `0.3.0` — Reliable core browser journeys for onboarding, fit review and corrections, pipeline tracking, and pipeline-stage persistence.
- `0.2.0` — Versioned matching taxonomy, traceable exports, and visible product identifiers.

## Taxonomy version policy

The taxonomy has its own semantic version because matching vocabulary can evolve independently from the interface:

- Patch: spelling, metadata, or non-behavioural corrections.
- Minor: new canonical concepts or aliases that can create additional valid matches.
- Major: a breaking change to concept meaning, normalization, or compatibility.

Taxonomy v1.1.0 expands the initial registry using terms already present in Vecta’s curated job and demonstration-profile data. It adds explicit coverage for Microsoft Entra ID/Azure AD, vector databases, OpenTelemetry/OTel, LoRA/QLoRA, SAST, DAST, SOAR, TPRM, business continuity, device management, service management, model cards, and related forms.

Candidate match corrections do not mutate the shared taxonomy. They remain job-specific profile data.

## Export schema policy

The export schema uses a whole number. Increase it whenever a consumer must change how it reads the bundle. Additive application or taxonomy version metadata does not require a new schema after schema v1 establishes those fields.

Every export includes:

- `schemaVersion`
- `appVersion`
- `skillTaxonomyVersion`
- `exportDate`

## Release checklist

1. Choose the product, taxonomy, and export-schema bumps independently.
2. Update their source files and lockfile.
3. Add or update tests for any behavioural taxonomy change.
4. Run the build, automated tests, browser journey, and focused lint checks.
5. Update the roadmap, demo guide, user guide, and handover where the milestone changes.
6. Confirm the versions shown in the header, footer, fit audit, governance area, and exported JSON.
