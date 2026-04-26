# Story PX1.2: Create Teacher Dashboard Home View

Status: review

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

- [x] Define teacher dashboard summary model (AC: 1, 3)
  - [x] Map available list state to card metrics (drafts, submitted, needs attention)
  - [x] Define empty/zero-state copy and visual treatment
  - [x] Keep metric calculations deterministic and fast
- [x] Implement dashboard home view and cards (AC: 1, 3)
  - [x] Build dashboard component/section within new shell
  - [x] Render cards with concise labels and short supporting copy
  - [x] Preserve premium-neutral visual consistency
- [x] Wire card actions to list context navigation (AC: 2)
  - [x] Link cards to appointment views with matching focus/filter context
  - [x] Keep route/query-state handling predictable
  - [x] Ensure keyboard and screen-reader usability of cards as actions
- [x] Add tests and quality checks (AC: 1, 2, 3)
  - [x] Tests for card rendering with populated and empty datasets
  - [x] Tests for navigation behavior from card actions
  - [x] Run focused web lint/tests for touched files

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

- Added a dedicated `DashboardHomeComponent` with summary cards for drafts, submitted entries, and needs-attention items, backed by current appointment list data.
- Wired card actions to navigate into appointments with route query context (`drafts`, `submitted`, `attention`) for faster focused workflow entry.
- Added lightweight appointments list-context handling so dashboard navigation results in a meaningful filtered list view and clearable context state.
- Preserved existing appointment create/edit/submit behavior while introducing context filtering as a non-breaking enhancement.
- Added dashboard home component tests for summary rendering and card navigation behavior.
- Validated quality gates with `npx nx test web` and no linter diagnostics for touched files.

### File List

- `_bmad-output/implementation-artifacts/px1-2-create-teacher-dashboard-home-view.md`
- `school-cronicle/web/src/app/features/dashboard/dashboard-home.component.ts`
- `school-cronicle/web/src/app/features/dashboard/dashboard-home.component.css`
- `school-cronicle/web/src/app/features/dashboard/dashboard-home.component.spec.ts`
- `school-cronicle/web/src/app/app.routes.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.css`
