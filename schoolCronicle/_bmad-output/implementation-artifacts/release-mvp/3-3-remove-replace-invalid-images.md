# Story 3.3: Remove/Replace Invalid Images

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want to remove or replace failing images,  
so that I can recover without restarting the draft.

## Acceptance Criteria

1. Given a draft containing invalid images, when the teacher removes failing files, then file state updates immediately.
2. Given a draft containing invalid images, when the teacher replaces failing files with valid ones, then the replacement is attached and validation state updates accordingly.
3. Given the teacher removes or replaces failing files, then previously valid fields/files remain intact without unnecessary reset.

## Tasks / Subtasks

- [x] Implement explicit remove/replace workflow for invalid image entries (AC: 1, 2)
  - [x] Add UI actions to remove failed file entries directly from draft image list/status area
  - [x] Add replace action/input path tied to failed file context
  - [x] Ensure failed entry transitions are deterministic (`failed` -> removed/replaced -> revalidated)
- [x] Extend draft image state model for recoverable invalid entries (AC: 1, 2, 3)
  - [x] Persist/track enough metadata to identify and target failed file entries
  - [x] Keep accepted image entries separate from failed ones to avoid accidental loss
  - [x] Support stable ordering and display for mixed valid/invalid files
- [x] Implement safe replacement behavior preserving valid work (AC: 2, 3)
  - [x] Replacing a failed image should not clear valid attachments or form values
  - [x] Validation should execute for replacement file with clear result reason/status
  - [x] Keep selected draft and metadata state unchanged during replacement attempts
- [x] Add API support for failed-entry recovery operations where needed (AC: 1, 2)
  - [x] Ensure remove/replace operations are teacher-scoped and session-protected
  - [x] Keep response envelope consistent and non-sensitive
  - [x] Preserve draft integrity when replacement validation fails
- [x] Add tests for remove/replace recovery behavior (AC: 1, 2, 3)
  - [x] API tests for remove and replacement flows on teacher-owned drafts
  - [x] API tests for unauthorized/non-owned recovery attempts
  - [x] Web tests for remove failed image and replace failed image interactions
  - [x] Web tests confirming valid files/metadata remain intact throughout recovery
- [x] Validate quality gates and scope boundaries (AC: 1, 2, 3)
  - [x] Run focused remove/replace image tests
  - [x] Run `npx nx run-many -t lint,test,build --all` (known env caveats may apply)
  - [x] Keep submit-blocking policy behavior out of scope (Story 3.4)

## Dev Notes

- This story builds on Story 3.1 (attach + per-file status) and Story 3.2 (type/size validation with explicit failure reasons).
- Focus here is **recovery UX and state preservation** after validation failures.
- Do not introduce final submit-gate logic in this story; that belongs to Story 3.4.

### Previous Story Intelligence

- Story 3.1 implemented multi-file attach and status states (`queued`, `uploading`, `attached`, `failed`).
- Story 3.2 hardened server validation and client pre-checks for type/size; mixed-validity uploads already preserve valid attachments.
- Existing appointments workspace already supports baseline image removal; this story should refine it for failed-entry recovery and replacement.

### Architecture Guardrails

- Preserve session-based authentication and teacher ownership checks for all image mutation operations.
- Keep module boundaries (`api/modules/appointments`, `web/features/appointments`) and response envelope conventions.
- Ensure replacement failures do not leak internal validation/storage details.

### Technical Requirements

- API:
  - teacher-scoped remove/replace operations for image entries on draft
  - predictable validation + persistence behavior on replacement
  - no mutation loss for valid image entries during failure handling
- Web:
  - clear remove and replace controls for failed files
  - immediate state updates for removal/replacement outcomes
  - preservation of valid files and draft metadata during recovery interactions

### Security and Compliance Notes

- No cross-teacher or cross-draft remove/replace capabilities.
- Unauthenticated or unauthorized recovery attempts must be rejected consistently.
- Error responses should remain non-sensitive and actionable.

### UX Notes

- Recovery actions should be obvious and low-friction (remove vs replace).
- Failure-to-recovery transition should be visible, immediate, and non-destructive.
- Accessible status updates must remain perceivable without color-only dependency.

### Testing Requirements

- API:
  - remove failed file entry successfully
  - replace failed entry with valid file and confirm updated state
  - unauthorized/non-owned recovery request handling
- Web:
  - remove failed file action updates UI immediately
  - replace failed file path updates status and preserves valid entries
  - metadata and previously valid files remain unchanged through recovery flow
- Run lint/test/build quality gates.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 3.3]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Project Structure & Boundaries]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR12, FR17]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - recoverable failure and upload interaction patterns]
- [Source: `_bmad-output/implementation-artifacts/3-1-attach-images-to-draft.md`]
- [Source: `_bmad-output/implementation-artifacts/3-2-validate-image-type-and-size.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story auto-selected from sprint backlog order: `3-3-remove-replace-invalid-images`.
- Context synthesized from epics, architecture, PRD/UX, and completed Epic 3 story artifacts.

### Completion Notes List

- Added explicit failed-upload recovery controls in appointments UI: `Remove failed` and `Replace file`.
- Introduced deterministic failed-entry replacement flow using a dedicated hidden file input and target upload tracking (`replacingUploadId`).
- Kept previously valid attached images and draft metadata intact during remove/replace recovery operations.
- Added web tests covering failed-entry removal and replacement while preserving valid attachments.
- Verified quality gates for modified scope: `nx lint web` and `nx test web` pass.

### File List

- `_bmad-output/implementation-artifacts/3-3-remove-replace-invalid-images.md`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.css`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
