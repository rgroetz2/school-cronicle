# Story 2.3: Build School-Personal CRUD UI with Bottom Actions

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an admin,
I want CRUD forms for `school-personal` with fixed bottom actions,
so that record maintenance is consistent and predictable.

## Acceptance Criteria

1. Given create or edit mode for a `school-personal` record, when the form is displayed, then the bottom action bar contains exactly `SAVE` and `CANCEL`.
2. Given optional fields are empty, when submitting valid required fields, then save remains allowed.

## Tasks / Subtasks

- [x] Build create/edit form UI for `school-personal` (AC: 1, 2)
  - [x] Include all required and optional fields
  - [x] Enforce required validation for `name`, `role`, `jobRole`
- [x] Implement standardized bottom action bar usage (AC: 1)
  - [x] Render only `SAVE` and `CANCEL`
  - [x] Hook actions to editor lifecycle handlers
- [x] Wire create/update service actions (AC: 1, 2)
  - [x] Persist valid data via API service
  - [x] Surface validation errors in-line
- [x] Add CRUD UI tests (AC: 1, 2)
  - [x] Verify action visibility and optional-field behavior

## Dev Notes

- Reuse shared CRUD action bar patterns introduced in Epic 1/architecture conventions.
- Keep this story focused on form behavior; double-click grid open is covered in 2.4.

### Project Structure Notes

- Frontend feature path: `school-cronicle/web/src/app/features/*`
- Keep API calls in service/facade layers

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 2, Story 2.3]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Frontend Architecture]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story context generated via `bmad-create-story` workflow (batch run for Epic 2).

### Completion Notes List

- Implemented school-personal create/edit modal with required + optional fields and inline form validation.
- Enforced bottom actions to exactly `SAVE` and `CANCEL` for the CRUD editor.
- Wired create/update persistence through `AuthApiService` for both dummy and backend modes.

### File List

- `_bmad-output/implementation-artifacts/2-3-build-school-personal-crud-ui-with-bottom-actions.md`
- `school-cronicle/web/src/app/features/school-personal/school-personal.component.ts`
- `school-cronicle/web/src/app/features/school-personal/school-personal.component.css`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
