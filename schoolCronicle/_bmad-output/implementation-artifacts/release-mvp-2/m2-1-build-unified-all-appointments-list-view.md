# Story M2.1: Build Unified "All Appointments" List View

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want one list containing all my appointments,  
so that I do not need to switch between separate views to find my records.

## Acceptance Criteria

1. Given I am signed in, when I open the appointments workspace, then I see one list containing my draft and submitted appointments.
2. Each row shows key fields (title, date, type/category, status, last update).

## Tasks / Subtasks

- [x] Create unified query and retrieval path for draft + submitted records (AC: 1)
  - [x] Remove split-view assumptions in list state selectors/services.
  - [x] Ensure school-scope and owner constraints still apply.
- [x] Update list UI row model for key-field display (AC: 2)
  - [x] Render title/date/type/status/last-update consistently.
  - [x] Preserve accessibility labels and keyboard focus flow.
- [x] Add regression tests for mixed-state list rendering (AC: 1, 2)
  - [x] Verify both draft and submitted entries appear.
  - [x] Verify key field formatting and fallback values.

## Dev Notes

- Treat this as the base story for M2 list-centric workflow; M2.2 and M2.3 build on it.
- Keep existing auth/session and school-scope guarantees intact.
- Avoid introducing new list routes if current workspace route can be extended.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story M2.1]
- [Source: `_bmad-output/planning-artifacts/prd.md` - Release MVP 2 Addendum, FR33]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Release MVP 2 Architecture Addendum]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - Release MVP 2 UX Addendum]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

### Completion Notes List

- Updated appointments list language from draft-only wording to unified appointments wording.
- Added row-level "Last update" rendering using submitted timestamp fallback to created timestamp.
- Preserved existing mixed-state filtering logic while making all-state visibility explicit in copy and UX.
- Updated component tests for new UX text and added assertion for last-update key field visibility.

### File List

- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
