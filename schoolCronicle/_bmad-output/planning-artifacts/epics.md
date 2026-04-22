---
stepsCompleted:
  - 1
  - 2
  - 3
  - 4
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
status: complete
---

# schoolCronicle - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for schoolCronicle, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: A teacher can sign in using school-provisioned credentials.
FR2: A teacher can sign out of the application.
FR3: A teacher can work within an authenticated session governed by school security policy.
FR4: A teacher can follow a defined path to resolve access issues (e.g., contact/help) when sign-in fails.
FR5: A teacher can create a new appointment in draft state.
FR6: A teacher can view a list of their own appointments.
FR7: A teacher can open and edit their own draft appointments.
FR8: A teacher cannot submit an appointment until all required metadata fields are complete.
FR9: A teacher can assign an appointment type or category from the controlled set used for chronicle capture.
FR10: A teacher can remove their own draft appointment when policy allows.
FR11: A teacher can attach one or more images to a draft appointment.
FR12: A teacher can remove an attached image before submission.
FR13: A teacher can see which images failed validation and the reason for each failure.
FR14: The system blocks submission while any attached image fails validation.
FR15: The system validates appointment metadata against required-field rules before submission.
FR16: The system validates each image against allowed formats and maximum size rules.
FR17: A teacher can correct validation errors and resubmit without unnecessary loss of valid entered data.
FR18: A teacher can submit an appointment when validation requirements are satisfied.
FR19: A teacher can distinguish draft appointments from submitted appointments.
FR20: A teacher can see when an appointment was submitted.
FR21: A teacher can view read-only details of submitted appointments according to policy.
FR22: A teacher can only access appointments and images permitted within their school scope.
FR23: The system associates appointments and images with the correct school scope for isolation and export.
FR24: Authorized school personnel can obtain a structured export of submitted appointments and associated image references for downstream chronicle production, using an agreed channel that does not require an admin UI in V1.
FR25: Exported data preserves stable relationships between appointments and their images per the export specification.
FR26: A teacher can see a clear summary of which categories of personal data the product processes about them, where in scope for V1.
FR27: A teacher can correct inaccurate editable profile or appointment metadata where allowed by policy.
FR28: A teacher can invoke the school’s privacy process for erasure or restriction, and the system can honor the outcome for that teacher’s in-app contributions when required.
FR29: The system applies configured retention rules to drafts, submissions, and stored media.
FR30: The system records an audit trail of materially significant actions on appointments and submissions.
FR31: A teacher can access in-product guidance on required appointment fields and acceptable image formats.
FR32: A teacher can see who to contact at the school for privacy or account issues.

### NonFunctional Requirements

NFR1: Core teacher interactions (open appointment list, open draft, save metadata) complete within 2 seconds p95 server round-trip under nominal pilot load.
NFR2: A single-image upload up to configured max size completes without client timeout under stable nominal network conditions.
NFR3: Field-level and file-level validation results are returned within 2 seconds p95 for typical payloads.
NFR4: All browser-to-service communication uses HTTPS with TLS 1.2+.
NFR5: Personal data and stored media objects are protected with encryption at rest using industry-standard algorithms and key management.
NFR6: Sessions use hardened attributes (Secure, HttpOnly, SameSite) or equivalent protections.
NFR7: Authorization enforces school-scoped least privilege and is resistant to cross-tenant and IDOR access patterns.
NFR8: Production logs do not contain secrets or unnecessary personal data, and log access is restricted.
NFR9: GDPR alignment supports retention, auditability of significant actions, and timely response enablement for access/erasure/export processes.
NFR10: Architecture supports full teaching staff concurrent usage at one school during peak submission windows without systemic failure.
NFR11: Core authenticated teacher flows meet WCAG 2.2 AA for agreed scope.
NFR12: Validation and upload failures are perceivable without relying on color alone.
NFR13: Exports use a versioned schema/manifest for downstream compatibility across minor releases.
NFR14: Export documentation specifies secure media reference resolution under school-controlled access without breaking school isolation.

### Additional Requirements

