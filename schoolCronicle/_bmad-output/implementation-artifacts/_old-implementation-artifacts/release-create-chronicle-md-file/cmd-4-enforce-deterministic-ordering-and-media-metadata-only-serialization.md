# Story CMD.4: Enforce Deterministic Ordering and Media Metadata-Only Serialization

Status: in-progress

## Story

As a developer,  
I want output ordering and media formatting to be deterministic,  
so that the markdown is diff-friendly and stable for downstream tooling.

## Acceptance Criteria

1. Given identical input, repeated exports produce stable ordering and structure.
2. Media entries include filename + metadata only.
3. Media serialization excludes base64/binary payloads.

## Tasks / Subtasks

- [x] Implement deterministic sort strategy for exported sections/entries.
- [x] Serialize media as filename + metadata fields only.
- [x] Add guards to prevent binary/base64 payload inclusion in markdown output.

## Dev Agent Record

### Debug Log References

- `npx nx test api` (pass)

### Completion Notes

- Enforced deterministic sorting for markdown export sub-collections:
  - participants sorted by `name`, `role`, `contactId`
  - media sorted by `name`, `mimeType`, `printable` flag
- Added service-level tests verifying stable markdown output for identical data regardless input ID order.
- Added explicit safety tests proving markdown media lines contain metadata only and never include `data:image/` or base64 payload strings.
- Confirmed export remains deterministic and diff-friendly across repeated runs with reordered selection inputs.

### File List

- `school-cronicle/api/src/modules/appointments/appointments.service.ts`
- `school-cronicle/api/src/modules/appointments/appointments.service.spec.ts`
