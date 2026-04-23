# Story 6.3: Support Erasure/Restriction Process Invocation Path

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want a clear way to invoke school privacy processes for erasure/restriction,  
so that rights can be exercised through approved channels.

## Acceptance Criteria

1. Given privacy/help surface, when a teacher requests erasure/restriction path, then school-designated contact/process guidance is shown.
2. Given request invocation guidance is presented, when a teacher initiates the path, then request initiation is auditable where applicable.

## Tasks / Subtasks

- [x] Define erasure/restriction guidance content model (AC: 1)
  - [x] Identify required school-designated contact fields and process steps
  - [x] Structure content for clear invocation guidance (who to contact, what to include, expected next step)
  - [x] Keep language actionable and non-legalistic
- [x] Implement privacy invocation UX in existing privacy/help surface (AC: 1)
  - [x] Add dedicated erasure/restriction invocation section with clear CTA/actions
  - [x] Surface school contact/process information in accessible text format
  - [x] Ensure guidance is responsive and consistent with current design system
- [x] Add auditable initiation signal where applicable (AC: 2)
  - [x] Define lightweight auditable event capture boundary (client-side and/or API endpoint per architecture)
  - [x] Record invocation attempt metadata (actor/session, action type, timestamp) without secrets
  - [x] Keep audit behavior deterministic and non-blocking for user guidance flow
- [x] Preserve security and policy boundaries (AC: 1, 2)
  - [x] Keep invocation feature authenticated and scoped to current teacher session
  - [x] Avoid exposing internal policy implementation details
  - [x] Ensure feature does not imply automatic erasure/restriction completion
- [x] Add tests for guidance display and invocation audit behavior (AC: 1, 2)
  - [x] Web test: invocation guidance and school contact/process text is visible
  - [x] Web/API test: initiation action emits auditable event where configured
  - [x] Regression test: privacy summary and profile correction behaviors remain intact
- [x] Validate quality gates and scope boundaries (AC: 1, 2)
  - [x] Run focused lint/tests for touched modules
  - [x] Keep retention enforcement in Story 6.4 scope
  - [x] Keep in-product guidance enhancement for required fields/formats in Story 6.5 scope

## Dev Notes

- This story adds the invocation pathway for privacy rights processes, not the downstream process execution itself.
- Build on Story 6.1 privacy summary surfaces and Story 6.2 correction flows for a cohesive privacy area experience.
- Audit requirement is limited to initiation traceability where technically applicable.

### Previous Story Intelligence

- Story 6.1 introduced authenticated privacy summary surface and route.
- Story 6.2 added editable metadata correction form in the privacy surface.
- Existing session/auth patterns and component test setup can be reused.

### Architecture Guardrails

- Maintain boundaries in `web/features/privacy` and existing auth/session layers.
- If audit signal requires API support, follow current envelope and error-code conventions.
- Keep solution minimal and evolvable for later Epic 5/6 audit/privacy extensions.

### Technical Requirements

- Web:
  - present clear invocation guidance and contact/process details
  - provide explicit invocation action path with accessibility-first semantics
  - keep responsive behavior and keyboard navigation quality
- Audit/initiation:
  - capture invocation signal metadata where configured
  - do not collect secrets/unnecessary personal data
  - preserve user flow if audit signal write fails (unless policy says hard-fail)

### Security and Compliance Notes

- Invocation path must remain authenticated.
- Do not expose sensitive backend/internal policy details.
- Audit entries should contain only necessary operational metadata.

### UX Notes

- Invocation CTA should be obvious and understandable without legal expertise.
- Guidance should clearly distinguish “request initiated” from “request fulfilled.”
- Textual cues must carry meaning independent of color.

### Testing Requirements

- Web:
  - invocation guidance rendering and accessibility structure
  - invocation action behavior and feedback
- API/service (if used):
  - auditable event capture for initiation path
  - error-handling behavior does not silently drop user intent
- Run lint/test quality gates on touched projects.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 6.3]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR28, FR32]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Project Structure & Boundaries]
- [Source: `_bmad-output/implementation-artifacts/6-1-show-privacy-data-category-summary.md`]
- [Source: `_bmad-output/implementation-artifacts/6-2-enable-editable-profile-metadata-corrections.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story selected from Epic 6 backlog after Story 6.2 moved to review.
- Context synthesized from epics and existing privacy-surface implementation artifacts.

### Completion Notes List

- Added a dedicated erasure/restriction invocation section in privacy summary with clear contact and process guidance.
- Implemented auditable initiation capture in `AuthApiService` via a persisted local event log (`type`, `teacherId`, `initiatedAt`, `id`).
- Added explicit invocation actions for erasure and restriction and user-facing initiation feedback with reference IDs.
- Extended privacy component tests to cover invocation guidance visibility and auditable initiation behavior.
- Verified with `npx nx lint web` and `npx nx test web`.

### File List

- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/features/privacy/privacy-summary.component.ts`
- `school-cronicle/web/src/app/features/privacy/privacy-summary.component.css`
- `school-cronicle/web/src/app/features/privacy/privacy-summary.component.spec.ts`
- `_bmad-output/implementation-artifacts/6-3-support-erasure-restriction-process-invocation-path.md`
