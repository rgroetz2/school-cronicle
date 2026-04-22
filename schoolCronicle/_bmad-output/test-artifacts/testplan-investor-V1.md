# Master Test Plan — Investor V1 (Epic 1 + Epic 2)

**Document identifier:** MTP-SCHOOLCRONICLE-INVESTOR-V1-001  
**Version:** 1.0  
**Date:** 2026-04-22  
**Status:** Draft  
**Conforms to:** ISO/IEC/IEEE 29119-3:2021 (Test Plan)

## Related artifacts

| Artifact | Path |
| -------- | ---- |
| Epics and stories baseline | `_bmad-output/planning-artifacts/epics.md` |
| Sprint implementation status | `_bmad-output/implementation-artifacts/sprint-status.yaml` |
| Story artifacts (implemented scope) | `_bmad-output/implementation-artifacts/1-*.md`, `_bmad-output/implementation-artifacts/2-*.md` |
| Existing ISO test plan (full-product baseline) | `_bmad-output/test-artifacts/test-plan-iso29119-schoolCronicle-v1.md` |
| T1T5 method reference | `_bmad-output/test-artifacts/T1T5-Testdesign.md` |

---

## 1. Test plan identifier

| Field | Value |
| ----- | ----- |
| Project / product | SchoolCronicle |
| Release under test | Investor Demo V1 |
| Plan type | Master Test Plan (MTP) |
| Scope boundary | Implemented Epic 1 and Epic 2 only |
| Delivery model | Crowd testing provider managed service |
| Owning role | Provider Test Manager (with client QA sign-off) |

---

## 2. Introduction

### 2.1 Purpose

This plan defines the test objectives, scope, approach, roles, environments, deliverables, and quality gates for a **dedicated external test project** executed by a crowd testing provider for the investor demo release.

### 2.2 Scope of testing

**In scope (implemented now):**

- **Epic 1**: Sign-in, sign-out, session lifecycle, access failure/help path (stories 1.1–1.4)
- **Epic 2**: Draft creation/list/open/edit/category/date validation, metadata submit gate, draft deletion incl. local image association cleanup context (stories 2.1–2.5)
- UI and API behavior that currently exists for these stories

**Out of scope:**

- Epic 3+ feature sets as release content (image validation gates beyond current implementation, submission lifecycle completion, school-scope export/privacy epics)
- Production pen-test certification engagement
- Administrative operations UI not present in product scope

### 2.3 Definitions and acronyms

| Term | Definition |
| ---- | ---------- |
| SUT | Software under test |
| MTP | Master Test Plan |
| T1T5 | Scenario-based test design model: T1 Standard, T2 Alternative, T3 Exception, T4 Negative, T5 Misuse |
| TSR | Test Summary Report |
| UJ | User Journey |

---

## 3. References

| ID | Reference |
| -- | --------- |
| REF-1 | ISO/IEC/IEEE 29119-3:2021 |
| REF-2 | `_bmad-output/planning-artifacts/epics.md` |
| REF-3 | `_bmad-output/implementation-artifacts/sprint-status.yaml` |
| REF-4 | `_bmad-output/test-artifacts/T1T5-Testdesign.md` |
| REF-5 | `_bmad-output/test-artifacts/test-plan-iso29119-schoolCronicle-v1.md` |

---

## 4. Test items

Investor demo test item includes:

- Angular web app (`web`) implementing authentication and appointments workspace
- Backend API (`api`) endpoints used by implemented epic 1/2 flows
- Client-side local persistence/dummy-mode behavior currently used in implemented workflows

Build/version under test is captured per test cycle by provider Test Manager.

---

## 5. Features to be tested (Epic 1 + Epic 2)

| Feature group | Stories | Key capabilities |
| ------------- | ------- | ---------------- |
| F-AUTH | 1.1, 1.2, 1.3, 1.4 | Sign-in, sign-out, session checks, access failure and help path |
| F-DRAFT-CORE | 2.1, 2.2 | Create draft, list drafts, open selected draft |
| F-DRAFT-EDIT | 2.3 | Edit title/date/category/notes, controlled category behavior |
| F-DRAFT-GATE | 2.4 | Metadata readiness and submit blocking until complete |
| F-DRAFT-DELETE | 2.5 | Delete selected draft with confirmation and list/state update |

---

## 6. Features not to be tested

| Feature / area | Reason |
| -------------- | ------ |
| Epic 3 image validation and blocking model as release scope | Not fully in implemented target scope for this investor plan |
| Epic 4/5/6 lifecycle/export/privacy scope | Not implemented for current investor release target |
| Full compliance/legal audit evidence package | Outside product test project scope |

---

## 7. Test approach

### 7.1 Overall strategy

