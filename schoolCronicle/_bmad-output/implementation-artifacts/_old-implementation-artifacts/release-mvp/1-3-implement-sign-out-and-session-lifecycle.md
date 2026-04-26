# Story 1.3: Implement Sign-Out and Session Lifecycle

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want to sign out and have sessions managed safely,  
so that my account stays secure on shared devices.

## Acceptance Criteria

1. Given an authenticated session, when the teacher selects sign-out, then server session is invalidated and protected pages are inaccessible.
2. Given a signed-out or invalidated session, when a protected route is reloaded or revisited, then authentication is required again.
3. Given expired/invalid sessions, when protected API resources are requested, then responses are handled consistently with the re-authentication flow.

## Tasks / Subtasks

- [x] Implement server-side sign-out and session invalidation endpoint (AC: 1, 3)
  - [x] Add `POST /api/auth/sign-out` endpoint in auth module
  - [x] Invalidate current server-side session token/store entry
  - [x] Clear auth cookie in response with matching cookie attributes/path
  - [x] Return consistent success envelope for sign-out action
- [x] Add session validation model for protected resources (AC: 2, 3)
  - [x] Introduce auth guard/middleware for protected routes
  - [x] Ensure requests with missing/invalid/expired session are rejected with consistent unauthorized responses
  - [x] Add one protected probe route for lifecycle verification (or mark an existing route protected) without implementing business scope beyond story
- [x] Implement sign-out UX + route protection behavior in web app (AC: 1, 2, 3)
  - [x] Add sign-out action in authenticated workspace area
  - [x] Call API sign-out endpoint and navigate user to login route
  - [x] Add route guard for protected app routes (`/appointments` and future protected surfaces)
  - [x] Ensure unauthorized API result/session invalidation redirects to login in a consistent way
- [x] Add tests for session lifecycle behavior (AC: 1, 2, 3)
  - [x] API tests: sign-out invalidates session and unauthorized behavior on protected endpoint
  - [x] Web tests: sign-out action redirects to login and guarded route blocks when unauthenticated
  - [x] Regression test: stale/invalid session path triggers re-auth behavior without leaking sensitive details
- [x] Validate quality gates and scope (AC: 1, 2, 3)
  - [x] Run focused auth/session tests
  - [x] Run `npx nx run-many -t lint,test,build --all`
  - [x] Confirm story remains scoped to sign-out/session lifecycle (no help-path implementation yet)

## Dev Notes

- This story extends Story 1.2 auth foundations by adding logout and consistent session enforcement.
- Keep behavior deterministic and minimal: explicit sign-out + enforced access boundaries + re-auth redirects.
- Do not fold Story 1.4 help-path content into this story.

### Previous Story Intelligence

- Story 1.2 already introduced:
  - `/api/auth/sign-in` endpoint
  - in-memory session service with rotation-on-login
  - `sc_session` cookie with hardened attributes baseline
  - login route and redirect to `/appointments`
- Reuse and extend current auth/session structure; avoid introducing a parallel auth mechanism.
- Keep naming and architecture alignment with established `modules/auth` and `features/auth` patterns.

### Architecture Guardrails

- Session strategy remains server-side session with cookie transport.
- Keep cookie hardening aligned with architecture:
  - `HttpOnly`
  - `Secure` in production
  - `SameSite` set explicitly
- Ensure centralized auth checks are used for protected routes.
- Keep implementation in architecture-aligned paths:
  - API: `apps/api/src/modules/auth`, guards in common/api boundary as appropriate
  - Web: `apps/web/src/app/core/auth`, route guard patterns, feature-local UI

### Technical Requirements

- API:
  - Add sign-out endpoint and protected-resource enforcement
  - Ensure unauthorized response format is stable and non-sensitive
- Web:
  - Provide explicit sign-out action from authenticated area
  - Route guard protects workspace route(s) and redirects to `/login` if session is absent/invalid
  - Session invalidation responses should return user to login cleanly

### Security and Compliance Notes

- Never expose session identifiers or sensitive account details in responses or logs.
- Invalid/expired session handling must be consistent to prevent auth-state confusion.
- Sign-out must remove active session and client auth cookie together.

### UX Notes

- Sign-out should be clear and immediate.
- Re-auth prompts should be calm and actionable, not alarmist.
- Unauthorized redirect behavior should avoid dead-end pages.

### Testing Requirements

- API:
  - sign-out endpoint success and session invalidation assertion
  - protected endpoint unauthorized after sign-out/invalid session
- Web:
  - sign-out interaction triggers redirect to `/login`
  - guarded route blocks unauthenticated access
  - invalid session flow results in consistent re-auth path
- Keep full workspace gates green.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 1.3]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Project Structure & Boundaries]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR2, FR3]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - Error handling and accessibility]
- [Source: `_bmad-output/implementation-artifacts/1-2-implement-teacher-sign-in.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story auto-selected from sprint backlog order: `1-3-implement-sign-out-and-session-lifecycle`.
- Context synthesized from epics, architecture, PRD, UX, and Story 1.2 implementation record.
- Implemented API session lifecycle endpoints: `POST /api/auth/sign-out` and protected `GET /api/auth/session`.
- Added reusable cookie/session parsing utility and auth session guard for protected API access.
- Added web route guard for protected routes and unauthorized-response interceptor redirecting to login.
- Added explicit sign-out action in appointments workspace that clears session via API and returns to login.
- Added regression tests for API session invalidation and web guard/sign-out behavior.
- Validation commands executed:
  - `npx nx test api`
  - `npx nx test web`
  - `npx nx run-many -t lint,test,build --all`

### Completion Notes List

- Implemented sign-out endpoint that invalidates active session and clears auth cookie with aligned cookie options.
- Added protected session probe route and centralized API guard handling invalid/missing sessions with consistent unauthorized response.
- Implemented client-side protected route guard and unauthorized interceptor to enforce re-authentication flow.
- Added sign-out UX in authenticated workspace with immediate redirect to login.
- All targeted tests and full quality gates pass; story is now ready for review.

### File List

- `_bmad-output/implementation-artifacts/1-3-implement-sign-out-and-session-lifecycle.md`
- `school-cronicle/api/src/modules/auth/auth.controller.ts`
- `school-cronicle/api/src/modules/auth/auth.controller.integration.spec.ts`
- `school-cronicle/api/src/modules/auth/auth.module.ts`
- `school-cronicle/api/src/modules/auth/auth.service.ts`
- `school-cronicle/api/src/modules/auth/session.service.ts`
- `school-cronicle/api/src/modules/auth/auth-cookie.util.ts`
- `school-cronicle/api/src/modules/auth/auth-session.guard.ts`
- `school-cronicle/web/src/app/app.config.ts`
- `school-cronicle/web/src/app/app.routes.ts`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/core/auth-session.guard.ts`
- `school-cronicle/web/src/app/core/auth-session.guard.spec.ts`
- `school-cronicle/web/src/app/core/auth-unauthorized.interceptor.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`

### Change Log

- 2026-04-22: Implemented Story 1.3 sign-out/session lifecycle (API + web guards/interceptor), added tests, and moved status to `review`.
