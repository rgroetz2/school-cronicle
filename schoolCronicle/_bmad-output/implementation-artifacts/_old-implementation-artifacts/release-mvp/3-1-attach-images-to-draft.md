# Story 3.1: Attach Images to Draft

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want to attach one or more images to a draft,  
so that the appointment includes supporting media.

## Acceptance Criteria

1. Given an editable draft appointment, when the teacher selects image files, then files are attached to the draft context.
2. Given selected image files, when attachment is processed, then upload/attachment status is shown per file.

## Tasks / Subtasks

- [x] Implement teacher-scoped image attach endpoint on draft appointments (AC: 1, 2)
  - [x] Add authenticated attach API route for teacher-owned draft
  - [x] Persist image metadata and storage reference in draft context
  - [x] Return consistent API envelope and non-sensitive errors
- [x] Implement image storage integration for draft attachments (AC: 1)
  - [x] Add service-layer attach behavior with draft ownership checks
  - [x] Ensure draft-scoped image records can support multiple attachments
  - [x] Keep storage/media abstraction aligned with architecture guardrails
- [x] Add appointments UI attach flow for one or more images (AC: 1, 2)
  - [x] Add file-input interaction scoped to selected/editable draft
  - [x] Show per-file attachment/upload state (queued/uploading/attached/failed as supported)
  - [x] Preserve existing draft metadata form state while attaching files
- [x] Add list/detail representation of attached images (AC: 2)
  - [x] Render attached image rows/cards in draft workspace
  - [x] Include filename/type/size summary where available
  - [x] Keep keyboard accessibility and clear status announcements
- [x] Add tests for attach behavior and status visibility (AC: 1, 2)
  - [x] API tests for successful teacher-owned draft image attachment
  - [x] API tests for unauthorized or non-owned draft attach attempts
  - [x] Web tests for file selection and attached image status rendering
  - [x] Accessibility checks for upload state/status feedback semantics
- [x] Validate quality gates and scope boundaries (AC: 1, 2)
  - [x] Run focused image-attach tests
  - [x] Run `npx nx run-many -t lint,test,build --all` (known env caveats may apply)
  - [x] Keep validation-failure logic out of scope (Story 3.2/3.4)

## Dev Notes

- This story starts Epic 3 and builds on the completed Epic 2 draft workflows (create/list/open/edit/delete + submit readiness metadata gate).
- Keep this story focused on **attachment capability and visible status only**; detailed validation-rule enforcement belongs to Stories 3.2 and 3.4.
- Maintain backward compatibility with current draft behavior in local/dummy mode while supporting API-backed flow.

### Previous Story Intelligence

- Story 2.1–2.5 established draft lifecycle and selected-draft editing in appointments workspace.
- The current web implementation already contains local image attach/remove affordances in dummy/local mode.
- Story 2.5 notes image entries should remain draft-scoped and cleaned up when draft is deleted.

### Architecture Guardrails

- Preserve session-based auth and teacher ownership checks on all image mutations.
- Keep module boundaries (`api/modules/appointments`, `web/features/appointments`) and response-envelope conventions.
- Ensure storage/media references remain school/teacher scoped per architecture and future Epic 5 security requirements.

### Technical Requirements

- API:
  - teacher-scoped attach-image endpoint for draft appointments
  - attachment metadata persistence and retrieval in draft payloads
  - robust unauthorized/non-owned/unknown draft handling
- Web:
  - multi-file selection attach flow from opened draft context
  - visible per-file status for attachment processing
  - no loss of existing form input while attachment runs

### Security and Compliance Notes

- No cross-teacher or cross-draft attachment capability.
- Unauthenticated and out-of-scope attach attempts must be rejected consistently.
- Errors should avoid leaking storage internals or ownership details.

### UX Notes

- Attachment workflow should be simple, transparent, and recoverable.
- Upload/attach status must be perceivable and not rely on color only.
- Keep touch/keyboard interaction usable for investor-demo readiness.

### Testing Requirements

- API:
  - successful image attachment to teacher-owned draft
  - reject unauthenticated and non-owned draft attach requests
- Web:
  - image selection adds attachment entry and visible status
  - multiple files can be attached to same draft context
  - status messaging is visible and accessible
- Run lint/test/build quality gates.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 3.1]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Project Structure & Boundaries]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR11]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - upload row/status patterns]
- [Source: `_bmad-output/implementation-artifacts/2-5-remove-draft-appointment.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story auto-selected from sprint backlog order: `3-1-attach-images-to-draft`.
- Context synthesized from epics, architecture, PRD/UX, and completed Epic 2 implementation artifacts.

### Completion Notes List

- Added API in-memory image attachment model and endpoint: `POST /api/appointments/drafts/:draftId/images`.
- Extended API draft shape to include draft-scoped `images` metadata and added integration tests for success + unauthenticated rejection.
- Updated web attach flow to support multiple file selection with explicit per-file status states (`queued`, `uploading`, `attached`, `failed`).
- Added web unit test for per-file attachment status visibility and verified existing attach/remove flows remain green.
- Verified quality gates: `nx test api`, `nx lint web`, and `nx test web` all pass.

### File List

- `_bmad-output/implementation-artifacts/3-1-attach-images-to-draft.md`
- `school-cronicle/api/src/modules/appointments/appointment.types.ts`
- `school-cronicle/api/src/modules/appointments/appointments.service.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.integration.spec.ts`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.css`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
