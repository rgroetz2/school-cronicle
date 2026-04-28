# Story 4.2: Create Shared Excel-Like Grid Interaction Contract

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a frontend developer,
I want a shared grid interaction contract,
so that row/column behavior and double-click editing are consistent.

## Acceptance Criteria

1. Given list/filter screens for `school-personal` and `school`, when users interact with cells, then both screens implement consistent row/column presentation and selection behavior.
2. Given both list screens, when any data cell is double-clicked, then each supports the same open-record editor interaction.

## Tasks / Subtasks

- [x] Define reusable grid interaction contract (AC: 1, 2)
- [x] Apply shared contract to `school-personal` grid (AC: 1, 2)
- [x] Apply shared contract to `school` grid (AC: 1, 2)
- [x] Add/adjust tests for consistent grid interaction behavior (AC: 1, 2)

## Dev Notes

- Keep interaction consistency explicit in template and event wiring.
- Avoid introducing behavior drift between school and school-personal grids.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 4, Story 4.2]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story file created during Epic 4 initialization.

### Completion Notes List

- Added shared `GridRecordOpenDirective` to standardize cell open interactions (double-click and Enter key).
- Applied shared directive to both school and school-personal grid cells for consistent behavior.
- Added consistent selected-row visual state in both grids.

### File List

- `_bmad-output/implementation-artifacts/release-1/4-2-create-shared-excel-like-grid-interaction-contract.md`
- `school-cronicle/web/src/app/shared/grid-record-open.directive.ts`
- `school-cronicle/web/src/app/shared/grid-record-open.directive.spec.ts`
- `school-cronicle/web/src/app/features/school/school.component.ts`
- `school-cronicle/web/src/app/features/school/school.component.css`
- `school-cronicle/web/src/app/features/school-personal/school-personal.component.ts`
- `school-cronicle/web/src/app/features/school-personal/school-personal.component.css`
