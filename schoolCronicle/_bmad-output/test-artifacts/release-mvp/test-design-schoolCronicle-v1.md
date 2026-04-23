---
workflowStatus: complete
totalSteps: 5
stepsCompleted: [1, 2, 3, 4, 5]
lastStep: step-05-generate-output
nextStep: ''
lastSaved: '2026-04-21'
---

# Test Design: SchoolCronicle V1 (Teacher Web App)

**Date:** 2026-04-21  
**Author:** Master Test Architect (BMAD TEA workflow)  
**Status:** Draft  
**Basis:** `prd.md`, `ux-design-specification.md`, `product-brief-schoolCronicle.md`

---

## Executive Summary

**Scope:** System-level test design for **SchoolCronicle V1** — teacher-only authenticated web application for appointment capture (draft/submit), image attachment with validation, school-scoped access, GDPR-aligned capabilities, and structured export without admin UI.

**Risk summary**

| Category | Count (approx.) | Notes |
| -------- | --------------- | ----- |
| High (score ≥6) | 5 | Auth/session, IDOR/school scope, image pipeline, GDPR/retention, export integrity |
| Medium (3–5) | 6 | Performance on school networks, WCAG scope, pilot load, manual provisioning |
| Low (1–2) | 4 | Guidance copy, help routing, minor UX variance |

**Coverage summary (indicative)**

| Priority | Scenario groups | Est. effort (person-days) |
| -------- | ---------------- | ------------------------- |
| P0 | Auth, scope, submit blockers, image validation, core GDPR audit | 8–12 |
| P1 | Export, retention, profile/correction, journeys, NFR spot-checks | 6–10 |
| P2/P3 | Edge formats, slow network, localization if any | 3–5 |
| **Total** | | **17–27** |

---

## Not in Scope

| Item | Reasoning | Mitigation |
| ---- | --------- | ---------- |
| Admin UI / bulk provisioning | Explicitly out of V1 PRD | Manual runbook + ops tests for export channel only |
| Multi-school product tenancy | Future phase | N/A for V1 |
| Downstream chronicle layout tools | External consumers | Contract/schema tests on export artifact only |
| Formal pen-test sign-off | Often separate engagement | Security test suite + external assessment per school policy |

---

## Risk Assessment

### High-priority risks (score ≥6)

| Risk ID | Category | Description | P | I | Score | Mitigation | Owner |
| ------- | -------- | ----------- | - | - | ----- | ---------- | ----- |
| R-001 | SEC | Cross-tenant or IDOR access to appointments/images (wrong school or user) | 2 | 3 | 6 | Automated API/E2E negative cases; fuzz IDs; security review of authZ layer | QA + Dev |
| R-002 | SEC | Session fixation / weak cookie or token handling | 2 | 3 | 6 | Cookie attribute checks; session rotation on login; transport-only cookies | Dev + QA |
| R-003 | DATA | Image validation bypass (malware, oversize, type confusion) leading to bad storage or UX | 3 | 2 | 6 | Server-side validation tests; reject client-only checks; sample corpus | QA + Dev |
| R-004 | DATA | Submission allowed while invalid images or metadata present | 2 | 3 | 6 | State-machine tests; concurrent upload + submit | QA |
| R-005 | BUS | Export loses linkage appointment ↔ images or breaks school isolation | 2 | 3 | 6 | Golden-file export tests; checksum of relationships; access control on media URLs | QA |

### Medium-priority risks (score 3–5)

| Risk ID | Category | Description | P | I | Score | Mitigation |
| ------- | -------- | ----------- | - | - | ----- | ---------- |
| R-006 | PERF | p95 > 2s on list/open/save under pilot load | 2 | 2 | 4 | Load script on critical APIs; defer non-critical if triaged |
| R-007 | BUS | Teachers lose draft data on validation failure paths | 2 | 2 | 4 | E2E preserve-field tests; FR17 coverage |
| R-008 | TECH | WCAG gaps in dynamic errors / upload progress | 2 | 2 | 4 | axe + manual keyboard on Direction A components |
| R-009 | OPS | Manual account provisioning delays pilot | 2 | 2 | 4 | Runbook test; entry criteria for “accounts ready” |
| R-010 | DATA | Retention job deletes wrong cohort or wrong timing | 1 | 3 | 3 | Time-boxed integration tests; config review |
| R-011 | SEC | Audit log omits material events or leaks PII | 2 | 2 | 4 | Log schema tests; redaction review |