- Starter template requirement: initialize implementation with Nx monorepo + Angular app + Nest API app (`npx create-nx-workspace@latest ...`, then generate `web` and `api` apps).
- Data architecture requirement: PostgreSQL as primary database with Prisma ORM and migration strategy under version control.
- Security architecture requirement: server-side session authentication with hardened cookie policy and CSRF defenses.
- Authorization requirement: RBAC with mandatory school-scope policy guard checks for every protected appointment/media/export access.
- API governance requirement: REST JSON API with OpenAPI contract as the source of truth and uniform error envelope.
- Frontend architecture requirement: Angular Signals + feature facades/services + Reactive Forms (no global store by default).
- Deployment requirement: single-VM/traditional host baseline with explicit migration path to containerized deployment post-MVP.
- Logging/observability requirement: centralized logs, request context IDs, and privacy-safe error handling.
- Data format requirement: API boundary camelCase, DB persistence snake_case, ISO-8601 UTC timestamps.
- Process requirement: shared implementation patterns for naming, response shape, test placement, and retry/error-handling behavior.
- Integration requirement: object storage integration for media and controlled export delivery channel.
- Operational requirement: retention jobs, privacy process support hooks, and runbooks for provisioning and compliance operations.

### UX Design Requirements

UX-DR1: Implement mobile-first responsive layouts for login, appointments list, compose form, upload rows, and confirmation views, with core flows usable at ~360px width without horizontal scroll.
UX-DR2: Implement explicit draft/submitted state surfaces (badge + list/detail indicators + submitted timestamp) across list, detail, and confirmation screens.
UX-DR3: Implement gated submit behavior where submit remains disabled until required metadata and image validations pass, with clear inline readiness summary.
UX-DR4: Implement per-file upload row component with states (queued/uploading/valid/invalid), actionable fix text, and remove/replace actions while preserving valid files.
UX-DR5: Implement inline field-level and file-level validation patterns (no generic-only errors), with clear and calm copy for recoverable failures.
UX-DR6: Implement sticky primary action region on compose for mobile (Save draft / Submit), preserving keyboard usability and thumb reach.
UX-DR7: Implement submitted confirmation screen/card with one-scan closure signals (title, status, timestamp, next actions).
UX-DR8: Implement non-destructive failure UX for network/server issues (retry pathways, draft preservation, no silent data loss).
UX-DR9: Implement Angular Material–based design system foundation with small custom components: `AppointmentStatusBadge`, `ImageUploadRow`, `SubmitReadinessSummary`, and `AppointmentListItem`.
UX-DR10: Implement accessibility baseline for WCAG 2.2 AA on core flows, including visible focus, keyboard navigation, proper labels, non-color-only errors, and live-region updates where needed.
UX-DR11: Implement touch target and spacing standards (minimum ~44x44 targets, 8px spacing rhythm) and responsive behavior across defined breakpoints.
UX-DR12: Implement guidance/privacy touchpoints at the right moments (e.g., upload/submit/help) using concise, plain-language content.
UX-DR13: Implement list empty/loading/read-only submitted state patterns consistent with UX spec.
UX-DR14: Implement visual tone and theming direction (Material Direction A, professional institutional calm) with contrast-safe semantic states.

### FR Coverage Map

FR1: Epic 1 - Teacher can sign in with school credentials.
FR2: Epic 1 - Teacher can sign out of the application.
FR3: Epic 1 - Teacher can operate in authenticated session under policy.
FR4: Epic 1 - Teacher can find access issue/help path on sign-in failure.
FR5: Epic 2 - Teacher can create a draft appointment.
FR6: Epic 2 - Teacher can view own appointments list.
FR7: Epic 2 - Teacher can open/edit own drafts.
FR8: Epic 2 - Submission is gated by required metadata completion.
FR9: Epic 2 - Teacher can assign controlled appointment category/type.
FR10: Epic 2 - Teacher can remove own draft when policy allows.
FR11: Epic 3 - Teacher can attach one or more images to draft.
FR12: Epic 3 - Teacher can remove attached images before submission.
FR13: Epic 3 - Teacher sees per-image validation failure reasons.
FR14: Epic 3 - System blocks submission while invalid image exists.
FR15: Epic 4 - System validates metadata before submission.
FR16: Epic 3 - System validates image format and max size.
FR17: Epic 3 - Teacher can correct validation errors without unnecessary data loss.
FR18: Epic 4 - Teacher can submit appointment when valid.
FR19: Epic 4 - Teacher can distinguish draft and submitted states.
FR20: Epic 4 - Teacher can see submission timestamp.
FR21: Epic 4 - Teacher can view submitted appointment in read-only mode.
FR22: Epic 5 - Teacher access is restricted by school scope.
FR23: Epic 5 - System correctly associates records/media to school scope.
FR24: Epic 5 - Authorized personnel can obtain structured export.
FR25: Epic 5 - Export preserves appointment-image relationships.
FR26: Epic 6 - Teacher sees personal data category summary.
FR27: Epic 6 - Teacher can correct inaccurate editable profile/metadata.
FR28: Epic 6 - Teacher can invoke erasure/restriction process and system honors outcomes.
FR29: Epic 6 - System applies retention rules to drafts/submissions/media.
FR30: Epic 5 - System records audit trail of significant actions.
FR31: Epic 6 - Teacher can access in-product guidance for fields/formats.
FR32: Epic 6 - Teacher can view school privacy/account contact path.