- Risk-based and story-driven testing for implemented epics
- ISO 29119 test documentation structure with provider-managed execution governance
- T1T5 user-journey design for end-user critical flows
- Mixed manual + automated execution:
  - Crowd team executes cross-device/user-centric and exploratory coverage
  - Automation engineers execute repeatable regression packs (API + UI smoke/regression)

### 7.2 Provider organization and responsibilities

| Role | Responsibility |
| ---- | -------------- |
| Provider Test Manager | Owns plan execution, staffing, schedule, metrics, defect triage cadence, sign-off proposal |
| Provider Test Analysts | Design test conditions/cases using T1T5 and requirement traceability |
| Provider Test Automation Engineers | Build and run API/UI regression suites, maintain CI-ready packs, publish automation evidence |
| Client Product/Tech contacts | Clarify expected behavior and approve scope deviations/waivers |

### 7.3 Test levels and test types

| Type | Level | Focus |
| ---- | ----- | ----- |
| Functional | System (UI) | End-to-end teacher journeys |
| Functional | API integration | Auth and draft operations contracts |
| Exploratory | Session-based | Investor-demo risk hotspots, UX clarity, failure handling |
| Accessibility (lightweight) | UI | Keyboard flow, visible feedback, non-color-only messaging |
| Regression | API/UI automation | Stable repeatable validation for Epic 1+2 critical paths |

### 7.4 T1T5 user-journey design baseline

The provider shall design user-journey tests using T1T5 categories for each critical journey below.

#### UJ-01 Sign-in and session
- **T1** `T1_login_validTeacherWithCorrectCredentials_userIsSignedInAndSeesAppointmentsWorkspace`
- **T2** `T2_login_validTeacherWithRememberedSession_userIsRoutedToWorkspaceWithoutManualReentry`
- **T3** `T3_login_validTeacherWithTemporaryBackendIssue_userSeesRecoverableFailureGuidance`
- **T4** `T4_login_teacherWithInvalidPassword_userSeesNonSensitiveErrorAndHelpPath`
- **T5** `T5_login_userAttemptsRapidRepeatedCredentialAbuse_systemPreventsUnauthorizedAccess`

#### UJ-02 Draft creation and edit
- **T1** `T1_draftCreate_teacherEntersRequiredMetadata_draftIsSavedAndVisibleInList`
- **T2** `T2_draftEdit_teacherUpdatesDateAndCategory_changesPersistOnReopen`
- **T3** `T3_draftEdit_teacherLosesConnectivityDuringSave_userReceivesFailureWithoutSilentDataLoss`
- **T4** `T4_draftEdit_teacherLeavesRequiredFieldEmpty_submitReadinessShowsMissingFields`
- **T5** `T5_draftEdit_userAttemptsInvalidCategoryInjection_systemRejectsControlledValueViolation`

#### UJ-03 Submit readiness and deletion
- **T1** `T1_submitGate_completeMetadata_selectedDraftReportsReadyState`
- **T2** `T2_submitGate_teacherResolvesMissingFields_stateTransitionsFromBlockedToReady`
- **T3** `T3_deleteDraft_teacherConfirmsDeletion_listAndSelectionStateRefreshCorrectly`
- **T4** `T4_deleteDraft_teacherCancelsConfirmation_draftRemainsUnchanged`
- **T5** `T5_deleteDraft_userAttemptsDeleteWithoutValidSession_operationIsRejected`

### 7.5 Coverage and prioritization

- **P0**: UJ-01 T1/T4/T5, UJ-02 T1/T4, UJ-03 T1/T5
- **P1**: Remaining T1/T2 paths and key T3 exception recovery paths
- **P2**: Extended exploratory/browser-variant coverage

---

## 8. Item pass/fail criteria

| Area | Pass criteria | Fail criteria |
| ---- | ------------- | ------------- |
| Epic 1 | Auth/session/help paths behave as defined in stories 1.1–1.4 | Any critical auth flow breaks or leaks sensitive behavior |
| Epic 2 | Draft lifecycle stories 2.1–2.5 operate correctly and consistently | Data/state inconsistencies, broken readiness gating, delete defects |
| T1T5 coverage | All mandatory T1–T5 scenarios executed for each selected user journey | Missing category coverage without approved waiver |
| Automation pack | P0 regression pack passes in stable environment | Reproducible P0 automation failures unresolved |

---

## 9. Suspension and resumption criteria

### 9.1 Suspension
- Environment unavailable or unstable for >4h in planned window
- Blocking auth failure prevents access to core Epic 1+2 tests
- Missing mandatory test data/accounts

### 9.2 Resumption
- Environment restored and smoke passed
- Blockers resolved or accepted with formal deviation
- Data/accounts re-provisioned and validated

