---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-schoolCronicle.md
documentCounts:
  briefCount: 1
  researchCount: 0
  brainstormingCount: 0
  projectDocsCount: 0
classification:
  projectType: web_app
  domain: edtech
  complexity: medium
  projectContext: greenfield
  complianceNotes: GDPR required (personal data, accounts, and image handling including identifiable individuals)
workflowType: 'prd'
---

# Product Requirements Document - schoolCronicle

**Author:** Rudolfgroetz
**Date:** 2026-04-21

## Executive Summary

SchoolCronicle is a greenfield edtech web application that standardizes how teachers submit yearly chronicle contributions, replacing the current coordinator-centric process where one person manually collects, reformats, and completes missing inputs. In V1, the product delivers teacher input workflows only: structured appointment creation and image upload with validation, clear submission states, and export-ready data for downstream chronicle production.

The product solves a high-friction operational problem: inconsistent submissions, missing context, wrong image formats, and deadline-driven back-and-forth that concentrates workload on a single coordinator. The intended outcome is predictable, chronicle-ready input quality throughout the school year, with measurable reductions in reformatting effort, follow-up requests, and late or incomplete contributions.

V1 is web-frontend only (responsive and usable on mobile browsers), with native iOS and Android apps planned later after workflow and API patterns are proven. GDPR is a mandatory non-negotiable requirement from the start because the platform processes personal data and potentially identifiable individuals in uploaded photos.

### What Makes This Special

SchoolCronicle is differentiated by enforcing quality at the point of entry rather than attempting cleanup at publication time. Teachers are guided through required fields and media constraints before submission, so correctness is shifted upstream and coordinator overhead collapses downstream.

The core insight is that the chronicle bottleneck is not document assembly itself; it is input quality and timing. By designing around this operational reality, the product creates immediate value without needing to ship full in-app chronicle editing in V1.

## Project Classification

- **Project Type:** Web application (`web_app`)
- **Domain:** Education technology (`edtech`)
- **Complexity:** Medium, with explicit GDPR compliance requirements
- **Project Context:** Greenfield

## Success Criteria

### User Success

- Teachers can create and submit an appointment with required details in under 3 minutes.
- Teachers can upload valid chronicle images without coordinator assistance.
- Teachers clearly understand submission status (draft/submitted/needs-fix) at all times.
- Doris no longer needs to manually request missing mandatory fields for most submissions.

### Business Success

- At least 80% of teachers actively submit at least one chronicle item per month during the school year.
- Coordinator follow-up requests to teachers drop by at least 50% within the first term.
- Late submissions are reduced by at least 40% versus the prior manual process.
- Chronicle preparation effort for Doris is reduced by at least 50% by year-end.

### Technical Success

- Image validation blocks unsupported formats and oversized files before submission.
- Required metadata validation prevents incomplete appointment submissions.
- All submission actions are auditable (who submitted what, when, and status changes).
- GDPR baseline controls are present in V1: lawful-basis documentation, data retention rules, deletion/export handling path, and secure access controls.

### Measurable Outcomes

- 90% of appointment submissions include all required fields on first submit.
- 85% of image uploads pass technical validation on first attempt.
- Median submission completion time (appointment + images) is under 5 minutes.
- Fewer than 10% of submitted entries require coordinator correction due to missing/invalid data.

## Product Scope

Authoritative **V1 boundaries** (including **no admin UI** and out-of-band provisioning) are specified under **Project Scoping & Phased Development**; this section summarizes phase intent.

### MVP - Minimum Viable Product

- Responsive web app (desktop and mobile browsers); **teacher is the only in-product role in V1** (additional roles and admin UI are post-MVP).
- Teacher authentication and session security suitable for school deployment.
- Appointments with mandatory fields, validation, and draft/submitted lifecycle.
- Image upload with format/size validation, per-file errors, and linkage to appointments.
- Export-capable structured data for downstream chronicle tooling.
- GDPR-aligned controls and documentation as agreed with the school (see **Domain-Specific Requirements** and **Non-Functional Requirements**).