## Epic List

### Epic 1: Foundation, Access, and Teacher Workspace
Teachers can securely sign in, land in a usable responsive workspace, and manage their authenticated session confidently.
**FRs covered:** FR1, FR2, FR3, FR4

### Epic 2: Draft Appointment Creation and Management
Teachers can create, edit, categorize, view, and remove draft appointments with required metadata guidance.
**FRs covered:** FR5, FR6, FR7, FR8, FR9, FR10

### Epic 3: Image Attachment, Validation, and Recovery
Teachers can attach images, see per-file validation outcomes, fix issues, and continue without losing valid progress.
**FRs covered:** FR11, FR12, FR13, FR14, FR16, FR17

### Epic 4: Submission Lifecycle and Read-Only Review
Teachers can submit valid entries, clearly see status transitions, and review submitted items in read-only mode.
**FRs covered:** FR15, FR18, FR19, FR20, FR21

### Epic 5: School Scope Security, Export, and Audit
The system enforces school-scoped authorization, preserves appointment-image relationships, and supports chronicle export with auditability.
**FRs covered:** FR22, FR23, FR24, FR25, FR30

### Epic 6: Privacy, Retention, and In-Product Guidance
Teachers can access privacy/guidance surfaces, correction pathways, and school support contacts while the system enforces retention/privacy outcomes.
**FRs covered:** FR26, FR27, FR28, FR29, FR31, FR32

<!-- Repeat for each epic in epics_list (N = 1, 2, 3...) -->

## Epic 1: Foundation, Access, and Teacher Workspace

Teachers can securely sign in, land in a usable responsive workspace, and manage their authenticated session confidently.

### Story 1.1: Set Up Initial Project from Starter Template

As a developer,  
I want to scaffold the Nx workspace with Angular web and Nest API apps,  
So that all subsequent features are built on the agreed architecture baseline.

**Acceptance Criteria:**

**Given** an empty repository for implementation  
**When** the workspace is initialized with Nx, Angular app, and Nest app  
**Then** the repository contains runnable `web` and `api` applications  
**And** baseline lint/test/build commands run successfully in CI mode

### Story 1.2: Implement Teacher Sign-In

As a teacher,  
I want to sign in with school-provisioned credentials,  
So that I can access my chronicle workspace securely.

**Acceptance Criteria:**

**Given** a valid school teacher account  
**When** credentials are submitted on sign-in  
**Then** the user is authenticated and receives a secure session  
**And** the teacher is redirected to the appointments workspace

### Story 1.3: Implement Sign-Out and Session Lifecycle

As a teacher,  
I want to sign out and have sessions managed safely,  
So that my account stays secure on shared devices.

**Acceptance Criteria:**

**Given** an authenticated session  
**When** the teacher selects sign-out  
**Then** server session is invalidated and protected pages are inaccessible  
**And** reloading a protected route requires authentication

### Story 1.4: Implement Access Failure and Help Path

As a teacher,  
I want clear failure feedback and support guidance when sign-in fails,  
So that I know how to recover access quickly.

**Acceptance Criteria:**

**Given** invalid credentials or a blocked account state  
**When** sign-in fails  
**Then** a non-sensitive error message is shown  
**And** a clear school help/contact path is visible

## Epic 2: Draft Appointment Creation and Management

Teachers can create, edit, categorize, view, and remove draft appointments with required metadata guidance.

### Story 2.1: Create Draft Appointment

As a teacher,  
I want to create a new appointment draft with required fields,  
So that I can capture chronicle content progressively.

**Acceptance Criteria:**

