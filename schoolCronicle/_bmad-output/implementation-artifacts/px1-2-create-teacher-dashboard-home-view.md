# Story PX1.2: Create Teacher Dashboard Home View

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want a simple dashboard home view,  
so that I can see what needs attention first.

## Acceptance Criteria

1. Given I open Dashboard, when the page loads, then I see summary cards for draft count, submitted count, and needs-attention items.
2. Given a summary card is selected, when I activate it, then I navigate to a relevant list context (for example filtered list state).
3. Given no data exists for a summary, when the dashboard renders, then the card still presents a clear zero/empty state without confusing errors.

## Tasks / Subtasks

- [ ] Define teacher dashboard summary model (AC: 1, 3)
  - [ ] Map available list state to card metrics (drafts, submitted, needs attention)
  - [ ] Define empty/zero-state copy and visual treatment
  - [ ] Keep metric calculations deterministic and fast
- [ ] Implement dashboard home view and cards (AC: 1, 3)
  - [ ] Build dashboard component/section within new shell
  - [ ] Render cards with concise labels and short supporting copy
  - [ ] Preserve premium-neutral visual consistency
- [ ] Wire card actions to list context navigation (AC: 2)
  - [ ] Link cards to appointment views with matching focus/filter context
  - [ ] Keep route/query-state handling predictable
  - [ ] Ensure keyboard and screen-reader usability of cards as actions
- [ ] Add tests and quality checks (AC: 1, 2, 3)
  - [ ] Tests for card rendering with populated and empty datasets
  - [ ] Tests for navigation behavior from card actions
  - [ ] Run focused web lint/tests for touched files

## Dev Notes

- This story is a teacher-facing dashboard orientation layer for faster workflow start.
- Use existing appointment state as the source of truth; avoid introducing parallel inconsistent metrics.
- Keep scope aligned to teacher UX and avoid leadership/investor analytics in this story.

### Previous Story Intelligence

- Story PX1.1 introduces shell and menu entry for dashboard route.
- Existing appointments list already exposes draft/submitted status and readiness indicators to reuse.
- Story 6.5 guidance improvements should remain accessible from list/editor surfaces after navigation.

### Architecture Guardrails

- Frontend-only changes expected.
- No changes required to existing API contracts for baseline card metrics.
- Maintain route guard and session behavior.

### Testing Requirements

- Validate card counts and empty-state messaging.
- Validate navigation from each card to corresponding appointment context.
- Validate accessibility for card interactions.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story PX1.2]
- [Source: `_bmad-output/planning-artifacts/pitch-ux-epics.md`]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story created from Pitch UX epic stream for teacher-first dashboard orientation.

### Completion Notes List

- Pending implementation.

### File List

- `_bmad-output/implementation-artifacts/px1-2-create-teacher-dashboard-home-view.md`
