# Story UX3.2: Enforce Mode-Aware Create/Save/Delete Rules

Status: drafted

## Story

As a teacher,  
I want CRUD actions to match whether I am creating a new record or editing an existing one,  
so that I cannot trigger the wrong action.

## Acceptance Criteria

1. Given create mode, when bottom actions are shown, then `Create` is actionable and `Save`/`Delete` are hidden or disabled.
2. Given edit mode, when bottom actions are shown, then `Save` and `Delete` are actionable and `Create` is hidden or disabled.
3. Invalid mode/action combinations are prevented both visually and in handler logic.

## Tasks / Subtasks

- [ ] Define mode contract (`create` vs `edit`) in CRUD editor state.
- [ ] Bind action enablement/visibility to mode contract.
- [ ] Add tests for all action/mode combinations.
