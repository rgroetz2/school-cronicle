# Story 3.1: Implement School Data Model and Validation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want a `school` entity with required and optional fields,
so that school metadata is stored consistently.

## Acceptance Criteria

1. Given the `school` schema, when records are created or updated, then required fields are `name`, `type`, and `address`.
2. Given optional fields `description` and `comment`, when values are missing, then records remain valid.

## Tasks / Subtasks

- [x] Define `school` domain model and storage contract (AC: 1, 2)
  - [x] Add required fields: `name`, `type`, `address`
  - [x] Add optional fields: `description`, `comment`
- [x] Implement create/update validation rules (AC: 1, 2)
  - [x] Enforce required-field validation for `name`, `type`, `address`
  - [x] Accept empty/missing `description` and `comment`
- [x] Add backend tests for required/optional field behavior (AC: 1, 2)
  - [x] Include positive and negative payload coverage

## Dev Notes

- Keep API payload keys camelCase and align persistence naming with architecture conventions.
- Keep this story focused on schema/validation and avoid list/CRUD UI work.
- Follow uniform API error envelope and typed validation messages.

### Project Structure Notes

- Backend modules: `school-cronicle/api/src/modules/*`
- Frontend contracts/facades (only if needed for model typing): `school-cronicle/web/src/app/*`
- Story artifact location: `_bmad-output/implementation-artifacts/`

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 3, Story 3.1]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Data Architecture]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Naming/Format Patterns]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story context generated via `bmad-create-story` workflow (batch run for Epic 3).

### Completion Notes List

- Implemented backend `school` model/service/controller/module with required + optional field handling.
- Added strict validation for required fields (`name`, `type`, `address`) and optional text support for `description` and `comment`.
- Added backend integration tests covering valid admin CRUD payloads and validation behavior.

### File List

- `_bmad-output/implementation-artifacts/3-1-implement-school-data-model-and-validation.md`
- `school-cronicle/api/src/modules/school/school.types.ts`
- `school-cronicle/api/src/modules/school/school.service.ts`
- `school-cronicle/api/src/modules/school/school.controller.ts`
- `school-cronicle/api/src/modules/school/school.module.ts`
- `school-cronicle/api/src/modules/school/school.controller.integration.spec.ts`
- `school-cronicle/api/src/app/app.module.ts`
- `school-cronicle/api/project.json`
