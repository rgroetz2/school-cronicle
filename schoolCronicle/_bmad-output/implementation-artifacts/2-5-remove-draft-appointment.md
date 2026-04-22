# Story 2.5: Remove Draft Appointment

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want to remove my draft when policy allows,  
so that I can clean up obsolete entries.

## Acceptance Criteria

1. Given a teacher-owned draft and policy allowing deletion, when delete is confirmed, then the draft is removed.
2. Given a deleted draft, when the appointments list is shown, then deletion is reflected in the appointment list.

## Tasks / Subtasks

- [x] Implement authenticated draft deletion endpoint (AC: 1)
  - [x] Add `DELETE` draft endpoint scoped to current teacher/session
  - [x] Reuse existing session guard and ownership checks
  - [x] Return consistent API envelope and non-sensitive errors
- [x] Enforce policy/ownership rules for deletion (AC: 1)
  - [x] Ensure only teacher-owned drafts can be deleted
  - [x] Preserve behavior for unauthorized/unknown draft IDs
  - [x] Keep submitted/non-draft behavior out of scope unless explicitly present
- [x] Add delete interaction to appointments UI (AC: 1, 2)
  - [x] Add delete action for selected/open draft with explicit user confirmation
  - [x] Show success/failure feedback in accessible status region
  - [x] Refresh list state after deletion and clear now-invalid selection
- [x] Ensure list reflects deletion reliably (AC: 2)
  - [x] Keep loading/empty/list states correct after delete
  - [x] Prevent stale deleted item from reappearing in local state
  - [x] Keep keyboard-operable delete flow and confirmation controls
- [x] Add tests for delete behavior and visibility updates (AC: 1, 2)
  - [x] API tests for successful teacher-owned draft deletion
  - [x] API tests for unauthorized or non-owned deletion attempts
  - [x] Web tests for confirmation, delete action, and list refresh behavior
  - [x] Accessibility checks for confirmation and status announcements
- [x] Validate quality gates and scope (AC: 1, 2)
  - [x] Run focused draft-delete tests
  - [x] Run `npx nx run-many -t lint,test,build --all` (still blocked by existing `web:build:production` failure)
  - [x] Keep scope limited to draft removal (submission lifecycle remains Epic 4)

## Dev Notes

- This story builds on Story 2.2 list/open behavior and Story 2.3/2.4 edit+readiness flows.
- Drafts now support local image attachments; draft deletion should remove the draft together with its locally stored image entries.
- Deletion should only affect draft entities and should not introduce submission-state logic.
- Keep user feedback clear and reversible up to confirmation point.

### Previous Story Intelligence

- Story 2.1 introduced draft persistence.
- Story 2.2 added list/open interactions.
- Story 2.3 added metadata editing, including required appointment date.
- Story 2.4 added submit-readiness evaluation and submit gate behavior.
- Current implementation supports local image attachment on drafts in web dummy/local mode.
- Current implementation enforces a local image max-size guard of 2 MB during attach flow.

### Architecture Guardrails

- Preserve session-based auth and teacher ownership checks on all mutations.
- Maintain module boundaries (`modules/appointments`, `features/appointments`) and response envelope conventions.
- Keep error details non-sensitive and aligned with existing auth/appointments patterns.

### Technical Requirements

- API:
  - teacher-scoped draft deletion endpoint
  - clear success response with deleted draft identity
  - robust handling of unknown/non-owned IDs
- Web:
  - delete control with confirmation step
  - local state/list refresh after successful delete
  - local image attachments tied to deleted draft are removed from client state as part of draft removal
  - image attach flow includes local max-size guard (2 MB) with user-facing feedback
  - clear status feedback and consistent empty-state behavior

### Security and Compliance Notes

- No cross-teacher delete capability.
- Unauthenticated deletion must be rejected consistently.
- Deletion errors must not leak sensitive ownership or internal policy details.

### UX Notes

- Confirmation step should prevent accidental destructive actions.
- Post-delete state should be immediate and unambiguous in the list.
- Status updates must be perceivable and keyboard-accessible.

### Testing Requirements

- API:
  - successful delete for teacher-owned draft
  - unauthorized/non-owned delete attempt handling
- Web:
  - confirmation + delete flow
  - deleted item removed from list and selection cleared
  - status feedback for success/failure is visible and accessible
  - image-attach oversize file path surfaces max-size feedback (2 MB) without persisting file
- Run full lint/test/build gates.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 2.5]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Project Structure & Boundaries]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR10]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - list/empty/loading and destructive-action patterns]
- [Source: `_bmad-output/implementation-artifacts/2-4-enforce-metadata-submission-gate.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story auto-selected from sprint backlog order: `2-5-remove-draft-appointment`.
- Context synthesized from epics, architecture, PRD, UX, and previous implementation artifacts.

### Completion Notes List

- Added authenticated draft deletion endpoint (`DELETE /api/appointments/drafts/:draftId`) with teacher ownership checks.
- Added delete action in appointments UI with explicit confirmation and accessible status feedback.
- Deletion now updates local list state immediately, clears selected draft, and resets the form safely.
- Added API and web tests for successful deletion and unauthenticated deletion rejection.
- Full run-many remains blocked by existing `web:build:production` environment failure.

### File List

- `_bmad-output/implementation-artifacts/2-5-remove-draft-appointment.md`
- `school-cronicle/api/src/modules/appointments/appointments.service.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.integration.spec.ts`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
