# Story M2.4: Enable Submitted Editing with Post-Submit Indicator

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want to edit submitted appointments and still see that they were changed after submission,  
so that corrections are possible while chronology remains transparent.

## Acceptance Criteria

1. Given a submitted appointment, when I save a change in the modal, then the change is persisted.
2. Appointment shows a "last edited after submit" indicator with timestamp and editor identity.
3. No full version-history workflow is required in MVP 2.

## Tasks / Subtasks

- [x] Remove read-only block for submitted records in modal workflow (AC: 1)
  - [x] Keep policy checks for ownership/school scope.
  - [x] Preserve required metadata and validation behaviors.
- [x] Add post-submit edit indicator fields and update logic (AC: 2)
  - [x] Persist edited-after-submit timestamp.
  - [x] Persist editor identity reference.
- [x] Surface indicator in list and modal/detail contexts (AC: 2)
  - [x] Ensure clear and non-ambiguous wording.
  - [x] Keep display consistent with refreshed visual system.
- [x] Explicitly avoid version snapshots/audit timeline UI in this release (AC: 3)
- [x] Add tests for submitted-edit save and indicator display.

## Dev Notes

- Governance choice is indicator-only for MVP 2; do not implement full versioning.
- Ensure compatibility with existing submission state logic.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story M2.4]
- [Source: `_bmad-output/planning-artifacts/prd.md` - Release MVP 2 Addendum, FR36]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - indicator-only policy and data impacts]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - submitted-edit interaction rule]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

### Completion Notes List

- Enabled submitted appointment updates in API/service and dummy client store update flow.
- Added indicator fields `editedAfterSubmitAt` and `editedAfterSubmitBy` to draft domain models.
- Persisted indicator fields whenever a submitted appointment is edited.
- Surfaced indicator in list status text and in modal details (`Last edited after submit`).
- Kept image/media mutation rules unchanged (submitted media remains read-only in current scope).
- Updated integration/component tests to reflect submitted-edit allowance and indicator visibility.

### File List

- `school-cronicle/api/src/modules/appointments/appointment.types.ts`
- `school-cronicle/api/src/modules/appointments/appointments.service.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.integration.spec.ts`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
