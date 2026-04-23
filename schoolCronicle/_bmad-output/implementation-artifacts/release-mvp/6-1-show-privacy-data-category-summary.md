# Story 6.1: Show Privacy Data Category Summary

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want to see a clear summary of personal data categories processed,  
so that I understand privacy implications.

## Acceptance Criteria

1. Given an authenticated teacher, when privacy information is opened, then data categories are presented in clear language.
2. Given privacy information is displayed, when rendered on supported devices, then content is accessible and responsive.

## Tasks / Subtasks

- [x] Define privacy summary information model and source content (AC: 1)
  - [x] Identify the initial data-category set and plain-language descriptions from product/privacy requirements
  - [x] Structure category content for stable rendering (title, description, examples/notes where needed)
  - [x] Keep sensitive/internal implementation details out of user-facing copy
- [x] Implement authenticated privacy summary surface in web app (AC: 1, 2)
  - [x] Add a dedicated privacy information view/section reachable from existing in-product flow
  - [x] Render category cards/rows with clear headings and concise language
  - [x] Ensure only authenticated users can access the summary surface
- [x] Ensure accessibility and responsive behavior (AC: 2)
  - [x] Use semantic headings/lists/landmarks for screen-reader clarity
  - [x] Validate keyboard navigation and focus order through privacy content
  - [x] Ensure layout remains readable on narrow and wide breakpoints
- [x] Align copy and UX consistency with existing product style (AC: 1, 2)
  - [x] Reuse established premium-neutral design tokens and component spacing
  - [x] Keep microcopy concise, non-legalistic, and action-oriented
  - [x] Avoid color-only emphasis for important distinctions
- [x] Add tests for privacy summary rendering and access behavior (AC: 1, 2)
  - [x] Web test: authenticated route/view renders all defined data categories
  - [x] Web test: unauthenticated access is blocked/redirected via session guard behavior
  - [x] Web test: essential accessibility text/structure exists in rendered output
- [x] Validate quality gates and scope boundaries (AC: 1, 2)
  - [x] Run focused web lint/tests for privacy summary implementation
  - [x] Keep profile correction flow in Story 6.2 scope
  - [x] Keep erasure/restriction invocation flow in Story 6.3 scope

## Dev Notes

- This story opens Epic 6 by introducing a teacher-facing privacy information surface.
- Scope is clear summary presentation, not policy execution workflows.
- Keep content simple and understandable for non-technical users.

### Previous Story Intelligence

- Prior epics established authenticated app shell and session/guard patterns that should be reused.
- UI already uses a premium-neutral design system and accessible status/text patterns.
- Story should integrate without regressing appointments workflows.

### Architecture Guardrails

- Maintain boundaries within `web/features` and existing auth/session guard structure.
- Avoid introducing backend dependencies unless required by accepted scope; static/config-driven content is acceptable if aligned with product intent.
- Keep response/error contracts unchanged for unrelated modules.

### Technical Requirements

- Web:
  - provide an authenticated privacy summary surface with clear category content
  - content must be readable, responsive, and keyboard/screen-reader friendly
  - route/view should integrate with existing navigation/session behavior
- Data/content:
  - use plain-language category descriptions
  - avoid exposing sensitive implementation internals

### Security and Compliance Notes

- Privacy guidance must not leak secrets or system internals.
- Access to the privacy summary should follow existing authenticated access patterns.
- Content should support transparency goals without over-disclosing technical controls.

### UX Notes

- Categories should be scannable and easy to understand at a glance.
- Copy should emphasize clarity over legal jargon.
- Responsive layout and typography must preserve readability on mobile.

### Testing Requirements

- Web:
  - authenticated rendering of privacy categories
  - unauthenticated blocking/redirect behavior
  - accessibility-oriented structure assertions
- Run web lint/test quality gates for touched files.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 6.1]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR26]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Project Structure & Boundaries]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story selected per user instruction to skip Epic 5 and proceed with Epic 6.
- Context synthesized from Epic 6 definition and current sprint state.

### Completion Notes List

- Added an authenticated `/privacy` route guarded by `authSessionGuard` and connected it to a new privacy summary feature component.
- Implemented plain-language privacy categories with responsive card layout and semantic structure for headings and list content.
- Added in-product navigation between appointments and privacy summary via explicit header actions.
- Added tests covering guarded route configuration, privacy summary rendering, and navigation behavior.
- Verified with `npx nx lint web` and `npx nx test web`.

### File List

- `school-cronicle/web/src/app/app.routes.ts`
- `school-cronicle/web/src/app/app.routes.spec.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.css`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
- `school-cronicle/web/src/app/features/privacy/privacy-summary.component.ts`
- `school-cronicle/web/src/app/features/privacy/privacy-summary.component.css`
- `school-cronicle/web/src/app/features/privacy/privacy-summary.component.spec.ts`
- `_bmad-output/implementation-artifacts/6-1-show-privacy-data-category-summary.md`
