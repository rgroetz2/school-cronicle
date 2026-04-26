# Story UX3.2: Enforce Mode-Aware Create/Save/Delete Rules

Status: in-progress

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

## Dev Agent Record

### Debug Log References

- `npx nx lint web` (pass)
- `npx nx test web --include=web/src/app/shared/crud-action-bar.component.spec.ts --include=web/src/app/features/contacts/contacts.mode-actions.spec.ts --include=web/src/app/features/appointments/appointments.mode-actions.spec.ts` (pass)
- `npx nx test web` (fails in pre-existing appointments component suite; see notes)

### Completion Notes

- Added explicit mode contract getters in appointments and contacts editors (`create` vs `edit`) to drive Create/Save/Delete rendering.
- Added mode-gated action handlers to prevent invalid action combinations in handler logic (`onAppointmentCreateAction`, `onAppointmentSaveAction`, `onContactCreateAction`, `onContactSaveAction`).
- Added focused mode-action tests for appointments and contacts plus shared action-bar tests.
- Full regression suite currently has unrelated legacy failures in `appointments.component.spec.ts`; story remains `in-progress` until those are resolved.

### File List

- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/contacts/contacts.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.mode-actions.spec.ts`
- `school-cronicle/web/src/app/features/contacts/contacts.mode-actions.spec.ts`
- `school-cronicle/web/src/app/shared/crud-action-bar.component.spec.ts`

### Change Log

- 2026-04-25: Introduced mode-aware CRUD action gating and added focused mode tests for appointments/contacts.
