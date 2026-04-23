# Story 2.4: Enforce Metadata Submission Gate

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want submit to be blocked until required metadata is complete,  
so that I can avoid incomplete submissions.

## Acceptance Criteria

1. Given a draft with missing required metadata, when submit is attempted, then submission is blocked.
2. Given a draft with missing required metadata, when the teacher views submission readiness, then the UI shows which requirements remain.

## Tasks / Subtasks

- [x] Implement metadata readiness evaluation in appointments domain (AC: 1, 2)
  - [x] Define required metadata set for submit readiness (title, appointment date, category)
  - [x] Add reusable readiness evaluator usable by API and web surfaces
  - [x] Keep behavior deterministic and aligned with existing metadata validation rules
- [x] Enforce submit gate on API submission path (AC: 1)
  - [x] Add/extend submit endpoint guard to reject incomplete metadata before submission transition
  - [x] Return consistent, non-sensitive error envelope for blocked submit attempts
  - [x] Preserve teacher ownership and session authorization checks
- [x] Implement web submit readiness UX and blocking behavior (AC: 1, 2)
  - [x] Add submit action control to draft workspace with disabled state when metadata incomplete
  - [x] Render readiness summary listing missing metadata requirements
  - [x] Keep save-draft/edit capabilities available while submit is gated
  - [x] Ensure keyboard and screen-reader accessibility for readiness and blocked states
- [x] Add tests for submission gate and readiness feedback (AC: 1, 2)
  - [x] API tests for blocked submit contract and unauthorized submit attempts
  - [x] API tests for successful submit readiness path when metadata is complete
  - [x] Web tests for disabled submit control and visible missing-requirements summary
  - [x] Accessibility checks for readiness and blocked-submit feedback semantics
- [x] Validate quality gates and story boundaries (AC: 1, 2)
  - [x] Run focused submit-gate tests
  - [x] Run `npx nx run-many -t lint,test,build --all` (still blocked by existing `web:build:production` environment failure)
  - [x] Keep scope limited to metadata gate only (image gate remains Story 3.4)

## Dev Notes

- This story follows Story 2.3, which now includes required `appointmentDate` metadata in draft create/edit flows.
- Focus on metadata-only submit readiness and blocking behavior; do not add image validation gating here.
- Keep submit gate transparent and actionable so teachers can quickly resolve missing fields.

### Previous Story Intelligence

- Story 2.1 introduced draft creation baseline.
- Story 2.2 introduced list/open flow for draft continuation.
- Story 2.3 introduced editable metadata with required fields and controlled category options.

### Architecture Guardrails

- Maintain session-based auth and teacher ownership constraints on appointment actions.
- Preserve API envelope patterns and non-sensitive error semantics.
- Keep feature/domain organization (`modules/appointments`, `features/appointments`) and test placement consistency.

### Technical Requirements

- API:
  - metadata readiness check before submit transition
  - explicit blocked-submit response for incomplete metadata
  - strict teacher-scoped authorization
- Web:
  - submit control with disabled/blocked behavior for incomplete metadata
  - explicit readiness summary of missing required metadata
  - no regression in create/edit/save draft flows

### Security and Compliance Notes

- Submit attempts for non-owned drafts must remain blocked by ownership checks.
- Unauthenticated submit attempts must be rejected consistently.
- Error payloads should not leak sensitive ownership or internal policy details.

### UX Notes

- Disabled submit should clearly communicate why action is unavailable.
- Missing metadata guidance should be concise, specific, and actionable.
- Readiness feedback should be accessible without relying on color alone.

### Testing Requirements

- API:
  - blocked submit on incomplete metadata
  - successful submit when metadata complete
  - unauthorized/forbidden submit behavior unchanged
- Web:
  - readiness summary lists missing required metadata
  - submit remains disabled until metadata is complete
  - blocked/ready states are perceivable and accessible
- Run full lint/test/build gates.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 2.4]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Project Structure & Boundaries]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR8, FR15]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - submit readiness/gate patterns]
- [Source: `_bmad-output/implementation-artifacts/2-3-edit-draft-metadata-and-category.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story auto-selected from sprint backlog order: `2-4-enforce-metadata-submission-gate`.
- Context synthesized from epics, architecture, PRD, UX, and previous implementation artifacts.

### Completion Notes List

- Added metadata readiness evaluation for required draft fields (`title`, `appointmentDate`, `category`).
- Added `POST /api/appointments/drafts/:draftId/submit` readiness gate with teacher ownership and session checks.
- Added submit-readiness panel in appointments UI with missing-field summary and disabled submit control until metadata is complete.
- Added API and web tests for submit readiness flow, disabled submit behavior, and unauthenticated submit rejection.
- Focused lint/test checks pass; full run-many remains blocked by existing `web:build:production` environment issue.

### File List

- `_bmad-output/implementation-artifacts/2-4-enforce-metadata-submission-gate.md`
- `school-cronicle/api/src/modules/appointments/appointments.service.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.integration.spec.ts`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
