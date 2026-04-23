# Story PX1.3: Reduce Workspace Cognitive Load via Section Re-layout

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want the workspace split into clear zones,  
so that editing and list navigation are not overwhelming.

## Acceptance Criteria

1. Given I open the appointments workspace, when the page renders, then navigation, filters, list/results, and detail/editor are visually separated into clear sections.
2. Given I interact with the workspace, when controls are presented, then only context-relevant controls are shown by default (progressive disclosure for secondary actions).
3. Given common teacher tasks (open draft, edit draft, check readiness), when I perform them, then the layout reduces visual noise without regressing existing behavior.

## Tasks / Subtasks

- [x] Define section architecture and visual hierarchy (AC: 1, 3)
  - [x] Define explicit workspace zones: navigation shell, filter panel, list/results panel, detail/editor panel
  - [x] Define scan order and spacing rhythm for lower cognitive load
  - [x] Preserve premium-neutral style consistency with PX1.1/PX1.2
- [x] Re-layout appointments workspace into dedicated sections (AC: 1, 3)
  - [x] Reorganize current stacked panel structure into clearer grouped regions
  - [x] Keep list and editor interactions stable while improving visual grouping
  - [x] Maintain responsive behavior at mobile and tablet breakpoints
- [x] Add progressive disclosure for non-primary controls (AC: 2)
  - [x] Keep primary actions visible by default
  - [x] Move secondary/advanced actions behind toggles/expandable sections where appropriate
  - [x] Ensure controls remain discoverable and keyboard accessible
- [x] Validate UX and behavior integrity (AC: 2, 3)
  - [x] Confirm create/edit/submit/read-only flows still work as before
  - [x] Confirm filter/list context flows remain stable
  - [x] Keep warning/readiness surfaces perceivable without clutter
- [x] Add tests and quality checks (AC: 1, 2, 3)
  - [x] Component tests for new layout section presence and default visibility rules
  - [x] Regression tests for key flows impacted by section movement
  - [x] Run focused web lint/tests for touched files

## Dev Notes

- This story is layout/interaction architecture focused, not business-logic expansion.
- Reuse the existing dashboard shell and filter panel introduced in PX1.1/PX2.1.
- Keep implementation incremental to avoid destabilizing ongoing pitch-track stories.

### Previous Story Intelligence

- PX1.1 introduced sidebar shell and route hierarchy.
- PX1.2 introduced dashboard card navigation into appointments contexts.
- PX2.1 introduced dedicated filter panel and list filtering logic.
- Existing submission/read-only/guidance behaviors from Epics 4 and 6 must remain intact.

### Architecture Guardrails

- Frontend-focused changes in web feature components and styles.
- Avoid API contract changes for this story.
- Maintain route and session guard behavior.

### Testing Requirements

- Validate clear section boundaries in rendered layout.
- Validate progressive disclosure default states and action accessibility.
- Validate no regressions in core appointment workflows.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story PX1.3]
- [Source: `_bmad-output/planning-artifacts/pitch-ux-epics.md`]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`]
- [Source: `_bmad-output/implementation-artifacts/px1-1-introduce-left-sidebar-dashboard-shell.md`]
- [Source: `_bmad-output/implementation-artifacts/px1-2-create-teacher-dashboard-home-view.md`]
- [Source: `_bmad-output/implementation-artifacts/px2-1-build-dedicated-filter-panel.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story created from Pitch UX stream after PX1.1, PX1.2, and PX2.1 moved to review.

### Completion Notes List

- Reorganized the appointments page into explicit workspace zones: list/results, detail/editor, and media/attachments, with dedicated zone headers and clearer visual boundaries.
- Preserved existing draft open/edit/submit/read-only and filter context behaviors while separating interaction regions to reduce clutter.
- Added progressive disclosure for secondary controls by moving advanced filter criteria into a collapsible `Advanced filters` section (collapsed by default).
- Added component tests for zone visibility and advanced-filter default/toggle behavior.
- Validated quality gates with `npx nx test web` and confirmed no linter diagnostics for touched files.

### File List

- `_bmad-output/implementation-artifacts/px1-3-reduce-workspace-cognitive-load-via-section-re-layout.md`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.css`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