**Given** an authenticated teacher  
**When** the teacher starts a new appointment and saves required metadata  
**Then** a draft appointment is persisted for that teacher and school scope  
**And** required fields are clearly marked in the UI

### Story 2.2: View and Open Appointment List

As a teacher,  
I want to view my appointments and open drafts,  
So that I can continue incomplete work efficiently.

**Acceptance Criteria:**

**Given** existing teacher appointments  
**When** the list page is opened  
**Then** only the teacher's permitted appointments are shown  
**And** selecting a draft opens it for editing

### Story 2.3: Edit Draft Metadata and Category

As a teacher,  
I want to edit draft metadata and assign a controlled category,  
So that entries are accurate and chronicle-ready.

**Acceptance Criteria:**

**Given** a saved draft appointment  
**When** the teacher edits fields and category  
**Then** updates are persisted to the draft  
**And** category options come from the controlled set

### Story 2.4: Enforce Metadata Submission Gate

As a teacher,  
I want submit to be blocked until required metadata is complete,  
So that I can avoid incomplete submissions.

**Acceptance Criteria:**

**Given** a draft with missing required metadata  
**When** submit is attempted  
**Then** submission is blocked  
**And** the UI shows which requirements remain

### Story 2.5: Remove Draft Appointment

As a teacher,  
I want to remove my draft when policy allows,  
So that I can clean up obsolete entries.

**Acceptance Criteria:**

**Given** a teacher-owned draft and policy allowing deletion  
**When** delete is confirmed  
**Then** the draft is removed  
**And** deletion is reflected in the appointment list

## Epic 3: Image Attachment, Validation, and Recovery

Teachers can attach images, see per-file validation outcomes, fix issues, and continue without losing valid progress.

### Story 3.1: Attach Images to Draft

As a teacher,  
I want to attach one or more images to a draft,  
So that the appointment includes supporting media.

**Acceptance Criteria:**

**Given** an editable draft appointment  
**When** the teacher selects image files  
**Then** files are attached to the draft context  
**And** upload/attachment status is shown per file

### Story 3.2: Validate Image Type and Size

As a teacher,  
I want invalid image files to be detected with clear reasons,  
So that I can fix issues before submission.

**Acceptance Criteria:**

**Given** attached files with mixed validity  
**When** validation is executed  
**Then** invalid files are flagged with specific reason text  
**And** valid files remain accepted without reset

### Story 3.3: Remove/Replace Invalid Images

As a teacher,  
I want to remove or replace failing images,  
So that I can recover without restarting the draft.

**Acceptance Criteria:**

**Given** a draft containing invalid images  
**When** the teacher removes or replaces failing files  
**Then** file state updates immediately  
**And** previously valid fields/files remain intact

### Story 3.4: Block Submit on Image Validation Failures

As a teacher,  
I want submit blocked while any image remains invalid,  
So that submissions cannot include non-compliant media.

**Acceptance Criteria:**

**Given** a draft with at least one invalid image  
**When** submit is attempted  
**Then** submission is rejected  
**And** the blocking condition is clearly presented in readiness summary

## Epic 4: Submission Lifecycle and Read-Only Review

Teachers can submit valid entries, clearly see status transitions, and review submitted items in read-only mode.

### Story 4.1: Submit Valid Appointment

As a teacher,  
I want to submit a fully valid appointment,  
So that my contribution enters downstream chronicle processing.

**Acceptance Criteria:**

**Given** a draft with valid metadata and images  
**When** the teacher submits  
**Then** appointment status changes to submitted  
**And** submission timestamp is stored and displayed

### Story 4.2: Display Draft vs Submitted States

As a teacher,  
I want clear status indicators in list and detail views,  
So that I always understand entry state.

**Acceptance Criteria:**

**Given** appointments in mixed states  
**When** list/detail pages render  
**Then** draft and submitted states are visually and textually distinct  
**And** status representation does not rely on color alone

### Story 4.3: Enforce Read-Only Submitted View

As a teacher,  
I want submitted records to be read-only,  
So that submission integrity is preserved.

**Acceptance Criteria:**

**Given** a submitted appointment  
**When** the teacher opens details  
**Then** fields and media are shown in read-only mode  
**And** edit actions are unavailable per policy

## Epic 5: School Scope Security, Export, and Audit

The system enforces school-scoped authorization, preserves appointment-image relationships, and supports chronicle export with auditability.

