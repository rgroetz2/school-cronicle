# Story 3.4: Wire School Double-Click Edit and Close-on-Action

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a grid user,
I want double-click to open school editing and auto-close on action,
so that record updates are efficient.

## Acceptance Criteria

1. Given a `school` row in the grid, when any cell is double-clicked, then the row record opens in CRUD edit mode.
2. Given editor actions, when `SAVE` succeeds, then changes persist, editor closes, and list refreshes; when `CANCEL` is clicked, then editor closes without persistence.

## Tasks / Subtasks

- [x] Implement double-click row/cell handler (AC: 1)
  - [x] Resolve target `school` record from clicked cell context
  - [x] Open edit UI with selected record loaded
- [x] Wire save flow to close-on-success behavior (AC: 2)
  - [x] Persist updates then refresh list data
  - [x] Close editor after successful save
- [x] Wire cancel flow to close-without-save behavior (AC: 2)
  - [x] Exit editor without mutation
  - [x] Preserve current list/filter context
- [x] Add interaction tests (AC: 1, 2)
  - [x] Verify double-click edit open
  - [x] Verify save/cancel lifecycle outcomes

## Dev Notes

- Keep side effects explicit and deterministic for testability.
- Use the same close-on-action lifecycle expectations as other list/editor experiences.
- Avoid introducing hidden autosave behavior.

### Project Structure Notes

- Grid/editor interaction logic in feature facade + component layer
- API persistence remains in service layer

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 3, Story 3.4]
- [Source: `_bmad-output/planning-artifacts/ux-design-directions.html` - Interaction behavior]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story context generated via `bmad-create-story` workflow (batch run for Epic 3).

### Completion Notes List

- Added double-click cell handlers for school grid rows to open edit mode.
- Implemented close-on-save with persisted refresh and close-on-cancel without persistence.
- Added `school.component.spec.ts` coverage for grid rendering and double-click editor open behavior.

### File List

- `_bmad-output/implementation-artifacts/3-4-wire-school-double-click-edit-and-close-on-action.md`
- `school-cronicle/web/src/app/features/school/school.component.ts`
- `school-cronicle/web/src/app/features/school/school.component.spec.ts`
