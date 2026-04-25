# Story UX3.7: Verify Cross-Screen CRUD Action Consistency with Tests

Status: in-progress

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

## Dev Agent Record

### Debug Log References

- `npx nx lint web` (pass)
- `npx nx lint web-e2e` (pass)
- `npx nx test web --include=web/src/app/shared/crud-action-bar.component.spec.ts --include=web/src/app/features/appointments/appointments.mode-actions.spec.ts --include=web/src/app/features/contacts/contacts.mode-actions.spec.ts --include=web/src/app/core/auth-api.service.spec.ts` (pass)
- `npx nx test web` (fails due to existing unrelated `appointments.component.spec.ts` regressions)

### Completion Notes

- Verified mode-aware CRUD action consistency with targeted specs across appointments and contacts.
- Kept cross-screen e2e CRUD flow coverage in place for both editors (`appointments-workflow` and `contacts-workflow`).
- Added accessibility assertions for shared bottom action bar group labeling and focusable control order.
- Added failure-path context assertions for contact delete flows (confirmation cancel + API error) to ensure state is preserved and feedback remains actionable.
- Full web regression remains blocked by pre-existing `appointments.component.spec.ts` failures, so story remains `in-progress`.

### File List

- `school-cronicle/web/src/app/shared/crud-action-bar.component.spec.ts`
- `school-cronicle/web/src/app/features/contacts/contacts.mode-actions.spec.ts`
- `school-cronicle/web-e2e/src/appointments-workflow.spec.ts`
- `school-cronicle/web-e2e/src/contacts-workflow.spec.ts`

### Change Log

- 2026-04-25: Added cross-screen CRUD action consistency accessibility and failure-path assertions; validated targeted web test suites.
