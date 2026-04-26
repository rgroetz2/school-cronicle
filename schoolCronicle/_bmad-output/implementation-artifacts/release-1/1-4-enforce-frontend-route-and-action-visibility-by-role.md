# Story 1.4: Enforce Frontend Route and Action Visibility by Role

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to see only actions I am authorized to use,
so that the interface matches my permissions and reduces accidental access attempts.

## Acceptance Criteria

1. Given a signed-in `user`, when protected screens/actions render, then admin-only routes and actions are hidden or inaccessible.
2. Given direct navigation attempts to admin routes, when route resolution occurs, then access is blocked and redirected safely.

## Tasks / Subtasks

- [x] Implement role-aware frontend route guards (AC: 1, 2)
  - [x] Add role checks for admin route segments
  - [x] Ensure unauthorized navigation redirects to safe destination
- [x] Enforce role-based action visibility in UI components (AC: 1)
  - [x] Hide/disable admin-only buttons and menus for `user`
  - [x] Keep behavior consistent across pages
- [x] Add frontend tests for route/action visibility (AC: 1, 2)
  - [x] Verify `user` cannot access admin routes directly
  - [x] Verify admin-only actions are not actionable in `user` session

## Dev Notes

- UI restrictions improve UX but do not replace backend authorization checks.
- Keep role checks centralized (facade/guard utility), avoid scattered inline conditionals.
- Preserve accessibility semantics when actions are hidden/disabled.

### Project Structure Notes

- Routes and guards: `apps/web/src/app/app.routes.ts`, `apps/web/src/app/core/auth/*`.
- Feature action surfaces: `apps/web/src/app/features/*`.
- Shared role utility (if created): `libs/domain/*` or `apps/web/src/app/shared/*`.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 1, Story 1.4]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Frontend Architecture]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story context generated via `bmad-create-story` workflow (batch run for Epic 1).
- Added role-based frontend guard `authAdminRoleGuard` using authenticated session context role.
- Protected `admin` route segment with role guard and safe redirect to `/dashboard` for non-admin users.
- Updated dashboard shell to load session context role and enforce admin-only nav/action visibility.
- Added/updated focused frontend tests for:
  - admin route guard behavior
  - route configuration guard wiring
  - dashboard action visibility for `user` vs `admin`
- Validation command executed:
  - `npx nx test web -- --include "web/src/app/app.routes.spec.ts" --include "web/src/app/core/auth-role.guard.spec.ts" --include "web/src/app/features/dashboard/dashboard-shell.component.spec.ts"`

### Completion Notes List

- Frontend now enforces role-aware route access for admin paths with redirect-safe behavior.
- Admin-only UI actions are hidden for `user` sessions and visible for `admin` sessions.
- Role checks are centralized via session-context-driven guard and dashboard role state.
- Story acceptance criteria satisfied with targeted test coverage and clean lint status.

### File List

- `_bmad-output/implementation-artifacts/1-4-enforce-frontend-route-and-action-visibility-by-role.md`
- `school-cronicle/web/src/app/core/auth-role.guard.ts`
- `school-cronicle/web/src/app/core/auth-role.guard.spec.ts`
- `school-cronicle/web/src/app/app.routes.ts`
- `school-cronicle/web/src/app/app.routes.spec.ts`
- `school-cronicle/web/src/app/features/dashboard/dashboard-shell.component.ts`
- `school-cronicle/web/src/app/features/dashboard/dashboard-shell.component.spec.ts`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
