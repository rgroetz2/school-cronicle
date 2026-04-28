# Story 2.2: Build School-Personal List and Filter Grid

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an admin,
I want an Excel-like list/filter grid for `school-personal`,
so that I can scan and locate records quickly.

## Acceptance Criteria

1. Given existing `school-personal` records, when the list screen opens, then records are displayed in row/column grid format with clear headers.
2. Given filter/search input, when criteria are changed, then visible rows update consistently without breaking grid interaction.

## Tasks / Subtasks

- [x] Build `school-personal` list grid UI shell (AC: 1)
  - [x] Add required columns: `name`, `role`, `jobRole`, `class`, `startDate`
  - [x] Render optional values with explicit placeholder display
- [x] Add list data retrieval and binding (AC: 1)
  - [x] Load records from backend service/facade
  - [x] Keep loading/empty/error states consistent with app patterns
- [x] Implement filter/search controls (AC: 2)
  - [x] Add text search and role/jobRole filters
  - [x] Ensure row updates are deterministic
- [x] Add focused UI tests (AC: 1, 2)
  - [x] Verify row/column rendering and filter behavior

## Dev Notes

- Keep grid behavior aligned with Excel-like UX direction from planning docs.
- Preserve architecture rule: presentation in components, logic in facades/services.
- Avoid introducing CRUD editor interactions in this story (covered in 2.3/2.4).

### Project Structure Notes

- Target frontend feature area: `school-cronicle/web/src/app/features/*`
- Shared UI helpers: `school-cronicle/web/src/app/shared/*` or `libs/ui/*` where applicable

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 2, Story 2.2]
- [Source: `_bmad-output/planning-artifacts/ux-design-directions.html` - Grid interaction direction]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story context generated via `bmad-create-story` workflow (batch run for Epic 2).

### Completion Notes List

- Added `school-personal` feature screen with Excel-like row/column grid headers and optional-field placeholders.
- Added search, role, and jobRole filtering integrated through `AuthApiService.listSchoolPersonal()`.
- Added focused component spec covering grid rendering and editor-open interaction.

### File List

- `_bmad-output/implementation-artifacts/2-2-build-school-personal-list-and-filter-grid.md`
- `school-cronicle/web/src/app/features/school-personal/school-personal.component.ts`
- `school-cronicle/web/src/app/features/school-personal/school-personal.component.css`
- `school-cronicle/web/src/app/features/school-personal/school-personal.component.spec.ts`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/app.routes.ts`
