# Master Test Plan - Investor Pitch Release (PX1-PX4)

**Document identifier:** MTP-SCHOOLCRONICLE-INVESTOR-PITCH-001  
**Version:** 1.0  
**Date:** 2026-04-23  
**Status:** Draft  
**Conforms to:** ISO/IEC/IEEE 29119-3:2021 (Test Plan)

## Related artifacts

| Artifact | Path |
| --- | --- |
| Pitch epic baseline | `_bmad-output/planning-artifacts/epics.md` |
| T1T5 method reference | `_bmad-output/test-artifacts/T1T5-Testdesign.md` |
| Investor pitch T1T5 testcase specification | `_bmad-output/test-artifacts/release-investor-pitch/testcase-specification-T1T5-investor-pitch.md` |
| Existing investor V1 baseline plan | `_bmad-output/test-artifacts/release-mvp/testplan-investor-V1.md` |

---

## 1. Test plan identifier

| Field | Value |
| --- | --- |
| Project / product | SchoolCronicle |
| Release under test | Investor Pitch Release |
| Plan type | Master Test Plan (MTP) |
| Scope boundary | Pitch UX track: PX1-PX4 |
| Delivery model | Internal QA + automation team |
| Owning role | QA Lead (with Product and Engineering sign-off) |

---

## 2. Introduction

### 2.1 Purpose

This plan defines objectives, scope, approach, environments, data governance, automation strategy, quality gates, and reporting for the investor-pitch release of SchoolCronicle.

### 2.2 Scope of testing

**In scope:**

- **PX1:** Teacher dashboard navigation and IA refinement
- **PX2:** Dedicated filtering, active chips, and saved presets
- **PX3:** Optional appointment metadata enrichment and display
- **PX4:** Demo reset reliability and scripted 7-minute pitch flow
- End-to-end demo readiness for sales conversations

**Out of scope:**

- Full MVP compliance/privacy/retention certification
- Deep performance certification beyond lightweight demo resilience checks
- Non-pitch roadmap features outside PX1-PX4

### 2.3 Definitions and acronyms

| Term | Definition |
| --- | --- |
| SUT | Software under test |
| MTP | Master Test Plan |
| T1T5 | Scenario model: Standard, Alternative, Exception, Negative, Misuse |
| TSR | Test Summary Report |
| UJ | User Journey |
| DMS | Demo Management State (seed/reset state model) |

---

## 3. References

| ID | Reference |
| --- | --- |
| REF-1 | ISO/IEC/IEEE 29119-3:2021 |
| REF-2 | `_bmad-output/planning-artifacts/epics.md` |
| REF-3 | `_bmad-output/test-artifacts/T1T5-Testdesign.md` |
| REF-4 | `_bmad-output/test-artifacts/release-investor-pitch/testcase-specification-T1T5-investor-pitch.md` |
| REF-5 | `_bmad-output/test-artifacts/release-mvp/testplan-investor-V1.md` |

---

## 4. Test items

Investor pitch release test items include:

- Angular web application pitch flows (`web`)
- API behavior supporting filter, metadata, and demo reset capabilities (`api`)
- Demo seed/reset and local persistence behavior used in pitch sessions

Build and commit identifiers are recorded for each execution cycle.

---

## 5. Features to be tested (PX1-PX4)

| Feature group | Stories | Key capabilities |
| --- | --- | --- |
| F-NAV-IA | PX1.1, PX1.2, PX1.3 | Sidebar IA, dashboard cards, focused workspace layout |
| F-FILTERS | PX2.1, PX2.2, PX2.3 | Dedicated filters, optional metadata filters, chips/presets |
| F-METADATA | PX3.1, PX3.2, PX3.3 | Optional field capture/display with no extra submit blocking |
| F-DEMO-REPLAY | PX4.1, PX4.2 | Deterministic reset and repeatable 7-minute script |

---

## 6. Features not to be tested

| Feature / area | Reason |
| --- | --- |
| Non-pitch epics beyond PX1-PX4 | Not required for investor presentation objective |
| Full-scale load/stress certification | Not needed for controlled demo context |
| External penetration test engagement | Separate governance stream |

---

## 7. Test approach

### 7.1 Overall strategy

- Risk-based testing with T1T5 coverage per investor-pitch user journey
- Combined manual exploratory and automated regression execution
- Priority focus:
  - **P0:** Demo-path breakers, security misuse, reset reliability
  - **P1:** Primary UX and data correctness flows
  - **P2:** Secondary usability and fallback behavior

