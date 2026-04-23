---
workflowStatus: 'completed'
totalSteps: 5
stepsCompleted: ['step-01-detect-mode', 'step-02-load-context', 'step-03-risk-and-testability', 'step-04-coverage-plan', 'step-05-generate-output']
lastStep: 'step-05-generate-output'
nextStep: ''
lastSaved: '2026-04-23'
---

# Test Design: Epic release-mvp - MVP Release (Epics 1-6)

**Date:** 2026-04-23
**Author:** Rudolfgroetz
**Status:** Draft

---

## Executive Summary

**Scope:** Epic-level test design for Epic release-mvp

**Risk Summary:**

- Total risks identified: 9
- High-priority risks (>=6): 4
- Critical categories: SEC, DATA, BUS

**Coverage Summary:**

- P0 scenarios: 8 (~24-36 hours)
- P1 scenarios: 14 (~28-42 hours)
- P2/P3 scenarios: 20 (~20-36 hours)
- **Total effort**: ~72-114 hours (~2-3 weeks)

---

## Not in Scope

| Item | Reasoning | Mitigation |
| --- | --- | --- |
| Pitch UX Epics PX1-PX4 | Sales demo track is parallel to MVP delivery and has separate acceptance focus | Validate in separate pitch test plan and smoke-check only integration boundaries |
| Load/stress benchmark certification | MVP goal is functional reliability first, not production-scale certification | Add dedicated NFR workflow (`bmad-testarch-nfr`) before go-live hardening |
| Third-party security audit execution | Requires external process and budget outside this design scope | Maintain internal auth/session and data exposure guardrail tests in P0/P1 |

---

## Risk Assessment

### High-Priority Risks (Score >=6)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-001 | SEC | School-scoped authorization bypass allows cross-school data access | 2 | 3 | 6 | Add negative API authz tests for all school-bound endpoints and verify 403 with no data leakage | API team + QA | Before MVP RC |
| R-002 | DATA | Appointment-image association breaks during delete/export lifecycle | 2 | 3 | 6 | Add referential integrity API tests and export contract assertions per story 5.4 | API team + QA | Before MVP RC |
| R-003 | BUS | Submission gate allows incomplete metadata/image-invalid state to pass | 3 | 2 | 6 | Add end-to-end submit-gate matrix covering metadata + image validity transitions | Web team + QA | Current sprint |
| R-004 | OPS | Audit trail gaps block incident reconstruction for sensitive actions | 2 | 3 | 6 | Add integration tests asserting audit record generation for submit/delete/export/auth events | API team | Before MVP RC |

### Medium-Priority Risks (Score 3-4)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R-005 | TECH | Session lifecycle edge cases produce stale auth state in UI | 2 | 2 | 4 | Add guard + refresh-token/session-expiry component and API tests | Web team |
| R-006 | PERF | Appointment list and image-heavy draft screens degrade user responsiveness | 2 | 2 | 4 | Add lightweight performance thresholds in nightly runs for list and draft rendering | Web team |
| R-007 | BUS | Privacy guidance/contact flows are discoverable but incomplete in edge scenarios | 1 | 3 | 3 | Add UX-path tests for privacy/contact entry points and fallback messages | Product + QA |

### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description | Probability | Impact | Score | Action |
| --- | --- | --- | --- | --- | --- | --- |
| R-008 | OPS | Non-critical CI flake from e2e environment setup | 1 | 2 | 2 | Monitor |
| R-009 | TECH | Minor UI regressions in non-core dashboard/presentation surfaces | 1 | 1 | 1 | Monitor |

### Risk Category Legend

- **TECH**: Technical/Architecture
- **SEC**: Security
- **PERF**: Performance
- **DATA**: Data Integrity
- **BUS**: Business Impact
- **OPS**: Operations

---

## Entry Criteria

- [ ] Requirements and assumptions agreed by QA, Dev, and PM
- [ ] Test environments available for `web`, `api`, `web-e2e`, and `api-e2e`
- [ ] Seed data/accounts available for auth, draft lifecycle, and school-scoped scenarios
- [ ] Current MVP story set merged or available in an integration branch
- [ ] Release-mvp scope baseline frozen for test execution window

