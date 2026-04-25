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
FR33: A teacher can view all of their appointments in one unified list with the most important fields visible at a glance.
FR34: A teacher can search and filter appointments in the unified list view.
FR35: A teacher can open any appointment from the list in a modal and edit all supported fields.
FR36: When a submitted appointment is edited, the system shows a "last edited after submit" indicator.
FR37: A teacher can manage and select participants from a school-wide contacts list (teachers, parents, staff, partners) with contact details.
FR38: A teacher can capture chronicle-relevant special events as an appointment type, including optional media/documents.
FR39: Authorized users can generate a chronicle draft as a Word document (.docx) from manually selected appointments using a fixed layout.
FR40: Each appointment supports up to 5 uploaded images, and up to 3 images can be marked as printable for chronicle output.

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
FR33: Epic M2.1 - Teacher sees all appointments in one unified list.
FR34: Epic M2.1 - Teacher can search and filter unified appointment list.
FR35: Epic M2.1 - Teacher can open/edit appointments in modal UI.
FR36: Epic M2.1 - System shows last-edited-after-submit indicator.
FR37: Epic M2.2 - Teacher can use school-wide contacts as participants.
FR38: Epic M2.2 - Teacher can store special events as appointment type with optional media.
FR39: Epic M2.3 - System can export manually selected appointments to chronicle .docx.
FR40: Epic M2.3 - System enforces image upload/printable limits per appointment.

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

### Epic M2.1: Unified Appointment Workspace and Modal Editing
Teachers can work from a single appointment list with search/filter tools and edit any appointment from a modal, including submitted items with a clear post-submit edit indicator.
**FRs covered:** FR33, FR34, FR35, FR36

### Epic M2.2: Contacts Directory, Participants, and Special Events
Teachers can maintain and reuse school-wide contacts as appointment participants and store chronicle-worthy special events in the same operational flow.
**FRs covered:** FR37, FR38

### Epic M2.3: Chronicle Generation v1 and Image Policy
Authorized users can export manually selected appointments to a fixed-layout Word chronicle draft while respecting image upload and printable limits.
**FRs covered:** FR39, FR40

### Epic M2.4: Visual Refresh and Accessible Color System
The product gains a light visual refresh with a neutral, accessible color system that improves scanability without changing core interaction patterns.
**FRs covered:** UX-DR14 (extension)

<!-- Repeat for each epic in epics_list (N = 1, 2, 3...) -->

## Epic 1: Foundation, Access, and Teacher Workspace

Teachers can securely sign in, land in a usable responsive workspace, and manage their authenticated session confidently.

### Story 1.1: Set Up Initial Project from Starter Template

As a developer,  
I want to scaffold the Nx workspace with Angular web and Nest API apps,  
So that all subsequent features are built on the agreed architecture baseline.

**Implements:** FR1 (foundation enablement), Architecture starter-template requirement
**NFR Alignment:** NFR4, NFR8

**Acceptance Criteria:**

**Given** an empty repository for implementation  
**When** the workspace is initialized with Nx, Angular app, and Nest app  
**Then** the repository contains runnable `web` and `api` applications  
**And** baseline lint/test/build commands run successfully in CI mode

### Story 1.2: Implement Teacher Sign-In

As a teacher,  
I want to sign in with school-provisioned credentials,  
So that I can access my chronicle workspace securely.

**Implements:** FR1
**NFR Alignment:** NFR4, NFR6, NFR7

**Acceptance Criteria:**

**Given** a valid school teacher account  
**When** credentials are submitted on sign-in  
**Then** the user is authenticated and receives a secure session  
**And** the teacher is redirected to the appointments workspace  
**And** invalid credentials return non-sensitive error feedback without exposing account existence

### Story 1.3: Implement Sign-Out and Session Lifecycle

As a teacher,  
I want to sign out and have sessions managed safely,  
So that my account stays secure on shared devices.

**Implements:** FR2, FR3
**NFR Alignment:** NFR6, NFR7

**Acceptance Criteria:**

**Given** an authenticated session  
**When** the teacher selects sign-out  
**Then** server session is invalidated and protected pages are inaccessible  
**And** reloading a protected route requires authentication  
**And** expired/invalid sessions are handled consistently with re-authentication flow

### Story 1.4: Implement Access Failure and Help Path

As a teacher,  
I want clear failure feedback and support guidance when sign-in fails,  
So that I know how to recover access quickly.

