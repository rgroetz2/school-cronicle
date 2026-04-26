# Story UX3.6: Introduce Colorful CRUD Action Tokens and States

Status: in-progress

## Story

As a teacher,  
I want action buttons to be visually distinct and engaging,  
so that primary actions stand out while destructive actions remain clear.

## Acceptance Criteria

1. Given appointment/contact CRUD editors, when colorful UI updates are applied, then `Create` and `Save` use consistent prominent styles.
2. `Delete` uses a clearly destructive style distinct from non-destructive actions.
3. Focus, disabled, loading, and error states remain accessibility-compliant and non-color-only.

## Tasks / Subtasks

- [ ] Define semantic color tokens for create/save/delete action hierarchy.
- [ ] Apply tokenized styles to shared CRUD action bar.
- [ ] Validate contrast and focus visibility with accessibility checks.

## Dev Agent Record

### Debug Log References

- `npx nx lint web` (pass)
- `npx nx test web --include=web/src/app/shared/crud-action-bar.component.spec.ts --include=web/src/app/features/appointments/appointments.mode-actions.spec.ts --include=web/src/app/features/contacts/contacts.mode-actions.spec.ts` (pass)
- `npx nx test web` (fails in existing appointments component suite; see notes)

### Completion Notes

- Added semantic CRUD tokens in shared theme (`styles.css`) for create/save/delete hierarchy and focus ring handling.
- Updated shared CRUD action bar to use explicit create/save/delete classes with loading-state accessibility attributes (`aria-busy`, `data-loading`).
- Added visual states for hover, focus-visible, disabled, and loading with non-color cues (busy labels + loading style treatment).
- Updated appointments and contacts integrations to pass loading-state inputs for create/save/delete actions.
- Added/updated tests for action-bar loading attributes and mode-action behavior; targeted suite passes.
- Full web regression remains blocked by existing unrelated `appointments.component.spec.ts` failures, so story remains `in-progress`.

### File List

- `school-cronicle/web/src/styles.css`
- `school-cronicle/web/src/app/shared/crud-action-bar.component.ts`
- `school-cronicle/web/src/app/shared/crud-action-bar.component.css`
- `school-cronicle/web/src/app/shared/crud-action-bar.component.spec.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/contacts/contacts.component.ts`

### Change Log

- 2026-04-25: Added semantic CRUD color tokens and loading/focus/disabled state styling for shared CRUD action bar.
