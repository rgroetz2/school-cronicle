# Release Brief: Create Chronicle Markdown File

## Release Name
`create-chronicle-md-file`

## Release Intent

Deliver an MVP markdown chronicle export flow that complements existing `.docx` export by generating a deterministic, review-friendly `.md` file with explicit `contact persons` and `appointments` sections.

## Inputs Used

- `_bmad-output/planning-artifacts/prd.md`
- `_bmad-output/planning-artifacts/architecture.md`
- `_bmad-output/planning-artifacts/create-chronicle-md-file-brainstorm.md`
- `_bmad-output/planning-artifacts/epics.md`

## User Outcome

Teachers and coordinators can export chronicle content as markdown for lightweight collaboration, auditing, and downstream automation, without changing existing `.docx` behavior.

## Definition of Done

1. Export control includes `Export chronicle (.md)` in the existing export workflow.
2. Markdown output contains explicit `contact persons` and `appointments` sections.
3. Media entries include filename + metadata only, with no binary/base64 payload.
4. Markdown structure and ordering are deterministic for the same input.
5. Failure feedback is actionable and preserves selection context.
6. Existing `.docx` export remains functional and regression-tested.

## Constraints

- Keep implementation aligned with existing export architecture and security boundaries.
- Avoid introducing template engines or markdown import in this MVP.
- Preserve accessibility and current teacher interaction flow.

## Story Decomposition Guidance

- Separate UI wiring from serialization contract logic.
- Keep markdown schema validation isolated and testable.
- Explicitly include non-regression checks for `.docx` export.
