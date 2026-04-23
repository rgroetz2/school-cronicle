# Story M2.7: Add Special Event Appointment Type with Optional Media

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want to record special events (e.g., retirements, town changes) as a dedicated appointment type,  
so that chronicle-relevant milestones are captured consistently.

## Acceptance Criteria

1. Given appointment creation/editing, when I select "Special Event" type, then I can capture title, date, category, and narrative description.
2. Optional images/documents can be attached.
3. Event is eligible for chronicle export selection.

## Tasks / Subtasks

- [ ] Extend appointment type taxonomy with "Special Event" (AC: 1)
  - [ ] Update validation and type mappings in UI/API.
  - [ ] Preserve compatibility with existing appointment types.
- [ ] Add special-event form handling in modal/editor (AC: 1)
  - [ ] Ensure required fields and narrative support.
  - [ ] Keep create/edit UX consistent with existing flow.
- [ ] Enable optional media/document attachment rules (AC: 2)
  - [ ] Reuse existing media validation pipelines where possible.
  - [ ] Ensure attach/remove behavior is resilient.
- [ ] Mark special events export-eligible in selection pipeline (AC: 3)
- [ ] Add tests for type behavior, fields, and export eligibility.

## Dev Notes

- Product decision: special events are an appointment type, not a separate module.
- This story feeds M2.9 export behavior.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story M2.7]
- [Source: `_bmad-output/planning-artifacts/prd.md` - Release MVP 2 Addendum, FR38]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - appointment type and export impacts]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

### Completion Notes List

### File List
