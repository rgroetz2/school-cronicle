# Story UX3.7: Verify Cross-Screen CRUD Action Consistency with Tests

Status: drafted

## Story

As a product owner,  
I want automated checks for bottom CRUD action behavior,  
so that regressions are caught quickly.

## Acceptance Criteria

1. Tests verify `Create`, `Save`, and `Delete` visibility and enabled-state rules for create and edit modes.
2. Tests verify successful create/save/delete outcomes for appointment and contact editors.
3. Tests verify failure paths keep user context and show actionable feedback.

## Tasks / Subtasks

- [ ] Add component/integration tests for mode-based action states.
- [ ] Add e2e coverage for appointment and contact CRUD action flows.
- [ ] Add accessibility assertions for keyboard focus order and control labeling in bottom action bar.
