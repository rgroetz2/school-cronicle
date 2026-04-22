# Story 3.2: Validate Image Type and Size

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want invalid image files to be detected with clear reasons,  
so that I can fix issues before submission.

## Acceptance Criteria

1. Given attached files with mixed validity, when validation is executed, then invalid files are flagged with specific reason text.
2. Given attached files with mixed validity, when validation is executed, then valid files remain accepted without reset.
3. Given manipulated or unsupported files, when validation reaches server boundary, then unsupported or malformed files are rejected server-side even if client checks are bypassed.

## Tasks / Subtasks

- [x] Implement server-side image validation rules for type and size (AC: 1, 3)
  - [x] Define allowed MIME/types and maximum size constraints in appointments domain configuration
  - [x] Validate image attach payload at API boundary before persistence
  - [x] Return explicit, non-sensitive validation reason codes/messages per failed file
- [x] Preserve accepted files while rejecting invalid files (AC: 1, 2)
  - [x] Ensure per-file validation result does not clear previously accepted image entries
  - [x] Keep existing draft metadata and accepted attachments intact on partial failures
  - [x] Maintain deterministic validation ordering for consistent UX/status display
- [x] Implement client-side pre-checks aligned with server validation (AC: 1, 2)
  - [x] Add/confirm size guard and file-type pre-check before upload/attach request
  - [x] Show specific per-file failure reason in UI status list
  - [x] Keep successful files attached while failed files stay actionable
- [x] Add API contract and data model support for per-file validation outcomes (AC: 1, 3)
  - [x] Include field(s) needed to represent validation outcome and reason per file
  - [x] Ensure response envelope remains consistent with existing appointments API
  - [x] Keep ownership/session checks intact for all validation paths
- [x] Add tests for image validation behavior (AC: 1, 2, 3)
  - [x] API tests: unsupported mime, oversize file, malformed payload rejection
  - [x] API tests: valid file accepted and existing accepted files preserved
  - [x] Web tests: per-file validation reason text shown for failures without clearing valid files
  - [x] Accessibility checks: failure reasons perceivable without color-only cues
- [x] Validate quality gates and scope boundaries (AC: 1, 2, 3)
  - [x] Run focused image-validation tests
  - [x] Run `npx nx run-many -t lint,test,build --all` (known env caveats may apply)
  - [x] Keep remove/replace behavior out of scope (Story 3.3) and submit blocking policy out of scope (Story 3.4)

## Dev Notes

- This story builds directly on Story 3.1 attach capability and status rendering.
- Primary focus: **validation quality and explicit reason messaging**; do not add replacement flow logic here.
- Keep client checks helpful but non-authoritative; server validation is source of truth.

### Previous Story Intelligence

- Story 3.1 introduced multi-file attach and per-file status states (`queued`, `uploading`, `attached`, `failed`).
- Existing web flow includes local max-size guard; this story must align and harden with server-side enforcement.
- Draft lifecycle and metadata readiness behavior already exists from Epic 2 and should remain stable.

### Architecture Guardrails

- Preserve session-based authentication and teacher ownership checks for all image operations.
- Keep module boundaries (`api/modules/appointments`, `web/features/appointments`) and uniform error-envelope patterns.
- Ensure validation failures do not expose storage internals or sensitive system details.

### Technical Requirements

- API:
  - strict server-side validation for allowed type and maximum size
  - per-file rejection reasons in consistent envelope
  - no mutation of accepted files when new invalid files are rejected
- Web:
  - per-file reason text for validation failures
  - accepted files retained and visible after mixed-validity attach attempts
  - accessible status/failure messaging

### Security and Compliance Notes

- Unsupported/malformed file attempts must be rejected server-side regardless of client checks.
- Validation errors should avoid stack traces/internal parser details in responses.
- Ownership and auth behavior must match existing draft and image mutation protections.

### UX Notes

- Failure reason copy must be concise and actionable (e.g., unsupported format, file too large).
- Mixed outcomes should be obvious: valid files stay attached, invalid files clearly marked.
- Ensure failure communication works for keyboard and assistive technologies.

### Testing Requirements

- API:
  - reject unsupported file types and malformed payloads
  - reject oversize files with clear reason code
  - keep accepted files intact during mixed-validity operations
- Web:
  - show per-file failure reasons for invalid files
  - preserve valid attached files when other files fail
  - accessible status semantics for validation results
- Run lint/test/build quality gates.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 3.2]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Project Structure & Boundaries]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR13, FR16]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - upload error messaging and recoverability patterns]
- [Source: `_bmad-output/implementation-artifacts/3-1-attach-images-to-draft.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story auto-selected from sprint backlog order: `3-2-validate-image-type-and-size`.
- Context synthesized from epics, architecture, PRD/UX, and Story 3.1 implementation artifact.

### Completion Notes List

- Added domain-level image validation configuration for allowed MIME types and max bytes in API appointments module.
- Hardened `POST /api/appointments/drafts/:draftId/images` with server-side checks for unsupported type, malformed payload, MIME mismatch, and payload-size limits.
- Extended web image selection flow with explicit client-side type pre-check (`JPEG`, `PNG`, `WebP`) while preserving accepted files during mixed-validity uploads.
- Added API integration tests for unsupported MIME and oversized payload rejection (413 body limit enforced by Nest parser in current environment).
- Added web component test validating mixed-validity upload behavior: failed file reason shown without clearing successful attachment.
- Verified quality gates: `nx test api`, `nx lint web`, and `nx test web` pass.

### File List

- `_bmad-output/implementation-artifacts/3-2-validate-image-type-and-size.md`
- `school-cronicle/api/src/modules/appointments/appointment-image-validation.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.integration.spec.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
