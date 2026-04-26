# Story 2.5: Enforce User Self-Only Profile Permissions

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a `user`,
I want to maintain only my own `school-personal` profile,
so that data ownership and role boundaries are respected.

## Acceptance Criteria

1. Given a signed-in `user`, when profile maintenance is opened, then only the current user's record is editable.
2. Given attempts to fetch or edit another user's profile, when API calls are made, then requests are denied server-side.

## Tasks / Subtasks

- [x] Add backend ownership checks for `school-personal` access (AC: 1, 2)
  - [x] Restrict read/update by session identity for `user` role
  - [x] Keep `admin` behavior unrestricted per policy
- [x] Enforce frontend self-only profile behavior (AC: 1)
  - [x] Ensure user flow points to self record context
  - [x] Hide/disable non-self edit affordances for `user`
- [x] Add negative-path authorization tests (AC: 2)
  - [x] Verify forbidden responses for cross-user profile access
  - [x] Verify allowed self-edit path for `user`

## Dev Notes

- Server-side checks are mandatory; UI restrictions are supportive only.
- Reuse role/session guard mechanisms introduced in Epic 1.
- Return consistent forbidden envelope for denied operations.

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

- Added server-side self-only enforcement so `user` can read/update only own profile and cannot create/delete records.
- Added role-change protection for user self-updates and explicit forbidden envelopes for blocked operations.
- Frontend now switches behavior by session role (admin full list/create; user self-only and restricted role edits).

### File List

- `_bmad-output/implementation-artifacts/2-5-enforce-user-self-only-profile-permissions.md`
- `school-cronicle/api/src/modules/school-personal/school-personal.controller.ts`
- `school-cronicle/api/src/modules/school-personal/school-personal.controller.integration.spec.ts`
- `school-cronicle/web/src/app/features/school-personal/school-personal.component.ts`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
