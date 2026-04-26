# Story M2.7: Add Special Event Appointment Type with Optional Media

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want to record special events (e.g., retirements, town changes) as a dedicated appointment type,  
so that chronicle-relevant milestones are captured consistently.

## Acceptance Criteria

1. Given appointment creation/editing, when I select "Special Event" type, then I can capture title, date, category, and narrative description.
2. Optional images/documents can be attached.
3. Event is eligible for chronicle export selection.

## Tasks / Subtasks

- [x] Extend appointment type taxonomy with "Special Event" (AC: 1)
  - [x] Update validation and type mappings in UI/API.
  - [x] Preserve compatibility with existing appointment types.
- [x] Add special-event form handling in modal/editor (AC: 1)
  - [x] Ensure required fields and narrative support.
  - [x] Keep create/edit UX consistent with existing flow.
- [x] Enable optional media/document attachment rules (AC: 2)
  - [x] Reuse existing media validation pipelines where possible.
  - [x] Ensure attach/remove behavior is resilient.
- [x] Mark special events export-eligible in selection pipeline (AC: 3)
- [x] Add tests for type behavior, fields, and export eligibility.

## Dev Notes

- Product decision: special events are an appointment type, not a separate module.
- This story feeds M2.9 export behavior.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story M2.7]
- [Source: `_bmad-output/planning-artifacts/prd.md` - Release MVP 2 Addendum, FR38]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - appointment type and export impacts]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

### Completion Notes List

- Added `special_event` to appointment category taxonomy and propagated it through API and dummy client category lists.
- Added special-event validation requiring narrative notes for create/update flows in both API and UI.
- Added special-event modal handling with contextual narrative labeling and required guidance.
- Reused existing image attachment pipeline in modal for special events as optional media.
- Added `chronicleExportEligible` draft field and set it true for `special_event` records in API/client normalization.
- Added integration test coverage for required narrative and export-eligibility behavior.

### File List

- `school-cronicle/api/src/modules/appointments/appointment-categories.ts`
- `school-cronicle/api/src/modules/appointments/appointment.types.ts`
- `school-cronicle/api/src/modules/appointments/appointments.service.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.integration.spec.ts`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
