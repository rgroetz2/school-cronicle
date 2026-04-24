# Story M2.10: Apply Fixed Chronicle Layout Independent of Image Count

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an editor,  
I want consistent layout in every generated chronicle section,  
so that output remains predictable even with varying media counts.

## Acceptance Criteria

1. Given generated chronicle sections, when appointments have 0, 1, 2, or 3 printable images, then section structure and typography remain fixed.
2. Image slots follow deterministic placement rules without layout drift.

## Tasks / Subtasks

- [x] Define fixed section template rules for chronicle `.docx` rendering (AC: 1, 2)
  - [x] Standardize heading, text, participant, and media placement regions.
  - [x] Define slot behavior for 0..3 printable images.
- [x] Implement deterministic renderer logic using fixed template (AC: 1, 2)
  - [x] Keep typography and spacing stable across cases.
  - [x] Prevent content shifts from variable media counts.
- [x] Validate output fidelity with golden samples (AC: 1, 2)
  - [x] Generate sample docs for 0/1/2/3 printable-image cases.
  - [x] Compare layout consistency and slot ordering.

## Dev Notes

- This story refines M2.9 output quality and determinism.
- Keep layout rules explicit and versioned for future changes.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story M2.10]
- [Source: `_bmad-output/planning-artifacts/prd.md` - Release MVP 2 Addendum (fixed layout constraint)]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - deterministic layout/export template note]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - chronicle layout UX rule]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

### Completion Notes List

- Introduced fixed chronicle section line renderer with explicit, stable regions: date, category, status, narrative, participants.
- Added deterministic 3-slot image mapping (`Image slot 1..3`) with explicit `[empty]` placeholders for missing printable images.
- Updated `.docx` export pipeline to use fixed section lines for every selected appointment section, preventing layout drift from variable image counts.
- Added unit tests for 0/1/2/3 printable-image scenarios verifying consistent slot structure and ordering.

### File List

- `school-cronicle/api/src/modules/appointments/appointments.service.ts`
- `school-cronicle/api/src/modules/appointments/appointments.service.spec.ts`
