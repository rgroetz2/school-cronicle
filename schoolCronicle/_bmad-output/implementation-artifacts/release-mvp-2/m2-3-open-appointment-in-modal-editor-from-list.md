# Story M2.3: Open Appointment in Modal Editor from List

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want to open any appointment in a modal editor from the list,  
so that I can review and update fields without losing list context.

## Acceptance Criteria

1. Given I click an appointment row, when the modal opens, then all supported appointment fields are shown in editable form.
2. Saving updates both modal data and list row state without full page navigation.

## Tasks / Subtasks

- [x] Add row-click to modal-open interaction for unified list entries (AC: 1)
  - [x] Ensure focus management and dialog accessibility.
  - [x] Prevent accidental navigation away from current list context.
- [x] Implement modal editor form parity with current appointment fields (AC: 1)
  - [x] Reuse existing validators and save/update logic.
  - [x] Show participant/media sections if available in current story sequence.
- [x] Implement save flow and optimistic/list refresh integration (AC: 2)
  - [x] Update affected row fields after save.
  - [x] Handle API failure without closing modal or losing edits.
- [x] Add tests for modal open/edit/save/list refresh path (AC: 1, 2)

## Dev Notes

- This story is a UX orchestration layer; preserve established domain validation paths.
- Avoid introducing separate edit route unless required by technical constraints.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story M2.3]
- [Source: `_bmad-output/planning-artifacts/prd.md` - Release MVP 2 Addendum, FR35]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - modal edit flow rules]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - UI architecture impacts]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

### Completion Notes List

- Added a modal editor overlay that opens from appointment row clicks and preserves list context.
- Added "Create appointment" entrypoint to open modal in create mode without route navigation.
- Reused existing appointment form validators/save logic for create and update within modal workflow.
- Auto-closes modal after successful create/update while refreshing list data in place.
- Added regression test coverage for modal open and modal-driven create/save behavior.

### File List

- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.css`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
