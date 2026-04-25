# Story UX3.3: Apply Shared Action Bar to Appointment Editor

Status: drafted

## Story

As a teacher,  
I want appointment editing to use the same bottom CRUD controls as other editors,  
so that behavior feels predictable throughout the app.

## Acceptance Criteria

1. Given appointment create mode, when I use bottom actions, then `Create` creates a new appointment.
2. Given appointment edit mode, when I use bottom actions, then `Save` updates and `Delete` removes the appointment when policy allows.
3. Success and error feedback is shown without dropping unrelated form values.

## Tasks / Subtasks

- [ ] Map existing appointment handlers to standardized action-bar events.
- [ ] Align labels and action ordering with shared contract.
- [ ] Add integration/e2e coverage for create, save, and delete appointment flows.
