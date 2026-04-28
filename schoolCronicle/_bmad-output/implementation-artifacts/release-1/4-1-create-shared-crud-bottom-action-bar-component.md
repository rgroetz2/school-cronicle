# Story 4.1: Create Shared CRUD Bottom Action Bar Component

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a frontend developer,
I want a shared bottom action component for CRUD screens,
so that `SAVE`/`CANCEL` behavior is uniform across modules.

## Acceptance Criteria

1. Given any CRUD screen in scope, when the action region renders, then it uses a shared component exposing only `SAVE` and `CANCEL`.
2. Given action states, when screens are idle/loading/disabled, then shared component states remain consistent.

## Tasks / Subtasks

- [x] Create shared save/cancel action bar component (AC: 1, 2)
  - [x] Expose only `SAVE` and `CANCEL` actions
  - [x] Add common labels and disabled state inputs
- [x] Adopt shared component in school CRUD UI (AC: 1, 2)
  - [x] Replace local modal footer buttons with shared component
- [x] Adopt shared component in school-personal CRUD UI (AC: 1, 2)
  - [x] Replace local modal footer buttons with shared component

## Dev Notes

- Keep action API minimal and reusable across both entity CRUD flows.
- Preserve existing save/cancel behavior while deduplicating footer markup and styles.

### Project Structure Notes

- Shared component path: `school-cronicle/web/src/app/shared/*`
- Feature usage paths: `school-cronicle/web/src/app/features/*`

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 4, Story 4.1]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Implemented during `bmad-dev-story` continuation after Epic 3 completion.

### Completion Notes List

- Added `SaveCancelActionBarComponent` as a shared standalone component.
- Replaced school and school-personal modal footer actions with shared component usage.
- Removed duplicated save/cancel CSS blocks from both feature stylesheets.

### File List

- `_bmad-output/implementation-artifacts/release-1/4-1-create-shared-crud-bottom-action-bar-component.md`
- `school-cronicle/web/src/app/shared/save-cancel-action-bar.component.ts`
- `school-cronicle/web/src/app/features/school/school.component.ts`
- `school-cronicle/web/src/app/features/school/school.component.css`
- `school-cronicle/web/src/app/features/school-personal/school-personal.component.ts`
- `school-cronicle/web/src/app/features/school-personal/school-personal.component.css`
