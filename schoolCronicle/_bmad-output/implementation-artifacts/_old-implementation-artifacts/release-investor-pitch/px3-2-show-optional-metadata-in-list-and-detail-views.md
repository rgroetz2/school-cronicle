# Story PX3.2: Show Optional Metadata in List and Detail Views

Status: draft

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want optional metadata visible where I work,  
so that I can recognize appointments faster.

## Acceptance Criteria

1. Given appointments contain optional metadata, when I view list and detail screens, then class/grade, guardian name, and location are displayed as secondary metadata.
2. Given optional metadata is shown in list/detail contexts, when I scan the UI, then display remains readable and does not overload key task flows.

## Tasks / Subtasks

- [ ] Define metadata display contract for list and detail views (AC: 1, 2)
  - [ ] Specify placement and visual hierarchy for `classGrade`, `guardianName`, and `location`
  - [ ] Define fallback behavior when optional values are missing
  - [ ] Ensure naming and labels remain consistent with editor and filters
- [ ] Implement optional metadata in appointments list items (AC: 1, 2)
  - [ ] Render class/grade as secondary text in list cards/rows
  - [ ] Render guardian name as secondary metadata where space allows
  - [ ] Render location in a compact format aligned with existing list density
  - [ ] Preserve readability on narrow widths and dense datasets
- [ ] Implement optional metadata in appointment detail view (AC: 1, 2)
  - [ ] Add optional metadata section/rows in detail panel
  - [ ] Hide empty optional fields to reduce visual noise
  - [ ] Keep required metadata visually dominant over optional metadata
- [ ] Ensure compatibility with legacy records and mixed datasets (AC: 1, 2)
  - [ ] Confirm records without optional metadata still render cleanly
  - [ ] Confirm mixed lists (with and without optional values) remain scannable
  - [ ] Confirm no regressions in open/select/detail interactions
- [ ] Add tests and quality checks (AC: 1, 2)
  - [ ] Unit/component tests for rendering each optional field in list and detail
  - [ ] Tests for hidden-empty optional metadata behavior
  - [ ] Regression tests for list readability/no-overload conditions
  - [ ] Run focused web lint/tests for touched files

## Dev Notes

- This story follows PX3.1 (capture optional metadata) and should expose that metadata where teachers scan and verify appointments.
- Keep metadata presentation secondary and compact to preserve cognitive-load goals from PX1.3.
- Rendering should be deterministic and safe for existing appointments that have no optional metadata values.

### Previous Story Intelligence

- PX3.1 added optional fields (`classGrade`, `guardianName`, `location`) into model/form flows.
- PX2.2 added filters for these fields, increasing value when metadata is visible in list/detail contexts.
- PX1.3 optimized dashboard layout and information hierarchy; this story must preserve that clarity.

### Architecture Guardrails

- Implement in frontend view layer (`web`) without changing submit-gate behavior.
- Prefer display-only enhancements for this story; validation/submission constraints are handled by PX3.3.
- Avoid introducing visual clutter in list rows and detail panes.

### Testing Requirements

- Validate optional metadata appears correctly in list and detail when populated.
- Validate empty optional fields are hidden or shown minimally per display contract.
- Validate no regression in selection, open-draft, and detail-read flows.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story PX3.2]
- [Source: `_bmad-output/implementation-artifacts/px3-1-add-optional-fields-to-appointment-model.md`]
- [Source: `_bmad-output/implementation-artifacts/px2-2-add-new-optional-metadata-filters.md`]
- [Source: `_bmad-output/implementation-artifacts/px1-3-reduce-workspace-cognitive-load-via-section-re-layout.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story artifact created from PX3.2 epic definition and aligned with existing implementation-artifact format.

### Completion Notes List

- Created draft story artifact with acceptance criteria, implementation tasks, guardrails, and testing expectations.

### File List

- `_bmad-output/implementation-artifacts/px3-2-show-optional-metadata-in-list-and-detail-views.md`