---

## 10. Test deliverables (ISO 29119 aligned)

| Deliverable | Owner | Description |
| ----------- | ----- | ----------- |
| Master Test Plan (`testplan-investor-V1.md`) | Provider Test Manager | Governing plan for investor release |
| Test design specification (T1T5 journey matrix) | Provider Test Analysts | Scenario decomposition and traceability |
| Test case specifications | Provider Test Analysts | Detailed cases per journey and story |
| Test procedures (manual + automated) | Analysts + Automation Engineers | Execution steps/scripts |
| Test data specification | Provider Test Analysts | Data sets, account matrix, lifecycle rules |
| Automation regression suite report | Provider Automation Engineers | API/UI run evidence and pass/fail |
| Test summary report | Provider Test Manager | Final recommendation and residual risks |

---

## 11. Test environment needs

| Need | Description |
| ---- | ----------- |
| Web environments | Stable test and staging endpoints for web + API |
| Browser matrix | Chrome, Edge, Safari + mobile viewport profiles |
| Accounts | Teacher personas: valid, invalid-password, restricted/edge variants |
| Data reset capability | Repeatable seed/reset for draft lifecycle scenarios |
| Logging/diagnostics | Access to functional logs and API error traces for triage |

---

## 12. Test data management

### 12.1 Data strategy
- Use **synthetic non-production data only**
- Maintain identifiable persona dataset per story cluster:
  - `teacher_valid_a`, `teacher_valid_b`
  - `teacher_invalid_password`
  - optional restricted/edge persona
- Keep test data versioned and traceable to test cycle ID

### 12.2 Data lifecycle controls
- Pre-cycle seeding script/checklist
- Daily cleanup/reset for draft states to avoid test coupling
- Dedicated corrupted/invalid payload set for negative/misuse paths (T4/T5)
- Data defect triage labels: `DATA_SETUP`, `DATA_INTEGRITY`, `DATA_ENV`

### 12.3 Data governance
- No real student/teacher personal data in provider environments
- Masking/anonymization rules applied to any imported baseline fixtures
- Evidence artifacts must not expose secrets/credentials

---

## 13. Test automation strategy

### 13.1 Automation scope
- **API automation**: sign-in/session checks, draft create/list/edit/readiness/delete endpoints
- **UI automation**: core T1/T4 P0 journeys for Epic 1 and 2
- **Smoke-on-demand** pack for every test environment deployment

### 13.2 Automation ownership model
- Automation engineers own script design, maintainability, and execution reporting
- Test analysts own scenario intent and expected behavior definitions
- Test manager approves automation coverage adequacy for release gates

### 13.3 Automation quality gates
- P0 automated journeys pass at 100%
- Flaky tests tracked and remediated under dedicated defect class `AUTO_FLAKY`
- Automation evidence attached to each cycle summary

---

## 14. Schedule and milestones (provider-managed)

| Milestone | Output |
| --------- | ------ |
| M1 Planning kickoff | Approved scope and staffing |
| M2 Test design baseline | T1T5 journey matrix + case inventory |
| M3 Data/environment readiness | Seeded data and smoke pass |
| M4 Main execution cycle | Manual + automated execution evidence |
| M5 Closure and sign-off | TSR with release recommendation |

Dates are set by provider Test Manager and aligned with investor demo deadline.

---

## 15. Risks and contingencies

| Risk | Impact | Mitigation |
| ---- | ------ | ---------- |
| Scope ambiguity between implemented and planned stories | Misaligned test effort | Freeze scope to Epic 1+2 stories marked implemented/review |
| Environment instability | Execution delay | Buffer window + smoke gate before each test wave |
| Incomplete data seeding | False negatives/blocked tests | Mandatory data readiness checklist before execution |
| Automation instability | Reduced confidence | Separate flaky bucket and deterministic rerun policy |

---

## 16. Approvals

| Role | Name | Signature / Date |
| ---- | ---- | ---------------- |
| Provider Test Manager | | |
| Client Product Owner | | |
| Client Engineering Lead | | |

---

## Annex A — Story traceability (implemented scope)

| Epic | Story IDs | Covered by this plan |
| ---- | --------- | -------------------- |
| Epic 1 | 1.1, 1.2, 1.3, 1.4 | Yes |
| Epic 2 | 2.1, 2.2, 2.3, 2.4, 2.5 | Yes |

## Annex B — T1T5 governance rule

For each investor-critical user journey, at least one test case must exist and be executed for each category:
- T1 Standard
- T2 Alternative
- T3 Exception
- T4 Negative
- T5 Misuse

Waivers require written approval by Provider Test Manager and Client Product Owner.
