# Story 3.3: Build School CRUD UI with Save/Cancel

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an admin,
I want school create/edit forms with standardized actions,
so that CRUD behavior is consistent with other modules.

## Acceptance Criteria

1. Given create or edit mode for a `school` record, when the CRUD form is shown, then the bottom action bar contains exactly `SAVE` and `CANCEL`.
2. Given required fields are invalid, when save is attempted, then validation blocks persistence until fields are valid.

## Tasks / Subtasks

- [x] Build create/edit form UI for `school` (AC: 1, 2)
  - [x] Include required fields `name`, `type`, `address`
  - [x] Include optional fields `description`, `comment`
- [x] Implement standardized bottom action bar usage (AC: 1)
  - [x] Render only `SAVE` and `CANCEL`
  - [x] Hook actions to editor lifecycle handlers
- [x] Wire create/update service actions (AC: 1, 2)
  - [x] Persist valid data via API service
  - [x] Surface validation errors in-line
- [x] Add CRUD UI tests (AC: 1, 2)
  - [x] Verify action visibility and required-field validation behavior

## Dev Notes

- Reuse established CRUD action-area patterns to keep interaction consistent.
- Keep this story focused on form behavior and validation, not double-click open flow.
- Keep accessibility and keyboard interaction standards aligned with project conventions.

### Project Structure Notes

- Frontend feature path: `school-cronicle/web/src/app/features/*`
- Keep API calls in service/facade layers

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 3, Story 3.3]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Frontend Architecture]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story context generated via `bmad-create-story` workflow (batch run for Epic 3).

### Completion Notes List

- Implemented `school` CRUD modal form with required and optional fields.
- Enforced bottom actions to exactly `SAVE` and `CANCEL` in the editor footer.
- Wired create/update persistence via `AuthApiService.createSchool()` and `updateSchool()`.

### File List

- `_bmad-output/implementation-artifacts/3-3-build-school-crud-ui-with-save-cancel.md`
- `school-cronicle/web/src/app/features/school/school.component.ts`
- `school-cronicle/web/src/app/features/school/school.component.css`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
