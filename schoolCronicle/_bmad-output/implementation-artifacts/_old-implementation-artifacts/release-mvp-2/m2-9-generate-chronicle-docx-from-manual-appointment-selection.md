# Story M2.9: Generate Chronicle .docx from Manual Appointment Selection

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an authorized user,  
I want to select appointments manually and export them to Word,  
so that I can build a first chronicle draft with editorial control.

## Acceptance Criteria

1. Given export access, when I manually select appointments and start export, then the system generates a `.docx` file.
2. Export content includes selected appointments, narrative text, participants, and printable images.

## Tasks / Subtasks

- [x] Build manual selection flow for chronicle export (AC: 1)
  - [x] Allow selecting/deselecting eligible appointment entries.
  - [x] Validate selection state before export action.
- [x] Implement export API/service for `.docx` generation (AC: 1, 2)
  - [x] Accept selected appointment IDs and resolve required linked content.
  - [x] Return generated file artifact/stream with stable metadata.
- [x] Map export payload content for narrative, participants, printable media (AC: 2)
  - [x] Include only printable-marked media.
  - [x] Ensure ordering and section grouping are deterministic.
- [x] Add tests for selection flow and export payload integrity.

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

- Added manual chronicle selection controls in appointments list for export-eligible records.
- Implemented `POST /api/appointments/chronicle/export` endpoint with selection validation and school/teacher-scoped resolution.
- Added `.docx` generation service using `docx` package; response returns stable file metadata and base64 artifact.
- Export content includes title/date/category/status, narrative text, participants, and printable-only image names.
- Applied deterministic ordering by appointment date then id in export payload mapping.
- Added integration coverage for chronicle export artifact generation.

### File List

- `school-cronicle/api/src/modules/appointments/appointments.service.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.integration.spec.ts`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
