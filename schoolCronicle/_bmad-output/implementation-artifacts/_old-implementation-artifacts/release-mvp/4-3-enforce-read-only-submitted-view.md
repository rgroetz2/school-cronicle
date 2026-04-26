# Story 4.3: Enforce Read-Only Submitted View

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want submitted records to be read-only,  
so that submission integrity is preserved.

## Acceptance Criteria

1. Given a submitted appointment, when the teacher opens details, then fields and media are shown in read-only mode.
2. Given a submitted appointment, when the teacher views available actions, then edit actions are unavailable per policy.

## Tasks / Subtasks

- [x] Enforce read-only policy in web detail/editor surfaces (AC: 1, 2)
  - [x] Convert submitted-entry form fields to non-editable/read-only presentation
  - [x] Replace mutating action affordances with policy-safe read-only cues
  - [x] Keep draft entries fully editable and unchanged
- [x] Enforce read-only policy for media interactions (AC: 1, 2)
  - [x] Prevent attach/remove/replace operations for submitted entries
  - [x] Render submitted media in view-only mode with clear copy
  - [x] Keep accessibility semantics explicit for unavailable actions
- [x] Harden API policy boundaries for submitted records (AC: 2)
  - [x] Ensure mutating endpoints consistently reject updates to submitted records
  - [x] Keep response contract deterministic with explicit read-only policy codes/messages
  - [x] Preserve auth/ownership checks and existing validation ordering
- [x] Align read-only UX messaging across panels (AC: 1, 2)
  - [x] Keep status/read-only messaging consistent between list, detail, and readiness sections
  - [x] Ensure messaging is text-first and not color-dependent
  - [x] Avoid implying submission can be reversed from this scope
- [x] Add tests for read-only submitted behavior (AC: 1, 2)
  - [x] Web test: submitted detail renders read-only field/media experience
  - [x] Web test: submitted actions are unavailable while draft actions remain available
  - [x] API integration test: mutating submitted record returns explicit policy rejection
- [x] Validate quality gates and scope boundaries (AC: 1, 2)
  - [x] Run focused API/web lint and tests for submitted read-only behavior
  - [x] Keep status styling refinements in Story 4.2 and lifecycle transition logic in Story 4.1
  - [x] Keep export/audit and school-scope authorization concerns in Epic 5

## Dev Notes

- This story hardens policy behavior so submitted appointments are strictly view-only.
- Build on Story 4.1 lifecycle state (`submitted`) and Story 4.2 status communication patterns.
- Scope is read-only enforcement for submitted records; no unsubmit flow is introduced.

### Previous Story Intelligence

- Story 4.1 introduced submitted-state transitions and initial guardrails.
- Story 4.2 added explicit state communication in list/detail views.
- Current UI already blocks many submitted actions; Story 4.3 should complete and standardize enforcement and presentation.

### Architecture Guardrails

- Preserve boundaries across `api/modules/appointments` and `web/features/appointments`.
- Maintain existing response-envelope and error-code patterns.
- Keep auth/session and teacher ownership checks intact for all protected endpoints.

### Technical Requirements

- API:
  - submitted records cannot be mutated by update/image mutation endpoints
  - response must clearly indicate read-only policy rejection
  - behavior remains deterministic across repeated attempts
- Web:
  - submitted entries render view-only details/media
  - mutating actions are unavailable or non-interactive with explicit text explanation
  - draft entries continue normal edit behavior

### Security and Compliance Notes

- Submitted data integrity must be preserved against accidental or direct mutation attempts.
- Unauthorized access patterns remain rejected under existing auth/ownership rules.
- Read-only feedback must avoid leaking internal system details.

### UX Notes

- Read-only state should be obvious immediately after opening a submitted record.
- Explanations for unavailable actions should be concise and actionable.
- Non-color cues (text labels/messages) are required for policy clarity.

### Testing Requirements

- API:
  - submitted mutation attempts return explicit read-only rejection contract
  - draft mutation behavior remains unchanged
- Web:
  - submitted view shows read-only details/media
  - mutating actions unavailable for submitted records, available for drafts
  - messaging remains text-first and consistent
- Run lint/test quality gates on touched projects.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 4.3]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Project Structure & Boundaries]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR21]
- [Source: `_bmad-output/implementation-artifacts/4-1-submit-valid-appointment.md`]
- [Source: `_bmad-output/implementation-artifacts/4-2-display-draft-vs-submitted-states.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story auto-selected from sprint backlog order: `4-3-enforce-read-only-submitted-view`.
- Context synthesized from epics and completed Epic 4 Story 4.1/4.2 artifacts.

### Completion Notes List

- Completed read-only submitted presentation by replacing the editable form with a structured read-only details panel for submitted records.
- Updated submitted media section to remain visible in view-only mode while keeping all image mutation affordances unavailable.
- Hardened delete behavior so submitted records are rejected consistently with `APPOINTMENT_READ_ONLY`, aligned with update/attach rules.
- Added service-layer dummy-mode guards to avoid mutating submitted records through update, attach, remove, and delete helpers.
- Added integration coverage for submitted-delete rejection and extended component tests for read-only detail/media rendering.
- Verified with `npx nx test api`, `npx nx lint web`, and `npx nx test web`.

### File List

- `school-cronicle/api/src/modules/appointments/appointments.controller.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.integration.spec.ts`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.css`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
- `_bmad-output/implementation-artifacts/4-3-enforce-read-only-submitted-view.md`
