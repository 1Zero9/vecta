# Vecta User Guide

Vecta is a candidate workspace for exploring specialist roles, understanding fit, preparing applications, and tracking progress. The current version uses curated demonstration data. Browser storage remains the working copy; the private hosted preview can also protect a reviewed career profile under its signed-in account.

The current milestone is **Vecta v0.14.0 Preview**, using skill taxonomy **v1.1.0** and export schema **v1**. These identifiers are shown in the interface and included in exports so a result can be traced to the rules that produced it.

The name is inspired by the Latin *vecta* — “carried forward” or “conveyed”. In Vecta, your experience, evidence, and ambitions come together to carry your career forward with clarity.

To present the product to someone else, use the repeatable [Demo Guide](DEMO_GUIDE.md).

## 1. Explore roles

Open **Direct Jobs** to browse roles in AI and machine learning, cybersecurity, governance and GRC, and cloud/IT.

You can:

- Search by title, company, skill, or standard.
- Filter by discipline, seniority, and work mode.
- Show only saved roles.
- Open the employer application link.
- Save a role or add it to the pipeline.

The current role catalogue is curated prototype data. A listing should not be treated as recently verified unless its source is checked independently.

## 2. Build your candidate profile

Select **Complete your profile** from the Jobs workspace to open the four-step guided flow.

The setup opens as a keyboard-contained dialog. Its step controls have spoken labels at every screen size, the current step is announced, Escape closes the flow, and focus returns to the control that opened it.

### Direction

Add your name, current or recent title, primary discipline, and years of experience.

### Preferences

Add preferred locations, work mode, and an optional minimum target salary.

### Expertise

Add specific skills, technologies, practices, standards, and certifications. These structured claims are used by the deterministic fit comparison.

### Evidence

You can paste career history manually or upload a PDF or DOCX résumé up to 10 MB.

Résumé files are read in the browser and are not uploaded by the current implementation. After extraction:

1. Review the extracted text.
2. Deselect any suggested skills or certifications you do not recognise.
3. Correct the suggested years of experience when necessary.
4. Select **Apply reviewed details**.
5. Select **Save profile** to persist the profile on this device.

Nothing is accepted or saved automatically. Scanned or image-only PDFs do not contain readable text and require manual paste because OCR is not currently included.

## 3. Link claims to evidence

Use **Evidence links** in onboarding or Candidate Profile settings to connect a claim with something you can discuss or verify.

Candidate Profile settings use the same keyboard behaviour as onboarding. The drawer groups career direction, skills and credentials, and career history under labelled headings; skill and certification chips have explicit remove actions.

Evidence types are:

- **Employment** for responsibilities or outcomes from a role.
- **Project** for a delivery, implementation, or portfolio example.
- **Certification** for a credential or accreditation.

Each evidence record needs a title, a short description, and at least one linked skill or certification. Organisation and period are optional. Records remain editable and removable.

Evidence improves explanation and confidence; it does not increase the fit percentage.

## 4. Understand a fit estimate

Select a role’s **Vector Match** card to open the audit.

The fit estimate combines:

- **Skills alignment — 50%**
- **Seniority alignment — 25%**
- **Domain alignment — 25%**

Within skills alignment, required skills contribute 75% and preferred skills contribute 25%. If a role provides only one category, that category carries the full skills weight. Vecta recognizes a curated set of explicit aliases, such as AWS/Amazon Web Services and K8s/Kubernetes, and shows which profile term or résumé source produced a match.

The audit also shows:

- Matching and missing skills.
- Evidence sources behind supported matches.
- Matches that appear in the profile or résumé but lack linked evidence.
- Honest talking points for skill gaps.
- Résumé parseability feedback.

If a result is wrong, choose **Not a match** beside a matched requirement or **Count as match** beside a gap. The correction applies only to that role and immediately recalculates its fit. Choose **Undo correction** to return to automatic matching. A manual inclusion is labelled **Included by you** and still needs linked evidence before it should be relied on in an application.

### Confidence and insufficient information

Confidence is separate from match strength. It reflects how much usable information is available in the profile, résumé, role requirements, and evidence links.