## Exit Criteria

- [ ] All P0 tests passing
- [ ] P1 failures triaged with approved waivers where required
- [ ] No open unmitigated high-priority risks (score >= 6)
- [ ] Coverage for MVP critical flows accepted by team
- [ ] Go/no-go review completed with QA + Tech Lead + Product

---

## Test Coverage Plan

Priority labels (P0/P1/P2/P3) represent risk/criticality, not execution timing.

### P0 (Critical)

**Criteria**: Blocks core journey + High risk (>=6) + No workaround

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| --- | --- | --- | --- | --- | --- |
| Sign-in/session authorization boundaries (Epic 1 + Epic 5.1) | API | R-001 | 8 | QA/API | Include cross-school negative tests |
| Draft metadata + image submit gate transitions (Epic 2.4 + Epic 3.4 + Epic 4.1) | E2E | R-003 | 6 | QA/Web | Required-field and invalid-image permutations |
| Appointment-image export integrity (Epic 5.4) | API | R-002 | 5 | QA/API | Referential integrity in export payload |
| Audit record generation for significant actions (Epic 5.5) | Integration | R-004 | 4 | QA/API | Submit/delete/export/auth audit events |

**Total P0**: 23 tests, ~24-36 hours

### P1 (High)

**Criteria**: Important features + Medium risk (3-4) + Common workflows

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| --- | --- | --- | --- | --- | --- |
| Draft create/list/edit/delete lifecycle (Epic 2.1-2.5) | API | R-005 | 10 | QA/API | CRUD + state transition coverage |
| Image attach/replace/remove recovery (Epic 3.1-3.3) | Component | R-006 | 8 | QA/Web | Validation feedback and correction flow |
| Draft vs submitted read-only states (Epic 4.2-4.3) | E2E | R-005 | 6 | QA/Web | Prevent post-submit edits |
| Privacy summary and correction path (Epic 6.1-6.2) | Component | R-007 | 5 | QA/Web | Guidance and editable metadata behavior |

**Total P1**: 29 tests, ~28-42 hours

### P2 (Medium)

**Criteria**: Secondary features + Low risk (1-2) + Edge cases

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| --- | --- | --- | --- | --- | --- |
| Help path and access-failure messaging (Epic 1.4) | Component | R-007 | 6 | QA/Web | UX and content continuity |
| Privacy process invocation and retention paths (Epic 6.3-6.4) | API | R-008 | 8 | QA/API | Process trigger and retention policy checks |
| Optional edge metadata permutations | Unit | R-009 | 10 | Dev | Defensive validation rules |

**Total P2**: 24 tests, ~16-28 hours

### P3 (Low)

**Criteria**: Nice-to-have + exploratory + benchmark checks

| Requirement | Test Level | Test Count | Owner | Notes |
| --- | --- | --- | --- | --- |
| UI polish and non-critical navigation checks | E2E | 4 | QA | Exploratory pack |
| Extended browser/viewport matrix | E2E | 6 | QA | Weekly confidence checks |

**Total P3**: 10 tests, ~4-8 hours

---

## Execution Strategy

- **PR**: Run all functional API/component/E2E tests when suite remains under ~15 minutes via parallelization.
- **Nightly**: Run longer regression packs plus retention/privacy process validations and extended browser matrix.
- **Weekly**: Run performance probes and resilience/chaos-style checks that are too expensive for PR cadence.

---

## Resource Estimates

| Priority | Effort Range | Notes |
| --- | --- | --- |
| P0 | ~24-36 hours | Highest-risk coverage with strict assertions |
| P1 | ~28-42 hours | Core behavior and integration confidence |
| P2 | ~16-28 hours | Secondary behavior and edge handling |
| P3 | ~4-8 hours | Exploratory and extended matrix checks |
| **Total** | **~72-114 hours** | **~2-3 weeks elapsed with QA + dev support** |

