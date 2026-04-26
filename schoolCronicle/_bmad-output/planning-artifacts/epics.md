---
stepsCompleted:
  - 1
  - 2
  - 3
  - 4
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-directions.html
status: complete
---

# schoolCronicle - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for schoolCronicle Release 1, focused on role-based access and CRUD/filter workflows for `school-personal` and `school` entities with Excel-like list interaction.

## Requirements Inventory

### Functional Requirements

FR1: The system supports two roles: `admin` and `user`.
FR2: A `user` is not allowed to perform admin operations.
FR3: A `user` can maintain only their own `school-personal` profile.
FR4: A `user` can maintain only their own appointments.
FR5: The system provides a `school-personal` entity with properties: `name`, `role` (`admin | user`), `jobRole` (`teacher | assistant | supporter | other`), `class` (optional), and `startDate` (optional).
FR6: The system provides CRUD UI for `school-personal`.
FR7: The system provides one list/filter UI for `school-personal`.
FR8: The system provides a `school` entity with properties: `name`, `type`, `address`, `description`, and `comment`.
FR9: The system provides CRUD UI for `school`.
FR10: The system provides one list/filter UI for `school`.
FR11: Every CRUD UI has exactly two bottom actions: `SAVE` and `CANCEL`.
FR12: Clicking `SAVE` executes persistence and closes the CRUD UI.
FR13: Clicking `CANCEL` closes the CRUD UI.
FR14: Filter/list UI uses an Excel-like rows-and-columns grid style.
FR15: Double-clicking a grid cell opens the corresponding record in CRUD UI.
FR16: After `SAVE`, list/filter UI reflects the persisted changes.

### NonFunctional Requirements

NFR1: Authorization enforcement follows deny-by-default and prevents role escalation.
NFR2: `user` ownership restrictions are enforced server-side, not UI-only.
NFR3: Core list/open/save interactions should align with existing p95 responsiveness goals (2s target under nominal load).
NFR4: UI interactions are keyboard-accessible and do not rely on color-only state meaning.
NFR5: API and frontend naming/format conventions remain consistent with project architecture standards.
NFR6: Significant CRUD actions are auditable with actor, action, target, and timestamp.

### Additional Requirements

- Keep API authorization checks role-aware (`admin` vs `user`) and ownership-aware for `school-personal`.
- Keep API payloads camelCase and persistence naming conventions consistent with architecture (`snake_case` in DB).
- Preserve architecture pattern: frontend facades/services + Reactive Forms.
- Maintain uniform API success/error envelopes and typed validation errors.
- Keep entity creation incremental by story (no broad upfront schema unrelated to current story).

### UX Design Requirements

UX-DR1: `school-personal` and `school` list views render as compact grid tables with clear row/column separation (Excel-like mental model).
UX-DR2: Double-click on any data cell opens that row record in CRUD UI edit mode.
UX-DR3: CRUD screens include only `SAVE` and `CANCEL` in the bottom action area.
UX-DR4: Successful save closes CRUD UI and returns user to refreshed list context.
UX-DR5: Cancel closes CRUD UI without persisting changes.
UX-DR6: Missing optional values (`class`, `startDate`, optional `school` text fields) show explicit placeholders in list/detail views for scanability.

### FR Coverage Map

FR1: Epic 1 - Define two-role authorization model.
FR2: Epic 1 - Block `user` from admin operations.
FR3: Epic 2 - Restrict `user` to own `school-personal` profile.
FR4: Epic 5 - Restrict appointment maintenance to owning user.
FR5: Epic 2 - Implement `school-personal` data model.
FR6: Epic 2 - Implement `school-personal` CRUD UI.
FR7: Epic 2 - Implement `school-personal` list/filter UI.
FR8: Epic 3 - Implement `school` data model.
FR9: Epic 3 - Implement `school` CRUD UI.
FR10: Epic 3 - Implement `school` list/filter UI.
FR11: Epic 4 - Enforce `SAVE`/`CANCEL` bottom actions.
FR12: Epic 4 - Save executes and closes CRUD UI.
FR13: Epic 4 - Cancel closes CRUD UI.
FR14: Epic 4 - Excel-like row/column filter grid.
FR15: Epic 4 - Double-click cell opens CRUD editor.
FR16: Epic 4 - Save updates reflected in list/grid.

## Epic List

### Epic 1: Role-Based Access Foundation
Deliver secure two-role behavior (`admin`, `user`) with deny-by-default guards so non-admin users cannot access admin operations.
**FRs covered:** FR1, FR2

