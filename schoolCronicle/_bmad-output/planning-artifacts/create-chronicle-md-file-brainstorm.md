# BMAD Brainstorm: `create-chronicle-md-file`

## Feature Name
`create-chronicle-md-file`

## Brainstorm Goal
Define a practical, MVP-ready feature that generates a Markdown chronicle file from selected appointments, aligned with existing export flows and teacher workflows.

## Problem Statement
Current chronicle export focus is `.docx`, but teams may need a plain, portable, versionable format for review, collaboration, and downstream automation. A Markdown export can provide this lightweight interchange without replacing the `.docx` path.

## Desired Outcome
Teachers (or coordinator-facing workflows) can generate a single `.md` chronicle file from selected appointments, with deterministic structure, readable sections, and safe handling of optional data.

## Users and Jobs To Be Done
- **Teacher:** "I want to quickly export selected appointments into a readable markdown file I can share or review."
- **Chronicle coordinator:** "I want a consistent text-based chronicle artifact that is easy to diff, archive, or post-process."
- **Developer/ops:** "I want a stable markdown schema that can be consumed by scripts or AI tooling later."

## Scope Options Considered

### Option A: Minimal markdown export (MVP)
- Export selected appointments into one `.md` file.
- Include core metadata, notes, participants, and image references.
- Triggered from existing chronicle export area.

**Pros:** Fastest delivery, low risk, immediate utility.  
**Cons:** Limited formatting controls, no templates.

### Option B: Template-driven markdown export
- User chooses among markdown templates.
- Supports custom section ordering.

**Pros:** Flexible and future-proof.  
**Cons:** Higher complexity; larger testing surface.

### Option C: Bi-directional markdown sync
- Import edited markdown back into appointments.

**Pros:** Powerful editing loop.  
**Cons:** High parsing/validation complexity; out of MVP scope.

## Decision
Proceed with **Option A (Minimal markdown export)** for MVP.  
Decision confirmed in chat.

## MVP Scope Definition

### In Scope
- Add "Export chronicle (.md)" action near existing chronicle export controls.
- Export selected data into one markdown document with two explicit sections:
  - `contact persons`
  - `appointments`
- Use deterministic ordering (by appointment date, then title).
- Include only metadata and file names for media references (no image data content).
- Download file locally with predictable filename.
- Show clear success/failure feedback in UI.

### Out of Scope (for this feature phase)
- Rich markdown theming/template selection
- Image binary embedding (base64 in markdown)
- Round-trip markdown import/edit sync
- Full WYSIWYG preview/editor

## Functional Requirements (Draft)
- **CMDFR1:** User can export chronicle data as a single `.md` file.
- **CMDFR2:** Output structure is deterministic and consistent across runs for same input.
- **CMDFR3:** Optional fields render safely (missing data does not break structure).
- **CMDFR4:** File name follows a predictable convention including date/time context.
- **CMDFR5:** Errors are surfaced with actionable feedback; selection state is preserved on failure.
- **CMDFR6:** Export includes `contact persons` and `appointments` sections.
- **CMDFR7:** Media representation in markdown includes file name and metadata only (no binary/base64 body).

## Non-Functional Requirements (Draft)
- **CMDNFR1:** Export generation should complete within acceptable UX latency for normal selection sizes.
- **CMDNFR2:** Markdown must be UTF-8 text and compatible with common markdown viewers.
- **CMDNFR3:** Accessibility parity with existing export controls (keyboard + screen reader labels).
- **CMDNFR4:** No regression to existing `.docx` export flow.

## Markdown Output Contract (MVP Draft)
- File extension: `.md`
- Encoding: UTF-8
- Suggested filename: `chronicle-YYYY-MM-DD-HHMM.md`
- Section pattern:
  1. `# Chronicle Export`
  2. Generation metadata
  3. `## Contact persons`
     - Repeating contact blocks with role + metadata
  4. `## Appointments`
     - Repeating appointment blocks:
     - `## <Appointment Title>`
     - Date, category, status
     - Notes
     - Participants list (if any)
     - Media list (if any): **file name + metadata only**

## Acceptance Criteria (Draft)
1. Given export-eligible data, when user clicks `Export chronicle (.md)`, then browser downloads one `.md` file.
2. Given selected appointments with optional metadata missing, when export runs, then markdown remains valid and readable with omitted/placeholder-safe sections.
3. Given the same appointment set and sort order, when exported repeatedly, then entry ordering and headings are deterministic.
4. Given export failure, when error occurs, then user sees actionable error feedback and current selection remains unchanged.
5. Existing `.docx` export continues to work unchanged for same selection.
6. Exported markdown contains explicit `contact persons` and `appointments` sections.
7. Media entries in markdown include only file name and metadata, with no image binary/base64 payload.

## Story Decomposition Proposal
- **Story CMD-1:** Add markdown export command and UI entry point.
- **Story CMD-2:** Implement markdown serializer for selected appointments (deterministic contract).
- **Story CMD-3:** Integrate download behavior and user feedback states (success/error/loading).
- **Story CMD-4:** Add automated tests (unit + integration/e2e) for markdown structure and failure handling.

## Risks and Mitigations
- **Risk:** Inconsistent markdown formatting across edge cases.  
  **Mitigation:** Snapshot tests for serializer output with varied fixtures.
- **Risk:** Regressions in existing `.docx` export actions.  
  **Mitigation:** Keep separate command path and add regression tests for both exports.
- **Risk:** Large selection size impacts response time.  
  **Mitigation:** Bound selection count for MVP or show progress/loading feedback.

## Open Questions
- Should submitted-only appointments be exportable, or same eligibility as current `.docx` flow?
- Do we want locale-specific date formatting in markdown, or fixed ISO format?
- Is there a preferred heading taxonomy for coordinator workflows?

## Recommended Next BMAD Step
Run `bmad-create-epics-and-stories` for `create-chronicle-md-file` using this brainstorm artifact plus existing PRD/architecture docs.