**Implements:** FR4, FR32
**NFR Alignment:** NFR11

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

**Implements:** FR5, FR8
**NFR Alignment:** NFR1, NFR11

**Acceptance Criteria:**

**Given** an authenticated teacher  
**When** the teacher starts a new appointment and saves required metadata  
**Then** a draft appointment is persisted for that teacher and school scope  
**And** required fields are clearly marked in the UI

### Story 2.2: View and Open Appointment List

As a teacher,  
I want to view my appointments and open drafts,  
So that I can continue incomplete work efficiently.

**Implements:** FR6, FR7
**NFR Alignment:** NFR1, NFR7

**Acceptance Criteria:**

**Given** existing teacher appointments  
**When** the list page is opened  
**Then** only the teacher's permitted appointments are shown  
**And** selecting a draft opens it for editing

### Story 2.3: Edit Draft Metadata and Category

As a teacher,  
I want to edit draft metadata and assign a controlled category,  
So that entries are accurate and chronicle-ready.

**Implements:** FR7, FR9, FR15
**NFR Alignment:** NFR1, NFR11

**Acceptance Criteria:**

**Given** a saved draft appointment  
**When** the teacher edits fields (including appointment date) and category  
**Then** updates are persisted to the draft  
**And** appointment date is required and stored in `YYYY-MM-DD` format  
**And** category options come from the controlled set

### Story 2.4: Enforce Metadata Submission Gate

As a teacher,  
I want submit to be blocked until required metadata is complete,  
So that I can avoid incomplete submissions.

**Implements:** FR8, FR15
**NFR Alignment:** NFR3, NFR11

**Acceptance Criteria:**

**Given** a draft with missing required metadata  
**When** submit is attempted  
**Then** submission is blocked  
**And** the UI shows which requirements remain

### Story 2.5: Remove Draft Appointment

As a teacher,  
I want to remove my draft when policy allows,  
So that I can clean up obsolete entries.

**Implements:** FR10
**NFR Alignment:** NFR7

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

**Implements:** FR11
**NFR Alignment:** NFR2, NFR11

**Acceptance Criteria:**

**Given** an editable draft appointment  
**When** the teacher selects image files  
**Then** files are attached to the draft context  
**And** upload/attachment status is shown per file

### Story 3.2: Validate Image Type and Size

As a teacher,  
I want invalid image files to be detected with clear reasons,  
So that I can fix issues before submission.

**Implements:** FR13, FR16
**NFR Alignment:** NFR2, NFR3, NFR12

**Acceptance Criteria:**

**Given** attached files with mixed validity  
**When** validation is executed  
**Then** invalid files are flagged with specific reason text  
**And** valid files remain accepted without reset  
**And** unsupported or malformed files are rejected server-side even if client checks are bypassed

### Story 3.3: Remove/Replace Invalid Images

As a teacher,  
I want to remove or replace failing images,  
So that I can recover without restarting the draft.

**Implements:** FR12, FR17
**NFR Alignment:** NFR11, NFR12

**Acceptance Criteria:**

**Given** a draft containing invalid images  
**When** the teacher removes or replaces failing files  
**Then** file state updates immediately  
**And** previously valid fields/files remain intact

### Story 3.4: Block Submit on Image Validation Failures

As a teacher,  
I want submit blocked while any image remains invalid,  
So that submissions cannot include non-compliant media.

**Implements:** FR14
**NFR Alignment:** NFR3, NFR12

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

**Implements:** FR18, FR20
**NFR Alignment:** NFR3, NFR7

**Acceptance Criteria:**

**Given** a draft with valid metadata and images  
**When** the teacher submits  
**Then** appointment status changes to submitted  
**And** submission timestamp is stored and displayed  
**And** submission is rejected with clear actionable feedback if validation or authorization fails

### Story 4.2: Display Draft vs Submitted States

As a teacher,  
I want clear status indicators in list and detail views,  
So that I always understand entry state.

**Implements:** FR19, FR20
**NFR Alignment:** NFR11, NFR12

**Acceptance Criteria:**

**Given** appointments in mixed states  
**When** list/detail pages render  
**Then** draft and submitted states are visually and textually distinct  
**And** status representation does not rely on color alone

### Story 4.3: Enforce Read-Only Submitted View

As a teacher,  
I want submitted records to be read-only,  
So that submission integrity is preserved.

