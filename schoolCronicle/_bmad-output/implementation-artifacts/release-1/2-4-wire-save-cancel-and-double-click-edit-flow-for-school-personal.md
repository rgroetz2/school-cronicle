# Story 2.4: Wire Save/Cancel and Double-Click Edit Flow for School-Personal

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user of the grid,
I want double-click-to-edit and close-on-save/cancel behavior,
so that editing is fast and list context is preserved.

## Acceptance Criteria

1. Given a row in the `school-personal` grid, when a user double-clicks any data cell, then the matching record opens in CRUD edit mode.
2. Given editor actions, when `SAVE` succeeds, then changes persist and editor closes; when `CANCEL` is clicked, then editor closes without persisting.

## Tasks / Subtasks

- [x] Implement double-click row/cell handler (AC: 1)
  - [x] Resolve record identity from clicked cell context
  - [x] Open edit UI with selected record loaded
- [x] Wire save flow to close-on-success behavior (AC: 2)
  - [x] Persist updates then refresh grid row data
  - [x] Close editor after successful save
- [x] Wire cancel flow to close-without-save behavior (AC: 2)
  - [x] Exit editor without mutation
  - [x] Preserve existing grid state
- [x] Add interaction tests (AC: 1, 2)
  - [x] Verify double-click edit open
  - [x] Verify save/cancel lifecycle outcomes

## Dev Notes

- Maintain deterministic editor lifecycle behavior (shared UX pattern).
- Keep side effects explicit and testable; avoid hidden auto-save behavior.

### Project Structure Notes

- Grid/editor interaction logic in feature facade + component layer
- API persistence remains in service layer

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 2, Story 2.4]
- [Source: `_bmad-output/planning-artifacts/ux-design-directions.html` - Interaction behavior]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story context generated via `bmad-create-story` workflow (batch run for Epic 2).

### Completion Notes List

- Added cell-level double-click handlers across grid columns to open the selected record in edit mode.
- Save now persists changes, closes the modal, and refreshes list data; cancel closes without persistence.
- Added interaction coverage in `school-personal.component.spec.ts` for edit opening and action visibility.

### File List

- `_bmad-output/implementation-artifacts/2-4-wire-save-cancel-and-double-click-edit-flow-for-school-personal.md`
- `school-cronicle/web/src/app/features/school-personal/school-personal.component.ts`
- `school-cronicle/web/src/app/features/school-personal/school-personal.component.spec.ts`
