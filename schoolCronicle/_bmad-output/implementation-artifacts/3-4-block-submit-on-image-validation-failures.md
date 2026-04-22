# Story 3.4: Block Submit on Image Validation Failures

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want submit blocked while any image remains invalid,  
so that submissions cannot include non-compliant media.

## Acceptance Criteria

1. Given a draft with at least one invalid image, when submit is attempted, then submission is rejected.
2. Given blocked submission due to invalid images, when the teacher views submit readiness, then the blocking condition is clearly presented in readiness summary.

## Tasks / Subtasks

- [x] Implement image-validation submit gate in appointments domain/API (AC: 1)
  - [x] Extend submit-readiness evaluation to include invalid-image blocking state
  - [x] Reject submit endpoint when any image is in failed/invalid state
  - [x] Return explicit, non-sensitive rejection reason and invalid image context
- [x] Integrate image gate with existing metadata gate behavior (AC: 1, 2)
  - [x] Combine metadata and image readiness checks without breaking existing Story 2.4 flow
  - [x] Ensure API response identifies both missing metadata and image-related blockers when present
  - [x] Keep submit contract consistent and deterministic
- [x] Implement web submit-blocking UX for invalid images (AC: 1, 2)
  - [x] Disable submit action while failed image entries exist
  - [x] Surface clear readiness summary for image-based block reason
  - [x] Keep draft save/edit/remove/replace recovery actions available while blocked
- [x] Ensure recovery unblocks submit immediately when image issues resolved (AC: 2)
  - [x] Recompute readiness after remove/replace operations from Story 3.3
  - [x] Transition UI from blocked to ready state without full page reset
  - [x] Preserve valid images and metadata during unblocking flow
- [x] Add tests for image submit-gate behavior (AC: 1, 2)
  - [x] API tests for blocked submit with invalid image state
  - [x] API tests for successful submit readiness once image issues are resolved
  - [x] Web tests for disabled submit and visible image-blocking summary
  - [x] Accessibility checks for blocking-state messaging (non-color-only cues)
- [x] Validate quality gates and scope boundaries (AC: 1, 2)
  - [x] Run focused submit-gate and recovery tests
  - [ ] Run `npx nx run-many -t lint,test,build --all` (known env caveats may apply)
  - [x] Keep actual submission lifecycle/status transition out of scope (Epic 4)

## Dev Notes

- This story completes Epic 3 by enforcing submit blocking for invalid image states.
- Build on Story 2.4 metadata gate and Story 3.1–3.3 image attach/validation/recovery behavior.
- Scope is gate enforcement and readiness communication, not full submitted-state lifecycle.

### Previous Story Intelligence

- Story 2.4 introduced metadata-based submit readiness and blocked submit behavior.
- Story 3.1 introduced image attachment and per-file status tracking.
- Story 3.2 added explicit type/size validation with failure reasons.
- Story 3.3 added remove/replace recovery for failed images while preserving valid data.

### Architecture Guardrails

- Preserve session-based auth and teacher ownership checks on submit and image operations.
- Maintain module boundaries (`api/modules/appointments`, `web/features/appointments`) and response envelope patterns.
- Keep error details actionable but non-sensitive.

### Technical Requirements

- API:
  - submit readiness must account for invalid image states
  - blocked submit response includes image-block reason data
  - deterministic contract when both metadata and image blockers exist
- Web:
  - submit control disabled on invalid image state
  - readiness summary clearly communicates image blocker(s)
  - immediate unblock after failed image removal/replacement

### Security and Compliance Notes

- No submit path should bypass invalid image state checks.
- Unauthorized submit attempts remain rejected consistently.
- Blocking details should not expose internals or sensitive storage metadata.

### UX Notes

- Submit block reason must be explicit and easy to resolve.
- Recovery path should be discoverable from readiness section and image area.
- Messaging must be perceivable via text and status semantics, not color alone.

### Testing Requirements

- API:
  - blocked submit when failed images exist
  - submit readiness returns ready once image issues resolved
  - existing metadata gate behavior remains intact
- Web:
  - submit button disabled while invalid image state exists
  - readiness summary includes image block reason
  - submit unblocks after remove/replace resolves failed image entries
- Run lint/test/build quality gates.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 3.4]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Project Structure & Boundaries]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR14]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - readiness summary and blocking-state patterns]
- [Source: `_bmad-output/implementation-artifacts/2-4-enforce-metadata-submission-gate.md`]
- [Source: `_bmad-output/implementation-artifacts/3-3-remove-replace-invalid-images.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story auto-selected from sprint backlog order: `3-4-block-submit-on-image-validation-failures`.
- Context synthesized from epics, architecture, PRD/UX, and completed Epic 2/3 implementation artifacts.

### Completion Notes List

- Added API submit gate evaluation for invalid/legacy images so submit is blocked when metadata or image checks fail.
- Extended blocked-submit response payload to include `invalidImages` (id + name) alongside `missingRequiredFields`.
- Updated appointments readiness UI to show image-based blocking reasons and keep submit disabled while failed upload entries exist.
- Added API integration coverage for blocked submit with injected invalid image state and web coverage for submit unblock after failed-image recovery.
- Verified with `npx nx test api`, `npx nx lint web`, and `npx nx test web`.

### File List

- `api/src/modules/appointments/appointments.service.ts`
- `api/src/modules/appointments/appointments.controller.ts`
- `api/src/modules/appointments/appointments.controller.integration.spec.ts`
- `web/src/app/features/appointments/appointments.component.ts`
- `web/src/app/features/appointments/appointments.component.spec.ts`
- `_bmad-output/implementation-artifacts/3-4-block-submit-on-image-validation-failures.md`
