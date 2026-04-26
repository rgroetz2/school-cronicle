# Story UX3.1: Define Shared Bottom CRUD Action Bar Contract

Status: in-progress

## Story

As a teacher,  
I want the same action layout at the bottom of every appointment/contact CRUD editor,  
so that I always know where to create, save, or delete records.

## Acceptance Criteria

1. Given an appointment or contact CRUD editor is open, when the bottom action region renders, then it uses one shared action-bar pattern with `Create`, `Save`, and `Delete` controls.
2. Labels, ordering, spacing, and loading/disabled states are consistent across appointments and contacts.
3. The action row is keyboard reachable and touch-friendly.

## Tasks / Subtasks

- [x] Define shared action-bar component/API for create, save, delete controls.
- [x] Apply shared layout/styles to appointment and contact editors.
- [x] Add unit tests for rendering consistency and action state props.

## Dev Agent Record

### Debug Log References

- `npx nx lint web` (pass)
- `npx nx test web --include=web/src/app/shared/crud-action-bar.component.spec.ts` (pass)
- `npx nx test web` (fails in existing broader appointments suite; see completion notes)

### Completion Notes

- Added reusable `CrudActionBarComponent` with a shared API for Create/Save/Delete actions and consistent state/labels.
- Integrated the shared action bar in both appointment and contact editor modals so control placement and behavior are aligned.
- Added focused unit tests for visibility, disabled-state, and event emission behavior in `crud-action-bar.component.spec.ts`.
- Story implementation is functionally complete for UX3.1 scope, but full web regression suite currently reports multiple failing existing appointments tests that need separate stabilization.

### File List

- `school-cronicle/web/src/app/shared/crud-action-bar.component.ts`
- `school-cronicle/web/src/app/shared/crud-action-bar.component.css`
- `school-cronicle/web/src/app/shared/crud-action-bar.component.spec.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/contacts/contacts.component.ts`

### Change Log

- 2026-04-25: Implemented shared CRUD action bar component and applied it to appointments/contacts editors.