### Story 5.1: Enforce School-Scoped Authorization

As a platform operator,  
I want every protected data access constrained by school scope,  
So that cross-tenant access is prevented.

**Acceptance Criteria:**

**Given** multiple school datasets  
**When** appointment/media endpoints are accessed  
**Then** only records in requester's allowed school scope are accessible  
**And** unauthorized scope access attempts are denied and logged

### Story 5.2: Persist Correct School Associations

As a platform operator,  
I want appointments and media consistently associated to school scope,  
So that export and access controls remain correct.

**Acceptance Criteria:**

**Given** draft creation and media attachment flows  
**When** records are persisted  
**Then** school association fields are always populated correctly  
**And** relational integrity checks prevent orphaned cross-scope links

### Story 5.3: Generate Structured Export

As authorized school personnel,  
I want a structured export of submitted appointments and image references,  
So that downstream chronicle assembly can proceed efficiently.

**Acceptance Criteria:**

**Given** submitted appointments in a school scope  
**When** export is requested through approved channel  
**Then** export payload is produced in versioned schema format  
**And** only authorized/scope-permitted records are included

### Story 5.4: Preserve Appointment-Image Referential Integrity in Export

As downstream chronicle assembler,  
I want stable appointment-image linkage in exports,  
So that imported data remains coherent.

**Acceptance Criteria:**

**Given** exported appointment and media metadata  
**When** relationships are inspected  
**Then** each image reference resolves to its parent appointment deterministically  
**And** schema validation passes for relationship fields

### Story 5.5: Record Audit Trail for Significant Actions

As a compliance stakeholder,  
I want significant actions audited,  
So that accountability and investigations are possible.

**Acceptance Criteria:**

**Given** significant actions (create/edit/submit/export/security denials)  
**When** actions occur  
**Then** audit events are recorded with actor, action, target, and timestamp  
**And** logs avoid secrets/unnecessary personal data

## Epic 6: Privacy, Retention, and In-Product Guidance

Teachers can access privacy/guidance surfaces, correction pathways, and school support contacts while the system enforces retention/privacy outcomes.

### Story 6.1: Show Privacy Data Category Summary

As a teacher,  
I want to see a clear summary of personal data categories processed,  
So that I understand privacy implications.

**Acceptance Criteria:**

**Given** an authenticated teacher  
**When** privacy information is opened  
**Then** data categories are presented in clear language  
**And** content is accessible and responsive

### Story 6.2: Enable Editable Profile/Metadata Corrections

As a teacher,  
I want to correct inaccurate editable profile or appointment metadata,  
So that my data remains accurate.

**Acceptance Criteria:**

**Given** editable fields permitted by policy  
**When** teacher submits corrections  
**Then** updates are validated and saved  
**And** changes are reflected in subsequent views

### Story 6.3: Support Erasure/Restriction Process Invocation Path

As a teacher,  
I want a clear way to invoke school privacy processes for erasure/restriction,  
So that rights can be exercised through approved channels.

**Acceptance Criteria:**

**Given** privacy/help surface  
**When** teacher requests erasure/restriction path  
**Then** school-designated contact/process guidance is shown  
**And** request initiation path is auditable where applicable

### Story 6.4: Apply Retention Rules to Drafts, Submissions, and Media

As a compliance stakeholder,  
I want configured retention policies enforced,  
So that data is not kept beyond policy.

**Acceptance Criteria:**

**Given** retention configuration for records/media  
**When** retention processing runs  
**Then** eligible records are handled per policy  
**And** retention actions are auditable

### Story 6.5: Provide In-Product Guidance for Required Fields and Formats

As a teacher,  
I want clear guidance on required fields and accepted image formats,  
So that I can submit valid content first time.

**Acceptance Criteria:**

**Given** compose and upload surfaces  
**When** teacher interacts with fields/files  
**Then** required field and acceptable format guidance is visible contextually  
**And** guidance language is concise and actionable

### Story 6.6: Surface School Privacy/Account Contact Information

As a teacher,  
I want to easily find who to contact for privacy or account issues,  
So that I can resolve access/compliance concerns quickly.

**Acceptance Criteria:**

**Given** support/help paths in app  
**When** teacher seeks support details  
**Then** school-specific contact information is available and current  
**And** path is reachable from relevant auth/privacy contexts
