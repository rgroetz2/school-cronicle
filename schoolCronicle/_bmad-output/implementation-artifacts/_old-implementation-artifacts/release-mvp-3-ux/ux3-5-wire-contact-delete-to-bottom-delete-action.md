# Story UX3.5: Wire Contact Delete to Bottom Delete Action

Status: in-progress

## Story

As a teacher,  
I want to delete an existing contact from the bottom action bar,  
so that I can maintain a clean participants directory.

## Acceptance Criteria

1. Given contact edit mode, when I click `Delete` and confirm, then the contact is deleted.
2. Given delete success, then the contacts list refreshes and the modal/editor exits or reflects removal.
3. Given confirmation cancel, then no deletion occurs and data remains unchanged.

## Tasks / Subtasks

- [ ] Add contact delete confirmation flow in contact editor.
- [ ] Trigger frontend contact delete service method from bottom action bar.
- [ ] Add regression tests for confirm/cancel/error paths.

## Dev Agent Record

### Debug Log References

- `npx nx lint web` (pass)
- `npx nx lint web-e2e` (pass)
- `npx nx test web --include=web/src/app/features/contacts/contacts.mode-actions.spec.ts --include=web/src/app/core/auth-api.service.spec.ts` (pass)
- `npx nx test web` (fails in existing appointments component suite; see notes)

### Completion Notes

- Wired bottom delete action in contacts modal to real flow (`onContactDeleteAction` -> `deleteContact`) with confirmation prompt.
- Connected delete to frontend service method `AuthApiService.deleteContact(...)`, including loading state and disabled-state protections to avoid overlapping actions.
- On successful delete, modal closes, form state resets, selected contact clears, and contacts list refreshes.
- Added regression coverage in contacts unit tests for delete action gating and confirm/cancel/error paths.
- Extended contacts e2e workflow to include delete confirmation and post-delete list/status verification.
- Story remains `in-progress` due to unrelated existing full-suite failures in `appointments.component.spec.ts`.

### File List

- `school-cronicle/web/src/app/features/contacts/contacts.component.ts`
- `school-cronicle/web/src/app/features/contacts/contacts.mode-actions.spec.ts`
- `school-cronicle/web-e2e/src/contacts-workflow.spec.ts`

### Change Log

- 2026-04-25: Wired contact delete bottom action to service + confirmation flow and added unit/e2e regression coverage.
