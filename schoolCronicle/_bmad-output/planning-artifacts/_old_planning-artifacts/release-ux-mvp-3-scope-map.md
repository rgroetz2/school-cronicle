# Release UX MVP 3 - CRUD Scope Map

## Release Goal

Implement a colorful, teacher-friendly UI pass with consistent bottom action controls for CRUD surfaces, with required actions:
- `Create`
- `Save`
- `Delete`

## Surface Inventory

## 1) Appointments CRUD Surface
- UI: `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- Current capability: Create, update/save, delete already exist with modal footer actions.
- Release requirement:
  - Keep all three bottom actions present and visually consistent.
  - Standardize action behavior and label semantics.
  - Ensure explicit mode behavior:
    - Create mode: `Create` visible, `Save` hidden/disabled, `Delete` hidden/disabled.
    - Edit mode: `Save` and `Delete` visible, `Create` hidden/disabled.

## 2) Contacts CRUD Surface
- UI: `school-cronicle/web/src/app/features/contacts/contacts.component.ts`
- Current capability: Create and update/save exist; delete is missing in frontend service/UI flow.
- Release requirement:
  - Add and wire bottom `Delete` action for edit mode.
  - Keep `Create` for new mode and `Save` for edit mode.
  - Remove ambiguity from duplicate save controls if present.

## 3) Other App Screens
- `dashboard`, `drafts`, `submitted`, `help`, and `privacy` are not full appointment/contact CRUD screens.
- They are excluded from bottom `Create/Save/Delete` mandatory control set for this release, except where they embed appointment/contact CRUD interactions in future.

## Action Semantics Standard

For every appointment/contact CRUD editor:
- `Create`
  - Purpose: Persist a new record.
  - Enabled only when minimum required fields for creation are satisfied.
- `Save`
  - Purpose: Persist changes to an existing record.
  - Enabled only in edit mode.
- `Delete`
  - Purpose: Remove an existing record after confirmation.
  - Enabled only in edit mode.

## Visual and UX Rules

- Button row is fixed at the bottom of the CRUD editor viewport/modal.
- Colorful styling follows accessible semantic tokens:
  - Create/Save as primary/tonal emphasis.
  - Delete as destructive emphasis with adequate contrast.
- Controls remain keyboard accessible and touch-friendly.
- States (loading/disabled/error) are consistent across appointments and contacts.

## Dependency Notes

- Contacts delete requires frontend API method support in auth API service and corresponding UI wiring.
- Unified button behavior should be implemented via a shared UI pattern/component to avoid drift.
