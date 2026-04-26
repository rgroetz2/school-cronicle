# Story UX3.3: Apply Shared Action Bar to Appointment Editor

Status: in-progress

## Story

As a teacher,  
I want appointment editing to use the same bottom CRUD controls as other editors,  
so that behavior feels predictable throughout the app.

## Acceptance Criteria

1. Given appointment create mode, when I use bottom actions, then `Create` creates a new appointment.
2. Given appointment edit mode, when I use bottom actions, then `Save` updates and `Delete` removes the appointment when policy allows.
3. Success and error feedback is shown without dropping unrelated form values.

## Tasks / Subtasks

- [ ] Map existing appointment handlers to standardized action-bar events.
- [ ] Align labels and action ordering with shared contract.
- [ ] Add integration/e2e coverage for create, save, and delete appointment flows.

## Dev Agent Record

### Debug Log References

- `npx nx lint web` (pass)
- `npx nx test web --include=web/src/app/features/appointments/appointments.mode-actions.spec.ts --include=web/src/app/shared/crud-action-bar.component.spec.ts` (pass)
- `npx nx lint web-e2e` (pass)
- `npx nx test web` (fails in existing appointments component suite; see notes)

### Completion Notes

- Added appointment-focused mode behavior tests confirming modal action labels are create-only in create mode and save/delete in edit mode.
- Verified shared action bar wiring remains consistent with appointment handlers and UX3.2 mode contract.
- Confirmed targeted lint and tests pass for action bar and appointment mode behavior.
- Added/extended appointment e2e workflow coverage for create/save/delete behavior through modal action bar controls.
- Full web regression still fails in legacy `appointments.component.spec.ts` scenarios unrelated to this focused story, so story remains `in-progress`.

### File List

- `school-cronicle/web/src/app/features/appointments/appointments.mode-actions.spec.ts`
- `school-cronicle/web-e2e/src/appointments-workflow.spec.ts`

### Change Log

- 2026-04-25: Added appointment-specific mode/action coverage for shared CRUD action bar usage.
- 2026-04-25: Added e2e create/save/delete appointment workflow checks.
