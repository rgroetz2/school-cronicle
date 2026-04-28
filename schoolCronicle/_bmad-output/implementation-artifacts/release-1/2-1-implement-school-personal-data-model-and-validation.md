# Story 2.1: Implement School-Personal Data Model and Validation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want a `school-personal` entity with required and optional fields,
so that profile data can be captured consistently.

## Acceptance Criteria

1. Given the `school-personal` entity schema, when records are created or updated, then required fields are `name`, `role`, and `jobRole`.
2. Given optional fields `class` and `startDate`, when values are missing, then records remain valid.
3. Given `startDate` is provided, when validation runs, then date format is validated consistently.

## Tasks / Subtasks

- [x] Define `school-personal` domain model and storage contract (AC: 1, 2)
  - [x] Add fields: `name`, `role`, `jobRole`, optional `class`, optional `startDate`
  - [x] Ensure role enums align with product rules (`admin|user`, `teacher|assistant|supporter|other`)
- [x] Implement create/update validation rules (AC: 1, 2, 3)
  - [x] Enforce required field validation for `name`, `role`, `jobRole`
  - [x] Enforce date validation for optional `startDate`
- [x] Add tests for required/optional behavior (AC: 1, 2, 3)
  - [x] Include valid/invalid payload coverage and edge cases

## Dev Notes

- Keep API formats camelCase; keep persistence conventions aligned with architecture.
- This story establishes contract foundations for stories 2.2–2.5.
- Avoid introducing unrelated UI work in this story.

### Project Structure Notes

- Backend domain modules: `school-cronicle/api/src/modules/*`
- Frontend contracts/facades: `school-cronicle/web/src/app/*`
- Story artifact location: `_bmad-output/implementation-artifacts/`

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 2, Story 2.1]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Data Architecture]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Naming/Format Patterns]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story context generated via `bmad-create-story` workflow (batch run for Epic 2).

### Completion Notes List

- Implemented backend school-personal model, service, module, and controller with required/optional field validation.
- Added date-format validation for `startDate` and enum validation for `role` + `jobRole`.
- Added backend integration tests for admin/user behavior and payload validation coverage.

### File List

- `_bmad-output/implementation-artifacts/2-1-implement-school-personal-data-model-and-validation.md`
- `school-cronicle/api/src/modules/school-personal/school-personal.types.ts`
- `school-cronicle/api/src/modules/school-personal/school-personal.service.ts`
- `school-cronicle/api/src/modules/school-personal/school-personal.controller.ts`
- `school-cronicle/api/src/modules/school-personal/school-personal.module.ts`
- `school-cronicle/api/src/modules/school-personal/school-personal.controller.integration.spec.ts`
- `school-cronicle/api/src/app/app.module.ts`
- `school-cronicle/api/project.json`
