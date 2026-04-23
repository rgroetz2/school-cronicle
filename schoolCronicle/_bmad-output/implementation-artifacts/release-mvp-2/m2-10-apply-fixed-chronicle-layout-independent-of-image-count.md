# Story M2.10: Apply Fixed Chronicle Layout Independent of Image Count

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an editor,  
I want consistent layout in every generated chronicle section,  
so that output remains predictable even with varying media counts.

## Acceptance Criteria

1. Given generated chronicle sections, when appointments have 0, 1, 2, or 3 printable images, then section structure and typography remain fixed.
2. Image slots follow deterministic placement rules without layout drift.

## Tasks / Subtasks

- [ ] Define fixed section template rules for chronicle `.docx` rendering (AC: 1, 2)
  - [ ] Standardize heading, text, participant, and media placement regions.
  - [ ] Define slot behavior for 0..3 printable images.
- [ ] Implement deterministic renderer logic using fixed template (AC: 1, 2)
  - [ ] Keep typography and spacing stable across cases.
  - [ ] Prevent content shifts from variable media counts.
- [ ] Validate output fidelity with golden samples (AC: 1, 2)
  - [ ] Generate sample docs for 0/1/2/3 printable-image cases.
  - [ ] Compare layout consistency and slot ordering.

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

### File List