### Growth Features (Post-MVP)

- Native mobile apps for iOS and Android.
- Rich media enhancements (bulk upload, smart compression, quality suggestions).
- Coordinator review dashboard and issue resolution workflow.
- Reminder automation for missing/late contributions.
- Better analytics for submission quality and participation by class/teacher.

### Vision (Future)

- End-to-end chronicle production workflow in-app (from submission to final publication).
- Multi-school support with tenant-level controls and reporting.
- AI-assisted chapter suggestions and media organization.
- Publication/export pipelines for multiple output formats (print-ready + digital).

## User Journeys

### Journey 1: Anna — happy path (teacher, first chronicle submission)

**Opening:** Anna teaches biology. In the past she emailed Doris photos after events, often late and in odd formats. She feels guilty when Doris chases her for missing dates or titles.

**Rising action:** She logs into SchoolCronicle on her phone browser after a parents’ evening. She opens “New appointment,” fills required fields (title, date, type, short description), attaches three photos, and sees inline checks: format OK, size OK, required metadata complete.

**Climax:** She taps Submit. Status shows **Submitted** with a timestamp. She realizes she will not get a “can you resend as JPEG?” email next week.

**Resolution:** Anna trusts the system as the single place to log chronicle-worthy moments. She submits more often during the year instead of batching chaos at the deadline.

### Journey 2: Ben — edge path (teacher, validation failure and recovery)

**Opening:** Ben rushes after a trip and uploads 12 images from his camera roll without checking file types.

**Rising action:** Several files fail validation (unsupported RAW, one oversize PNG). The UI lists each failure with a plain-language fix (“convert to JPEG/WEBP” or “compress under X MB”) and keeps successful files. His appointment stays **Draft** until resolved.

**Climax:** He replaces failing files, passes validation, and submits. Nothing invalid reaches export.

**Resolution:** Ben learns the rules once; recovery is self-serve. Coordinator rework from “bad batch from Ben” drops sharply.

### Journey 3: Clara — school administrator (Phase 2; not in V1 UI)

**V1 note:** There is **no admin UI**; Clara’s work happens **outside the product** (manual provisioning, runbooks, or operator tooling).

**Opening (future):** Clara manages teacher onboarding for the school year and wants self-serve invites and roster management inside the app.

**Rising action (future):** She invites teachers, ties them to the active school year, and monitors activation and first submission from an admin experience.

**Climax (future):** Early-term adoption is visible in-product without engineering intervention.

**Resolution (future):** Clara spends less time relaying coordinator instructions; the product carries structure for operations as well as teachers.

### Journey 4: Support / privacy contact (GDPR and access issues)

**Opening:** A teacher cannot access their account or requests deletion of uploaded photos after a consent dispute.

**Rising action:** They contact the school’s designated privacy or support channel. Support follows defined procedures to verify identity, export or delete data per GDPR timelines, and document the action without exposing other users’ data.

**Climax:** The request is completed within the agreed SLA.

**Resolution:** The school stays compliant; trust in uploading identifiable photos remains intact.

### Journey 5: Doris — downstream chronicle assembly (out of V1 product scope)

**Opening:** Doris still assembles the final chronicle in her document toolchain.

**Rising action:** She consumes structured export (appointments + image references + metadata) instead of hunting through inboxes.

**Climax:** She spends time on editorial layout, not reformatting phone screenshots.

**Resolution:** V1 proves value before in-app layout; later phases can bring assembly into the product.

### Journey Requirements Summary

| Area | Revealed by |
|------|-------------|
| Guided appointment forms + required fields | Anna, Ben |
| Client-side/server-side validation with actionable errors | Ben |
| Draft vs submitted state + timestamps | Anna, Ben |
| Teacher auth + session security | All teacher journeys |
| Image pipeline: type/size limits, storage, linkage to appointments | Anna, Ben |
| Export-ready structured data for downstream chronicle tooling | Doris |
| GDPR: retention, access, export, deletion, audit trail | Support journey, Ben |
| Onboarding / invites / school-year context | Out-of-band in V1 (no admin UI); future in-product admin (Clara, Phase 2) |

