# Vecta Demo Guide

Use this guide to present a consistent, honest demonstration of Vecta in about seven minutes. Vecta is a calm, evidence-led career intelligence workspace: it brings a candidate’s experience, proof, opportunities, and application progress into one place. The name draws on the Latin *vecta*—“carried forward” or “conveyed”—and the product promise is **Your career, carried forward with clarity.**

## Before the demo

From the repository root:

```bash
npm ci
npx prisma generate
npm run dev
```

Open the exact local URL printed by Next.js. Before an important session, also run `npm test`, `npm run build`, and `npm run test:e2e`. Start with the Alex Mercer persona and an empty or known pipeline. If the browser contains earlier demo state, use the reset steps below.

## Seven-minute walkthrough

### 1. Frame the product — 30 seconds

**Do:** Open Direct Jobs and briefly point to the Vecta definition and focused workspace. Optionally press **Cmd+K** or **Ctrl+K** to demonstrate fast keyboard navigation.

**Say:** “Vecta helps specialist candidates move from scattered career information to a clear, evidence-led decision: which role fits, why it fits, what is missing, and what to do next.”

Point out **Vecta v0.9.0 Preview** in the header. Explain that the fit audit also names its taxonomy version, making demonstrations and exported results reproducible.

### 2. Establish the candidate context — 60 seconds

**Do:** Open the profile flow. Show direction, preferences, expertise, and evidence without changing every field. Mention that PDF and DOCX résumé extraction has an explicit review step.

**Say:** “Nothing from a résumé is silently accepted. The candidate reviews extracted text and suggested claims before saving, then links important claims to employment, projects, or certifications.”

### 3. Find a relevant role — 45 seconds

**Do:** Search for a specific technology or role, clear a filter once, save a role, and open its Vector Match audit.

**Say:** “The current catalogue is curated demonstration data. The value being shown here is the decision workflow, not a claim that these listings are a live job feed.”

### 4. Explain and correct the match — 2 minutes

**Do:** Show the overall fit, skills/seniority/domain weights, confidence, required versus preferred coverage, alias provenance, and evidence coverage. Choose **Not a match** for one apparent match, then undo it. Choose **Count as match** for one gap, then undo it.

**Say:** “The score is deterministic and inspectable. Required skills carry more weight than preferred ones. Vecta shows why a term matched, separates evidence coverage from fit, and lets the candidate correct a mistaken result. A manual inclusion is visibly labelled and does not manufacture evidence.”

### 5. Move from insight to action — 75 seconds

**Do:** Add the role to the pipeline. Open the application preparation view, then show the Pipeline stages. Advance the role once and point out the concise confirmation message.

**Say:** “The next step stays attached to the decision. Current drafting is deterministic and must be reviewed; it uses saved evidence or explicit fill-in prompts instead of inventing experience or performance figures.”

### 6. Close on trust and direction — 60 seconds

**Do:** Open Governance and show export and erasure controls. Briefly mention the roadmap.

**Say:** “Candidate data is currently local-first and can be exported or erased. Production authentication, cross-device ownership, self-service user management, and an auditable admin workbench are planned work—not hidden claims about the prototype.”

Close with: “Vecta turns career evidence into a clearer next move, while keeping the candidate in control of every claim.”

## Two-minute version

1. Introduce Vecta as an evidence-led career workspace using curated demo jobs.
2. Search for a role and open Vector Match.
3. Show required/preferred weighting, provenance, evidence coverage, and one reversible correction.
4. Add the role to Pipeline.
5. Close on local-first export/erasure and the production identity/admin roadmap.

## Reset between demonstrations

1. Open **Governance**.
2. Use the data-erasure control and confirm the action.
3. Reload the page if any modal remains open.
4. Use the profile control to select **Alex Mercer**.
5. Confirm Direct Jobs and Pipeline show the expected starting state before the audience arrives.

Erasure removes the current browser’s Vecta user, profile, résumé text, evidence, corrections, saved roles, favourites, pipeline, and consent state. It does not affect repository fixtures.

## Prototype boundaries

Do not present the prototype as having capabilities that are not implemented:

- Jobs, companies, and market records are curated demonstration data, not a verified live feed.
- Application and interview drafts are deterministic templates, not external-model output.
- Browser storage is the primary candidate store; production authentication and durable multi-device ownership are not implemented.
- The profile switcher is not production user management, and there is no production admin workbench yet.
- Image-only or scanned PDFs require manual text entry because OCR is not included.
- Governance screens demonstrate product intent and local controls; they are not certification of legal or regulatory compliance.

## Questions you are likely to get

**Does evidence improve the fit score?** No. Fit and evidence coverage are deliberately separate. Evidence improves confidence and defensibility, not the percentage.

**Is the matching AI?** The current engine is deterministic. It normalizes a curated set of aliases, checks bounded terms, applies visible weights, and records provenance.

**What does a correction do?** It changes one requirement for one role, persists locally, and recalculates the audit. It does not update the global taxonomy or create supporting evidence.

**Can several people use it?** Demonstration personas can be switched locally. Production accounts, authorization, recovery, and administrator operations are Phase 3 roadmap work.

**Where does résumé data go?** The current parser runs in the browser. Extracted content is only added after review and saved locally with the profile.

## Fallbacks

- If a résumé does not extract, paste plain text and explain the image-only PDF boundary.
- If optional database sync is unavailable, continue with the local-first workflow; it is the primary prototype path.
- If prior browser state distracts from the story, erase it and select a demonstration persona.
- If a job link is stale, stay inside the Vecta workflow and reiterate that the catalogue is curated demo data.
