# Master Test Plan — SchoolCronicle V1

**Document identifier:** MTP-SCHOOLCRONICLE-V1-001  
**Version:** 1.0  
**Date:** 2026-04-21  
**Status:** Draft  
**Conforms to:** ISO/IEC/IEEE 29119-3:2021 — *Software testing — Part 3: Test documentation* (Master Test Plan / organizational test planning content)

**Related artifacts**

| Artifact | Path |
| -------- | ---- |
| Product requirements | `_bmad-output/planning-artifacts/prd.md` |
| UX design specification | `_bmad-output/planning-artifacts/ux-design-specification.md` |
| Product brief | `_bmad-output/planning-artifacts/product-brief-schoolCronicle.md` |
| Test design (risk & coverage) | `_bmad-output/test-artifacts/test-design/test-design-schoolCronicle-v1.md` |

---

## 1. Test plan identifier

| Field | Value |
| ----- | ----- |
| Project / product | SchoolCronicle |
| Release under test | V1 (teacher-only web app) |
| Plan type | Master Test Plan (MTP) |
| Owning role | Test Manager / QA Lead (TBD) |
| Revision history | 1.0 — Initial MTP aligned to PRD V1 |

---

## 2. Introduction

### 2.1 Purpose

This document specifies the **objectives**, **scope**, **features under test**, **test approach**, **resources**, **schedule**, **deliverables**, and **risk controls** for verifying and validating SchoolCronicle V1 against agreed requirements and stakeholder expectations.

### 2.2 Scope of testing

**In scope**

- Authenticated teacher workflows for appointment lifecycle (draft → validate → submit), image attachment and validation, school-scoped access, read-only submitted views, in-app guidance and privacy surfaces, retention and audit behavior as implemented, and structured export per PRD.
- Non-functional attributes declared in the PRD: security (transport, session, authorization, logging hygiene), performance targets for core interactions and validation, scalability for pilot-to-full-staff at one school, accessibility (WCAG 2.2 Level AA for agreed UX scope), integration aspects of export versioning and media references.

**Out of scope**

- Admin UI and automated multi-tenant school onboarding (explicitly excluded from V1).
- Third-party chronicle desktop publishing tools (only export consumability and schema versioning in scope).
- Formal production penetration test **engagement** (may be referenced as separate work product; this plan includes **internal** security verification).

### 2.3 Definitions and acronyms

| Term | Definition |
| ---- | ---------- |
| SUT | Software under test — SchoolCronicle V1 deployable increment |
| MTP | Master Test Plan (this document) |
| DTP | Detailed Test Plan / level-specific plan (may be derived per sprint or component) |
| TCS | Test Case Specification (ISO 29119-3 component; to be produced from test design TD-* IDs) |
| TP | Test Procedure (executable steps) |
| TRR | Test readiness review |
| IDOR | Insecure direct object reference |
| GDPR | EU General Data Protection Regulation (product capabilities aligned per PRD) |

*Normative terminology for test processes may also follow ISO/IEC/IEEE 29119-2 where the organization adopts that part.*

---

## 3. References

| ID | Reference |
| -- | --------- |
| REF-1 | ISO/IEC/IEEE 29119-3:2021 — Test documentation |
| REF-2 | ISO/IEC/IEEE 29119-2:2021 — Test processes (as adopted by the organization) |
| REF-3 | SchoolCronicle PRD — `_bmad-output/planning-artifacts/prd.md` |
| REF-4 | UX Design Specification — `_bmad-output/planning-artifacts/ux-design-specification.md` |
| REF-5 | WCAG 2.2 (W3C) — accessibility conformance reference per PRD |
| REF-6 | OWASP Testing Guide / ASVS (industry practice for web security verification) |

---

## 4. Test items

The **test item** is the **SchoolCronicle V1** release candidate comprising:

- Teacher-facing web client (UI) implementing journeys in the UX specification (Material “Direction A,” responsive layouts, custom components).
- Backend services supporting authentication, appointment CRUD, draft/submitted states, image upload and validation, school scoping, audit logging, retention processing, and export generation.
- Configuration and operational elements: TLS endpoints, session/cookie policy, storage encryption at rest, export channel integration agreed per school.

**Identification:** Build label / container image digest / git tag — recorded per test cycle in the test summary report.

