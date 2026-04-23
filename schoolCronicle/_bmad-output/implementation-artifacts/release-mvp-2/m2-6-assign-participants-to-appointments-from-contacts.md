# Story M2.6: Assign Participants to Appointments from Contacts

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want to link contacts to appointments as participants,  
so that events/trips reflect who is involved.

## Acceptance Criteria

1. Given an appointment editor modal, when I add participants from the contacts list, then selected contacts are linked to the appointment.
2. Participant details are visible in list/detail contexts as secondary metadata.

## Tasks / Subtasks

- [ ] Add appointment-participant relation in data model and API payloads (AC: 1)
  - [ ] Support link/unlink operations for contacts.
  - [ ] Enforce same-school relationship constraints.
- [ ] Implement participant picker in appointment modal (AC: 1)
  - [ ] Search/select from contacts directory.
  - [ ] Show selected participants with remove controls.
- [ ] Display participant metadata in list/detail areas (AC: 2)
  - [ ] Keep output concise and readable.
  - [ ] Ensure consistency with optional metadata display patterns.
- [ ] Add tests for participant linking, persistence, and rendering.

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

### File List
