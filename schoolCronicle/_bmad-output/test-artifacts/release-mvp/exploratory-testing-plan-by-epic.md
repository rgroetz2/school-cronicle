# Exploratory Testing Plan by Epic — SchoolCronicle

**Document identifier:** ETP-SCHOOLCRONICLE-EPICS-001  
**Version:** 1.0  
**Date:** 2026-04-22  
**Status:** Draft  
**Approach:** Session-Based Exploratory Testing (SBET) with T1T5-informed thinking

---

## 1. Purpose and use

This document defines exploratory testing plans per epic, each containing:
- **Test ideas** (what to probe)
- **Test charters** (time-boxed missions)
- **Test tours** (heuristic walkthrough lenses)

Each charter should be executed in 60-90 minute sessions, with notes, defects, evidence, and follow-up ideas logged per session.

---

## 2. Session model (applies to all epics)

- **Session length:** 60-90 minutes
- **Roles:** Test Analyst (driver), optional observer (PO/Dev)
- **Artifacts per session:** charter ID, environment, data set, findings, severity, risks, open questions
- **Exit from session:** at least one actionable output (defect, risk, or validated behavior note)

---

## Epic 1 — Foundation, Access, and Teacher Workspace

### Test ideas
- Authentication boundary behavior under valid, invalid, and borderline inputs
- Session continuity and invalidation across navigation and browser refresh
- Help-path clarity and usefulness when sign-in fails
- UX clarity in loading, error, and retry conditions

### Test charters
- **E1-CH01: Sign-in failure handling quality**
  - Mission: Explore all ways sign-in can fail and verify user guidance stays clear and non-sensitive.
  - Focus: Error copy, support links, retry behavior, no account enumeration leakage.
- **E1-CH02: Session lifecycle robustness**
  - Mission: Explore session state transitions (new session, active session, sign-out, stale session).
  - Focus: Guarded route behavior, post-logout access, refresh behavior.
- **E1-CH03: Auth usability under pressure**
  - Mission: Explore interaction quality under rapid retries and interrupted input.
  - Focus: Form feedback timing, duplicate-submit handling, user recovery.

### Test tours
- **Landmark tour:** Start at login entry, walk to workspace and back to login via sign-out.
- **Bad neighborhood tour:** Focus only on invalid credentials, expired sessions, and abrupt route access.
- **FedEx tour:** Follow the “message delivery path” for errors and support info from backend to UI.

---

## Epic 2 — Draft Appointment Creation and Management

### Test ideas
- Draft creation/edit flow consistency across create, open, save, and delete
- Required metadata behavior (title/date/category) in all edge states
- State synchronization risks between selected draft, list view, and form
- Deletion safety and clarity (confirm/cancel, stale selection handling)

### Test charters
- **E2-CH01: Draft happy/near-happy workflow stress**
  - Mission: Explore create → list → open → edit → save loop with realistic teacher behavior.
  - Focus: Data persistence, form hydration, status messages, state consistency.
- **E2-CH02: Required metadata and readiness behavior**
  - Mission: Explore readiness logic under partial and corrected metadata inputs.
  - Focus: Missing-field list correctness, transition to ready state, no silent submit bypass.
- **E2-CH03: Draft deletion safety**
  - Mission: Explore delete action under confirm/cancel, repeated clicks, and stale selected draft.
  - Focus: Correct removal, no accidental deletion, clear post-delete state.

### Test tours
- **Money tour:** Follow highest-value teacher outcomes (quick draft capture, safe edit, safe cleanup).
- **Interrupt tour:** Interrupt save/delete flows with navigation, refresh, and repeated actions.
- **Data tour:** Track one draft’s data integrity across all transitions and UI surfaces.

---

## Epic 3 — Image Attachment, Validation, and Recovery

### Test ideas
- File handling resilience across valid/invalid types and sizes
- Clarity of per-file error reasons and recoverability
- Interaction between image validation status and submit readiness
- Local persistence limits and large payload behavior

### Test charters
- **E3-CH01: File validation edge exploration**
  - Mission: Explore boundary conditions for file type/size validation.
  - Focus: Oversize, malformed MIME, extension mismatch, duplicate names.
- **E3-CH02: Recovery without data loss**
  - Mission: Explore remove/replace flows for invalid images while preserving valid work.
  - Focus: No unnecessary reset of valid metadata or other valid files.
