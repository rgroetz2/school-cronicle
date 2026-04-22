# Story 2.3: Edit Draft Metadata and Category

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want to edit draft metadata and assign a controlled category,  
so that entries are accurate and chronicle-ready.

## Acceptance Criteria

1. Given a saved draft appointment, when the teacher edits fields and category, then updates are persisted to the draft.
2. Given a draft editor with category selection, when the teacher opens category options, then options come from the controlled set.

## Tasks / Subtasks

- [x] Implement draft metadata update API (AC: 1)
  - [x] Add authenticated update endpoint for teacher-owned draft appointments
  - [x] Validate required metadata fields and keep error envelope consistency
  - [x] Persist updates only for the current teacher/session scope
- [x] Implement controlled category source and enforcement (AC: 2)
  - [x] Define controlled category set in shared appointments domain location
  - [x] Reject unknown category values at API boundary
  - [x] Keep category naming stable across web and API layers
- [x] Extend appointment draft editor UI for metadata and category updates (AC: 1, 2)
  - [x] Add editable draft form state hydrated from selected draft
  - [x] Render category input as controlled select/options list
  - [x] Save changes and surface success/failure feedback without losing user input
  - [x] Preserve keyboard and screen-reader accessibility for form updates
- [x] Add tests for edit persistence and controlled categories (AC: 1, 2)
  - [x] API tests for teacher-scoped updates on owned drafts
  - [x] API tests rejecting non-owned draft updates and invalid categories
  - [x] Web tests for editing flow, category options rendering, and save result UX
  - [x] Accessibility-focused checks for editable controls and validation feedback
- [x] Validate quality gates and story scope (AC: 1, 2)
  - [x] Run focused appointments edit tests
  - [x] Run `npx nx run-many -t lint,test,build --all` (still blocked by existing `web:build:production` environment issue)
  - [x] Keep submit-gate behavior out of scope (Story 2.4)

## Dev Notes

- This story builds directly on Story 2.2 list/open behavior by enabling metadata editing on selected drafts.
- Keep edit/save focused on draft state only; submission gating remains for Story 2.4.
- Preserve strict teacher ownership checks for every update path.

### Previous Story Intelligence

- Story 2.1 introduced draft creation and required metadata baseline.
- Story 2.2 added scoped list/open flow, which now provides the entry point to edit drafts.
- Existing auth/session guard patterns are already established and should be reused.

### Architecture Guardrails

- Keep session-based authenticated access on appointments endpoints.
- Maintain feature/domain organization (`modules/appointments`, `features/appointments`).
- Preserve API response envelope and non-sensitive error semantics.
- Enforce teacher-scope ownership checks for update operations.

### Technical Requirements

- API:
  - authenticated draft update endpoint
  - teacher-owned draft-only mutation
  - controlled category validation
- Web:
  - editable draft metadata form bound to selected draft
  - controlled category selector
  - save/update feedback and retained input on recoverable errors

### Security and Compliance Notes

- No cross-teacher draft edits or visibility during update calls.
- Unauthenticated updates must be rejected consistently.
- Error responses should avoid leaking ownership/internal identifiers.

### UX Notes

- Editing should feel lightweight and predictable from list-open flow.
- Category selection should clearly indicate controlled options.
- Validation and save feedback should be perceivable and accessible.

### Testing Requirements

- API:
  - successful teacher-owned draft update
  - unauthorized/forbidden update attempts
  - invalid category rejection
- Web:
  - draft edit form hydrates and saves changes
  - category options are controlled-set only
  - save feedback and a11y cues are present
- Run full lint/test/build gates.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 2.3]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Project Structure & Boundaries]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Authentication & Security]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR7, FR9, FR15]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - compose/edit form patterns]
- [Source: `_bmad-output/implementation-artifacts/2-2-view-and-open-appointment-list.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story auto-selected from sprint backlog order: `2-3-edit-draft-metadata-and-category`.
- Context synthesized from epics, architecture, PRD, UX, and previous implementation artifacts.

### Completion Notes List

- Added authenticated draft update API (`PATCH /api/appointments/drafts/:draftId`) with teacher-scope ownership enforcement.
- Added controlled category model and validation in API plus categories endpoint for UI consistency.
- Extended appointments UI to open/hydrate/edit a draft and save metadata/category updates.
- Added integration and component tests covering update success and invalid category rejection.
- Focused lint/test/build checks pass for changed projects; full run-many remains blocked by existing `web:build:production` failure.

### File List

- `_bmad-output/implementation-artifacts/2-3-edit-draft-metadata-and-category.md`
- `school-cronicle/api/src/modules/appointments/appointment-categories.ts`
- `school-cronicle/api/src/modules/appointments/appointment.types.ts`
- `school-cronicle/api/src/modules/appointments/appointments.service.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.integration.spec.ts`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
