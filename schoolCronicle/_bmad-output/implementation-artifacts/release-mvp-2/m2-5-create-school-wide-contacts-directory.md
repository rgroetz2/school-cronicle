# Story M2.5: Create School-Wide Contacts Directory

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a teacher,  
I want a reusable contacts directory for school participants,  
so that I can quickly attach the right people to appointments.

## Acceptance Criteria

1. Given contact management access, when I create or edit a contact, then required fields include name, role, email, and phone.
2. Contact types support teachers, parents, staff, and partner participants.

## Tasks / Subtasks

- [ ] Design and add contacts domain model (AC: 1, 2)
  - [ ] Include required fields and type/role classification.
  - [ ] Enforce school-scope isolation for contact records.
- [ ] Implement contacts CRUD API and validations (AC: 1, 2)
  - [ ] Validate required fields and contact format constraints.
  - [ ] Handle duplicate/near-duplicate contact behavior consistently.
- [ ] Build contacts management UI flow (AC: 1, 2)
  - [ ] Allow create/edit with clear required markers.
  - [ ] Provide role/type options matching allowed taxonomy.
- [ ] Add tests for model, API, and UI flows.

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

### File List
