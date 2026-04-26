# Story 1.2: Implement Teacher Sign-In

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want to sign in with school-provisioned credentials,  
so that I can access my chronicle workspace securely.

## Acceptance Criteria

1. Given a valid school teacher account, when credentials are submitted on sign-in, then the user is authenticated and receives a secure session.
2. Given successful authentication, when sign-in completes, then the teacher is redirected to the appointments workspace.
3. Given invalid credentials, when sign-in is attempted, then a non-sensitive error message is shown without exposing account existence.

## Tasks / Subtasks

- [x] Create baseline auth module and login endpoint in API (AC: 1, 3)
  - [x] Add `auth` module structure in `apps/api/src/modules/auth` aligned to architecture boundaries
  - [x] Implement sign-in request DTO/input validation at API boundary
  - [x] Implement login handler returning success envelope and setting session cookie on valid credentials
  - [x] Implement invalid-credential path returning non-sensitive error text and appropriate status code
- [x] Add secure session configuration and login session lifecycle hooks (AC: 1)
  - [x] Configure session cookie hardening (`HttpOnly`, `Secure`, `SameSite`) by environment
  - [x] Add session rotation behavior on successful login
  - [x] Ensure auth/session middleware is wired consistently for subsequent protected routes
- [x] Implement web sign-in UI flow (AC: 1, 2, 3)
  - [x] Create login feature route and form using Angular Reactive Forms
  - [x] Add client-side required-field validation and accessible error surfaces
  - [x] Wire form submission to API auth endpoint
  - [x] Navigate to appointments workspace route after successful login
  - [x] Show calm, non-sensitive error message on failed login attempts
- [x] Add automated tests for auth behavior (AC: 1, 2, 3)
  - [x] Add API unit/integration tests for successful login and failed login behavior
  - [x] Add web unit tests for login form validation and submit outcomes
  - [x] Verify redirect behavior to workspace after successful sign-in
  - [x] Verify error message does not reveal whether account exists
- [x] Validate quality gates and alignment (AC: 1, 2, 3)
  - [x] Run focused tests for auth changes
  - [x] Run `npx nx run-many -t lint,test,build --all`
  - [x] Ensure implementation remains within story scope (no sign-out/help-path implementation here)

## Dev Notes

- This story introduces the first real authentication behavior on top of Story 1.1 scaffold.
- Keep implementation minimal but production-safe: only sign-in behavior, no sign-out or advanced account recovery yet.
- Do not add admin UI or non-story business flows.
- Preserve privacy-safe behavior in all auth failures.

### Previous Story Intelligence

- Story 1.1 created workspace baseline at `schoolCronicle/school-cronicle` and validated full lint/test/build gates.
- API build command currently uses `npx webpack-cli build` in `api/project.json`; avoid unnecessary build config churn unless required for this story.
- Explicit lint targets were added for `api`, `api-e2e`, and `web-e2e`; keep those intact while extending auth features.

### Architecture Guardrails

- Use server-side session authentication (cookie-based) for sign-in.
- Enforce hardened cookie attributes: `HttpOnly`, `Secure`, `SameSite`.
- Prepare for school-scope authorization layering, but implement only sign-in in this story.
- Keep API contract style consistent (REST JSON, uniform response/error envelope).
- Keep module/file naming conventions:
  - Files in `kebab-case`
  - TS symbols in `PascalCase`/`camelCase`
  - API payload keys in `camelCase`

### Technical Requirements

- API stack: NestJS in `apps/api`
- Web stack: Angular with Reactive Forms in `apps/web`
- Session behavior:
  - Valid credentials create/refresh authenticated session
  - Invalid credentials never disclose whether username exists
- Redirect behavior:
  - Successful sign-in routes to teacher workspace (`/appointments` or project-defined equivalent)

### Security and Compliance Notes

- All auth requests must operate over HTTPS in deployed environments (NFR4).
- Session cookie settings must satisfy hardened-session baseline (NFR6).
- Error copy must be neutral and non-enumerating (NFR7 alignment for auth surface hardening).
- Avoid logging secrets or raw credential material.

### UX Notes

- Login experience should follow calm, actionable error style from UX spec.
- Validation should be inline and accessible (labeling, focus behavior, non-color-only cues).
- Keep mobile-first responsiveness baseline from project UX requirements.

### Testing Requirements

- Add API tests for:
  - successful login session creation
  - invalid login rejection with non-sensitive messaging
- Add web tests for:
  - form validation behavior
  - successful submit redirect behavior
  - failed submit error behavior
- Keep regression gates green across workspace.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 1.2]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Project Structure & Boundaries]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR1, FR3, FR4]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - Error/validation and accessibility guidance]
- [Source: `_bmad-output/implementation-artifacts/1-1-set-up-initial-project-from-starter-template.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story auto-selected from sprint backlog order: `1-2-implement-teacher-sign-in`.
- Context synthesized from epics, architecture, PRD, UX, and prior story output.
- Implemented API auth module with `/api/auth/sign-in`, in-memory session rotation, and hardened cookie policy.
- Added non-sensitive failure response for invalid credentials and missing credential payloads.
- Added web login route and form with Reactive Forms validation and error accessibility (`role="alert"`/`aria-live`).
- Added successful sign-in navigation to `/appointments` workspace route.
- Added API unit + integration tests and web unit tests covering validation, success redirect, and failure messaging.
- Validated with:
  - `npx nx test api`
  - `npx nx test web`
  - `npx nx run-many -t lint,test,build --all`

### Completion Notes List

- Implemented teacher sign-in end-to-end across API and web app per AC1-AC3.
- Session cookie hardening (`HttpOnly`, `SameSite=Lax`, `Secure` in production) is now active on successful login.
- Invalid sign-in responses are non-sensitive and do not disclose account existence.
- Login flow now redirects to appointments workspace after successful authentication.
- All required tests and workspace quality gates pass; story is ready for review.

### File List

- `_bmad-output/implementation-artifacts/1-2-implement-teacher-sign-in.md`
- `school-cronicle/api/project.json`
- `school-cronicle/api/src/app/app.module.ts`
- `school-cronicle/api/src/modules/auth/auth.module.ts`
- `school-cronicle/api/src/modules/auth/auth.controller.ts`
- `school-cronicle/api/src/modules/auth/auth.service.ts`
- `school-cronicle/api/src/modules/auth/session.service.ts`
- `school-cronicle/api/src/modules/auth/sign-in.dto.ts`
- `school-cronicle/api/src/modules/auth/auth.types.ts`
- `school-cronicle/api/src/modules/auth/auth.service.spec.ts`
- `school-cronicle/api/src/modules/auth/auth.controller.integration.spec.ts`
- `school-cronicle/web/src/app/app.ts`
- `school-cronicle/web/src/app/app.html`
- `school-cronicle/web/src/app/app.css`
- `school-cronicle/web/src/app/app.config.ts`
- `school-cronicle/web/src/app/app.routes.ts`
- `school-cronicle/web/src/app/app.spec.ts`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/features/auth/login.component.ts`
- `school-cronicle/web/src/app/features/auth/login.component.html`
- `school-cronicle/web/src/app/features/auth/login.component.css`
- `school-cronicle/web/src/app/features/auth/login.component.spec.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`

### Change Log

- 2026-04-22: Implemented Story 1.2 sign-in flow (API + web), added tests, and moved status to `review`.
