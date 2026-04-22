# Story 6.4: Apply Retention Rules to Drafts, Submissions, and Media

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a compliance stakeholder,  
I want configured retention policies enforced,  
so that data is not kept beyond policy.

## Acceptance Criteria

1. Given retention configuration for records/media, when retention processing runs, then eligible records are handled per policy.
2. Given retention processing executes, when retention actions occur, then those actions are auditable.
3. Given retention action failures occur, when processing continues, then failed actions are retried or flagged to operations without silent data-loss side effects.

## Tasks / Subtasks

- [x] Define retention policy model and processing scope (AC: 1)
  - [x] Specify retention windows for drafts, submitted records, and associated media
  - [x] Define policy input/config shape for deterministic processing
  - [x] Establish eligibility criteria and ordering for retention actions
- [x] Implement retention processing flow (AC: 1, 3)
  - [x] Add retention processor/service entry point for evaluating eligible records
  - [x] Apply policy actions to drafts/submissions/media without cross-entity integrity breaks
  - [x] Ensure processing is idempotent and safe on repeated runs
- [x] Implement auditable retention action logging (AC: 2)
  - [x] Record retention action metadata (actor/system, target, action, timestamp, outcome)
  - [x] Preserve non-sensitive logging boundaries
  - [x] Keep log format consistent with existing operational/audit patterns
- [x] Implement failure handling, retry, and operational flagging (AC: 3)
  - [x] Classify retryable vs non-retryable failures
  - [x] Add retry strategy or queue marker for retryable failures
  - [x] Surface non-retryable failures for operational visibility (without silent drops)
- [x] Protect data integrity and policy boundaries (AC: 1, 3)
  - [x] Ensure referential handling between appointments and media remains valid
  - [x] Prevent partial destructive behavior that leaves orphaned or inconsistent state
  - [x] Keep retention processing constrained to configured policy scope
- [x] Add tests for retention behavior and resilience (AC: 1, 2, 3)
  - [x] Unit/integration tests for eligible vs ineligible retention decisions
  - [x] Tests for audit log emission on successful retention actions
  - [x] Tests for retry/flag paths on failures and no silent data loss
- [x] Validate quality gates and scope boundaries (AC: 1, 2, 3)
  - [x] Run focused lint/tests for touched API/domain modules
  - [x] Keep in-product guidance behavior in Story 6.5 scope
  - [x] Keep privacy contact surface behavior in Story 6.6 scope

## Dev Notes

- This story introduces backend/domain retention enforcement and operational robustness.
- Build on existing draft/submitted/media model and privacy requirements from Epic 6.
- Scope is policy enforcement and processing reliability, not user-facing retention configuration UI.

### Previous Story Intelligence

- Epic 3/4 established draft/submitted/media lifecycle and referential expectations.
- Epic 6 stories 6.1-6.3 focused on privacy-facing UX and auditable invocation paths.
- Retention work should preserve existing behavior while enforcing lifecycle expiry rules.

### Architecture Guardrails

- Prefer implementation in API/domain layers with clear separation from web UI components.
- Keep processing deterministic, observable, and safe for scheduled/background execution.
- Maintain existing response envelope and error-handling conventions where applicable.

### Technical Requirements

- Retention processor:
  - evaluates record/media eligibility by configured policy
  - applies policy actions safely and idempotently
  - records audit outcomes for each action
- Failure handling:
  - retry/flag mechanism must prevent silent data-loss side effects
  - operational visibility must include clear failure reason and target context

### Security and Compliance Notes

- Retention actions must align with privacy/compliance policy boundaries.
- Logs should avoid secrets and unnecessary personal-data exposure.
- Failed actions must not leave hidden inconsistent states.

### UX Notes

- No direct end-user UI is required in this story.
- Any surfaced status copy in existing UI should remain non-technical and policy-safe.

### Testing Requirements

- API/domain:
  - policy decision correctness
  - audit logging behavior
  - retry/flag failure handling
  - referential integrity preservation
- Run lint/test quality gates for touched projects.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 6.4]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR29]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Project Structure & Boundaries]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/implementation-artifacts/6-3-support-erasure-restriction-process-invocation-path.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story selected from Epic 6 backlog after Story 6.3 moved to review.
- Context synthesized from epics and implementation artifacts across appointment/media lifecycle.

### Completion Notes List

- Added API/domain retention processing in `AppointmentsService` with deterministic policy windows (drafts and submitted records), safe candidate evaluation, and idempotent cleanup behavior across repeated runs.
- Added auditable retention action records for successful and failed actions, capturing target, action type, timestamp, media count, and outcome without exposing sensitive payloads.
- Added failure handling with operational flagging and retry metadata (`retryable`, `retryCount`, `nextRetryAt`) so inconsistent records are surfaced and retried instead of silently dropped.
- Added protected API entry point `POST /appointments/retention/run` and integration tests validating both cleanup/audit behavior and failure/retry signaling paths.
- Verified quality gates with `npx nx test api` and no linter issues in touched appointment files.

### File List

- `_bmad-output/implementation-artifacts/6-4-apply-retention-rules-to-drafts-submissions-and-media.md`
- `school-cronicle/api/src/modules/appointments/appointments.service.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.integration.spec.ts`