**Implements:** FR21
**NFR Alignment:** NFR7

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

**Implements:** FR22
**NFR Alignment:** NFR7, NFR8

**Acceptance Criteria:**

**Given** multiple school datasets  
**When** appointment/media endpoints are accessed  
**Then** only records in requester's allowed school scope are accessible  
**And** unauthorized scope access attempts are denied and logged  
**And** IDOR-style direct identifier access outside scope returns forbidden/hidden responses consistently

### Story 5.2: Persist Correct School Associations

As a platform operator,  
I want appointments and media consistently associated to school scope,  
So that export and access controls remain correct.

**Implements:** FR23
**NFR Alignment:** NFR7, NFR13

**Acceptance Criteria:**

**Given** draft creation and media attachment flows  
**When** records are persisted  
**Then** school association fields are always populated correctly  
**And** relational integrity checks prevent orphaned cross-scope links

### Story 5.3: Generate Structured Export

As authorized school personnel,  
I want a structured export of submitted appointments and image references,  
So that downstream chronicle assembly can proceed efficiently.

**Implements:** FR24
**NFR Alignment:** NFR7, NFR13, NFR14

**Acceptance Criteria:**

**Given** submitted appointments in a school scope  
**When** export is requested through approved channel  
**Then** export payload is produced in versioned schema format  
**And** only authorized/scope-permitted records are included  
**And** unauthorized export requests are denied with auditable security events

### Story 5.4: Preserve Appointment-Image Referential Integrity in Export

As downstream chronicle assembler,  
I want stable appointment-image linkage in exports,  
So that imported data remains coherent.

**Implements:** FR25
**NFR Alignment:** NFR13, NFR14

**Acceptance Criteria:**

**Given** exported appointment and media metadata  
**When** relationships are inspected  
**Then** each image reference resolves to its parent appointment deterministically  
**And** schema validation passes for relationship fields

### Story 5.5: Record Audit Trail for Significant Actions

As a compliance stakeholder,  
I want significant actions audited,  
So that accountability and investigations are possible.

**Implements:** FR30
**NFR Alignment:** NFR8, NFR9

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

**Implements:** FR26
**NFR Alignment:** NFR9, NFR11

**Acceptance Criteria:**

**Given** an authenticated teacher  
**When** privacy information is opened  
**Then** data categories are presented in clear language  
**And** content is accessible and responsive

### Story 6.2: Enable Editable Profile/Metadata Corrections

As a teacher,  
I want to correct inaccurate editable profile or appointment metadata,  
So that my data remains accurate.

**Implements:** FR27
**NFR Alignment:** NFR9

**Acceptance Criteria:**

**Given** editable fields permitted by policy  
**When** teacher submits corrections  
**Then** updates are validated and saved  
**And** changes are reflected in subsequent views

### Story 6.3: Support Erasure/Restriction Process Invocation Path

As a teacher,  
I want a clear way to invoke school privacy processes for erasure/restriction,  
So that rights can be exercised through approved channels.

**Implements:** FR28, FR32
**NFR Alignment:** NFR9, NFR11

**Acceptance Criteria:**

**Given** privacy/help surface  
**When** teacher requests erasure/restriction path  
**Then** school-designated contact/process guidance is shown  
**And** request initiation path is auditable where applicable

### Story 6.4: Apply Retention Rules to Drafts, Submissions, and Media

As a compliance stakeholder,  
I want configured retention policies enforced,  
So that data is not kept beyond policy.

**Implements:** FR29
**NFR Alignment:** NFR9

**Acceptance Criteria:**

**Given** retention configuration for records/media  
**When** retention processing runs  
**Then** eligible records are handled per policy  
**And** retention actions are auditable  
**And** failed retention actions are retried or flagged to operations without silent data-loss side effects

### Story 6.5: Provide In-Product Guidance for Required Fields and Formats

As a teacher,  
I want clear guidance on required fields and accepted image formats,  
So that I can submit valid content first time.

**Implements:** FR31
**NFR Alignment:** NFR11, NFR12

**Acceptance Criteria:**

**Given** compose and upload surfaces  
**When** teacher interacts with fields/files  
**Then** required field and acceptable format guidance is visible contextually  
**And** guidance language is concise and actionable

### Story 6.6: Surface School Privacy/Account Contact Information

As a teacher,  
I want to easily find who to contact for privacy or account issues,  
So that I can resolve access/compliance concerns quickly.

