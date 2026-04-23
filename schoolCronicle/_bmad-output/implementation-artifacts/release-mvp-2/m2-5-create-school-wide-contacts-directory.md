# Story M2.5: Create School-Wide Contacts Directory

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want a reusable contacts directory for school participants,  
so that I can quickly attach the right people to appointments.

## Acceptance Criteria

1. Given contact management access, when I create or edit a contact, then required fields include name, role, email, and phone.
2. Contact types support teachers, parents, staff, and partner participants.

## Tasks / Subtasks

- [x] Design and add contacts domain model (AC: 1, 2)
  - [x] Include required fields and type/role classification.
  - [x] Enforce school-scope isolation for contact records.
- [x] Implement contacts CRUD API and validations (AC: 1, 2)
  - [x] Validate required fields and contact format constraints.
  - [x] Handle duplicate/near-duplicate contact behavior consistently.
- [x] Build contacts management UI flow (AC: 1, 2)
  - [x] Allow create/edit with clear required markers.
  - [x] Provide role/type options matching allowed taxonomy.
- [x] Add tests for model, API, and UI flows.

## Dev Notes

- This story creates foundational participant data reused by M2.6.
- Keep contact schema minimal for MVP 2 to avoid premature complexity.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story M2.5]
- [Source: `_bmad-output/planning-artifacts/prd.md` - Release MVP 2 Addendum, FR37]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - contacts entity and school-scope impacts]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

### Completion Notes List

- Added new contacts domain model and role taxonomy for `teacher`, `parent`, `staff`, and `partner`.
- Implemented `/api/contacts` CRUD endpoints with auth/session checks, required-field validation, role/email validation, and duplicate detection by school-scoped email+phone.
- Added contacts module wiring in API app bootstrap.
- Extended web `AuthApiService` with contact listing/creation/updating and dummy-store parity.
- Added a contacts directory panel in appointments workspace with required create/edit form and contact list refresh/edit flow.
- Added focused integration and component tests for contact create/edit behavior and duplicate handling.

### File List

- `school-cronicle/api/src/modules/contacts/contact.types.ts`
- `school-cronicle/api/src/modules/contacts/contact-roles.ts`
- `school-cronicle/api/src/modules/contacts/contacts.service.ts`
- `school-cronicle/api/src/modules/contacts/contacts.controller.ts`
- `school-cronicle/api/src/modules/contacts/contacts.module.ts`
- `school-cronicle/api/src/modules/contacts/contacts.controller.integration.spec.ts`
- `school-cronicle/api/src/app/app.module.ts`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.css`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
