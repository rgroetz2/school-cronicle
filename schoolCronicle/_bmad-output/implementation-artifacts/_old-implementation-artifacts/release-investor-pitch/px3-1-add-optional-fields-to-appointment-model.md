# Story PX3.1: Add Optional Fields to Appointment Model

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want additional optional fields on appointments,  
so that I can record useful classroom context.

## Acceptance Criteria

1. Given create/edit draft flow, when I edit an appointment, then I can enter class/grade, guardian name, and location.
2. Given existing appointments without these fields, when they are loaded and edited, then they remain valid and do not break existing flows.

## Tasks / Subtasks

- [x] Extend appointment model with optional metadata fields (AC: 1, 2)
  - [x] Add `classGrade`, `guardianName`, and `location` as optional fields in frontend draft contracts
  - [x] Ensure compatibility with existing records that do not include these fields
  - [x] Keep defaults non-blocking (empty/undefined)
- [x] Extend create/edit draft UI with optional inputs (AC: 1)
  - [x] Add class/grade input in draft editor
  - [x] Add guardian name input in draft editor
  - [x] Add location input in draft editor
  - [x] Keep field labels and hierarchy clear without increasing visual overload
- [x] Wire optional metadata through create/update flows (AC: 1, 2)
  - [x] Include optional fields in create draft payload assembly
  - [x] Include optional fields in update draft payload assembly
  - [x] Ensure open/edit/save cycles preserve optional metadata values
- [x] Preserve existing required-field submit behavior (AC: 2)
  - [x] Do not add optional fields to submission gating logic
  - [x] Keep existing required fields (`title`, `appointmentDate`, `category`) as the only metadata blockers
- [x] Add tests and quality checks (AC: 1, 2)
  - [x] Tests for creating/editing drafts with optional metadata populated
  - [x] Tests for legacy drafts missing optional metadata
  - [x] Regression test to confirm submit gate remains unchanged
  - [x] Run focused web lint/tests for touched files

## Dev Notes

- This story introduces optional metadata capture in the editor and model, complementing PX2.2 filtering.
- Keep implementation frontend-focused and compatible with current API/dummy-mode behavior.
- Optional fields must improve context without affecting submission speed.

### Previous Story Intelligence

- PX2.2 added metadata-based filters (`class/grade`, `guardian name`, `location`) and model normalization safety.
- PX1.3 established a zone-based editor layout where optional fields should fit naturally.
- Existing submit gate validates only required metadata and must remain unchanged.

### Architecture Guardrails

- Prefer changes in `web` model/UI layers first to preserve demo reliability.
- Ensure records without optional metadata remain first-class and editable.
- Maintain deterministic behavior for local demo flows.

### Testing Requirements

- Validate optional field capture and persistence in create/update interactions.
- Validate compatibility with mixed datasets (with and without optional metadata).
- Validate no regression in submission readiness and submit behavior.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story PX3.1]
- [Source: `_bmad-output/implementation-artifacts/px2-2-add-new-optional-metadata-filters.md`]
- [Source: `_bmad-output/implementation-artifacts/px1-3-reduce-workspace-cognitive-load-via-section-re-layout.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story artifact created from PX3.1 epic definition and aligned with current pitch UX implementation stream.

### Completion Notes List

- Extended draft editor form contract with optional metadata fields (`classGrade`, `guardianName`, `location`) and added corresponding inputs.
- Wired optional metadata into create/update payload assembly while keeping required submit gate logic unchanged.
- Preserved compatibility for legacy drafts by defaulting missing optional values to empty form values on open/reset cycles.
- Added test assertions that verify optional metadata is sent on create/update requests and added a dedicated legacy-compatibility test.
- Verified quality with `npx nx test web` and lint diagnostics for touched files.

### File List

- `_bmad-output/implementation-artifacts/px3-1-add-optional-fields-to-appointment-model.md`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
