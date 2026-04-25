# Story CMD.1: Add `Export chronicle (.md)` Action in Existing Export Surface

Status: in-progress

## Story

As a teacher,  
I want an `Export chronicle (.md)` action in the current export controls,  
so that I can generate a markdown chronicle without leaving my workflow.

## Acceptance Criteria

1. Given export-eligible data is selected, when I click `Export chronicle (.md)`, then one `.md` file download is triggered.
2. Given export action is running, then loading/disabled states prevent duplicate execution.
3. Given export failure, then actionable error feedback is shown and current selection remains unchanged.

## Tasks / Subtasks

- [x] Add markdown export button/action in current chronicle export area.
- [x] Bind loading and disabled states to prevent duplicate submission.
- [x] Surface success and failure feedback aligned with existing UX patterns.

## Dev Agent Record

### Debug Log References

- `npx nx lint web` (pass)
- `npx nx lint web-e2e` (pass)
- `npx nx test web --include=web/src/app/features/appointments/appointments.mode-actions.spec.ts --include=web/src/app/core/auth-api.service.spec.ts` (pass)

### Completion Notes

- Added `Export chronicle (.md)` action alongside existing `.docx` export in appointments export controls.
- Implemented dedicated frontend service call and UI handler for markdown export download.
- Added loading/disabled guards so export buttons prevent duplicate execution while export is running.
- Added success/failure feedback messaging for markdown export outcomes.
- Added backend markdown export endpoint and service path to ensure the action is functional end-to-end.
- Added e2e coverage for markdown export trigger and `.md` download filename assertion.

### File List

- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.ts`
- `school-cronicle/api/src/modules/appointments/appointments.service.ts`
- `school-cronicle/web-e2e/src/chronicle-export.spec.ts`