**Implements:** FR32
**NFR Alignment:** NFR11

**Acceptance Criteria:**

**Given** support/help paths in app  
**When** teacher seeks support details  
**Then** school-specific contact information is available and current  
**And** path is reachable from relevant auth/privacy contexts

## Pitch UX Epic Track (Sales Readiness)

This optional track is focused on teacher-facing demo quality for sales conversations. It is intentionally parallel to Epics 1-6 and can be delivered without full completion of all prior epics.

### Epic PX1: Teacher Dashboard Navigation and Menu IA

Teachers can orient quickly via a left-sidebar dashboard and focused menu structure instead of overloaded single-page controls.

### Story PX1.1: Introduce Left Sidebar Dashboard Shell

As a teacher,  
I want a persistent sidebar menu,  
So that I can navigate core tasks quickly.

**Acceptance Criteria:**

**Given** I am signed in  
**When** I open the teacher workspace  
**Then** I see a left sidebar with clear menu entries (Dashboard, Appointments, Drafts, Submitted, Privacy, Help)  
**And** the selected menu item is visually clear and keyboard accessible

### Story PX1.2: Create Teacher Dashboard Home View

As a teacher,  
I want a simple dashboard home view,  
So that I can understand what needs attention first.

**Acceptance Criteria:**

**Given** I open Dashboard  
**When** the page loads  
**Then** I see summary cards for draft count, submitted count, and needs-attention items  
**And** each card can navigate to a relevant filtered list view

### Story PX1.3: Reduce Workspace Cognitive Load via Section Re-layout

As a teacher,  
I want the workspace split into clear zones,  
So that editing and list navigation are not overwhelming.

**Acceptance Criteria:**

**Given** I am in Appointments  
**When** the page renders  
**Then** navigation, filters, list, and detail/editor are visually separated  
**And** only context-relevant controls are shown by default

### Epic PX2: Dedicated Filtering and Saved Views

Teachers can use a dedicated filter list to find appointments fast across larger datasets.

### Story PX2.1: Build Dedicated Filter Panel

As a teacher,  
I want a dedicated filter panel,  
So that I can narrow appointment lists without scanning everything.

**Acceptance Criteria:**

**Given** the appointments list  
**When** I open filters  
**Then** I can filter by category, status, date range, has images, and draft/submitted  
**And** filter state is reflected in the list immediately

### Story PX2.2: Add New Optional Metadata Filters

As a teacher,  
I want to filter by class/grade, guardian name, and location,  
So that I can quickly find relevant appointments.

**Acceptance Criteria:**

**Given** appointments include optional metadata  
**When** I set class/grade, guardian name, or location filters  
**Then** list results update correctly  
**And** empty states clearly explain no-match outcomes

### Story PX2.3: Add Active Filter Chips and Saved Presets

As a teacher,  
I want visible active filters and saved views,  
So that repeated workflows are fast and clear.

**Acceptance Criteria:**

**Given** one or more filters are active  
**When** I view results  
**Then** active filters are shown as removable chips  
**And** I can clear all filters in one action  
**And** I can load at least two saved presets (for example, Needs Completion and Submitted This Week)

### Epic PX3: Appointment Data Enrichment for Teacher UX

Teachers can capture additional optional context to improve organization and filtering without increasing submission friction.

### Story PX3.1: Add Optional Fields to Appointment Model

As a teacher,  
I want additional optional fields on appointments,  
So that I can record useful classroom context.

**Acceptance Criteria:**

**Given** create/edit draft flow  
**When** I edit an appointment  
**Then** I can enter class/grade, guardian name, and location  
**And** existing appointments without these fields remain valid

### Story PX3.2: Show Optional Metadata in List and Detail Views

As a teacher,  
I want optional metadata visible where I work,  
So that I can recognize appointments faster.

**Acceptance Criteria:**

**Given** appointments contain optional metadata  
**When** I view list and detail screens  
**Then** class/grade, guardian name, and location are displayed as secondary metadata  
**And** display stays readable and not overloaded

### Story PX3.3: Keep Optional Metadata Outside Submit Gate

As a teacher,  
I want optional fields not to block submission,  
So that workflow speed is preserved.

**Acceptance Criteria:**

**Given** optional metadata is empty  
**When** I submit a draft with required existing fields complete  
**Then** submission behavior remains unchanged  
**And** no new blocking validation is introduced for optional metadata