### Low-priority risks (score 1–2)

| Risk ID | Category | Description | Action |
| ------- | -------- | ----------- | ------ |
| R-012 | BUS | Help/contact copy outdated | Monitor; content review |
| R-013 | OPS | Export channel misconfiguration for one school | Pilot checklist |

### Risk category legend

- **TECH:** Architecture, integration, scalability  
- **SEC:** Authentication, authorization, transport, logging hygiene  
- **PERF:** Latency, uploads, timeouts  
- **DATA:** Integrity, retention, export consistency  
- **BUS:** User-visible correctness, GDPR UX  
- **OPS:** Provisioning, deployment, runbooks  

---

## Entry Criteria

- [ ] PRD V1 FR/NFR baseline agreed and under change control  
- [ ] Test environment with HTTPS, representative school network profile  
- [ ] Test accounts: ≥2 teachers same school; ≥2 teachers **different** schools (scope tests)  
- [ ] Image fixtures: valid JPEG/PNG/WebP; oversize; wrong magic bytes; ZIP disguised as image  
- [ ] Export channel stub or school-agreed sandbox endpoint  
- [ ] Privacy/retention configuration documented for test env  

## Exit Criteria

- [ ] All P0 tests passing; P1 passing or formally waived with PO sign-off  
- [ ] No open **Critical / High** defects on R-001–R-005 areas  
- [ ] Security tests for IDOR/session complete with documented residual risk  
- [ ] WCAG 2.2 AA agreed scope exercised (forms, errors, focus, contrast, non-color cues)  
- [ ] Traceability: each P0 FR covered by ≥1 executed test (see matrix)  

---

## Test Levels and Types

| Level / type | Objective | Tooling (indicative) | Notes |
| ------------ | --------- | -------------------- | ----- |
| Unit | Validation rules, state transitions, pure mappers | Jest/Vitest/pytest per stack | Required-field matrix from FR8/FR15/FR16 |
| Integration | DB + API + storage; retention jobs; audit writes | Same + test DB / LocalStack if S3 | School scope on every query |
| API (contract) | REST/GraphQL handlers, authZ | Playwright API / REST Client / Pact optional | Negative security cases priority |
| E2E (UI) | Journeys per UX spec | Playwright/Cypress | Mobile-first breakpoints per UX |
| Accessibility | WCAG 2.2 AA core flows | axe, keyboard, screen reader spot | Align with UX “Responsive & Accessibility” |
| Performance | p95 budgets, upload progress | k6/Locust + RUM-like metrics | NFR thresholds in PRD |
| Security | TLS, cookies, IDOR | OWASP ZAP light pass + custom scripts | Complement external pen-test if required |

---

## Test Coverage Plan

### P0 (critical) — run every merge to main / nightly on trunk

**Criteria:** Blocks core teacher journey **or** risk score ≥6 **or** no workaround.

| Requirement area | Test level | Risk link | Test count (indicative) | Notes |
| ---------------- | ---------- | --------- | ----------------------- | ----- |
| FR1–FR4 Sign-in/out/session/help | E2E + API | R-002 | 6 | Cookie flags; logout invalidates; failed login path |
| FR22–FR23 School scope | API + E2E | R-001 | 10 | Horizontal privilege tests |
| FR11–FR14, FR16 Images | API + E2E | R-003, R-004 | 12 | Server validation; submit blocked when invalid |
| FR5–FR10, FR15 Draft/edit/submit gates | E2E | R-004 | 8 | Required fields; type/category set |
| FR18–FR21 Lifecycle | E2E | R-004 | 5 | Draft vs submitted; timestamp visible |
| FR30 Audit material actions | Integration | R-011 | 4 | Create/edit/submit/export-related if logged |

