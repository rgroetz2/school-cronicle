# Story 4.1: Submit Valid Appointment

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want to submit a fully valid appointment,  
so that my contribution enters downstream chronicle processing.

## Acceptance Criteria

1. Given a draft with valid metadata and images, when the teacher submits, then appointment status changes to submitted.
2. Given a successful submission, when the appointment is persisted, then a submission timestamp is stored and displayed.
3. Given validation or authorization failures, when submit is attempted, then submission is rejected with clear actionable feedback.

## Tasks / Subtasks

- [x] Implement submission lifecycle transition in appointments domain/API (AC: 1, 2)
  - [x] Extend appointment model to support `submitted` state and `submittedAt` timestamp
  - [x] Update submit endpoint to persist the state transition atomically for teacher-owned draft
  - [x] Ensure re-submit behavior is deterministic and policy-compliant (idempotent reject or no-op)
- [x] Preserve and integrate existing readiness gates from Epic 2 and Epic 3 (AC: 1, 3)
  - [x] Keep metadata required-field gate intact (title, appointmentDate, category)
  - [x] Keep image-validation gate intact (invalid/failed images block submit)
  - [x] Return deterministic blocked-submit payload for combined blockers
- [x] Implement web submission flow updates for submitted lifecycle (AC: 1, 2, 3)
  - [x] Trigger submit from selected draft and refresh local state from API response
  - [x] Display submitted timestamp and submitted status for successfully submitted records
  - [x] Show actionable validation/authorization failure feedback without losing user context
- [x] Protect submitted records from unintended mutation entry points (AC: 1, 3)
  - [x] Ensure edit controls are disabled or blocked once submitted (full read-only enforcement continues in Story 4.3)
  - [x] Ensure attach/remove image actions do not mutate submitted records
  - [x] Keep policy boundary explicit between Story 4.1 and Story 4.3
- [x] Add tests for submission lifecycle and failure handling (AC: 1, 2, 3)
  - [x] API integration test: valid draft submits to `submitted` with `submittedAt`
  - [x] API integration test: unauthorized or invalid submit remains rejected with clear error contract
  - [x] Web test: successful submit updates status/timestamp visibility and action affordances
  - [x] Web test: blocked submit retains actionable messaging and no state corruption
- [x] Validate quality gates and scope boundaries (AC: 1, 2, 3)
  - [x] Run focused API/web tests for submit lifecycle and error handling
  - [x] Run lint targets for touched projects
  - [x] Keep advanced submitted-view UX refinements in Story 4.2 and strict read-only policy completion in Story 4.3

## Dev Notes

- This story introduces the first real state transition from draft to submitted in the appointment lifecycle.
- Build on Story 2.4 (metadata submit gate) and Story 3.4 (image submit gate); both must remain intact.
- Scope includes successful submit transition and failure handling contract, not full visual state taxonomy (Story 4.2) or complete read-only policy hardening (Story 4.3).

### Previous Story Intelligence

- Story 2.4 introduced metadata-based submit gating and blocked-submit payload patterns.
- Story 3.4 added image-based submit blocking and combined blocker handling.
- Current web workspace already has submit readiness UI and submit action wiring; Story 4.1 extends it to persist real submitted lifecycle state.

### Architecture Guardrails

- Preserve session-based auth and teacher ownership checks for submit operations.
- Maintain module boundaries (`api/modules/appointments`, `web/features/appointments`) and response envelope conventions.
- Keep error payloads actionable, deterministic, and non-sensitive.

### Technical Requirements

- API:
  - submit transition updates record status to `submitted` and writes `submittedAt`
  - submit endpoint must continue to enforce existing readiness and authorization checks
  - response contract remains explicit for both success and blocked/error cases
- Web:
  - submitted status and timestamp must be visible after successful submit
  - submit action and related mutating controls must align with submitted lifecycle rules
  - failure states must preserve form/draft context and offer clear remediation

### Security and Compliance Notes

- Unauthorized submit attempts must remain rejected consistently.
- Submitted lifecycle updates must not bypass ownership/scope checks.
- Error messaging must not reveal internal persistence details.

### UX Notes

- Submission outcome should be immediately visible with textual status and timestamp.
- Failure feedback should map to actionable next steps (complete metadata, resolve images, re-authenticate).
- Status communication should remain perceivable via text, not color alone.

### Testing Requirements

- API:
  - successful submit transitions to `submitted` with timestamp
  - blocked submit preserves existing metadata/image blocker semantics
  - unauthorized submit remains rejected with expected contract
- Web:
  - submit success reflects updated state and timestamp
  - mutating actions respond correctly after submission
  - blocked/failed submit keeps context and clear messaging
- Run lint/test quality gates on touched projects.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 4.1]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Project Structure & Boundaries]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR18, FR20]
- [Source: `_bmad-output/implementation-artifacts/2-4-enforce-metadata-submission-gate.md`]
- [Source: `_bmad-output/implementation-artifacts/3-4-block-submit-on-image-validation-failures.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story auto-selected from sprint backlog order: `4-1-submit-valid-appointment`.
- Context synthesized from epics, architecture/PRD references, and completed Epic 2/3 implementation artifacts.

### Completion Notes List

- Implemented real submit transition in API and dummy-mode service (`draft` -> `submitted`) with persisted `submittedAt`.
- Kept Story 2.4/3.4 readiness gates intact and added deterministic rejection for already-submitted records.
- Added read-only guardrails for submitted records across update and attach-image API endpoints and in web action handlers.
- Updated appointments workspace to surface submitted status and timestamp in list metadata and submit feedback.
- Added/updated API and web tests for successful submission lifecycle and post-submit read-only behavior.
- Verified with `npx nx test api`, `npx nx lint web`, and `npx nx test web`.

### File List

- `api/src/modules/appointments/appointment.types.ts`
- `api/src/modules/appointments/appointments.service.ts`
- `api/src/modules/appointments/appointments.controller.ts`
- `api/src/modules/appointments/appointments.controller.integration.spec.ts`
- `web/src/app/core/auth-api.service.ts`
- `web/src/app/features/appointments/appointments.component.ts`
- `web/src/app/features/appointments/appointments.component.spec.ts`
- `_bmad-output/implementation-artifacts/4-1-submit-valid-appointment.md`