- **High confidence** means the estimate has broad supporting information.
- **Moderate confidence** means the percentage is useful but has visible limitations.
- **Low confidence** means Vecta hides the precise overall percentage and shows **Insufficient information** instead.

Follow the listed limitations or choose **Complete profile details** to improve the basis of the comparison.

## 5. Prepare an application

The current application and interview outputs are deterministic templates based on the selected role and profile. They are not generated by an external AI model. Where verified profile evidence exists, drafts reuse it; otherwise they show bracketed prompts instead of manufacturing an achievement or metric.

Always review drafts before use. Do not retain a statement that is not supported by your real experience or approved profile evidence.

## 6. Track applications

Open **Pipeline** to manage applications across Saved, Drafting, Applied, Screening, Interviewing, Offer, and Archived stages. Pipeline state is stored on this device in the current prototype.

When the pipeline is empty, use **Add application** or return to Jobs and track a role. Export remains unavailable until the pipeline contains at least one record.

When adding an application manually, job title and company are required. Missing fields are identified beside their controls. Use **Cancel**, the close button, or Escape to leave the dialog without adding a record.

Vecta confirms stage changes, saved notes, and removals in a short status message. It also confirms saved roles, saved companies, profile changes, and privacy choices. These messages are announced to assistive technology without taking focus away from the current task.

## 7. Switch demo personas

Use the profile control in the header to switch between the included demonstration profiles or create a custom local profile. Switching profiles recalculates role comparisons. The dialog keeps keyboard focus inside while open, closes with Escape, and returns focus to the profile control.

This is still a prototype profile switcher, not a complete account-management system. On the private hosted preview, the panel confirms the signed-in Vecta account and shows separate protection cards for the career profile and the saved-role/company lists. Each card can show:

- **Protected:** the device and account copies match.
- **Ready to copy:** no account copy exists yet; review the counts or profile summary before copying. An empty saved list is preserved intentionally.
- **Choose which to keep:** the copies differ. Vecta preserves both until you choose one and confirm the replacement.

Protected snapshots include profile details, preferences, résumé text, evidence, per-role fit corrections, saved roles, and favourite companies. Applications, pipeline notes, and consent remain device-local. Vecta has no recruiter or vacancy-publisher account type; session management, account recovery, and administrator support tools remain roadmap work.

Press **Cmd+K** on macOS or **Ctrl+K** elsewhere to open global search. Search results and quick navigation are standard keyboard-accessible actions; Tab moves through them and Escape closes the search.

## 8. Export or erase your data

The Governance area provides local-data controls:

- **Export** downloads a JSON representation of the current user, profile, résumé text, evidence, pipeline, saved roles, favourites, and consent settings.
- **Erase** removes those records from browser storage.

These controls cover only the current browser state. They do not export or delete protected D1 profile or saved-list copies. Do not present them as a complete production data-subject workflow until protected-account export, deletion, and retention handling are implemented.

## 9. Current limitations

- The private hosted preview has server-trusted identity plus protected profile and saved-list snapshots, but no standalone public authentication, recovery, automatic cross-device synchronization, or complete account data-rights workflow.
- No OCR for scanned résumés.
- No verified live job-ingestion service.
- No external AI drafting service.
- Skill matching uses versioned taxonomy v1.1.0 rather than a complete industry vocabulary. Corrections are local, role-specific decisions and do not teach or update the shared taxonomy.
- Market and company records are curated demonstration data.
- Core scoring, profile-completion, storage, filtering, and pipeline rules have automated unit coverage. Component coverage includes onboarding, résumé review, job empty states, and pipeline actions. Chromium journeys cover onboarding persistence, fit review and corrections, role-to-pipeline tracking, and pipeline-stage persistence.

While saved browser data is being restored, Vecta shows a labelled workspace preview rather than briefly displaying default persona data. If an unexpected application error occurs, the recovery screen preserves local data, offers **Try again**, and provides a route back to the workspace.

For implementation status and planned work, see [ROADMAP.md](ROADMAP.md).
For the version policy and current identifiers, see [VERSIONING.md](VERSIONING.md).
