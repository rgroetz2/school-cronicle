# Story 3.5: Enable School CRUD for Both Roles

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a system owner,
I want both `admin` and `user` to modify school records,
so that school data management is collaborative across roles.

## Acceptance Criteria

1. Given a signed-in `user`, when they attempt create, update, or delete on `school`, then the backend allows the request.
2. Given school UI rendering for `admin` and `user`, when actions are displayed, then school CRUD actions are available for both roles.

## Tasks / Subtasks

- [x] Update backend authorization for `school` CRUD (AC: 1)
  - [x] Allow create/update/delete endpoints for both roles
  - [x] Keep authentication/session checks active
- [x] Update frontend school action visibility (AC: 2)
  - [x] Show school create/edit actions for both roles
  - [x] Preserve shared CRUD behavior across roles
- [x] Update authorization tests (AC: 1, 2)
  - [x] Verify user CRUD requests succeed
  - [x] Verify admin CRUD requests remain allowed

## Dev Notes

- Keep server-side authentication checks active for all school CRUD routes.
- Keep frontend behavior consistent across roles for school management.
- Preserve existing validation and error envelope patterns.

### Project Structure Notes

- Backend authorization logic: `school-cronicle/api/src/modules/*` and auth guards/policies
- Frontend behavior: `school-cronicle/web/src/app/features/*`

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 3, Story 3.5]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story context generated via `bmad-create-story` workflow (batch run for Epic 3).

### Completion Notes List

- Removed backend admin-only enforcement for school CRUD endpoints.
- Updated integration tests to validate user-role CRUD allowance and admin compatibility.
- Frontend now exposes school CRUD actions for both `admin` and `user`.

### File List

- `_bmad-output/implementation-artifacts/3-5-restrict-school-crud-to-admin-role.md`
- `school-cronicle/api/src/modules/school/school.controller.ts`
- `school-cronicle/api/src/modules/school/school.controller.integration.spec.ts`
- `school-cronicle/web/src/app/features/school/school.component.ts`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