## Domain-Specific Requirements

### Compliance & Regulatory

- **GDPR (EU/EEA):** Lawful basis documented for each processing purpose (e.g., teacher accounts, appointment metadata, image storage, audit logs, exports). Processor vs controller roles clarified where the vendor hosts data for the school.
- **Special-category data:** Photos may identify individuals; define when consent, explicit school policy, or another Article 9 ground applies, and how withdrawals are honored (including removal from exports where required).
- **Data subject rights:** Access, rectification, erasure, restriction, portability, and objection supported within statutory timelines; procedures for requests initiated via the school’s privacy contact.
- **Retention:** School-year-aligned retention defaults for drafts/submissions and media; legal hold or publication-driven exceptions documented.
- **International transfers:** If infrastructure is outside the EEA, SCCs (or successor mechanism) and transfer impact assessment as applicable.
- **Security of processing + breach:** Technical and organizational measures documented; personal-data breach notification playbook aligned with GDPR Article 33/34 timelines.
- **Accessibility (edtech baseline):** Teacher-facing targets align with **Non-Functional Requirements** (WCAG 2.2 Level AA for agreed core flows).

### Technical Constraints

- **Encryption:** TLS for data in transit; encryption at rest for stored personal data and media objects.
- **Access control:** Role-based access, least privilege, session management, and tamper-evident **audit logs** for submission and admin/support actions.
- **Media pipeline:** File type/size validation, malware scanning policy (if/when implemented), secure direct upload patterns, and clear separation of tenant/school data.
- **Privacy by design:** Data minimization in forms; separate optional fields from required; avoid collecting unnecessary identifiable metadata.

### Integration Requirements

- **V1:** Structured **export** of appointments and image metadata (and secure links or packaged assets per policy) compatible with Doris’s offline chronicle toolchain.
- **Post-MVP:** Optional SIS/identity integrations only when explicitly in scope.

### Risk Mitigations

- **Consent / publication disputes:** Clear teacher attestation on image rights and school-use scope at upload; reversible draft state until submission.
- **Over-collection:** Validation rules prevent “shadow PII” fields; retention job prevents indefinite image hoarding.
- **School IT trust:** Transparent subprocessors list, DPA template, and documented subprocessor change process.
- **Cross-user leakage:** Strict tenant/school scoping and testing for IDOR-style access to appointments and media.

## Web Application Specific Requirements

### Project-Type Overview

SchoolCronicle V1 is a **single-page web application** (SPA) aimed at authenticated teachers, with **responsive layouts** so the same build works on desktop and mobile browsers. Native iOS/Android apps are explicitly out of scope for V1.

### Technical Architecture Considerations

- **Client architecture:** SPA with client-side routing; server provides hosting, APIs, authentication, and media upload handling.
- **State and forms:** Appointment drafts and submission states must survive refresh within a session and align with server-side source of truth.
- **Media uploads:** Prefer resumable or chunked upload patterns only if large files are in scope; otherwise enforce max size consistent with validation rules.

### Browser Matrix

- **Supported (V1):** Current and previous major version of **Chrome**, **Firefox**, **Safari**, **Edge**; **iOS Safari** and **Chrome on Android** for last two OS generations where feasible.
- **Unsupported:** Internet Explorer; browsers without TLS 1.2+.

### Responsive Design

- **Breakpoints:** Mobile-first layout; core flows (login, appointment form, image upload, submission status) usable on ~360px width without horizontal scrolling.
- **Touch:** Adequate tap targets; file picker works with mobile camera/gallery flows where the browser allows.

### Performance Targets

- **Initial load:** Time-to-interactive targets to be tuned in implementation; prioritize fast first paint for login and form screens on 4G.
- **Upload UX:** Clear progress and cancel where supported; avoid blocking UI during validation of multiple files.

### SEO Strategy

- **V1:** Minimal SEO requirements; most content is behind authentication. Provide basic `index`/`robots` policy (e.g., disallow indexing of app shell if appropriate).
- **Post-MVP:** Public marketing site may warrant separate SEO strategy outside authenticated app.

