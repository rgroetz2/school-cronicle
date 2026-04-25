# Story UX3.4: Add Contact Delete API Method in Frontend Service

Status: drafted

## Story

As a developer,  
I want a dedicated frontend API method for deleting contacts,  
so that the contacts editor can invoke delete through the same service abstraction as create/save.

## Acceptance Criteria

1. Given a contact id, when delete is requested, then the frontend service calls the backend contact delete endpoint.
2. The service returns actionable success/failure states to UI consumers.
3. Error handling follows existing app error conventions.

## Tasks / Subtasks

- [ ] Add delete contact method to frontend service with typed response/error handling.
- [ ] Add tests for successful and failing delete API responses.
- [ ] Document usage in contacts feature notes.
