# Story 3.2: Build School List and Filter Grid

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an admin,
I want a filterable Excel-like grid for `school`,
so that I can quickly find and review school records.

## Acceptance Criteria

1. Given existing `school` records, when the list screen renders, then records appear in a row/column table-like grid.
2. Given filter criteria changes, when filters are applied, then the row set updates consistently by key columns.

## Tasks / Subtasks

- [x] Build `school` list grid UI shell (AC: 1)
  - [x] Add grid columns for `name`, `type`, `address`, `description`, `comment`
  - [x] Render optional values with explicit placeholder display
- [x] Add list data retrieval and binding (AC: 1)
  - [x] Load `school` records from backend service/facade
  - [x] Keep loading/empty/error states aligned to current app patterns
- [x] Implement filter/search controls (AC: 2)
  - [x] Add text search and key-column filters
  - [x] Keep filtering deterministic and stable
- [x] Add focused UI tests (AC: 1, 2)
  - [x] Verify grid structure and filter behavior

## Dev Notes

- Keep Excel-like row/column scanability aligned with UX direction.
- Preserve architecture rule: component presentation + service/facade data flow.
- Do not include CRUD editor interaction wiring in this story (covered in 3.3/3.4).

### Project Structure Notes

- Frontend feature area: `school-cronicle/web/src/app/features/*`
- Shared UI helpers: `school-cronicle/web/src/app/shared/*` or `libs/ui/*` where applicable

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 3, Story 3.2]
- [Source: `_bmad-output/planning-artifacts/ux-design-directions.html` - Grid interaction direction]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story context generated via `bmad-create-story` workflow (batch run for Epic 3).

### Completion Notes List

- Added `school` list/filter screen with Excel-like row/column table layout and required headers.
- Added list loading + deterministic filtering by search and `type` through `AuthApiService.listSchools()`.
- Added optional-field placeholder rendering for `description` and `comment`.

### File List

- `_bmad-output/implementation-artifacts/3-2-build-school-list-and-filter-grid.md`
- `school-cronicle/web/src/app/features/school/school.component.ts`
- `school-cronicle/web/src/app/features/school/school.component.css`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