### Accessibility Level

- **Target:** WCAG **2.2 Level AA** for core teacher flows (forms, errors, focus order, labels, contrast, keyboard operability where applicable).
- **Errors:** Validation and upload errors exposed to assistive tech (not color-only).

### Implementation Considerations

- **Security headers and cookies:** HttpOnly, Secure, SameSite policy aligned with GDPR/security expectations.
- **Deployment:** HTTPS everywhere; environment-based configuration for API and storage endpoints.
- **Observability:** Client and server logging sufficient to debug upload/auth failures without logging sensitive personal content.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP approach:** Problem-solving MVP—prove that teachers submit **complete, valid** appointments and images on the web, with **GDPR baselines** and **export** for Doris’s offline chronicle work. **V1 includes no admin UI:** all school-side provisioning and configuration is manual or out-of-band (scripts, support, or a future admin product).

**Resource requirements (indicative):** Frontend (Angular SPA), backend/API + auth, media storage, security/privacy for GDPR. No dedicated admin-frontend capacity required for V1.

### MVP Feature Set (Phase 1)

**Core user journeys supported:**

- Teacher happy path: create appointment, attach valid images, submit.
- Teacher recovery path: fix validation failures and resubmit from draft.
- **No in-app school administrator journey in V1**—teacher accounts and school-year context are created and maintained **outside the app** (documented operator runbook).
- GDPR/support path: documented procedures for access/erasure/export; technical behavior in the app where required (e.g. delete or export user-contributed data per authorized request).

**Must-have capabilities:**

- HTTPS web app; teacher authentication and session handling.
- Appointment entity with required fields and server-side validation.
- Image upload with format/size rules and per-file error feedback.
- Draft vs submitted lifecycle with audit-friendly timestamps.
- Secure storage and school-scoped access for appointments and media.
- GDPR baseline: lawful processing documentation, retention approach, DSAR handling path, subprocessors/DPA stance, breach playbook (operational + technical).
- Export of structured data (and policy for media handoff) for downstream chronicle production.

**Explicitly out of V1 UI:**

- Admin dashboards, invite flows, roster management, role configuration screens, and any coordinator/chronicle-assembly UI.

### Post-MVP Features

**Phase 2 (growth):**

- **School admin UI** (invites, roster, school year, roles) once the teacher workflow is proven.
- Native iOS and Android apps.
- Coordinator review UI, reminders, richer analytics, bulk upload and smarter media assistance.
- Optional identity/SIS integrations.

**Phase 3 (expansion):**

- In-app chronicle assembly and publication pipelines; multi-school tenancy; advanced editorial and AI-assisted organization (only if validated by earlier phases).

### Risk Mitigation Strategy

**Technical risks:** Image pipeline and GDPR-compliant storage remain the highest engineering risk—mitigate with strict limits, early spike on upload and malware-handling policy, and security testing for IDOR/access control.

**Market/ops risks:** Without admin UI, onboarding friction falls on **manual provisioning**—mitigate with a **repeatable runbook**, a small pilot school, and clear SLAs for account creation.

**Resource risks:** If the team shrinks, defer export polish and non-critical validations before touching authentication, school scoping, or GDPR minimums.

## Functional Requirements

### Access & session

- FR1: A teacher can sign in using school-provisioned credentials.
- FR2: A teacher can sign out of the application.
- FR3: A teacher can work within an authenticated session governed by school security policy.
- FR4: A teacher can follow a defined path to resolve access issues (e.g., contact/help) when sign-in fails.

### Appointments

- FR5: A teacher can create a new appointment in draft state.
- FR6: A teacher can view a list of their own appointments.
- FR7: A teacher can open and edit their own draft appointments.
- FR8: A teacher cannot submit an appointment until all required metadata fields are complete.
- FR9: A teacher can assign an appointment type or category from the controlled set used for chronicle capture.
- FR10: A teacher can remove their own draft appointment when policy allows.

### Images

