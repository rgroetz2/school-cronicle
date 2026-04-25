# Story UX3.4: Add Contact Delete API Method in Frontend Service

Status: in-progress

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

## Dev Agent Record

### Debug Log References

- `npx nx lint web` (pass)
- `npx nx test web --include=web/src/app/core/auth-api.service.spec.ts` (pass)

### Completion Notes

- Added `deleteContact(contactId: string): Observable<boolean>` to `AuthApiService` with typed API response mapping (`DeleteContactResponse`).
- Added dummy-session behavior that deletes by id from local contacts store and returns success boolean.
- Added service tests covering:
  - successful dummy-session delete
  - successful API delete endpoint mapping
  - API failure propagation for delete requests.
- Full app regression gate remains blocked by existing unrelated failures in the broader appointments suite, so story remains `in-progress`.

### File List

- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/core/auth-api.service.spec.ts`

### Change Log

- 2026-04-25: Added typed contact delete method and success/failure tests in auth API service.