### Epic PX4: Demo Reliability and Replayability

The team can run a deterministic teacher demo repeatedly during sales conversations.

### Story PX4.1: Add Demo Data Seed/Reset Flow

As a sales presenter,  
I want predictable sample data and reset behavior,  
So that each demo starts clean and consistent.

**Acceptance Criteria:**

**Given** demo mode is enabled  
**When** I reset demo data  
**Then** a known teacher dataset is restored  
**And** the core pitch journey works without manual cleanup

### Story PX4.2: Define 7-Minute Teacher Demo Path

As a sales presenter,  
I want a scripted in-app teacher flow,  
So that value is communicated quickly and consistently.

**Acceptance Criteria:**

**Given** demo mode  
**When** I follow the scripted path  
**Then** I can show navigation, filtering, draft work, and submission readiness in under 7 minutes  
**And** each step has a clear value message

## Release MVP 2 Epic Track

This track captures post-MVP feedback and defines new product capabilities for operational usability, participant management, chronicle output, and visual polish. It is planning-only and does not imply implementation has started.

### Epic M2.1: Unified Appointment Workspace and Modal Editing

Teachers can manage all of their appointments in one place with fast retrieval and direct modal editing.

### Story M2.1: Build Unified "All Appointments" List View

As a teacher,  
I want one list containing all my appointments,  
So that I do not need to switch between separate views to find my records.

**Acceptance Criteria:**

**Given** I am signed in  
**When** I open the appointments workspace  
**Then** I see one list containing my draft and submitted appointments  
**And** each row shows key fields (title, date, type/category, status, last update)

### Story M2.2: Add Search and Filter Controls to Unified List

As a teacher,  
I want to search and filter appointments,  
So that I can quickly locate the exact record I need.

**Acceptance Criteria:**

**Given** the unified list view  
**When** I use search and filters (status, date range, category/type, optional metadata)  
**Then** the list updates consistently and quickly  
**And** empty results show a clear no-match state with reset actions

### Story M2.3: Open Appointment in Modal Editor from List

As a teacher,  
I want to open any appointment in a modal editor from the list,  
So that I can review and update fields without losing list context.

**Acceptance Criteria:**

**Given** I click an appointment row  
**When** the modal opens  
**Then** all supported appointment fields are shown in editable form  
**And** saving updates both modal data and list row state without full page navigation

### Story M2.4: Enable Submitted Editing with Post-Submit Indicator

As a teacher,  
I want to edit submitted appointments and still see that they were changed after submission,  
So that corrections are possible while chronology remains transparent.

**Acceptance Criteria:**

**Given** a submitted appointment  
**When** I save a change in the modal  
**Then** the change is persisted  
**And** the appointment shows a "last edited after submit" indicator with timestamp and editor identity  
**And** no full version-history workflow is required in MVP 2

### Epic M2.2: Contacts Directory, Participants, and Special Events

Teachers can assign participants from a shared school contacts directory and record chronicle-worthy special events in appointment workflows.

### Story M2.5: Create School-Wide Contacts Directory

As a teacher,  
I want a reusable contacts directory for school participants,  
So that I can quickly attach the right people to appointments.

**Acceptance Criteria:**

**Given** contact management access  
**When** I create or edit a contact  
**Then** required fields include name, role, email, and phone  
**And** contact types support teachers, parents, staff, and partner participants

### Story M2.6: Assign Participants to Appointments from Contacts

As a teacher,  
I want to link contacts to appointments as participants,  
So that events/trips reflect who is involved.

**Acceptance Criteria:**

**Given** an appointment editor modal  
**When** I add participants from the contacts list  
**Then** selected contacts are linked to the appointment  
**And** participant details are visible in list/detail contexts as secondary metadata

### Story M2.7: Add Special Event Appointment Type with Optional Media

As a teacher,  
I want to record special events (e.g., retirements, town changes) as a dedicated appointment type,  
So that chronicle-relevant milestones are captured consistently.

**Acceptance Criteria:**

**Given** appointment creation/editing  
**When** I select "Special Event" type  
**Then** I can capture title, date, category, and narrative description  
**And** optional images/documents can be attached  
**And** the event is eligible for chronicle export selection

### Epic M2.3: Chronicle Generation v1 and Image Policy

Authorized users can generate first-version chronicle documents from selected appointments with deterministic layout behavior.

### Story M2.8: Enforce Image Upload and Printable Limits

