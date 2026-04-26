# Story PX2.2: Add New Optional Metadata Filters

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want to filter by class/grade, guardian name, and location,  
so that I can quickly find relevant appointments.

## Acceptance Criteria

1. Given appointments include optional metadata, when I set class/grade, guardian name, or location filters, then list results update correctly.
2. Given metadata filters are active, when combined with existing base filters, then results remain consistent across all selected criteria.
3. Given filters return no matching items, when the list renders, then a clear no-match state is shown with guidance to adjust or clear filters.

## Tasks / Subtasks

- [x] Define optional metadata filter state contract (AC: 1, 2)
  - [x] Add filter keys for class/grade, guardian name, and location
  - [x] Define matching rules (exact/contains, case handling, trim behavior)
  - [x] Define behavior when metadata is missing on legacy records
- [x] Extend filter panel UI with metadata fields (AC: 1, 2)
  - [x] Add class/grade filter control
  - [x] Add guardian name filter control
  - [x] Add location filter control
  - [x] Keep controls aligned with existing filter panel hierarchy
- [x] Implement combinational filtering logic (AC: 1, 2, 3)
  - [x] Apply metadata filters together with category/status/date/has-images/lifecycle filters
  - [x] Ensure filtering remains deterministic and immediate
  - [x] Ensure no-match guidance remains clear with metadata filters active
- [x] Preserve compatibility and avoid regressions (AC: 2, 3)
  - [x] Ensure records without optional metadata are handled safely
  - [x] Keep existing open/edit/submit flows unchanged
  - [x] Keep route-context list views (`drafts/submitted/attention`) stable
- [x] Add tests and quality checks (AC: 1, 2, 3)
  - [x] Tests for each metadata filter in isolation
  - [x] Tests for combined metadata + base filters
  - [x] Tests for no-match and clear/reset behavior with metadata filters
  - [x] Run focused web lint/tests for touched files

## Dev Notes

- This story extends the dedicated filter panel from PX2.1 with metadata-specific criteria.
- Optional metadata fields were defined for the pitch UX track and must stay non-blocking.
- Keep implementation frontend-focused and deterministic for demo reliability.

### Previous Story Intelligence

- PX2.1 delivered the baseline filter panel and combinational base filters.
- PX1.2 dashboard cards navigate into appointments contexts and should continue working with extended filters.
- PX1.3 re-layout introduced zone-based workspace organization and progressive disclosure.

### Architecture Guardrails

- Frontend-only changes in appointments filter/model presentation layer.
- No API contract change required for basic local filtering logic in this story.
- Preserve existing route/query context behavior.

### Testing Requirements

- Validate metadata filter behavior on populated and partially populated datasets.
- Validate combined filtering and no-result states.
- Validate no regression in core appointment interactions.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story PX2.2]
- [Source: `_bmad-output/planning-artifacts/pitch-ux-epics.md`]
- [Source: `_bmad-output/implementation-artifacts/px2-1-build-dedicated-filter-panel.md`]
- [Source: `_bmad-output/implementation-artifacts/px1-3-reduce-workspace-cognitive-load-via-section-re-layout.md`]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story created after PX2.1 moved to review to continue the metadata-filter path.

### Completion Notes List

- Added optional metadata fields (`classGrade`, `guardianName`, `location`) to the frontend draft model with safe normalization for legacy records that do not include metadata.
- Extended the dedicated filter panel with class/grade, guardian name, and location controls under advanced filters.
- Implemented deterministic metadata filtering as case-insensitive, trimmed contains-matching and combined it with existing base filters.
- Added focused appointments component tests for metadata-only and metadata+base filter combinations.
- Verified quality with `npx nx test web` and lint diagnostics for touched files.

### File List

- `_bmad-output/implementation-artifacts/px2-2-add-new-optional-metadata-filters.md`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