### Epic 2: School-Personal Management
Enable `school-personal` entity lifecycle with role-aware permissions (`admin` full access, `user` self-only profile maintenance).
**FRs covered:** FR3, FR5, FR6, FR7

### Epic 3: School Management
Enable `school` entity lifecycle with full CRUD and list/filter operations aligned to role policy.
**FRs covered:** FR8, FR9, FR10

### Epic 4: Shared CRUD and Grid Interaction Experience
Standardize CRUD action bar (`SAVE`, `CANCEL`), close-on-action behavior, Excel-like grid interaction, and double-click-to-open editing across both entities.
**FRs covered:** FR11, FR12, FR13, FR14, FR15, FR16

### Epic 5: User Appointment Ownership Guardrails
Ensure `user` can maintain only own appointments (authorization boundary in API and app guards).
**FRs covered:** FR4

## Epic 1: Role-Based Access Foundation

Deliver secure two-role behavior (`admin`, `user`) with deny-by-default guards so non-admin users cannot access admin operations.

### Story 1.1: Set Up Initial Project from Starter Template

As a developer,
I want to scaffold and validate the agreed Nx starter baseline,
So that role and CRUD features are implemented on the approved architecture foundation.

**Acceptance Criteria:**

**Given** the repository baseline for Release 1
**When** the starter workspace and required apps/libs are initialized and verified
**Then** the solution runs with passing baseline build/lint/test targets
**And** structure and naming conventions align with architecture patterns.

### Story 1.2: Add Role Model and Session Claims

As a platform operator,
I want authenticated sessions to include a canonical role claim (`admin` or `user`),
So that authorization decisions are deterministic across UI and API.

**Acceptance Criteria:**

**Given** a signed-in account
**When** the session is established
**Then** the session includes exactly one valid role from `admin | user`
**And** any unknown role value is rejected and logged as a security event.

### Story 1.3: Enforce Backend Role Guards

As a system owner,
I want backend endpoints to be protected by role guards with deny-by-default behavior,
So that `user` accounts cannot execute admin operations.

**Acceptance Criteria:**

**Given** an endpoint marked admin-only
**When** a `user` requests it
**Then** access is denied with a consistent forbidden error envelope
**And** authorization checks are enforced server-side independent of frontend controls.

### Story 1.4: Enforce Frontend Route and Action Visibility by Role

As a user,
I want to see only actions I am authorized to use,
So that the interface matches my permissions and reduces accidental access attempts.

**Acceptance Criteria:**

**Given** a signed-in `user`
**When** protected screens/actions render
**Then** admin-only routes and actions are hidden or inaccessible
**And** direct navigation attempts to admin routes are blocked and redirected safely.

## Epic 2: School-Personal Management

Enable `school-personal` entity lifecycle with role-aware permissions (`admin` full access, `user` self-only profile maintenance).

### Story 2.1: Implement School-Personal Data Model and Validation

As a developer,
I want a `school-personal` entity with required and optional fields,
So that profile data can be captured consistently.

**Acceptance Criteria:**

**Given** the `school-personal` entity schema
**When** records are created or updated
**Then** required fields are `name`, `role`, `jobRole`
**And** optional fields are `class` and `startDate` with valid date validation when provided.

### Story 2.2: Build School-Personal List and Filter Grid

As an admin,
I want an Excel-like list/filter grid for `school-personal`,
So that I can scan and locate records quickly.

**Acceptance Criteria:**

**Given** existing `school-personal` records
**When** the list screen opens
**Then** records are displayed in row/column grid format with clear headers
**And** filter/search controls refine visible rows without breaking grid interaction.

### Story 2.3: Build School-Personal CRUD UI with Bottom Actions

As an admin,
I want CRUD forms for `school-personal` with fixed bottom actions,
So that record maintenance is consistent and predictable.

**Acceptance Criteria:**

**Given** create or edit mode for a `school-personal` record
**When** the form is displayed
**Then** the bottom action bar contains exactly `SAVE` and `CANCEL`
**And** optional fields can be left empty while required fields enforce validation.

### Story 2.4: Wire Save/Cancel and Double-Click Edit Flow for School-Personal

As a user of the grid,
I want double-click-to-edit and close-on-save/cancel behavior,
So that editing is fast and list context is preserved.

**Acceptance Criteria:**

**Given** a row in the `school-personal` grid
**When** the user double-clicks any data cell
**Then** the matching record opens in CRUD edit mode
**And** `SAVE` persists and closes while `CANCEL` closes without persisting.

### Story 2.5: Enforce User Self-Only Profile Permissions