As a teacher,  
I want clear image limits per appointment,  
So that chronicle output remains constrained and predictable.

**Acceptance Criteria:**

**Given** appointment media upload  
**When** I manage images  
**Then** at most 5 images can be uploaded  
**And** at most 3 images can be marked printable  
**And** printable selection is manual and visible before export

### Story M2.9: Generate Chronicle .docx from Manual Appointment Selection

As an authorized user,  
I want to select appointments manually and export them to Word,  
So that I can build a first chronicle draft with editorial control.

**Acceptance Criteria:**

**Given** export access  
**When** I manually select appointments and start export  
**Then** the system generates a `.docx` file  
**And** export content includes selected appointments, narrative text, participants, and printable images

### Story M2.10: Apply Fixed Chronicle Layout Independent of Image Count

As an editor,  
I want consistent layout in every generated chronicle section,  
So that output remains predictable even with varying media counts.

**Acceptance Criteria:**

**Given** generated chronicle sections  
**When** appointments have 0, 1, 2, or 3 printable images  
**Then** section structure and typography remain fixed  
**And** image slots follow deterministic placement rules without layout drift

### Epic M2.4: Visual Refresh and Accessible Color System

The interface gains a light, accessibility-first visual polish with better color hierarchy and readability.

### Story M2.11: Introduce Neutral Accessible Color Tokens

As a user,  
I want clearer color semantics that remain accessible,  
So that I can scan statuses and actions quickly without visual strain.

**Acceptance Criteria:**

**Given** the design token/theme layer  
**When** colors are refreshed  
**Then** a neutral palette with accessible contrast is applied  
**And** semantic usage for status, emphasis, and feedback is consistent across core screens

### Story M2.12: Apply Light Visual Refresh to Core Views

As a teacher,  
I want a more modern and colorful (but calm) interface,  
So that daily workflows feel clearer and more engaging.

**Acceptance Criteria:**

**Given** login, list, modal, filter, and summary views  
**When** the refresh is applied  
**Then** spacing, hierarchy, accent usage, and component styling are visibly improved  
**And** interaction patterns remain familiar (no major structural redesign)

## Release UX MVP 3 Epic Track

This track was generated for `release-ux-mvp-3` using BMAD create-epics-and-stories workflow inputs from PRD, Architecture, UX specification, and release-specific CRUD scope requirements.

### Release UX MVP 3 Requirements Inventory Addendum

UX3-FR1: Teachers can always find bottom CRUD actions (`Create`, `Save`, `Delete`) in appointment and contact CRUD editors.
UX3-FR2: CRUD actions follow deterministic mode rules (new vs edit) and prevent invalid actions.
UX3-FR3: Teachers can delete contacts from the contacts CRUD editor with confirmation and immediate list consistency.
UX3-FR4: Colorful visual enhancements improve action discoverability without violating accessibility.
UX3-FR5: Shared action-bar behavior remains consistent across all appointment/contact CRUD editors.

UX3-NFR1: Bottom action controls remain keyboard accessible and touch-friendly (minimum 44x44 targets).
UX3-NFR2: Button color combinations maintain WCAG-aligned contrast and non-color-only state communication.
UX3-NFR3: CRUD action state transitions (idle/loading/success/error/disabled) are consistent and testable across surfaces.

### Release UX MVP 3 FR Coverage Map

UX3-FR1: Epic UX3.1 - Shared CRUD action bar and behavior contract.
UX3-FR2: Epic UX3.1 - Mode-aware action enablement and visibility rules.
UX3-FR3: Epic UX3.2 - Contact delete flow implementation.
UX3-FR4: Epic UX3.3 - Colorful action system and visual polish.
UX3-FR5: Epic UX3.1, Epic UX3.3 - Shared component adoption and verification.

### Release UX MVP 3 Epic List

### Epic UX3.1: Unified Bottom CRUD Actions for Appointment and Contact Editors
Teachers can reliably perform create/save/delete from a consistent bottom action bar in CRUD editors.
**FRs covered:** UX3-FR1, UX3-FR2, UX3-FR5

### Epic UX3.2: Complete Contact Delete Capability
Teachers can delete contacts directly in the contact CRUD editor with safe confirmation and full frontend integration.
**FRs covered:** UX3-FR3

