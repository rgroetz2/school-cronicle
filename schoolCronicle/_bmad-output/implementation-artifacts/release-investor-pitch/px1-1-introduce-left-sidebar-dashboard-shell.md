# Story PX1.1: Introduce Left Sidebar Dashboard Shell

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want a persistent sidebar menu,  
so that I can navigate core tasks quickly.

## Acceptance Criteria

1. Given an authenticated teacher opens the workspace, when the layout renders, then a left sidebar menu is visible with entries for Dashboard, Appointments, Drafts, Submitted, Privacy, and Help.
2. Given a menu item is active, when the teacher navigates, then the active state is clearly indicated and keyboard accessible.
3. Given smaller viewports, when space is constrained, then sidebar behavior remains usable (collapsed/toggle) without breaking access to menu items.

## Tasks / Subtasks

- [x] Define dashboard shell layout contract (AC: 1, 3)
  - [x] Establish sidebar + content-region structure for teacher workspace
  - [x] Define responsive breakpoints and collapse behavior
  - [x] Preserve premium-neutral design language
- [x] Implement sidebar menu component/shell integration (AC: 1, 2, 3)
  - [x] Add sidebar navigation entries (Dashboard, Appointments, Drafts, Submitted, Privacy, Help)
  - [x] Add active route/menu highlighting and focus-visible styles
  - [x] Ensure keyboard navigation and logical tab order
- [x] Integrate shell with existing teacher routes (AC: 1, 2)
  - [x] Route existing appointments/privacy views through new shell
  - [x] Keep current auth/session guards unchanged
  - [x] Avoid regressions in sign-out and privacy navigation actions
- [x] Add tests and quality checks (AC: 1, 2, 3)
  - [x] Component/route tests for menu visibility and active-state behavior
  - [x] Accessibility checks for keyboard focus and navigation
  - [x] Run focused web lint/tests for touched files

## Dev Notes

- This story introduces navigation structure, not business logic changes.
- Keep current appointment workflows functional while moving them into the new shell.
- Prefer incremental refactor to minimize risk before filter and data-enrichment stories.

### Previous Story Intelligence

- Existing teacher flow is concentrated in `AppointmentsComponent` and currently overloaded.
- Story 6.1 introduced privacy route surface that should remain reachable from the new menu.
- Story 6.5 added guidance copy and should remain visible after shell adoption.

### Architecture Guardrails

- Changes are expected in web layout/routing/components only.
- Keep API contracts and payloads unchanged.
- Preserve existing auth guard behavior on protected routes.

### Testing Requirements

- Verify sidebar renders for authenticated experience.
- Verify active-state behavior for menu navigation.
- Verify responsive behavior does not hide required navigation paths.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story PX1.1]
- [Source: `_bmad-output/planning-artifacts/pitch-ux-epics.md`]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story created from Pitch UX epic stream based on teacher UX overload feedback.

### Completion Notes List

- Added a new authenticated dashboard shell with a persistent left sidebar menu and keyboard-accessible route links for Dashboard, Appointments, Drafts, Submitted, Privacy, and Help.
- Integrated appointments and privacy routes into the new shell while keeping existing auth-session guard behavior unchanged.
- Added responsive collapse/toggle behavior for smaller viewports so navigation remains accessible without overloading the main workspace area.
- Added route and component tests covering shell protection and menu rendering/toggling behavior.
- Validated quality gates with `npx nx test web` and no linter diagnostics for touched files.

### File List

- `_bmad-output/implementation-artifacts/px1-1-introduce-left-sidebar-dashboard-shell.md`
- `school-cronicle/web/src/app/app.routes.ts`
- `school-cronicle/web/src/app/app.routes.spec.ts`
- `school-cronicle/web/src/app/features/dashboard/dashboard-shell.component.ts`
- `school-cronicle/web/src/app/features/dashboard/dashboard-shell.component.css`
- `school-cronicle/web/src/app/features/dashboard/dashboard-shell.component.spec.ts`
- `school-cronicle/web/src/app/features/dashboard/workspace-placeholder.component.ts`
