# Story M2.12: Apply Light Visual Refresh to Core Views

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want a more modern and colorful (but calm) interface,  
so that daily workflows feel clearer and more engaging.

## Acceptance Criteria

1. Given login, list, modal, filter, and summary views, when the refresh is applied, then spacing, hierarchy, accent usage, and component styling are visibly improved.
2. Interaction patterns remain familiar (no major structural redesign).

## Tasks / Subtasks

- [ ] Apply token-driven visual polish to core view surfaces (AC: 1)
  - [ ] Update spacing and visual hierarchy in key containers.
  - [ ] Refresh accent and component treatment using M2.11 tokens.
- [ ] Refine view-specific styling for login/list/modal/filter/summary (AC: 1)
  - [ ] Preserve readability and reduced cognitive load.
  - [ ] Keep form and list semantics unchanged.
- [ ] Protect interaction familiarity and behavior contracts (AC: 2)
  - [ ] No navigation model overhaul.
  - [ ] No disruption to known task flow sequence.
- [ ] Add targeted visual regression and UX sanity checks.

## Dev Notes

- This story is intentionally incremental; prioritize consistency over novelty.
- Keep accessibility and non-color feedback rules preserved after visual changes.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story M2.12]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - light refresh scope and constraints]
- [Source: `_bmad-output/planning-artifacts/prd.md` - MVP 2 visual constraints]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

### Completion Notes List

### File List