### Epic UX3.3: Colorful and Accessible CRUD Visual Upgrade
Teachers experience a vibrant but professional CRUD UI with clear action hierarchy and accessibility-safe states.
**FRs covered:** UX3-FR4, UX3-FR5

## Epic UX3.1: Unified Bottom CRUD Actions for Appointment and Contact Editors

Teachers can reliably perform create/save/delete from a consistent bottom action bar in CRUD editors.

### Story UX3.1: Define Shared Bottom CRUD Action Bar Contract

As a teacher,  
I want the same action layout at the bottom of every appointment/contact CRUD editor,  
So that I always know where to create, save, or delete records.

**Acceptance Criteria:**

**Given** an appointment or contact CRUD editor is open  
**When** the bottom action region renders  
**Then** it uses one shared action-bar pattern with `Create`, `Save`, and `Delete` controls  
**And** labels, ordering, spacing, and loading/disabled states are consistent across both surfaces

### Story UX3.2: Enforce Mode-Aware Create/Save/Delete Rules

As a teacher,  
I want CRUD actions to match whether I am creating a new record or editing an existing one,  
So that I cannot trigger the wrong action.

**Acceptance Criteria:**

**Given** a CRUD editor is in create mode  
**When** bottom actions are shown  
**Then** `Create` is available and `Save`/`Delete` are not actionable  
**And** in edit mode `Save` and `Delete` are available while `Create` is not actionable

### Story UX3.3: Apply Shared Action Bar to Appointment Editor

As a teacher,  
I want appointment editing to use the same bottom CRUD controls as other editors,  
So that behavior feels predictable throughout the app.

**Acceptance Criteria:**

**Given** I open appointment create or edit modal/editor  
**When** I use bottom actions  
**Then** `Create` creates a new appointment, `Save` updates an existing appointment, and `Delete` removes a deletable appointment  
**And** all action outcomes provide clear success/error feedback without losing unrelated form data

## Epic UX3.2: Complete Contact Delete Capability

Teachers can delete contacts directly in the contact CRUD editor with safe confirmation and full frontend integration.

### Story UX3.4: Add Contact Delete API Method in Frontend Service

As a developer,  
I want a dedicated frontend API method for deleting contacts,  
So that the contacts editor can invoke delete through the same service abstraction as create/save.

**Acceptance Criteria:**

**Given** the frontend service layer for contacts  
**When** delete is requested for a contact id  
**Then** a typed delete method calls the backend delete endpoint and returns actionable success/failure states  
**And** error responses are surfaced in a consistent app error pattern

### Story UX3.5: Wire Contact Delete to Bottom Delete Action

As a teacher,  
I want to delete an existing contact from the bottom action bar,  
So that I can maintain a clean participants directory.

**Acceptance Criteria:**

**Given** a contact is opened in edit mode  
**When** I click `Delete` and confirm  
**Then** the contact is removed and the contacts list refreshes consistently  
**And** canceling confirmation leaves the contact unchanged

## Epic UX3.3: Colorful and Accessible CRUD Visual Upgrade

Teachers experience a vibrant but professional CRUD UI with clear action hierarchy and accessibility-safe states.

### Story UX3.6: Introduce Colorful CRUD Action Tokens and States

As a teacher,  
I want action buttons to be visually distinct and engaging,  
So that primary actions stand out while destructive actions remain clear.

**Acceptance Criteria:**

**Given** appointment/contact CRUD editors  
**When** colorful theme updates are applied  
**Then** `Create` and `Save` use consistent prominent styles and `Delete` uses a clear destructive style  
**And** contrast and focus indicators remain accessibility-compliant

### Story UX3.7: Verify Cross-Screen CRUD Action Consistency with Tests

As a product owner,  
I want automated checks for bottom CRUD action behavior,  
So that regressions are caught quickly.

**Acceptance Criteria:**

**Given** automated frontend/e2e coverage for CRUD editors  
**When** tests run  
**Then** they verify correct visibility/enabled states for `Create`, `Save`, and `Delete` in create and edit modes  
**And** they verify successful and failing save/delete flows show expected feedback

## Release Chronicle Markdown Epic Track

This track was generated for `create-chronicle-md-file` using brainstorm inputs plus PRD/Architecture constraints.

### Chronicle Markdown Requirements Inventory Addendum