As a `user`,
I want to maintain only my own `school-personal` profile,
So that data ownership and role boundaries are respected.

**Acceptance Criteria:**

**Given** a signed-in `user`
**When** they open profile maintenance
**Then** only their own record is editable
**And** attempts to edit or fetch another user's profile are denied server-side.

## Epic 3: School Management

Enable `school` entity lifecycle with full CRUD and list/filter operations aligned to role policy.

### Story 3.1: Implement School Data Model and Validation

As a developer,
I want a `school` entity with required and optional fields,
So that school metadata is stored consistently.

**Acceptance Criteria:**

**Given** the `school` schema
**When** records are created or updated
**Then** required fields are `name`, `type`, `address`
**And** optional fields `description` and `comment` accept empty values.

### Story 3.2: Build School List and Filter Grid

As an admin,
I want a filterable Excel-like grid for `school`,
So that I can quickly find and review school records.

**Acceptance Criteria:**

**Given** existing `school` records
**When** the list screen renders
**Then** records appear in a row/column table-like grid
**And** filtering by key columns updates the row set consistently.

### Story 3.3: Build School CRUD UI with Save/Cancel

As an admin,
I want school create/edit forms with standardized actions,
So that CRUD behavior is consistent with other modules.

**Acceptance Criteria:**

**Given** create or edit mode for a `school` record
**When** the CRUD form is shown
**Then** the bottom action bar contains exactly `SAVE` and `CANCEL`
**And** form validation blocks invalid required fields before save.

### Story 3.4: Wire School Double-Click Edit and Close-on-Action

As a grid user,
I want double-click to open school editing and auto-close on action,
So that record updates are efficient.

**Acceptance Criteria:**

**Given** a `school` row in the grid
**When** any cell is double-clicked
**Then** the row record opens in CRUD edit mode
**And** `SAVE` persists + closes + refreshes the list while `CANCEL` closes immediately.

### Story 3.5: Restrict School CRUD to Admin Role

As a system owner,
I want only admins to modify school records,
So that non-admin users cannot perform administrative data changes.

**Acceptance Criteria:**

**Given** a signed-in `user`
**When** they attempt create, update, or delete on `school`
**Then** the backend denies the request
**And** admin-only school actions are not presented in user-facing UI.

## Epic 4: Shared CRUD and Grid Interaction Experience

Standardize CRUD action bar (`SAVE`, `CANCEL`), close-on-action behavior, Excel-like grid interaction, and double-click-to-open editing across both entities.

### Story 4.1: Create Shared CRUD Bottom Action Bar Component

As a frontend developer,
I want a shared bottom action component for CRUD screens,
So that `SAVE`/`CANCEL` behavior is uniform across modules.

**Acceptance Criteria:**

**Given** any CRUD screen in scope
**When** the action region renders
**Then** it uses a shared component exposing only `SAVE` and `CANCEL`
**And** component states support idle/loading/disabled/error consistently.

### Story 4.2: Create Shared Excel-Like Grid Interaction Contract

As a frontend developer,
I want a shared grid interaction contract,
So that row/column behavior and double-click editing are consistent.

**Acceptance Criteria:**

**Given** list/filter screens for `school-personal` and `school`
**When** users interact with cells
**Then** both screens implement consistent row/column presentation and selection behavior
**And** both support the same double-click-to-open-record interaction.

### Story 4.3: Standardize Post-Action UI Lifecycle

As a user,
I want identical close/refresh behavior after CRUD actions,
So that workflows are predictable across modules.

**Acceptance Criteria:**

**Given** a CRUD editor opened from a grid
**When** `SAVE` succeeds
**Then** the editor closes and the grid reflects latest persisted data
**And** when `CANCEL` is clicked the editor closes without mutation.

## Epic 5: User Appointment Ownership Guardrails

Ensure `user` can maintain only own appointments (authorization boundary in API and app guards).

### Story 5.1: Add Appointment Ownership Policy Checks

As a platform owner,
I want appointment operations to enforce owner-based access for `user` role,
So that users can only manage their own appointments.

**Acceptance Criteria:**

**Given** a signed-in `user`
**When** they query or mutate appointment records
**Then** only records owned by that user are returned or editable
**And** cross-user access attempts are denied and logged.

### Story 5.2: Align Appointment UI with Ownership Policy

As a `user`,
I want appointment UI actions to reflect ownership restrictions,
So that I cannot attempt actions on records I do not own.

**Acceptance Criteria:**

**Given** appointment screens rendered for a `user`
**When** records are listed
**Then** only owned records are shown
**And** unavailable cross-user actions are not visible or actionable in UI.
