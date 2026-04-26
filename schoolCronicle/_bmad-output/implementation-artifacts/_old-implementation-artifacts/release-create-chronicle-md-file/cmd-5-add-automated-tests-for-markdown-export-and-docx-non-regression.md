# Story CMD.5: Add Automated Tests for Markdown Export and `.docx` Non-Regression

Status: in-progress

## Story

As a product owner,  
I want automated checks for markdown export behavior and compatibility,  
so that regressions are caught before release.

## Acceptance Criteria

1. Tests verify markdown contract sections (`contact persons`, `appointments`) and deterministic ordering.
2. Tests verify media output includes filename + metadata only (no binary/base64 content).
3. Tests verify markdown export failure feedback and selection preservation behavior.
4. Tests verify `.docx` export path remains functional.

## Tasks / Subtasks

- [x] Add serializer-level tests for markdown schema and deterministic output.
- [x] Add integration/e2e coverage for markdown export action and download behavior.
- [x] Add non-regression tests for existing `.docx` export flow.

## Dev Agent Record

### Debug Log References

- `npx nx lint web` (pass)
- `npx nx lint web-e2e` (pass)
- `npx nx test web --include=web/src/app/features/appointments/appointments.mode-actions.spec.ts --include=web/src/app/core/auth-api.service.spec.ts` (pass)
- `npx nx test api` (pass)

### Completion Notes

- Added serializer-level deterministic and metadata-only checks in API service tests.
- Added/kept integration coverage for markdown export endpoint and markdown contract assertions.
- Added e2e coverage for markdown export download (`Export chronicle (.md)`).
- Kept `.docx` export e2e and API integration checks as non-regression coverage.
- Added UI-level failure-path test verifying markdown export failure feedback and selection preservation behavior.

### File List

- `school-cronicle/api/src/modules/appointments/appointments.service.spec.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.integration.spec.ts`
- `school-cronicle/web-e2e/src/chronicle-export.spec.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.mode-actions.spec.ts`
- `school-cronicle/web/src/app/core/auth-api.service.spec.ts`
