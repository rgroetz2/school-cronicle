# Story 4.2: Display Draft vs Submitted States

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want clear status indicators in list and detail views,  
so that I always understand entry state.

## Acceptance Criteria

1. Given appointments in mixed states, when list and detail pages render, then draft and submitted states are visually and textually distinct.
2. Given status indicators are shown, when teachers review appointment entries, then status representation does not rely on color alone.

## Tasks / Subtasks

- [x] Implement status display model for mixed lifecycle states (AC: 1)
  - [x] Confirm and normalize state fields consumed by UI (`status`, `submittedAt`)
  - [x] Ensure list and detail views receive consistent state values from API/service layers
  - [x] Preserve backward compatibility for existing draft-only data
- [x] Add explicit list-view status indicators (AC: 1, 2)
  - [x] Render textual labels for draft/submitted entries in appointment list
  - [x] Add semantic grouping/styling hooks for each state without color-only signaling
  - [x] Include submitted timestamp context where available
- [x] Add explicit detail-view status indicators (AC: 1, 2)
  - [x] Show current entry state in draft detail/editor panel
  - [x] Show submitted timestamp metadata in a readable format
  - [x] Keep messaging aligned with Story 4.1 submit feedback wording
- [x] Improve accessibility semantics for status communication (AC: 2)
  - [x] Ensure status text is perceivable independently of color
  - [x] Use existing semantic structure (`state-pill`, labels, clear copy) for screen and keyboard users
  - [x] Keep state communication concise and consistent across sections
- [x] Add tests for mixed-state rendering and accessibility cues (AC: 1, 2)
  - [x] Web test: mixed draft/submitted list entries display distinct textual state
  - [x] Web test: detail panel shows submitted metadata for submitted entries
  - [x] Web test: state meaning remains understandable without relying on color
- [x] Validate quality gates and scope boundaries (AC: 1, 2)
  - [x] Run focused web lint/tests for status rendering behavior
  - [x] Keep strict read-only policy enforcement in Story 4.3 scope
  - [x] Keep export/audit concerns out of scope (Epic 5)

## Dev Notes

- This story focuses on state communication and UX clarity for mixed appointment lifecycle states.
- Build on Story 4.1 lifecycle transition outputs (`status`, `submittedAt`) without reworking submit logic.
- Scope is visual/textual distinction and accessibility of state indicators; full policy lock-down remains Story 4.3.

### Previous Story Intelligence

- Story 4.1 introduced lifecycle transition from `draft` to `submitted` and timestamp persistence.
- Current appointments workspace already exposes list/readiness/form/image areas; Story 4.2 should apply consistent state labels across these surfaces.
- Existing neutral design tokens and `state-pill` patterns should be reused for consistency.

### Architecture Guardrails

- Keep module boundaries (`web/features/appointments`, `web/core`) unchanged.
- Preserve API response contracts introduced in Story 4.1; avoid unrelated backend behavior changes.
- Maintain deterministic rendering for both dummy and API-backed paths.

### Technical Requirements

- Web:
  - clearly distinguish `draft` and `submitted` in list and detail contexts
  - include textual status labels and submitted timestamp where available
  - avoid color-only differentiation; labels/copy must carry meaning
- API/service integration:
  - consume existing `status` and `submittedAt` fields consistently
  - tolerate records without `submittedAt` in draft state

### Security and Compliance Notes

- Do not expose sensitive internals in status metadata.
- Ensure status display does not imply edit permissions beyond existing policy boundaries.
- Keep authorization behavior unchanged.

### UX Notes

- Status indicators should be glanceable and unambiguous.
- Submitted timestamp should be readable and consistently formatted.
- Distinction between states must remain clear for color-blind and assistive-technology users.

### Testing Requirements

- Web:
  - mixed-state list rendering
  - detail/status metadata visibility for submitted entries
  - non-color-only cues validated via textual assertions
- Run web lint/test targets on touched files.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 4.2]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Project Structure & Boundaries]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR19, FR20]
- [Source: `_bmad-output/implementation-artifacts/4-1-submit-valid-appointment.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story auto-selected from sprint backlog order: `4-2-display-draft-vs-submitted-states`.
- Context synthesized from epics and prior Epic 4 implementation artifact.

### Completion Notes List

- Normalized draft status compatibility in service layer by defaulting legacy/missing status records to `draft`.
- Expanded detail readiness panel with explicit textual status and submitted timestamp metadata.
- Preserved list-level textual state indicators and timestamp context for mixed `draft`/`submitted` records.
- Added focused web tests for mixed-state rendering and submitted-detail metadata visibility without color-only dependency.
- Verified with `npx nx lint web` and `npx nx test web`.

### File List

- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
- `_bmad-output/implementation-artifacts/4-2-display-draft-vs-submitted-states.md`