### 7.2 Roles and responsibilities

| Role | Responsibility |
| --- | --- |
| QA Lead | Owns plan execution, quality gates, go/no-go recommendation |
| Test Analyst | Maintains T1T5 scenarios and traceability |
| Automation Engineer | Builds/maintains UI and API regression packs |
| Product Owner | Confirms expected pitch behavior and value narrative |
| Tech Lead | Supports defect triage and release readiness decisions |

### 7.3 Test levels and test types

| Type | Level | Focus |
| --- | --- | --- |
| Functional | System UI | End-to-end pitch journeys |
| Functional | API integration | Filter logic, metadata persistence, reset behavior |
| Exploratory | Session-based | UX clarity and demo presenter reliability |
| Security misuse | API/UI boundary | Route/query/preset payload tampering resilience |
| Regression automation | API + UI | Repeatable pre-demo confidence suite |

### 7.4 T1T5 baseline for investor pitch

All investor-pitch user journeys must include at least one executed scenario for each T1-T5 category, as documented in:

`_bmad-output/test-artifacts/release-investor-pitch/testcase-specification-T1T5-investor-pitch.md`

### 7.5 Coverage and prioritization

- **P0:** UJ-PX08 full set, plus T1/T4/T5 of UJ-PX01, UJ-PX04, UJ-PX07
- **P1:** Remaining T1/T2 and key T3 recovery flows for UJ-PX01..UJ-PX07
- **P2:** Extended browser and edge-case exploratory verification

---

## 8. Item pass/fail criteria

| Area | Pass criteria | Fail criteria |
| --- | --- | --- |
| Navigation and IA | Users can navigate quickly with clear context and accessibility basics | Broken navigation, unclear focus, blocked core routes |
| Filtering and presets | Results match filter intent and presets are stable | Incorrect filtering, corrupted preset state, no-match confusion |
| Optional metadata | Optional fields persist/display correctly and do not block submit gate | Data loss, display corruption, new unintended blockers |
| Demo replayability | Reset produces deterministic dataset and script completes reliably | Non-deterministic demo state, reset failures, script blockers |
| T1T5 governance | T1-T5 executed per selected journey | Missing category without approved waiver |

---

## 9. Suspension and resumption criteria

### 9.1 Suspension

- Demo reset flow fails repeatedly without workaround
- Environment instability blocks core investor path for >2 hours
- Critical seed data unavailable or corrupted

### 9.2 Resumption

- Seed/reset validated via smoke suite
- Blockers resolved or accepted with formal waiver
- Required test data/accounts verified and accessible

---

## 10. Test deliverables (ISO 29119 aligned)

| Deliverable | Owner | Description |
| --- | --- | --- |
| Master Test Plan (`testplan-investor-pitch-iso29119.md`) | QA Lead | Governing plan and quality gates |
| T1T5 testcase specification | Test Analyst | Journey-level scenario set |
| Test procedures | QA + Automation | Manual scripts and automated suites |
| Test data specification | QA | Data sets, reset lifecycle, governance controls |
| Automation execution report | Automation Engineer | API/UI run evidence and stability metrics |
| Test summary report (TSR) | QA Lead | Final recommendation and residual risks |

---

## 11. Test environment needs

| Need | Description |
| --- | --- |
| Web + API test environment | Stable endpoint pair matching pitch scope |
| Browser matrix | Chrome, Edge, Safari + one mobile viewport profile |
| Demo-mode control | Enable/disable capability and deterministic reset trigger |
| Logging and diagnostics | Access to frontend and API logs for quick triage |
| CI execution runner | Automated regression execution before demo events |

---

## 12. Test data management

### 12.1 Data strategy and objectives

- Use synthetic, non-production data only.
- Ensure deterministic data shape for pitch repeatability.
- Maintain traceable data versions tied to each test cycle.

### 12.2 Data domains

| Data domain | Required content | Owner |
| --- | --- | --- |
| Teacher personas | Valid user, invalid password variant, restricted behavior variant | QA |
| Appointment records | Mixed draft/submitted records with metadata variance | QA + Product |
| Optional metadata | class/grade, guardian name, location (empty + populated + invalid variants) | QA |
| Filter/preset data | Saved presets, active chips, edge no-match combinations | QA |
| Demo seed package | Canonical investor pitch dataset with expected counters | Engineering |

