# Story UX3.6: Introduce Colorful CRUD Action Tokens and States

Status: drafted

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
