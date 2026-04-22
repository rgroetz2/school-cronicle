# Story PX2.1: Build Dedicated Filter Panel

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want a dedicated filter panel,  
so that I can quickly narrow appointment lists without scanning everything.

## Acceptance Criteria

1. Given the appointments list is open, when I use filters, then I can filter by category, status, date range, has images, and draft/submitted state.
2. Given a filter value changes, when the list updates, then results refresh immediately and remain consistent with selected criteria.
3. Given filters produce no matches, when results are empty, then a clear no-results state is shown with guidance to clear or adjust filters.
4. Given filter selections are active, when I view the panel, then filter values are visible and can be reset/cleared.

## Tasks / Subtasks

- [ ] Define filter state model and behavior contract (AC: 1, 2, 4)
  - [ ] Specify filter keys: category, status, dateFrom/dateTo, hasImages, lifecycleState
  - [ ] Define combinational logic and default state
  - [ ] Define reset/clear behavior and URL/query-state strategy (if applicable)
- [ ] Implement dedicated filter panel UI (AC: 1, 4)
  - [ ] Add filter controls in a dedicated panel separate from list/editor regions
  - [ ] Keep controls concise, labeled, and keyboard accessible
  - [ ] Align with premium-neutral design and declutter goals
- [ ] Wire list filtering behavior (AC: 1, 2, 3)
  - [ ] Apply client-side filtering reliably to current appointment dataset
  - [ ] Ensure updates are immediate and stable across interactions
  - [ ] Add no-results state with actionable copy
- [ ] Add tests and quality checks (AC: 1, 2, 3, 4)
  - [ ] Unit/component tests for each filter criterion and combined scenarios
  - [ ] Tests for clear/reset behavior and empty-state rendering
  - [ ] Run focused web lint/tests for touched modules

## Dev Notes

- This story sets baseline filter capability; metadata filters for class/grade, guardian name, and location are in follow-up story PX2.2.
- Keep filtering deterministic and easy to explain in live demos.
- Avoid increasing editor complexity while introducing filter controls.

### Previous Story Intelligence

- Story PX1.3 introduces clearer zone layout that should host this dedicated filter panel.
- Current list already contains category/status/date/image signals that can seed filter logic.
- Existing draft/submitted states from Epic 4 must remain unchanged.

### Architecture Guardrails

- Frontend-focused implementation in web list/workspace layer.
- No API contract changes required for baseline filtering on locally available list data.
- Preserve current selection/open-draft behavior while filtering.

### Testing Requirements

- Validate each base filter works in isolation and combination.
- Validate no-results and reset paths.
- Validate no regression in open/edit/list flows.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story PX2.1]
- [Source: `_bmad-output/planning-artifacts/pitch-ux-epics.md`]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story created from Pitch UX epic stream to address list overload with dedicated filtering.

### Completion Notes List

- Pending implementation.

### File List

- `_bmad-output/implementation-artifacts/px2-1-build-dedicated-filter-panel.md`
