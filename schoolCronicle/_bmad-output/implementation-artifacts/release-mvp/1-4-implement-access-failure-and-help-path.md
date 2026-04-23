# Story 1.4: Implement Access Failure and Help Path

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want clear failure feedback and support guidance when sign-in fails,  
so that I know how to recover access quickly.

## Acceptance Criteria

1. Given invalid credentials or a blocked account state, when sign-in fails, then a non-sensitive error message is shown.
2. Given a sign-in failure, when recovery options are displayed, then a clear school help/contact path is visible.

## Tasks / Subtasks

- [x] Extend auth failure contract for support-oriented feedback (AC: 1, 2)
  - [x] Keep failure messaging non-sensitive and account-enumeration safe
  - [x] Standardize API failure envelope for sign-in errors so UI can map to help-path rendering
  - [x] Add blocked-account style failure handling path (generic externally; actionable internally for UX mapping)
- [x] Implement login help/contact UX for failed access (AC: 1, 2)
  - [x] Add explicit help/contact section on login failure state
  - [x] Render concise guidance text for recovery without exposing sensitive account details
  - [x] Ensure help/contact path is visible and keyboard accessible
- [x] Add configurable school contact presentation (AC: 2)
  - [x] Source support contact from environment/config stub appropriate for V1
  - [x] Show contact details in a deterministic fallback-safe format
  - [x] Ensure contact visibility only in relevant auth failure/help contexts
- [x] Add tests for failure and help-path behavior (AC: 1, 2)
  - [x] API tests for invalid/blocked auth responses preserving non-sensitive semantics
  - [x] Web tests for error rendering plus help/contact visibility on failed sign-in
  - [x] Accessibility-oriented checks (presence/labels/focusable links or elements)
- [x] Validate quality gates and scope (AC: 1, 2)
  - [x] Run focused auth/login failure tests
  - [x] Run `npx nx run-many -t lint,test,build --all`
  - [x] Keep scope limited to access failure/help path (no new auth lifecycle features beyond story need)

## Dev Notes

- This story builds directly on Stories 1.2 and 1.3 auth base.
- Emphasize clarity and recoverability for teachers while preserving security posture.
- Keep messaging calm and plain-language, aligned with UX guidance.

### Previous Story Intelligence

- Story 1.2 already provides non-sensitive invalid-credential responses and login UI error rendering.
- Story 1.3 added session lifecycle handling and route protection; do not regress those flows while updating login failure UX.
- Existing login component and auth service patterns should be reused for minimal-risk extension.

### Architecture Guardrails

- Maintain server-side session auth model; do not leak auth internals via error content.
- Keep API envelope patterns consistent with current auth endpoints.
- Use existing feature/core structure in web app:
  - `web/src/app/features/auth`
  - `web/src/app/core`
- Preserve naming and formatting rules from architecture document.

### Technical Requirements

- API:
  - Continue returning non-sensitive auth failures
  - Add/standardize structured data needed by UI help-path rendering
- Web:
  - Show clear failure text
  - Provide support/contact path in failure state
  - Keep behavior deterministic across repeated failed attempts

### Security and Compliance Notes

- Never reveal whether a teacher account exists or is blocked via precise diagnostic messages.
- Avoid exposing sensitive internals in UI, API responses, or logs.
- Keep failure handling resilient and consistent to avoid user confusion and security probing signals.

### UX Notes

- Follow UX spec principles:
  - calm, actionable error messaging
  - no blame/scolding tone
  - explicit recovery path
- Ensure help path is perceivable and operable on mobile and keyboard navigation.

### Testing Requirements

- API tests:
  - invalid credential failure response remains non-sensitive
  - blocked-account-mapped failure path remains non-sensitive externally
- Web tests:
  - failed sign-in shows expected generic error
  - help/contact section appears on failure
  - contact element is accessible and focusable
- Run full workspace quality gates.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 1.4]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR4, FR32]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - Error tone, recovery paths, accessibility]
- [Source: `_bmad-output/implementation-artifacts/1-2-implement-teacher-sign-in.md`]
- [Source: `_bmad-output/implementation-artifacts/1-3-implement-sign-out-and-session-lifecycle.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story auto-selected from sprint backlog order: `1-4-implement-access-failure-and-help-path`.
- Context synthesized from epics, architecture, PRD, UX, and previous auth story outputs.
- Extended sign-in unauthorized API envelope with stable fields: `code`, `reason`, and `support` contact metadata.
- Added blocked-account mapped failure reason while preserving generic, non-sensitive user-facing message.
- Implemented login help/contact fallback-safe path shown only on auth failure.
- Added API and web tests for invalid credential and blocked-account scenarios, including support link accessibility.
- Validation executed:
  - `npx nx test api`
  - `npx nx test web`
  - `npx nx run-many -t lint,test,build --all`

### Completion Notes List

- Implemented secure access-failure handling with a standardized API error envelope and non-enumerating messaging.
- Added explicit support/help path rendering in login failure UI with deterministic fallback contact details.
- Added blocked-account failure mapping for UX flow differentiation without exposing sensitive account state.
- Added and passed tests for invalid and blocked auth failure paths plus support contact visibility/accessibility.
- Full lint/test/build gates pass and story is ready for review.

### File List

- `_bmad-output/implementation-artifacts/1-4-implement-access-failure-and-help-path.md`
- `school-cronicle/api/src/modules/auth/auth.controller.ts`
- `school-cronicle/api/src/modules/auth/auth.controller.integration.spec.ts`
- `school-cronicle/api/src/modules/auth/auth.service.ts`
- `school-cronicle/api/src/modules/auth/auth.service.spec.ts`
- `school-cronicle/api/src/modules/auth/auth.types.ts`
- `school-cronicle/web/src/app/features/auth/login.component.ts`
- `school-cronicle/web/src/app/features/auth/login.component.html`
- `school-cronicle/web/src/app/features/auth/login.component.css`
- `school-cronicle/web/src/app/features/auth/login.component.spec.ts`

### Change Log

- 2026-04-22: Implemented Story 1.4 access-failure and help path behavior, added tests, and moved status to `review`.
