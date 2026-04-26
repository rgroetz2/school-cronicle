# Story CMD.2: Wire Frontend/Backend Markdown Export Command

Status: in-progress

## Story

As a developer,  
I want a dedicated markdown export command path,  
so that markdown generation is isolated from the existing `.docx` flow.

## Acceptance Criteria

1. Given markdown export is requested, when command handling runs, then a dedicated markdown command path is used end-to-end.
2. Given `.docx` export is requested, when existing command path runs, then behavior remains unchanged.
3. API/service response contracts for markdown export return actionable success/failure data.

## Tasks / Subtasks

- [x] Add markdown export API/service method on backend boundary.
- [x] Add frontend service integration method for markdown export.
- [x] Keep markdown and `.docx` command paths separated and testable.

## Dev Agent Record

### Debug Log References

- `npx nx lint web` (pass)
- `npx nx test web --include=web/src/app/core/auth-api.service.spec.ts` (pass)
- `npx nx test api` (pass)

### Completion Notes

- Resolved existing merge conflict markers in appointments integration spec to restore test suite integrity.
- Added explicit frontend service tests proving markdown export uses `/api/appointments/chronicle/export-md`.
- Added explicit frontend service tests proving docx export remains on `/api/appointments/chronicle/export`.
- Added backend integration coverage for markdown export via dedicated `POST /api/appointments/chronicle/export-md` endpoint.
- Kept markdown and docx response contracts separate and assertable in tests.

### File List

- `school-cronicle/web/src/app/core/auth-api.service.spec.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.integration.spec.ts`
