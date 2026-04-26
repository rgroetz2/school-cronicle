# Story 1.2: Add Role Model and Session Claims

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a platform operator,
I want authenticated sessions to include a canonical role claim (`admin` or `user`),
so that authorization decisions are deterministic across UI and API.

## Acceptance Criteria

1. Given a signed-in account, when the session is established, then the session includes exactly one valid role from `admin | user`.
2. Given malformed or unknown role values, when session setup occurs, then session creation is rejected and a security event is logged.

## Tasks / Subtasks

- [x] Define canonical role model in shared domain/contracts (AC: 1)
  - [x] Add enum/union type for `admin | user`
  - [x] Ensure API payload typing and UI consumption match
- [x] Add role claim to session lifecycle (AC: 1)
  - [x] Include role in authenticated session context
  - [x] Verify role is accessible to route guards and API guards
- [x] Validate and reject unknown role states (AC: 2)
  - [x] Add strict validation at auth/session boundary
  - [x] Emit auditable security event on invalid role attempts

## Dev Notes

- Follow architecture security pattern: server-side session auth with centralized guard checks.
- Keep claim naming and payload format aligned with existing API conventions.
- Do not duplicate role definitions across layers; use shared contracts.

### Project Structure Notes

- Backend auth/session modules under `apps/api/src/modules/auth` and `apps/api/src/common/guards`.
- Frontend auth state under `apps/web/src/app/core/auth`.
- Shared domain contracts in `libs/domain/*` as needed.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 1, Story 1.2]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Naming/Format Patterns]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story context generated via `bmad-create-story` workflow (batch run for Epic 1).
- Added canonical role contract (`admin | user`) in auth types and attached role claim to session model.
- Updated sign-in/session flows to return role in API responses (`/auth/sign-in`, `/auth/session-context`).
- Added strict configured-role validation in auth service with security logging on invalid role state.
- Verified API auth tests:
  - `npx vitest run api/src/modules/auth/auth.service.spec.ts`
  - `npx vitest run api/src/modules/auth/auth.controller.integration.spec.ts`
- Verified frontend auth service tests (focused):
  - `npx nx test web -- --include "web/src/app/core/auth-api.service.spec.ts"`

### Completion Notes List

- Canonical role model is implemented and shared through backend auth contracts and frontend session typing.
- Session lifecycle now includes role claim and exposes it through authenticated context for route/API guard usage.
- Invalid role configuration is rejected before session creation and logged as a security warning event.
- Acceptance criteria satisfied with targeted automated test coverage in API and frontend auth service layers.

### File List

- `_bmad-output/implementation-artifacts/1-2-add-role-model-and-session-claims.md`
- `school-cronicle/api/src/modules/auth/auth.types.ts`
- `school-cronicle/api/src/modules/auth/session.service.ts`
- `school-cronicle/api/src/modules/auth/auth.service.ts`
- `school-cronicle/api/src/modules/auth/auth.controller.ts`
- `school-cronicle/api/src/modules/auth/auth.service.spec.ts`
- `school-cronicle/api/src/modules/auth/auth.controller.integration.spec.ts`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/core/auth-api.service.spec.ts`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
