# Story PX4.2: Define 7-Minute Teacher Demo Path

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a sales presenter,  
I want a scripted in-app teacher flow,  
so that value is communicated quickly and consistently.

## Acceptance Criteria

1. Given demo mode, when I follow the scripted path, then I can show navigation, filtering, draft work, and submission readiness in under 7 minutes.
2. Given demo mode, when I follow the scripted path, then each step has a clear value message.

## Tasks / Subtasks

- [x] Define a deterministic 7-minute walkthrough sequence (AC: 1, 2)
  - [x] Break the flow into timed segments (target total <= 7:00)
  - [x] Cover mandatory path elements: navigation, filtering, draft work, submit readiness
  - [x] Define a fallback/skip step when live data differs from expectations
- [x] Create in-product demo guidance layer (AC: 1, 2)
  - [x] Add a presenter-visible step list or checklist (gated to demo mode)
  - [x] Surface concise value message text for each step
  - [x] Keep copy short, credible, and non-technical for live conversations
- [x] Align walkthrough with PX4.1 seed/reset behavior (AC: 1)
  - [x] Ensure step order matches canonical seeded dataset assumptions
  - [x] Include reset-first recommendation in guidance entry point
  - [x] Verify path still works after repeated reset cycles
- [x] Ensure guided flow remains unobtrusive and safe (AC: 2)
  - [x] Hide all walkthrough affordances when demo mode is off
  - [x] Prevent guidance UI from blocking normal teacher interactions
  - [x] Preserve current auth, read-only, and submit-gate policy semantics
- [x] Add tests and quality checks (AC: 1, 2)
  - [x] Component tests for demo-only visibility and step progression rendering
  - [x] Regression tests that flow surfaces required journey elements in expected order
  - [x] Focused web lint/tests for touched files

## Dev Notes

- PX4.2 is a presentation story layered on top of PX4.1 demo data reset.
- Prioritize predictable narrative over UI complexity: simple guided structure, clear messages, and deterministic order.
- Keep implementation in web layer; no new backend dependencies are required for the core scripted path.

### Previous Story Intelligence

- PX4.1 introduced demo gating (`PitchDemoModeService`), canonical seed/reset (`demo-seed.ts`), and in-app reset affordance in appointments header.
- Seed data now provides draft/submitted contrast, optional metadata coverage, and needs-attention signals that this scripted path should leverage.
- Existing workspace UX from PX1.x–PX3.x already supports the required journey segments; PX4.2 should orchestrate, not reinvent.

### Architecture Guardrails

- Reuse existing demo mode gate (`isPitchDemoModeEnabled()` / `PitchDemoModeService`) for visibility control.
- Keep walkthrough state local and deterministic; avoid mutating core domain data outside existing actions.
- Avoid coupling guidance logic too tightly to brittle selectors or volatile copy.

### Technical Requirements

- Demo-off behavior remains unchanged: no new visible controls or route side effects.
- Demo-on guidance must clearly map to: navigation -> filtering -> draft edit -> submit readiness.
- Guidance should support quick scanning and allow presenters to recover if they go off-script.

### Testing Requirements

- Validate demo-only render/hide behavior for walkthrough controls.
- Validate step/value-message pairing and ordering.
- Validate reset + walkthrough compatibility on fresh and repeated runs.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story PX4.2]
- [Source: `_bmad-output/implementation-artifacts/px4-1-add-demo-data-seed-reset-flow.md`]
- [Source: `school-cronicle/web/src/app/core/demo-mode.ts`]
- [Source: `school-cronicle/web/src/app/core/pitch-demo-mode.service.ts`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Implemented demo-only scripted walkthrough in appointments workspace with deterministic step timing and value messages.
- Added completion-state derivation from existing interactions (context navigation, active filters, opened draft, submit readiness).
- Added tests for demo-off hidden behavior and demo-on walkthrough ordering/value message coverage.

### Completion Notes List

- Added `demoPathSteps` walkthrough model with 6m45s total target and fallback guidance.
- Rendered a non-blocking demo script panel gated by `PitchDemoModeService` so non-demo sessions remain unchanged.
- Verified regression safety with `npx nx test web --skip-nx-cache` (47/47 passing).

### File List

- `_bmad-output/implementation-artifacts/release-investor-pitch/px4-2-define-7-minute-teacher-demo-path.md`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.css`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