- FR11: A teacher can attach one or more images to a draft appointment.
- FR12: A teacher can remove an attached image before submission.
- FR13: A teacher can see which images failed validation and the reason for each failure.
- FR14: The system blocks submission while any attached image fails validation.

### Validation & correction

- FR15: The system validates appointment metadata against required-field rules before submission.
- FR16: The system validates each image against allowed formats and maximum size rules.
- FR17: A teacher can correct validation errors and resubmit without unnecessary loss of valid entered data.

### Submission lifecycle

- FR18: A teacher can submit an appointment when validation requirements are satisfied.
- FR19: A teacher can distinguish draft appointments from submitted appointments.
- FR20: A teacher can see when an appointment was submitted.
- FR21: A teacher can view read-only details of submitted appointments according to policy.

### School scope & access control

- FR22: A teacher can only access appointments and images permitted within their school scope.
- FR23: The system associates appointments and images with the correct school scope for isolation and export.

### Export & chronicle handoff

- FR24: Authorized school personnel can obtain a structured export of submitted appointments and associated image references for downstream chronicle production, using an agreed channel that does not require an admin UI in V1.
- FR25: Exported data preserves stable relationships between appointments and their images per the export specification.

### GDPR-aligned product capabilities

- FR26: A teacher can see a clear summary of which categories of personal data the product processes about them, where in scope for V1.
- FR27: A teacher can correct inaccurate editable profile or appointment metadata where allowed by policy.
- FR28: A teacher can invoke the school’s privacy process for erasure or restriction, and the system can honor the outcome for that teacher’s in-app contributions when required.
- FR29: The system applies configured retention rules to drafts, submissions, and stored media.
- FR30: The system records an audit trail of materially significant actions on appointments and submissions.

### Guidance & support surfaces

- FR31: A teacher can access in-product guidance on required appointment fields and acceptable image formats.
- FR32: A teacher can see who to contact at the school for privacy or account issues.

## Non-Functional Requirements

### Performance

- **Interactive flows:** For typical school-network conditions, core teacher interactions (open appointment list, open draft, save metadata) complete within **2 seconds p95** server round-trip excluding client render, under nominal pilot load.
- **Uploads:** The system provides visible upload progress for multi-megabyte files; a single-image upload attempt of up to the configured maximum size completes without client timeout under nominal pilot conditions when the network is stable.
- **Validation feedback:** Field-level and file-level validation results are returned within **2 seconds p95** for typical payloads.

### Security

- **Transport:** All browser-to-service communication uses **HTTPS** with TLS **1.2+**.
- **Data at rest:** Personal data and stored media objects are protected with **encryption at rest** using industry-standard algorithms and key management appropriate to production deployment.
- **Authentication:** Sessions use hardened cookie attributes (**Secure**, **HttpOnly**, **SameSite** policy aligned with threat model) or an equivalent token strategy with comparable protections.
- **Authorization:** Enforce **school-scoped least privilege**; every read/write of appointments and media must be authorized and resistant to **cross-tenant and IDOR** access patterns (verified by security testing).
- **Logging:** Production logs must not contain secrets or unnecessary personal data; access to logs is restricted.
- **GDPR alignment:** Support documented **retention**, **auditability** of significant actions, and **timely** response enablement for access/erasure/export processes agreed with the school (operational SLAs are defined with the school, not by the software alone).

### Scalability

- **Pilot to full school:** The architecture supports running a **full teaching staff** at one school concurrently during peak usage windows (e.g., post-event submission spikes) without systemic failure; specific numeric targets are validated in load testing before go-live.

### Accessibility

- **Target:** Core authenticated teacher flows meet **WCAG 2.2 Level AA** for the scope agreed during UX refinement (forms, errors, labels, focus order, contrast, keyboard operability where applicable).
- **Errors:** Validation and upload failures are perceivable without relying on color alone.

### Integration

- **Export consumability:** School exports use a **versioned** schema or manifest so downstream chronicle tooling can detect format versions and remain stable across minor releases.
- **Media handoff:** Export documentation specifies how image references resolve to retrievable media under school-controlled access, without breaking school isolation rules.
