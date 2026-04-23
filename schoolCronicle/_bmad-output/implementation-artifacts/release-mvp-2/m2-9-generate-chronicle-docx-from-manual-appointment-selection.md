# Story M2.9: Generate Chronicle .docx from Manual Appointment Selection

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an authorized user,  
I want to select appointments manually and export them to Word,  
so that I can build a first chronicle draft with editorial control.

## Acceptance Criteria

1. Given export access, when I manually select appointments and start export, then the system generates a `.docx` file.
2. Export content includes selected appointments, narrative text, participants, and printable images.

## Tasks / Subtasks

- [ ] Build manual selection flow for chronicle export (AC: 1)
  - [ ] Allow selecting/deselecting eligible appointment entries.
  - [ ] Validate selection state before export action.
- [ ] Implement export API/service for `.docx` generation (AC: 1, 2)
  - [ ] Accept selected appointment IDs and resolve required linked content.
  - [ ] Return generated file artifact/stream with stable metadata.
- [ ] Map export payload content for narrative, participants, printable media (AC: 2)
  - [ ] Include only printable-marked media.
  - [ ] Ensure ordering and section grouping are deterministic.
- [ ] Add tests for selection flow and export payload integrity.

## Dev Notes

- This is chronicle generation v1; editorial control is manual selection.
- Ensure export remains school-scope safe and traceable.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story M2.9]
- [Source: `_bmad-output/planning-artifacts/prd.md` - Release MVP 2 Addendum, FR39]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - docx export service boundary impacts]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

### Completion Notes List

### File List
