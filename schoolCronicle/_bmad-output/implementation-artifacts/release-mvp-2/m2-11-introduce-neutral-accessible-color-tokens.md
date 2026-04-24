# Story M2.11: Introduce Neutral Accessible Color Tokens

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,  
I want clearer color semantics that remain accessible,  
so that I can scan statuses and actions quickly without visual strain.

## Acceptance Criteria

1. Given the design token/theme layer, when colors are refreshed, then a neutral palette with accessible contrast is applied.
2. Semantic usage for status, emphasis, and feedback is consistent across core screens.

## Tasks / Subtasks

- [x] Define neutral color tokens and semantic mapping (AC: 1, 2)
  - [x] Map tokens for background/surface/text/status/feedback/action emphasis.
  - [x] Verify contrast for key combinations in core flows.
- [x] Apply token updates to shared theme and component styles (AC: 1, 2)
  - [x] Keep non-color indicators for validation and status states.
  - [x] Minimize visual churn outside targeted refresh scope.
- [x] Add visual/accessibility checks for updated palette.
  - [x] Validate contrast and focus visibility across core routes.
  - [x] Add regression checks for status semantics.

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

- Added a neutral, accessibility-oriented global token set in `web/src/styles.css` including semantic surface, border, text, accent, focus, and feedback/status mappings.
- Fixed missing action emphasis token usage by defining `--accent` and `--accent-muted`, then aligned contact/appointment selection, active row state, and primary actions to semantic tokens.
- Replaced hardcoded color values across core screens (dashboard shell/home, login, privacy summary, appointments, contacts) with shared tokens to ensure consistent status/emphasis semantics.
- Preserved non-color cues (weight, borders, labels, hover/pressed states) while reducing visual churn to a light refresh.
- Ran lint diagnostics for all updated UI style files; no linter errors were reported.

### File List

- `school-cronicle/web/src/styles.css`
- `school-cronicle/web/src/app/features/dashboard/dashboard-shell.component.css`
- `school-cronicle/web/src/app/features/dashboard/dashboard-home.component.css`
- `school-cronicle/web/src/app/features/auth/login.component.css`
- `school-cronicle/web/src/app/features/privacy/privacy-summary.component.css`
- `school-cronicle/web/src/app/features/appointments/appointments.component.css`
- `school-cronicle/web/src/app/features/contacts/contacts.component.css`
