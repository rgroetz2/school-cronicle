# Story 2.1: Create Draft Appointment

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want to create a new appointment draft with required fields,  
so that I can capture chronicle content progressively.

## Acceptance Criteria

1. Given an authenticated teacher, when the teacher starts a new appointment and saves required metadata, then a draft appointment is persisted for that teacher and school scope.
2. Given the draft creation flow, when metadata fields are shown, then required fields are clearly marked in the UI.

## Tasks / Subtasks

- [x] Implement draft appointment create endpoint and model (AC: 1)
  - [x] Add appointment draft module/folder structure in API aligned with architecture boundaries
  - [x] Define draft appointment payload contract and required fields
  - [x] Implement authenticated create-draft endpoint returning persisted draft record
  - [x] Ensure teacher/school scope association is persisted with each new draft
- [x] Enforce authenticated access and ownership constraints for draft creation (AC: 1)
  - [x] Protect create-draft API route with existing session validation guard
  - [x] Reject unauthenticated requests with consistent unauthorized response
  - [x] Keep response shape and error envelope consistent with current API patterns
- [x] Implement draft creation UI and required-field visibility (AC: 1, 2)
  - [x] Add compose/new-draft route and form scaffold in web app
  - [x] Mark required fields clearly in labels and validation hints
  - [x] Submit draft metadata to API and show success/created draft state
  - [x] Preserve UX baseline for calm validation and accessibility
- [x] Add tests for draft creation behavior (AC: 1, 2)
  - [x] API tests for authenticated draft creation and school/teacher association
  - [x] API tests for unauthenticated creation rejection
  - [x] Web tests for required markers and successful draft submission flow
  - [x] Accessibility checks for required-field signaling and validation messaging
- [x] Validate quality gates and scope (AC: 1, 2)
  - [x] Run focused draft creation tests
  - [x] Run `npx nx run-many -t lint,test,build --all`
  - [x] Keep scope constrained to draft creation only (list/edit/delete in subsequent stories)

## Dev Notes

- This is the first story in Epic 2 and introduces appointment-domain persistence flow.
- Build on the auth/session foundation from Epic 1; do not bypass established auth guards.
- Keep implementation minimal and forward-compatible for Stories 2.2-2.5.

### Previous Story Intelligence

- Story 1.2 introduced authenticated login flow and session cookie model.
- Story 1.3 implemented sign-out, session guard behavior, and protected route patterns.
- Story 1.4 established consistent auth error envelope patterns and calm failure UX.
- Reuse established API/web patterns rather than creating parallel conventions.

### Architecture Guardrails

- Maintain REST JSON API with consistent envelopes.
- Preserve naming and structure conventions:
  - file names in `kebab-case`
  - API boundary keys in `camelCase`
  - feature/domain-first organization
- Enforce session-based authenticated access on protected write operations.
- Prepare for school-scope authorization requirements by persisting scope associations now.

### Technical Requirements

- API:
  - Add `appointments` draft create capability with required metadata validation
  - Persist teacher and school association attributes on create
  - Return stable JSON response with created draft identifier/state
- Web:
  - Add new-draft form surface
  - Required fields visibly marked and validated
  - Submission flow creates draft and reflects success state

### Security and Compliance Notes

- Draft creation must require authenticated session.
- No sensitive data leakage in validation/error responses.
- Preserve privacy-safe logging practices; do not log sensitive payload values unnecessarily.

### UX Notes

- Required fields must be explicit and understandable at first glance.
- Validation feedback should remain calm, contextual, and actionable.
- Keep mobile-first and accessibility baseline (WCAG-oriented core flow behavior).

### Testing Requirements

- API:
  - authenticated create-draft success
  - unauthenticated create-draft rejection
  - persisted ownership/scope association checks
- Web:
  - required field indicators present
  - successful draft submission flow
  - accessible field labels and error messaging behaviors
- Run full workspace lint/test/build gates.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 2.1]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Project Structure & Boundaries]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR5, FR8]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - Required fields, validation tone, accessibility]
- [Source: `_bmad-output/implementation-artifacts/1-2-implement-teacher-sign-in.md`]
- [Source: `_bmad-output/implementation-artifacts/1-3-implement-sign-out-and-session-lifecycle.md`]
- [Source: `_bmad-output/implementation-artifacts/1-4-implement-access-failure-and-help-path.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story auto-selected from sprint backlog order: `2-1-create-draft-appointment`.
- Context synthesized from epics, architecture, PRD, UX, and Epic 1 implementation outputs.
- Added API appointments module with protected draft creation endpoint at `POST /api/appointments/drafts`.
- Implemented draft persistence model with `teacherId`, `schoolId`, required metadata, and `draft` status.
- Protected route with existing auth session guard and consistent unauthorized behavior for missing session.
- Extended web appointments screen with compose form, required-field markers (`*`), and draft create submission flow.
- Added API integration tests and web component tests for required markers and successful creation flow.
- Validation commands executed:
  - `npx nx test api`
  - `npx nx test web`
  - `npx nx run-many -t lint,test,build --all`

### Completion Notes List

- Implemented authenticated draft creation end-to-end for API and web with required metadata fields.
- Draft records now persist teacher and school scope association in API response model.
- Required fields are clearly marked in UI and validated before submission.
- Added and passed API + web tests for authenticated create, unauthenticated rejection, and required-field UX behavior.
- Full lint/test/build quality gates pass and story is ready for review.

### File List

- `_bmad-output/implementation-artifacts/2-1-create-draft-appointment.md`
- `school-cronicle/api/src/app/app.module.ts`
- `school-cronicle/api/src/modules/auth/auth.module.ts`
- `school-cronicle/api/src/modules/appointments/appointment.types.ts`
- `school-cronicle/api/src/modules/appointments/appointments.module.ts`
- `school-cronicle/api/src/modules/appointments/appointments.service.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.integration.spec.ts`
- `school-cronicle/api/project.json`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`

### Change Log

- 2026-04-22: Implemented Story 2.1 draft creation flow (API + web), added tests, and moved status to `review`.