---

## Quality Gate Criteria

### Pass/Fail Thresholds

- **P0 pass rate**: 100%
- **P1 pass rate**: >=95%
- **P2/P3 pass rate**: >=90% (informational)
- **High-risk mitigations**: 100% complete or explicitly waived

### Coverage Targets

- **Critical paths**: >=80%
- **Security scenarios**: 100%
- **Business logic**: >=70%
- **Edge cases**: >=50%

### Non-Negotiable Requirements

- [ ] All P0 tests pass
- [ ] No unmitigated high-priority risk (score >=6)
- [ ] School-scope security scenarios pass 100%
- [ ] Submission gate and data integrity checks pass before release

---

## Mitigation Plans

### R-001: School-scoped authorization bypass (Score: 6)

**Mitigation Strategy:** Build endpoint-by-endpoint authorization negative tests and add token/scope mismatch assertions in CI.  
**Owner:** API team + QA  
**Timeline:** Complete before release candidate  
**Status:** Planned  
**Verification:** All school-scope negative tests pass with deterministic 403 and no leaked payload data

### R-002: Appointment-image referential integrity failure (Score: 6)

**Mitigation Strategy:** Add integration and export-schema tests enforcing stable parent-child linkage across create/update/delete/export.  
**Owner:** API team + QA  
**Timeline:** Complete before release candidate  
**Status:** Planned  
**Verification:** Export and API integrity suites pass; no orphan references in seeded stress data

### R-003: Submit gate bypass with incomplete metadata/invalid media (Score: 6)

**Mitigation Strategy:** Build matrix-driven E2E tests for gate state transitions and backend validation parity checks.  
**Owner:** Web team + QA  
**Timeline:** Complete current sprint  
**Status:** Planned  
**Verification:** Submit gate suite shows blocked->ready transitions only after all constraints satisfied

### R-004: Missing audit events for significant actions (Score: 6)

**Mitigation Strategy:** Add integration assertions for audit generation and immutable event payload shape.  
**Owner:** API team  
**Timeline:** Complete before release candidate  
**Status:** Planned  
**Verification:** Audit-event coverage report confirms required action classes captured

---

## Assumptions and Dependencies

### Assumptions

1. MVP release scope corresponds to Epics 1-6 in `epics.md`.
2. Existing Nx test targets remain the primary execution path for CI and local runs.
3. Team can provide environment stability for `web`, `api`, and e2e suites during test window.

### Dependencies

1. Stable auth and school-scope test accounts available before full regression.
2. Seed/reset workflow and deterministic fixture data maintained for repeatable runs.
3. Release branch freeze window communicated before final gate evaluation.

### Risks to Plan

- **Risk**: Scope churn late in release
  - **Impact**: Invalidates traceability and priority estimates
  - **Contingency**: Re-run test-design delta and reclassify risks within 24 hours of scope changes

---

## Interworking & Regression

| Service/Component | Impact | Regression Scope |
| --- | --- | --- |
| `web` | Teacher workflows, validation feedback, submit/read-only lifecycle | Component + E2E regressions for Epics 1-4 and 6 |
| `api` | Authz, audit, export, integrity rules | Integration + API regressions for Epics 1,2,4,5,6 |
| `web-e2e` | User-journey confidence | P0/P1 critical path suites |
| `api-e2e` | Contract and endpoint guardrails | Auth/session/draft/export endpoint suites |

---

## Appendix

### Knowledge Base References

- `risk-governance.md`
- `probability-impact.md`
- `test-levels-framework.md`
- `test-priorities-matrix.md`

### Related Documents

- PRD: `_bmad-output/planning-artifacts/prd.md`
- Epic: `_bmad-output/planning-artifacts/epics.md`
- Architecture: `_bmad-output/planning-artifacts/architecture.md`

---

**Generated by**: BMad TEA Agent - Test Architect Module  
**Workflow**: `bmad-testarch-test-design`  
**Version**: 4.0 (BMad v6)
