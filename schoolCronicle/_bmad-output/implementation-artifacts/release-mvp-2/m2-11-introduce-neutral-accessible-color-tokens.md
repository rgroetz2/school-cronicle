# Story M2.11: Introduce Neutral Accessible Color Tokens

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,  
I want clearer color semantics that remain accessible,  
so that I can scan statuses and actions quickly without visual strain.

## Acceptance Criteria

1. Given the design token/theme layer, when colors are refreshed, then a neutral palette with accessible contrast is applied.
2. Semantic usage for status, emphasis, and feedback is consistent across core screens.

## Tasks / Subtasks

- [ ] Define neutral color tokens and semantic mapping (AC: 1, 2)
  - [ ] Map tokens for background/surface/text/status/feedback/action emphasis.
  - [ ] Verify contrast for key combinations in core flows.
- [ ] Apply token updates to shared theme and component styles (AC: 1, 2)
  - [ ] Keep non-color indicators for validation and status states.
  - [ ] Minimize visual churn outside targeted refresh scope.
- [ ] Add visual/accessibility checks for updated palette.
  - [ ] Validate contrast and focus visibility across core routes.
  - [ ] Add regression checks for status semantics.

## Dev Notes

- This is a light refresh foundation story; avoid major structural redesign.
- Keep compatibility with existing Angular Material theming approach.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story M2.11]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - visual refresh direction]
- [Source: `_bmad-output/planning-artifacts/prd.md` - MVP 2 UX constraints]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

### Completion Notes List

### File List
