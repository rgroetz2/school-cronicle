# Story M2.8: Enforce Image Upload and Printable Limits

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want clear image limits per appointment,  
so that chronicle output remains constrained and predictable.

## Acceptance Criteria

1. Given appointment media upload, when I manage images, then at most 5 images can be uploaded.
2. At most 3 images can be marked printable.
3. Printable selection is manual and visible before export.

## Tasks / Subtasks

- [ ] Enforce max-5 upload policy in API and UI validation paths (AC: 1)
  - [ ] Reject or block additional uploads beyond limit with clear feedback.
  - [ ] Keep behavior deterministic across edit sessions.
- [ ] Add printable flag and max-3 selection policy (AC: 2)
  - [ ] Manual toggle/select behavior only; no automatic ranking.
  - [ ] Enforce limit server-side as source of truth.
- [ ] Surface printable-selection state in modal/list/export prep UI (AC: 3)
  - [ ] Ensure selected printable items are clearly visible.
  - [ ] Provide correction path when limit is exceeded.
- [ ] Add tests for upload and printable constraints.

## Dev Notes

- Keep constraints aligned with export requirements (M2.9/M2.10).
- Reuse existing file validation patterns to reduce regression risk.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story M2.8]
- [Source: `_bmad-output/planning-artifacts/prd.md` - Release MVP 2 Addendum, FR40]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - media policy constraints]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md` - media UX rules]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

### Completion Notes List

### File List
