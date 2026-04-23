# Story M2.2: Add Search and Filter Controls to Unified List

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want to search and filter appointments,  
so that I can quickly locate the exact record I need.

## Acceptance Criteria

1. Given the unified list view, when I use search and filters (status, date range, category/type, optional metadata), then the list updates consistently and quickly.
2. Empty results show a clear no-match state with reset actions.

## Tasks / Subtasks

- [x] Add search + filter state model on top of M2.1 list (AC: 1)
  - [x] Support status, date range, category/type, optional metadata filters.
  - [x] Ensure query logic composes without inconsistent combinations.
- [x] Build filter/search UI controls in appointments workspace (AC: 1)
  - [x] Keep controls discoverable and keyboard accessible.
  - [x] Persist local context while interacting with list.
- [x] Implement no-match empty state and reset action (AC: 2)
  - [x] Provide one-click clear/reset behavior.
  - [x] Ensure reset restores prior default list state.
- [x] Add tests for filter/query correctness and empty state (AC: 1, 2)

## Dev Notes

- Maintain low-latency feel for list updates; avoid full-page reload behavior.
- Keep query semantics aligned between API and UI to prevent mismatched results.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story M2.2]
- [Source: `_bmad-output/planning-artifacts/prd.md` - Release MVP 2 Addendum, FR34]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - IA and interaction updates]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - unified query/search impacts]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

### Completion Notes List

- Added a unified search input to the filter panel for quick list retrieval.
- Implemented composable search matching across title, notes, category, date, status, and optional metadata.
- Extended active-filter tracking and reset behavior to include the new search state.
- Added regression test coverage for search matching across key fields.

### File List

- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
