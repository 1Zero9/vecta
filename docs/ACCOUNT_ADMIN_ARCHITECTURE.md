# Account and Admin Architecture

This document fixes the Phase 3 product and security boundary before durable user data is introduced.

## Product boundary

Vecta is a career workspace for people finding and evaluating roles. A user can build a profile, compare opportunities, prepare an application, and manage their own pipeline. Employers and recruiters do not publish or manage vacancies in Vecta.

Career disciplines such as AI, security, governance/GRC, and IT are profile attributes. They never grant application permissions.

## Access roles

| Role | Purpose | Access |
| --- | --- | --- |
| User | A person managing their own career search | Their own profile, evidence, saved roles, favourites, applications, preferences, sessions, export, and deletion request. |
| Administrator | An authorised Vecta operator | Explicit operational queues and support actions only; no routine access to private résumé or evidence content. |

There is no recruiter, employer, hiring-manager, or auditor product role. Administrator access is assigned outside self-service registration, checked on the server for every request, and recorded in an immutable audit trail.

## Authentication decision

The owner-only Sites preview uses the platform-provided authenticated-user identity for its first Phase 3 account record. `oai-authenticated-user-id` is the stable per-Site ownership key; email and optional name are display attributes, not authorization inputs. The hosting access policy remains the preview membership boundary.

If Vecta later becomes a public standalone service, its external identity-provider path must be confirmed separately before implementation. Browser state, email query parameters, and hidden navigation controls must never authenticate or authorize a user.

## Owned data model

- `users`: stable platform subject, display details, account status, timestamps.
- `profiles`: one active career profile per user initially; discipline and preferences remain profile data.
- `profile_evidence`: employment, project, and certification evidence owned by a profile.
- `saved_jobs` and `favourite_companies`: user-owned references to catalogue records.
- `applications`: user-owned pipeline records with stage, notes, and follow-up dates.
- `skill_match_overrides`: user decisions scoped to one job requirement.
- `consent_events`: append-only records of the choice, notice version, source, and time.
- `sessions` and `security_events`: user-visible access history where the chosen identity system exposes it.
- `admin_assignments`: server-managed operator permissions; never client-writable.
- `admin_audit_events`: actor, action, target type/id, reason, outcome, and timestamp.

Structured product state belongs in D1 for the Sites runtime. Résumé files or future generated exports belong in R2, with ownership and lifecycle metadata in D1. Browser storage becomes a temporary migration cache or device preference store, not the source of truth.

Every user-owned query includes the authenticated subject. Object identifiers alone are insufficient. Admin routes apply both authentication and a server-side administrator check close to the data access operation.

## User account surface

The first production account surface should provide:

1. identity and verified contact details;
2. profile and notification preferences;
3. active session and security history visibility where supported;
4. a complete export request and status;
5. deletion request, retention explanation, and cancellation window;
6. clear migration of existing device-local data after sign-in.

The profile dialog labels unsigned/local use as **Device-local preview**. For a persisted hosted account it presents the protected-copy state and requires explicit confirmation before the device or D1 version replaces the other.

## Admin workbench boundary

The workbench supports the service, not employer recruiting. Its initial queues are:

- account access, suspension, restoration, and recovery cases;
- export and deletion requests;
- user reports and stale-job reports;
- job-ingestion failures and catalogue data-quality review;
- service health and audit review.

High-impact actions require a reason, fresh confirmation, least-privilege permission, and an audit event. Silent impersonation is excluded. Any future support view of private candidate data requires a separate, time-limited, visible access design and explicit approval.

## Delivery slices

1. **Boundary and preview UI — complete in v0.11.0.** Remove recruiter roles and vocabulary, migrate legacy local roles to User, label account state honestly, and document this model.
2. **Authenticated identity — complete in v0.12.0.** Read the Sites-authenticated subject server-side, create the D1 user record, reject missing identity, enforce suspended status, and add authorization tests.
3. **Durable profile migration — complete in v0.13.0.** Add D1 schema and explicitly migrate the profile, evidence, preferences, résumé text, and match decisions after review; detect conflicts and never infer ownership from browser input.
4. **Durable saved roles, pipeline, and rights.** Move saved roles, favourites, applications, notes, and consent history, then implement complete export and deletion.
5. **Admin foundation.** Add server-protected operator assignment, read-only queues, and audit recording before mutating support actions.
6. **Operational actions.** Add individually approved actions with reason capture, confirmation, least privilege, and recovery paths.

## Exit checks

- A second device restores only the authenticated user’s data.
- Cross-user object IDs cannot read or mutate another account.
- No client-provided role can grant administrator access.
- Export and deletion cover D1, R2, browser migration state, and audit-policy exceptions.
- Every admin read and action is authorized and auditable.
