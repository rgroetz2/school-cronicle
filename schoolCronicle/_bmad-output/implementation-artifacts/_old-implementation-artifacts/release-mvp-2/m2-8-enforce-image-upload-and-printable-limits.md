# Story M2.8: Enforce Image Upload and Printable Limits

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want clear image limits per appointment,  
so that chronicle output remains constrained and predictable.

## Acceptance Criteria

1. Given appointment media upload, when I manage images, then at most 5 images can be uploaded.
2. At most 3 images can be marked printable.
3. Printable selection is manual and visible before export.

## Tasks / Subtasks

- [x] Enforce max-5 upload policy in API and UI validation paths (AC: 1)
  - [x] Reject or block additional uploads beyond limit with clear feedback.
  - [x] Keep behavior deterministic across edit sessions.
- [x] Add printable flag and max-3 selection policy (AC: 2)
  - [x] Manual toggle/select behavior only; no automatic ranking.
  - [x] Enforce limit server-side as source of truth.
- [x] Surface printable-selection state in modal/list/export prep UI (AC: 3)
  - [x] Ensure selected printable items are clearly visible.
  - [x] Provide correction path when limit is exceeded.
- [x] Add tests for upload and printable constraints.

## Dev Notes

- Keep constraints aligned with export requirements (M2.9/M2.10).
- Reuse existing file validation patterns to reduce regression risk.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story M2.8]
- [Source: `_bmad-output/planning-artifacts/prd.md` - Release MVP 2 Addendum, FR40]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - media policy constraints]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - media UX rules]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

### Completion Notes List

- Added image-level `printableInChronicle` flag to appointment image schema and normalized client model.
- Enforced max 5 uploads per appointment in API (`APPOINTMENT_IMAGE_LIMIT_EXCEEDED`) and UI feedback path.
- Added manual printable toggle endpoint and service behavior with server-side max 3 enforcement (`APPOINTMENT_PRINTABLE_LIMIT_EXCEEDED`).
- Extended dummy client store to honor upload/printable limits and persist printable state.
- Updated special-event modal media area to show uploaded/printable counters and explicit mark/unmark printable controls.
- Added integration coverage for both upload and printable constraints.

### File List

- `school-cronicle/api/src/modules/appointments/appointment.types.ts`
- `school-cronicle/api/src/modules/appointments/appointments.service.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.integration.spec.ts`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