### 12.3 Data lifecycle controls

- **Provisioning:** Seed baseline dataset before each cycle.
- **Refresh:** Reset demo data before every execution wave and before live demos.
- **Variant injection:** Add controlled negative/misuse payloads for T4/T5 scenarios.
- **Cleanup:** Restore canonical state after each run to avoid coupling.

### 12.4 Data quality and traceability

- Record data set version in test run metadata.
- Track defects by data labels: `DATA_SETUP`, `DATA_INTEGRITY`, `DATA_SEED`.
- Keep mapping from test case IDs to required data fixtures.

### 12.5 Data governance and security

- No real personal data in test or demo environments.
- Mask or anonymize any imported baseline fixtures.
- Protect credentials and tokens in logs and evidence artifacts.
- Restrict write access to seed data definitions to approved maintainers.

---

## 13. Test automation strategy

### 13.1 Automation objectives

- Provide fast confidence before every investor-facing demo.
- Catch regressions in navigation, filtering, metadata, and reset path.
- Reduce manual repetition for deterministic checks.

### 13.2 Automation scope

| Scope | Coverage intent | Target cadence |
| --- | --- | --- |
| UI E2E smoke | Critical investor script path and blocker checks | On each PR / pre-demo |
| UI E2E regression | PX1-PX4 journey validations incl. selected T2/T3 | Nightly or release-candidate |
| API integration automation | Filter behavior, metadata persistence, reset contract checks | On each PR |
| Misuse guard tests | Route/query/preset payload tampering protections | On each PR |

### 13.3 Tooling and architecture

- Use existing Nx-integrated test stack for `web-e2e` and `api-e2e`.
- Prefer deterministic fixtures and reusable helper utilities.
- Keep test IDs aligned with T1T5 naming for traceability.

### 13.4 Automation quality controls

- P0 automated checks must pass at 100%.
- Flaky tests are tagged `AUTO_FLAKY`, triaged within one sprint.
- Failed automation must include logs/screenshots/network traces when possible.
- Require stable rerun policy for pre-demo gate decisions.

### 13.5 CI/CD integration

- PR gate: run smoke + critical API checks.
- Scheduled gate: run broader regression pack.
- Pre-demo gate: run investor-script suite and demo reset verification immediately before session.

### 13.6 Automation ownership

| Role | Responsibility |
| --- | --- |
| Automation Engineer | Script implementation, maintenance, reliability metrics |
| Test Analyst | Scenario intent and expected behavior alignment |
| QA Lead | Gate definition and go/no-go decision input |
| Engineering Lead | Support root-cause fixes for persistent failures |

---

## 14. Schedule and milestones

| Milestone | Output |
| --- | --- |
| M1 Plan baseline | Approved scope, risks, and ownership |
| M2 Test design freeze | Final T1T5 scenario baseline |
| M3 Data readiness | Seed package validated and reset checks green |
| M4 Automation readiness | Smoke and regression suites stable |
| M5 Main execution | Full run evidence and defect triage |
| M6 Investor go/no-go | TSR and release recommendation |

---

## 15. Risks and contingencies

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Demo reset non-determinism | Inconsistent investor walkthrough | Mandatory pre-demo reset and verification checklist |
| Filter/preset regression | Loss of credibility in live demo | P0 automation for core filter and preset scenarios |
| Data drift between runs | Unreliable results and false failures | Versioned seed data and strict cleanup/reset policy |
| Automation instability | Reduced confidence in release gate | Flaky test triage SLA and stable rerun policy |

---

## 16. Approvals

| Role | Name | Signature / Date |
| --- | --- | --- |
| QA Lead | | |
| Product Owner | | |
| Engineering Lead | | |

---

## Annex A - Scope traceability

| Epic | Stories | Covered by this plan |
| --- | --- | --- |
| PX1 | PX1.1, PX1.2, PX1.3 | Yes |
| PX2 | PX2.1, PX2.2, PX2.3 | Yes |
| PX3 | PX3.1, PX3.2, PX3.3 | Yes |
| PX4 | PX4.1, PX4.2 | Yes |

## Annex B - T1T5 governance rule

For each selected investor-pitch user journey, at least one executed test case must exist for:

- T1 Standard
- T2 Alternative
- T3 Exception
- T4 Negative
- T5 Misuse

Waivers require written approval by QA Lead and Product Owner.
