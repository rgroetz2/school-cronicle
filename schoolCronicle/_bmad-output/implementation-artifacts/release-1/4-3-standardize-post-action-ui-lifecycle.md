# Story 4.3: Standardize Post-Action UI Lifecycle

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want identical close/refresh behavior after CRUD actions,
so that workflows are predictable across modules.

## Acceptance Criteria

1. Given a CRUD editor opened from a grid, when `SAVE` succeeds, then editor closes and grid reflects latest persisted data.
2. Given a CRUD editor opened from a grid, when `CANCEL` is clicked, then editor closes without mutation.

## Tasks / Subtasks

- [ ] Audit existing school + school-personal editor lifecycle behavior (AC: 1, 2)
- [ ] Standardize save-success close and refresh flow (AC: 1)
- [ ] Standardize cancel-close-without-mutation flow (AC: 2)
- [ ] Add/adjust tests for lifecycle consistency (AC: 1, 2)

## Dev Notes

- Keep behavior deterministic and aligned across both modules.
- Ensure no hidden autosave side effects are introduced.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 4, Story 4.3]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story file created during Epic 4 initialization.

### Completion Notes List

- Story prepared for implementation.

### File List

- `_bmad-output/implementation-artifacts/release-1/4-3-standardize-post-action-ui-lifecycle.md`