---

## 5. Features to be tested

Features are mapped to **functional requirements (FR)** and **non-functional requirements (NFR)** from REF-3. Traceability to test design scenarios (TD-*) is in the test design artifact.

| Feature group | Description | Primary requirements |
| ------------- | ----------- | --------------------- |
| F-ACCESS | Sign-in, sign-out, session policy, access issue resolution path | FR1–FR4 |
| F-APPT | Draft creation, list, edit, categories, removal when allowed | FR5–FR10 |
| F-IMAGE | Attach, remove, validation feedback, block submit on failure | FR11–FR14, FR16 |
| F-VALID | Metadata and image validation rules; correction without unnecessary data loss | FR15–FR17 |
| F-LIFE | Submit when valid; distinguish draft/submitted; submission time; read-only submitted view | FR18–FR21 |
| F-SCOPE | School isolation; correct association for export | FR22–FR23 |
| F-EXPORT | Structured export; stable appointment–image relationships | FR24–FR25 |
| F-GDPR | Privacy summary, correction, erasure/restriction enablement, retention, audit trail | FR26–FR30 |
| F-GUIDE | Field/format guidance; school contact for privacy/account | FR31–FR32 |
| NF-PERF | Interactive p95, upload progress, validation feedback latency | NFR Performance |
| NF-SEC | HTTPS TLS 1.2+, encryption at rest, hardened sessions, least-privilege authZ, log hygiene | NFR Security |
| NF-SCALE | Concurrent staff usage at one school | NFR Scalability |
| NF-A11Y | WCAG 2.2 AA for agreed scope; errors not color-only | NFR Accessibility |
| NF-INT | Versioned export schema; image reference resolution under isolation | NFR Integration |

---

## 6. Features not to be tested

| Feature / area | Reason |
| ---------------- | ------ |
| Admin provisioning UI | Excluded from V1 product scope |
| Multi-school SaaS tenancy | Future phase; not a V1 acceptance target |
| AI-assisted editorial | Out of scope per PRD |
| Full legal GDPR processor assessment | Organizational/compliance activity beyond software test scope (software enables processes) |

Residual risk: documented in test design (R-009, runbook reliance).

---

## 7. Test approach

### 7.1 Test strategy

Testing combines **risk-based prioritization** (see test design R-001–R-005), **requirement-based coverage**, and **user-journey** validation derived from the UX specification. **Shift-left:** validation rules and authorization at API layer are tested early; **shift-right:** pilot monitoring may inform additional cases.

### 7.2 Test types and levels

| Type | Level | Objective |
| ---- | ----- | ----------- |
| Functional | Component / unit | Rules, parsers, state machines |
| Functional | Integration / service | Persistence, messaging, storage, jobs |
| Functional | System (E2E) | End-to-end teacher journeys in browser |
| Non-functional | Performance | p95 latency, upload completion under stable network |
| Non-functional | Security | TLS config, cookie attributes, horizontal/vertical access control |
| Non-functional | Accessibility | WCAG techniques applicable to forms, errors, focus, contrast |
| Data integrity | System | Export manifest vs DB; retention outcomes |

Test design techniques (equivalence partitioning, boundary values, state transition, error guessing, pairwise for field combinations where valuable) shall be recorded at **TCS** level where the organization requires explicit technique annotation.

### 7.3 Completion criteria (plan level)

- All **must** requirements in sections 5 and 8 satisfied **or** formally deferred with documented approval.
- **Entry/exit** criteria from the test design document are satisfied for the release gate.

---

## 8. Item pass/fail criteria

| Item class | Pass criteria | Fail criteria |
| ---------- | ------------- | ------------- |
| Functional FR | Observed behavior matches PRD acceptance intent; no blocking defect | Contradicts FR; blocking workaround absent |
| Security (critical) | No reproducible IDOR/session violation in test scope | Exploitable cross-tenant or session hijack path |
| Performance | Measured p95 within PRD thresholds under agreed test conditions | Sustained breach of threshold not explained by environment |
| Accessibility | No **violations** for agreed WCAG scope at AA, or defects triaged as fix/known-issue with waiver | Blocking barrier to core task without waiver |
| Export | Validates against versioned schema; referential integrity preserved | Broken links, wrong school data, schema regression |

