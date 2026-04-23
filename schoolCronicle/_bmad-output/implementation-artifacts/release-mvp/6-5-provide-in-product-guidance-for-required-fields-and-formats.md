# Story 6.5: Provide In-Product Guidance for Required Fields and Formats

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want clear guidance on required fields and accepted image formats,  
so that I can submit valid content first time.

## Acceptance Criteria

1. Given compose and upload surfaces, when teacher interacts with fields/files, then required field and acceptable format guidance is visible contextually.
2. Given contextual guidance is shown, when teachers read guidance, then language is concise and actionable.

## Tasks / Subtasks

- [x] Define guidance content model and placement map (AC: 1, 2)
  - [x] Identify required metadata fields and their guidance entry points in compose flow
  - [x] Identify image format/size guidance entry points near upload controls and validation surfaces
  - [x] Define concise copy constraints (plain language, actionable, non-technical tone)
- [x] Implement required-field contextual guidance in appointment compose flow (AC: 1, 2)
  - [x] Add inline/helper guidance for title, appointment date, and category requirements
  - [x] Ensure readiness/validation surfaces link to the same guidance language for consistency
  - [x] Preserve existing draft/submitted behavior (submitted remains read-only, no edit affordance regression)
- [x] Implement image format guidance in upload surfaces (AC: 1, 2)
  - [x] Surface accepted image formats and max-size expectations near file selection and failed upload rows
  - [x] Keep guidance available before and after user action (prevent hidden discoverability)
  - [x] Align error/failure copy with supported MIME/size rules already enforced in API and client guards
- [x] Ensure accessibility and UX clarity for guidance (AC: 1, 2)
  - [x] Keep guidance visible and perceivable without relying on color alone
  - [x] Ensure keyboard/screen-reader flow reaches guidance in relevant contexts
  - [x] Maintain concise, one-scan text blocks in premium-neutral UI style
- [x] Add test coverage for guidance behavior (AC: 1, 2)
  - [x] Component tests for required-field guidance visibility in draft compose states
  - [x] Component tests for image format guidance in normal and failed-upload states
  - [x] Tests that validate copy remains actionable and present in key interaction states
- [x] Validate quality gates and story boundaries (AC: 1, 2)
  - [x] Run focused web lint/tests for touched modules
  - [x] Keep retention automation behavior in Story 6.4 scope
  - [x] Keep school contact directory behavior in Story 6.6 scope

## Dev Notes

- This story focuses on in-product guidance UX; no new retention or export behavior is expected.
- Reuse existing validation/readiness mechanics from Epics 2-4 and image constraints from Epic 3.
- Keep copy consistent with privacy/guidance tone introduced in Epic 6 while avoiding overexposure of technical details.

### Previous Story Intelligence

- Story 3.2 and 3.4 already enforce image format/size constraints and submit blocking; this story should improve explainability, not change policy.
- Story 2.4 enforces metadata readiness; this story should make field expectations clearer before failure.
- Story 4.3 read-only behavior for submitted appointments must remain unchanged.
- Story 6.1-6.3 added privacy guidance surfaces and wording tone that should remain consistent.

### Architecture Guardrails

- Primary changes are expected in web feature components and templates; avoid unnecessary API changes.
- Guidance text should remain source-of-truth aligned with existing validation constants and error rules.
- Preserve current response envelope and API guard behavior.

### Technical Requirements

- Guidance must be visible contextually where users make decisions:
  - required metadata fields in draft form
  - image upload controls and image validation states
- Guidance copy should be concise, actionable, and non-technical.
- Existing validation errors should remain specific and compatible with guidance text.

### Security and Compliance Notes

- Guidance must not expose sensitive internals or security implementation details.
- Keep privacy-safe language and avoid embedding sensitive operational policy details in UI text.

### UX Notes

- Maintain premium-neutral design language and clear hierarchy.
- Use calm, concise instructional text and avoid dense blocks.
- Ensure guidance is discoverable in both initial and error states.

### Testing Requirements

- Web/component tests for required-field and image-format guidance visibility.
- Regression tests for existing submit/read-only/image validation behavior touched by UI copy placement.
- Run lint/tests for touched web project files.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 6.5]
- [Source: `_bmad-output/planning-artifacts/prd.md` - FR31]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - guidance and validation UX]
- [Source: `_bmad-output/implementation-artifacts/2-4-enforce-metadata-submission-gate.md`]
- [Source: `_bmad-output/implementation-artifacts/3-2-validate-image-type-and-size.md`]
- [Source: `_bmad-output/implementation-artifacts/3-4-block-submit-on-image-validation-failures.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story selected from Epic 6 after Story 6.4 moved to review.
- Context synthesized from metadata validation and image validation guidance gaps across prior stories.

### Completion Notes List

- Added concise required-field guidance in the draft editor for title, appointment date, and category, while preserving existing validation and read-only submitted behavior.
- Added contextual submit-readiness guidance and upload-surface format guidance so teachers can see required metadata and acceptable image constraints before and during interaction.
- Kept guidance copy aligned with existing image validation policy text (JPEG/PNG/WebP and 2 MB maximum) and existing failure detail surfaces.
- Expanded `AppointmentsComponent` tests to verify guidance visibility in compose and image-validation states.
- Validated web quality gates with `npx nx test web` and no linter diagnostics on touched files.

### File List

- `_bmad-output/implementation-artifacts/6-5-provide-in-product-guidance-for-required-fields-and-formats.md`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.css`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