- **E3-CH03: Validation-to-submit dependency**
  - Mission: Explore whether invalid image states properly block submission paths.
  - Focus: Readiness summary correctness and actionable feedback.

### Test tours
- **Garbage collector tour:** Feed problematic files to observe rejection quality and cleanup.
- **Couch potato tour:** Stay in one draft for long sessions; observe accumulation/stability issues.
- **Saboteur tour:** Attempt intentionally misleading file inputs to probe robustness.

---

## Epic 4 — Submission Lifecycle and Read-Only Review

### Test ideas
- Submission state transition integrity and timestamp correctness
- Distinction and discoverability of draft vs submitted states
- Read-only enforcement for submitted items
- Error recovery when submit fails late

### Test charters
- **E4-CH01: Submission transition correctness**
  - Mission: Explore all paths from eligible draft to submitted state.
  - Focus: Status badge, submitted timestamp, immutable state boundaries.
- **E4-CH02: Read-only protection**
  - Mission: Explore attempts to edit submitted items through UI and route tricks.
  - Focus: Edit control suppression and backend enforcement.
- **E4-CH03: Mixed-state list comprehension**
  - Mission: Explore user interpretation of mixed draft/submitted lists.
  - Focus: Misclassification risk, visual affordance clarity.

### Test tours
- **History tour:** Track one appointment through lifecycle transitions.
- **Police tour:** Look specifically for policy violations (editable submitted record).
- **Museum tour:** Inspect static/read-only surfaces for accidental interactive behavior.

---

## Epic 5 — School Scope Security, Export, and Audit

### Test ideas
- School-scope isolation under direct and indirect access attempts
- Export completeness and referential integrity of appointment-image links
- Audit trail completeness without sensitive data leakage
- Operational behavior of authorized/unauthorized export requests

### Test charters
- **E5-CH01: School isolation attack simulation**
  - Mission: Explore cross-scope access attempts using ID/route/API variations.
  - Focus: Preventing IDOR and cross-tenant data exposure.
- **E5-CH02: Export integrity exploration**
  - Mission: Explore export payload correctness and stable relationship mapping.
  - Focus: Schema consistency, missing/duplicate references, scope boundaries.
- **E5-CH03: Audit quality**
  - Mission: Explore whether key actions produce auditable records with safe content.
  - Focus: Event completeness, actor/action/target/timestamp consistency.

### Test tours
- **Back alley tour:** Probe security and authorization edge paths first.
- **Round-trip tour:** Export and verify data relationships against source records.
- **Paper trail tour:** Follow action-to-audit-log mapping end to end.

---

## Epic 6 — Privacy, Retention, and In-Product Guidance

### Test ideas
- Clarity and correctness of privacy data-category communication
- Correction and privacy-process invocation usability and traceability
- Retention policy enforcement behavior on drafts/submissions/media
- Contextual help quality for required fields/formats and contacts

### Test charters
- **E6-CH01: Privacy communication comprehension**
  - Mission: Explore whether users can correctly understand processed data categories and actions.
  - Focus: Plain language, completeness, discoverability.
- **E6-CH02: Rights-invocation workflow**
  - Mission: Explore erasure/restriction initiation guidance and outcome visibility.
  - Focus: Clarity of next steps, contact path reliability, auditability hooks.
- **E6-CH03: Retention behavior exploration**
  - Mission: Explore retention outcomes under varied record ages and states.
  - Focus: Correct treatment of drafts/submissions/media and safe failure handling.

### Test tours
- **Guided tour:** Follow help/privacy prompts as a new teacher persona.
- **Time traveler tour:** Manipulate temporal conditions to validate retention behavior.
- **Consistency tour:** Cross-check privacy/help messages across all entry points.

---

## 3. Reporting format for each exploratory session

Use this template per executed charter:

- **Session ID:** `ET-<Epic>-<Charter>-<nn>`
- **Charter:** `<Epic>-CHxx`
- **Tester / Date / Environment**
- **Data set used**
- **What was covered**
- **Findings**
  - Defects (with severity)
  - Risks/concerns
  - UX clarity issues
- **Evidence links** (screenshots, logs, videos)
- **Next-session ideas**

---

## 4. Execution recommendation

- For current implementation, execute **Epic 1 + Epic 2 charters first**.
- Keep Epic 3-6 plans ready as forward-looking charters for subsequent implemented releases.
- Re-run critical charters after major UX or auth changes.

