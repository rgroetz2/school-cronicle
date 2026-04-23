# Story M2.6: Assign Participants to Appointments from Contacts

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want to link contacts to appointments as participants,  
so that events/trips reflect who is involved.

## Acceptance Criteria

1. Given an appointment editor modal, when I add participants from the contacts list, then selected contacts are linked to the appointment.
2. Participant details are visible in list/detail contexts as secondary metadata.

## Tasks / Subtasks

- [x] Add appointment-participant relation in data model and API payloads (AC: 1)
  - [x] Support link/unlink operations for contacts.
  - [x] Enforce same-school relationship constraints.
- [x] Implement participant picker in appointment modal (AC: 1)
  - [x] Search/select from contacts directory.
  - [x] Show selected participants with remove controls.
- [x] Display participant metadata in list/detail areas (AC: 2)
  - [x] Keep output concise and readable.
  - [x] Ensure consistency with optional metadata display patterns.
- [x] Add tests for participant linking, persistence, and rendering.

## Dev Notes

- Depends on M2.5 contacts availability.
- Participant rendering should not overload row density in list view.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story M2.6]
- [Source: `_bmad-output/planning-artifacts/prd.md` - Release MVP 2 Addendum, FR37]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - participant linkage model impacts]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - participant assignment rules]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

### Completion Notes List

- Added `participants` relation on appointment drafts with `{ contactId, name, role }`.
- Extended create/update appointment payloads with `participantContactIds` and persisted resolved participant snapshots.
- Enforced same-school participant constraints in API by validating each contact id against school-scoped contacts; invalid ids return `APPOINTMENT_PARTICIPANT_NOT_FOUND`.
- Added participant picker in appointment modal with contact search and select/unselect actions.
- Surfaced participant metadata in appointment list rows via concise summary text.
- Added integration and component tests covering participant link persistence and request payload behavior.

### File List

- `school-cronicle/api/src/modules/appointments/appointment.types.ts`
- `school-cronicle/api/src/modules/appointments/appointments.service.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.ts`
- `school-cronicle/api/src/modules/appointments/appointments.module.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.integration.spec.ts`
- `school-cronicle/api/src/modules/contacts/contacts.module.ts`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.css`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