**Total P0 (indicative):** ~45 automated cases + exploratory charter per build.

### P1 (high) — run on PR to main / pre-release

| Requirement area | Test level | Risk link | Notes |
| ---------------- | ---------- | --------- | ----- |
| FR24–FR25 Export | Integration + E2E | R-005 | Versioned manifest; stable IDs |
| FR26–FR29 GDPR surfaces/retention/erasure outcome | E2E + Integration | R-010, R-011 | Config-driven dates |
| FR17 Correction without data loss | E2E | R-007 | |
| FR31–FR32 Guidance and contacts | E2E (content) | R-012 | Snapshot or manual checklist |
| NFR Performance spot | Perf | R-006 | Key APIs p95 |
| NFR HTTPS/TLS | Sec | R-002 | Automated smoke |

### P2/P3 — regression / cadence / best effort

- Unusual image dimensions, HEIC if explicitly unsupported, flaky network simulation  
- Visual regression optional (Material Direction A)  

---

## Scenario Catalog (traceability seeds)

| Test design ID | User journey / intent | FRs (primary) |
| ---------------- | -------------------- | ------------- |
| TD-001 | First-time login → land on appointment list empty state | FR1, FR3 |
| TD-002 | Create draft → fill partial → cannot submit | FR5, FR8, FR18 |
| TD-003 | Complete draft → attach valid images → submit | FR11, FR13–FR18, FR20 |
| TD-004 | Attach invalid image → see reason → fix → submit | FR13–FR17 |
| TD-005 | Remove draft when policy allows | FR10 |
| TD-006 | Open submitted read-only | FR19, FR21 |
| TD-007 | Teacher A cannot open Teacher B appointment (same school wrong owner if applicable) | FR22 |
| TD-008 | Teacher school A cannot access school B IDs | FR22, FR23 |
| TD-009 | Export consumed by stub consumer | FR24, FR25 |
| TD-010 | Privacy summary and school contact | FR26, FR32 |
| TD-011 | Profile/metadata correction | FR27 |
| TD-012 | Invoke erasure/restriction flow (as implemented) | FR28 |
| TD-013 | Retention behavior after configured period (test clock) | FR29 |
| TD-014 | Keyboard-only create and submit | FR5–FR21 + WCAG |
| TD-015 | Mobile 360px list + editor | UX responsive |

---

## Requirements Traceability (FR → test design)

| FR | P0 case group | TD IDs |
| -- | ------------- | ------ |
| FR1–FR4 | Auth session | TD-001, security suite |
| FR5–FR10 | Appointments draft | TD-002, TD-005 |
| FR11–FR14 | Images | TD-003, TD-004 |
| FR15–FR17 | Validation/correction | TD-002–TD-004 |
| FR18–FR21 | Submission | TD-003, TD-006 |
| FR22–FR23 | Scope | TD-007, TD-008 |
| FR24–FR25 | Export | TD-009 |
| FR26–FR30 | GDPR / audit | TD-010–TD-013 |
| FR31–FR32 | Guidance | TD-010 |

NFRs map to dedicated suites: performance (R-006), security transport/authZ (R-001–R-002), scalability pilot load, accessibility (TD-014), integration export versioning (TD-009).

---

## Data and Test Oracles

- **Golden export:** JSON/ZIP manifest with known appointment IDs and image handles; downstream parser round-trip.  
- **Audit oracle:** For each material action, query audit store for event type, actor, subject ID, timestamp (no PII in logs per NFR).  
- **Image oracle:** File size, MIME, magic bytes, dimension limits per PRD caps.  

---

## Dependencies

- Stable API version or feature flags for V1 scope  
- School branding optional; not blocking functional oracles  
- Legal-approved privacy copy for FR26/FR32  

---

## Handoff

- Detailed **ISO/IEC/IEEE 29119** master test plan: `../test-plan-iso29119-schoolCronicle-v1.md`  
- Future **test case specification** and **test procedure** documents can decompose TD-* IDs into executable steps per organization template.