Defect severity scales shall align with the project’s defect management policy (referenced in test summary reports).

---

## 9. Suspension and resumption criteria

### 9.1 Suspension

Testing shall **suspend** when:

- Test environment unavailable or not representative (e.g., HTTP-only, wrong TLS).
- Blocking defect in authentication or school scoping prevents meaningful execution (aligns with R-001/R-002).
- Test data or accounts not provisioned per entry criteria.

### 9.2 Resumption

Testing **resumes** when:

- Environment restored and configuration verified (smoke passed).
- Fix deployed or workaround approved for the blocking defect.
- Accounts and fixtures restored.

---

## 10. Test deliverables

| Deliverable | ISO 29119-3 mapping | Owner | Status |
| ----------- | ------------------- | ----- | ------ |
| Master Test Plan (this document) | Test Plan | QA | Draft |
| Test Design | Planning / risk documentation | QA | Complete |
| Test Case Specifications | TCS | QA | To be produced |
| Test Procedures | TP | QA / Automation | To be produced |
| Automated test suites | Executable artefacts | QA + Dev | In progress |
| Test data specification | Supporting info | QA | To be produced |
| Daily/weekly test execution logs | Test execution evidence | QA | Ongoing |
| Test Summary Report | Completion record per cycle | QA | Per release |

---

## 11. Test environment needs

| Need | Description |
| ---- | ----------- |
| Browser matrix | Latest evergreen Chrome/Edge/Safari + one mobile WebKit profile per UX breakpoints |
| Network | Profile simulating “typical school” latency/bandwidth for performance spot checks |
| TLS | HTTPS only; TLS 1.2+ |
| Identity | School-provisioned test identities; multi-school setup for isolation |
| Storage | Representative object store with encryption at rest enabled as in production class |
| Clock | Controllable test clock or short retention window for retention tests |
| Export | Sandbox destination or signed URL pattern per integration agreement |

---

## 12. Staffing, responsibilities, and training

| Role | Responsibility |
| ---- | -------------- |
| QA Lead | MTP maintenance, coverage sign-off, release test summary |
| Testers | Case design, execution, defect logging, exploratory charters |
| Developers | Unit/integration tests, fixes, environment support |
| Product Owner | Scope interpretation, waiver approval |
| DevOps | Environment parity, secrets, pipeline hooks for automated suites |
| Security champion | Review of authZ test matrix; optional external pen-test coordination |

Training: stack-specific (Playwright/Cypress, k6), GDPR product behavior, school runbook for provisioning.

---

## 13. Schedule and milestones

| Milestone | Description |
| --------- | ----------- |
| M1 | Test design reviewed (TRR) |
| M2 | P0 automation skeleton + API security negatives |
| M3 | Full P0 pass on release candidate |
| M4 | P1 pass + accessibility + performance evidence |
| M5 | Test Summary Report + release recommendation |

*Exact dates: to be aligned with project plan.*

---

## 14. Risks and contingencies

| Risk | Impact on testing | Contingency |
| ---- | ----------------- | ----------- |
| Late export spec | Blocks F-EXPORT cases | Early stub consumer; version negotiation tests |
| Weak test data | Missed IDOR | Dedicated multi-school fixture set |
| Environment drift | False failures | Infra smoke; version pinning |
| Scope creep | Slippage | Change control; re-baseline MTP |

Full risk register: test design document § Risk Assessment.

---

## 15. Approvals

| Role | Name | Signature / Date |
| ---- | ---- | ---------------- |
| Product Owner | | |
| Engineering Lead | | |
| QA Lead | | |

---

## Annex A — Traceability index (FR → planning documents)

| FR range | Test design reference | MTP section |
| -------- | --------------------- | ----------- |
| FR1–FR4 | TD-001, P0 auth | §5 F-ACCESS |
| FR5–FR21 | TD-002–TD-008, P0/P1 | §5 F-APPT, F-IMAGE, F-VALID, F-LIFE |
| FR22–FR25 | TD-008, TD-009 | §5 F-SCOPE, F-EXPORT |
| FR26–FR32 | TD-010–TD-013 | §5 F-GDPR, F-GUIDE |
| NFRs | Perf/Sec/A11y/Int suites | §5 NF-* , §7.2 |

---

*End of Master Test Plan*
