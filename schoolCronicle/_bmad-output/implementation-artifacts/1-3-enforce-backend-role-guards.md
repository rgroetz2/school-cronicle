# Story 1.3: Enforce Backend Role Guards

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a system owner,
I want backend endpoints to be protected by role guards with deny-by-default behavior,
so that `user` accounts cannot execute admin operations.

## Acceptance Criteria

1. Given an endpoint marked admin-only, when a `user` requests it, then access is denied using the standard forbidden error envelope.
2. Given frontend manipulation attempts, when protected backend endpoints are called directly, then authorization is still enforced server-side.

## Tasks / Subtasks

- [x] Implement or extend role guard middleware/decorators (AC: 1)
  - [x] Support endpoint-level role declarations
  - [x] Default to deny when role claim is missing/invalid
- [x] Apply guards to admin-only endpoints (AC: 1)
  - [x] Identify target modules and annotate routes consistently
  - [x] Keep error contract aligned with architecture response envelope
- [x] Add negative-path authorization tests (AC: 2)
  - [x] Verify `user` receives forbidden on admin endpoints
  - [x] Verify missing/invalid session claims are rejected

## Dev Notes

- Authorization must be enforced in API layer independent of UI route visibility.
- Use consistent error code/message envelope (no ad-hoc response shapes).
- Ensure guard logic remains composable with school-scope checks.

### Project Structure Notes

- Role guard location: `apps/api/src/common/guards`.
- Route modules: `apps/api/src/modules/*`.
- Policy helpers (if needed): `libs/application/policies`.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 1, Story 1.3]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - API Response/Error Patterns]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story context generated via `bmad-create-story` workflow (batch run for Epic 1).
- Added endpoint-level role metadata decorator and role guard in auth module.
- Applied role guard chain (`AuthSessionGuard`, `AuthRoleGuard`) to admin-only probe endpoint.
- Enforced deny-by-default behavior for missing/invalid session role with consistent forbidden error envelope.
- Added integration coverage for:
  - user denied on admin endpoint (`AUTH_FORBIDDEN_ROLE`)
  - admin allowed on admin endpoint
  - missing session rejected on admin endpoint
- Validation commands executed:
  - `npx vitest run api/src/modules/auth/auth.service.spec.ts`
  - `npx vitest run api/src/modules/auth/auth.controller.integration.spec.ts`
  - `npx nx lint api`

### Completion Notes List

- Backend role guard enforcement now supports endpoint-level required roles via decorator metadata.
- Admin-only endpoints deny `user` role requests server-side even if called directly (independent of UI behavior).
- Missing session requests are rejected before role checks; malformed session-role states return forbidden envelope.
- Story acceptance criteria satisfied with targeted integration and unit test validation.

### File List

- `_bmad-output/implementation-artifacts/1-3-enforce-backend-role-guards.md`
- `school-cronicle/api/src/modules/auth/auth-role.decorator.ts`
- `school-cronicle/api/src/modules/auth/auth-role.guard.ts`
- `school-cronicle/api/src/modules/auth/auth.module.ts`
- `school-cronicle/api/src/modules/auth/auth.controller.ts`
- `school-cronicle/api/src/modules/auth/auth.controller.integration.spec.ts`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
