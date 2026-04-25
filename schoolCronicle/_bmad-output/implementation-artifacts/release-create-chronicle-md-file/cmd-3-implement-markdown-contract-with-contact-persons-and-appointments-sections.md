# Story CMD.3: Implement Markdown Contract with `contact persons` and `appointments` Sections

Status: in-progress

## Story

As a chronicle coordinator,  
I want exported markdown to use explicit section headings,  
so that I can reliably review and process contact and appointment content.

## Acceptance Criteria

1. Markdown contains explicit `contact persons` and `appointments` sections.
2. Section content includes only metadata fields required by the export contract.
3. Optional fields are handled safely (no malformed markdown when values are missing).

## Tasks / Subtasks

- [x] Define and implement markdown schema for `contact persons` section.
- [x] Define and implement markdown schema for `appointments` section.
- [x] Add safe fallback rendering rules for missing optional metadata.

## Dev Agent Record

### Debug Log References

- `npx nx test api` (pass)

### Completion Notes

- Hardened markdown schema to include explicit metadata line format for contact persons: `id`, `name`, `role`.
- Expanded appointments section metadata with safe fallbacks for optional fields:
  - `Class/grade`
  - `Guardian name`
  - `Location`
- Added explicit participants sub-section with metadata-only rows (`id`, `name`, `role`) and `None` fallback.
- Kept media serialization metadata-only and validated markdown output contains no `data:image/` payloads.
- Added integration assertions that decode markdown artifact and verify required sections + fallback behavior.

### File List

- `school-cronicle/api/src/modules/appointments/appointments.service.ts`
- `school-cronicle/api/src/modules/appointments/appointments.controller.integration.spec.ts`
