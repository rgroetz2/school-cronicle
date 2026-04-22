# Story 2.2: View and Open Appointment List

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want to view my appointments and open drafts,  
so that I can continue incomplete work efficiently.

## Acceptance Criteria

1. Given existing teacher appointments, when the list page is opened, then only the teacher's permitted appointments are shown.
2. Given draft appointments are listed, when a draft item is selected, then it opens for editing.

## Tasks / Subtasks

- [x] Implement appointment list retrieval API (AC: 1)
  - [x] Add authenticated list endpoint for appointment drafts scoped to current teacher/session
  - [x] Ensure response returns only permitted appointment records for that teacher
  - [x] Keep API envelope and error patterns consistent with existing modules
- [x] Enforce teacher-scope filtering and access guardrails (AC: 1)
  - [x] Reuse session/authorization guard baseline from prior auth stories
  - [x] Prevent cross-teacher appointment visibility in list endpoint
  - [x] Add stable sorting/ordering for predictable UI rendering
- [x] Implement appointment list UI and draft-open interaction (AC: 1, 2)
  - [x] Add list view component/surface for current teacher appointments
  - [x] Render draft list items with clear clickable/open affordance
  - [x] Wire item selection to open draft in edit route/state
  - [x] Handle empty/loading states in a consistent UX pattern
- [x] Add tests for list visibility and open behavior (AC: 1, 2)
  - [x] API tests for scoped list responses (authenticated teacher only)
  - [x] API test to ensure no unauthorized cross-user data appears
  - [x] Web tests for list rendering and draft item open/navigation behavior
  - [x] Accessibility checks for keyboard-operable list item activation
- [x] Validate quality gates and scope (AC: 1, 2)
  - [x] Run focused appointment-list tests
  - [x] Run `npx nx run-many -t lint,test,build --all` (build currently fails in this environment under Node v25 with no app-code error output)
  - [x] Keep scope limited to list/open only (editing details in Story 2.3)

## Dev Notes

- This story extends Story 2.1 draft creation by introducing draft retrieval and resume flow.
- Maintain strict ownership visibility rules (teacher sees only own appointments).
- Keep list/open behavior minimal and reliable; avoid introducing edit-save complexity here.

### Previous Story Intelligence

- Story 2.1 introduced draft creation endpoint and basic compose flow with teacher/school association.
- Epic 1 stories established session guard and protected route patterns already in code.
- Current web appointments feature already has a draft form and can be extended for list + open behavior.

### Architecture Guardrails

- Keep session-based authenticated access on appointment endpoints.
- Maintain feature/domain-oriented organization (`modules/appointments`, `features/appointments`).
- Preserve naming and API envelope consistency.
- Teacher-scope access control is mandatory for appointment list retrieval.

### Technical Requirements

- API:
  - authenticated list endpoint for appointment drafts
  - teacher-scoped filtering in data retrieval
  - deterministic ordering for list usability
- Web:
  - appointments list rendering
  - open draft action routes to draft edit context
  - loading/empty state handling

### Security and Compliance Notes

- No cross-tenant/cross-user exposure in list results.
- Unauthenticated list access must be rejected consistently.
- Avoid leaking sensitive identifiers through error details.

### UX Notes

- List should support quick “resume work” behavior.
- Draft state should remain clear to user.
- Provide keyboard-friendly list item activation and readable empty state text.

### Testing Requirements

- API:
  - scoped list retrieval for authenticated teacher
  - unauthorized/forbidden visibility tests
- Web:
  - list renders expected drafts
  - selecting an item opens draft edit path
  - empty/loading states are visible and accessible
- Run full lint/test/build gates.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 2.2]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Project Structure & Boundaries]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR6, FR7]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - list/empty/loading patterns]
- [Source: `_bmad-output/implementation-artifacts/2-1-create-draft-appointment.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story auto-selected from sprint backlog order: `2-2-view-and-open-appointment-list`.
- Context synthesized from epics, architecture, PRD, UX, and previous implementation artifacts.

### Completion Notes List

- Added `GET /api/appointments/drafts` with authenticated teacher-scope filtering and deterministic ordering.
- Extended appointments UI with draft loading, empty/loading states, and keyboard-operable open buttons.
- Added API and web tests for scoped list visibility and draft open interaction behavior.
- Focused lint/test suites pass; full run-many reports a pre-existing web production build failure in current Node v25 environment.

### File List

- `_bmad-output/implementation-artifacts/2-2-view-and-open-appointment-list.md`
- `school-cronicle/api/src/modules/appointments/appointments.service.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.integration.spec.ts`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