CMD-FR1: Users can export chronicle data into a single `.md` file from the existing export area.  
CMD-FR2: Exported markdown always contains explicit `contact persons` and `appointments` sections.  
CMD-FR3: Markdown output is deterministic in structure and entry ordering for the same input selection.  
CMD-FR4: Media representation in markdown includes filename and metadata only (no binary/base64 payload).  
CMD-FR5: Export errors are actionable and preserve selection state; `.docx` export remains unaffected.

CMD-NFR1: Markdown is UTF-8 plain text compatible with common markdown viewers.  
CMD-NFR2: Export controls remain keyboard-accessible with clear labels and feedback states.  
CMD-NFR3: Existing `.docx` path has no behavioral regression.

### Chronicle Markdown FR Coverage Map

CMD-FR1: Epic CMD.1 - UI entry point and command wiring.  
CMD-FR2: Epic CMD.2 - Markdown schema and section serializer.  
CMD-FR3: Epic CMD.2 - Deterministic ordering and stable output contract.  
CMD-FR4: Epic CMD.2 - Media filename/metadata-only serialization rules.  
CMD-FR5: Epic CMD.1, Epic CMD.3 - Feedback/error handling and regression verification.

### Chronicle Markdown Epic List

### Epic CMD.1: Add Markdown Export Entry Point and Flow
Users can trigger chronicle markdown export from the existing export area with clear success/failure feedback.
**FRs covered:** CMD-FR1, CMD-FR5

### Epic CMD.2: Build Deterministic Markdown Chronicle Serializer
Exported markdown uses a stable contract with explicit `contact persons` and `appointments` sections, including media filename/metadata only.
**FRs covered:** CMD-FR2, CMD-FR3, CMD-FR4

### Epic CMD.3: Verify Markdown Export Reliability and Non-Regression
Automated coverage ensures markdown export works end-to-end and does not break `.docx` export behavior.
**FRs covered:** CMD-FR5

## Epic CMD.1: Add Markdown Export Entry Point and Flow

Users can trigger chronicle markdown export from the existing export area with clear success/failure feedback.

### Story CMD.1: Add `Export chronicle (.md)` Action in Existing Export Surface

As a teacher,  
I want an `Export chronicle (.md)` action in the current export controls,  
so that I can generate a markdown chronicle without leaving my workflow.

**Acceptance Criteria:**

**Given** export-eligible data is selected  
**When** I use `Export chronicle (.md)`  
**Then** the app starts markdown export and downloads one `.md` file  
**And** success/error feedback is shown with selection preserved on failure

### Story CMD.2: Wire Frontend/Backend Markdown Export Command

As a developer,  
I want a dedicated markdown export command path,  
so that markdown generation is isolated from the existing `.docx` flow.

**Acceptance Criteria:**

**Given** markdown export is requested  
**When** command handling executes  
**Then** a dedicated markdown path is used end-to-end  
**And** `.docx` export behavior remains unchanged

## Epic CMD.2: Build Deterministic Markdown Chronicle Serializer

Exported markdown uses a stable contract with explicit `contact persons` and `appointments` sections, including media filename/metadata only.

### Story CMD.3: Implement Markdown Contract with `contact persons` and `appointments` Sections

As a chronicle coordinator,  
I want exported markdown to use explicit section headings,  
so that I can reliably review and process contact and appointment content.

**Acceptance Criteria:**

**Given** markdown export runs  
**When** file content is generated  
**Then** the document contains `contact persons` and `appointments` sections  
**And** each section renders available metadata safely when optional fields are missing

### Story CMD.4: Enforce Deterministic Ordering and Media Metadata-Only Serialization

As a developer,  
I want output ordering and media formatting to be deterministic,  
so that the markdown is diff-friendly and stable for downstream tooling.

**Acceptance Criteria:**

**Given** the same export selection and source data  
**When** markdown is generated repeatedly  
**Then** section and entry ordering remain stable  
**And** media entries include filename + metadata only, without base64 or binary payloads

## Epic CMD.3: Verify Markdown Export Reliability and Non-Regression

Automated coverage ensures markdown export works end-to-end and does not break `.docx` export behavior.

### Story CMD.5: Add Automated Tests for Markdown Export and `.docx` Non-Regression

As a product owner,  
I want automated checks for markdown export behavior and compatibility,  
so that regressions are caught before release.

**Acceptance Criteria:**

**Given** unit/integration/e2e test execution  
**When** export tests run  
**Then** markdown contract, deterministic ordering, and failure feedback are verified  
**And** existing `.docx` export path is verified to remain functional
