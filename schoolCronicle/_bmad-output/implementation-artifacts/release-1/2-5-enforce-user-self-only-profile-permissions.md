# Story 2.5: Enable User CRUD Permissions for School-Personal

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a `user`,
I want to create, edit, and delete `school-personal` records,
so that both roles can maintain profile data in Release 1.

## Acceptance Criteria

1. Given a signed-in `user`, when school-personal management is opened, then list/create/edit/delete flows are available.
2. Given `school-personal` CRUD API calls, when requests are made by either `admin` or `user`, then server-side authorization allows both roles.

## Tasks / Subtasks

- [x] Update backend authorization for `school-personal` access (AC: 1, 2)
  - [x] Allow create/read/update/delete for `user` and `admin`
  - [x] Remove self-only ownership restriction logic
- [x] Update frontend `school-personal` behavior (AC: 1)
  - [x] Expose create/edit actions for both roles
  - [x] Remove role-based self-only guardrails in editor flow
- [x] Update authorization tests (AC: 2)
  - [x] Verify user CRUD path is allowed
  - [x] Verify admin CRUD path remains allowed

## Dev Notes

- Server-side authorization remains mandatory; policy now allows both roles for this module.
- Frontend should not hide CRUD actions by role for `school-personal`.
- Keep request/response contracts and validation envelopes unchanged.

### Project Structure Notes

- Backend authorization logic: `school-cronicle/api/src/modules/*` and auth guards/policies
- Frontend behavior: `school-cronicle/web/src/app/features/*`

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic 2, Story 2.5]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story context generated via `bmad-create-story` workflow (batch run for Epic 2).

### Completion Notes List

- Removed server-side self-only enforcement and role-change blocking for `school-personal`.
- Enabled frontend CRUD interactions for both `admin` and `user`.
- Updated integration tests to validate user CRUD allowance.

### File List

- `_bmad-output/implementation-artifacts/2-5-enforce-user-self-only-profile-permissions.md`
- `school-cronicle/api/src/modules/school-personal/school-personal.controller.ts`
- `school-cronicle/api/src/modules/school-personal/school-personal.controller.integration.spec.ts`
- `school-cronicle/web/src/app/features/school-personal/school-personal.component.ts`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
