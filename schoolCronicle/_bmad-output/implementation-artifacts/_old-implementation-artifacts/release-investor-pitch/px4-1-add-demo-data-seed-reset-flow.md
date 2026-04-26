# Story PX4.1: Add Demo Data Seed/Reset Flow

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a sales presenter,  
I want predictable sample data and reset behavior,  
so that each demo starts clean and consistent.

## Acceptance Criteria

1. Given demo mode is enabled, when I reset demo data, then a known teacher dataset is restored.
2. Given demo mode is enabled, when reset completes, then the core pitch journey (sign-in, appointments list, draft/edit, filters, optional metadata, submit readiness) works without manual cleanup.

## Tasks / Subtasks

- [x] Define demo mode contract and activation (AC: 1, 2)
  - [x] Specify how demo mode is toggled (build flag, env, query param, or explicit in-app control—pick one aligned with security posture)
  - [x] Document which surfaces are in scope: web dummy session, `localStorage` demo keys, and/or API in-memory store
  - [x] Ensure non-demo environments are unaffected by default
- [x] Specify canonical seed dataset (AC: 1, 2)
  - [x] Fixed teacher identity and minimal profile consistent with login dummy flow
  - [x] Mix of drafts and submitted appointments covering filters, optional metadata (`classGrade`, `guardianName`, `location`), and image edge cases as needed for pitch
  - [x] Version or checksum in metadata so presenters can confirm reset succeeded
- [x] Implement reset/seed behavior (AC: 1, 2)
  - [x] Clear ephemeral demo state (e.g. dummy drafts, profile overrides, privacy audit stubs) deterministically
  - [x] Load seed dataset atomically so UI never sees half-seeded state
  - [x] Expose reset via a clear presenter affordance (e.g. header action or dedicated demo panel) gated on demo mode
- [x] Align API and web paths (AC: 1, 2)
  - [x] If real API session path exists: define whether reset is client-only, server endpoint, or both; keep contracts explicit
  - [x] If dummy-only for V1: centralize seed/reset in `AuthApiService` (or shared module) to avoid drift with `AppointmentsComponent` expectations
- [x] Add tests and quality checks (AC: 1, 2)
  - [x] Unit/component tests: reset clears prior mutations and restores seed counts/ids or stable fingerprints
  - [x] Regression: post-reset, list + submit-readiness smoke assertions for pitch path
  - [x] Run focused web (and API if touched) lint/tests for changed modules

## Dev Notes

- Epic PX4 targets **deterministic sales demos**; this story is the data foundation for PX4.2 (scripted path).
- Today the web layer uses dummy session + `localStorage`-backed drafts in `AuthApiService`; the API uses in-memory `AppointmentsService` for authenticated flows—implementation must clarify which stack the “reset” guarantees for the pitch.
- Avoid leaking internal seed keys or PII in UI copy; seed data should read as realistic but obviously synthetic.

### V1 scope (implemented)

- **Demo mode**: `PitchDemoModeService` delegates to `isPitchDemoModeEnabled()` — `isDevMode()` **or** `sessionStorage.sc_pitch_demo === '1'`. Production builds hide the reset affordance unless the presenter opts in via sessionStorage.
- **Reset**: `AuthApiService.resetPitchDemoData()` applies only when `usesDummyClientStore()` (dummy session). Clears `sc_dummy_drafts`, `sc_dummy_profile`, `sc_dummy_privacy_events` and in-memory mirrors, then writes `buildDemoSeedDrafts()` + `buildDemoSeedProfile()` from `demo-seed.ts`.
- **API-backed sessions**: unchanged; UI explains that reset targets the in-browser demo store only.

### Previous Story Intelligence

- PX1.x–PX3.x established dashboard shell, filters, optional fields, list/detail metadata, and non-blocking submit gate—seed data should exercise those paths without manual setup.
- Story 4.x and image validation stories define submission and read-only rules—seed must include at least one valid “ready to submit” draft and one submitted row for contrast.

### Architecture Guardrails

- Prefer a **single source of truth** for seed definitions; avoid duplicating fixtures in component specs and runtime seed.
- Reset must be **idempotent**: repeated reset yields the same logical dataset.
- Do not weaken production auth or school scope rules for demo convenience; gate demo-only behavior explicitly.

### Technical Requirements

- Demo mode off: no new routes, storage keys, or behaviors visible to normal users.
- Demo mode on: reset completes in bounded time; user receives explicit success (and optional brief “what was restored” summary).
- Preserve existing API response envelopes and error codes outside demo-specific endpoints.

### Testing Requirements

- Verify pre-reset mutation (new draft, profile change) is undone after reset.
- Verify seed includes minimum set for pitch cards + appointments workspace.
- Verify no crash when `localStorage` is unavailable (in-memory fallback path in `AuthApiService`).

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Epic PX4, Story PX4.1]
- [Source: `_bmad-output/planning-artifacts/pitch-ux-epics.md`] (if present; align naming with pitch UX stream)
- [Source: `school-cronicle/web/src/app/core/auth-api.service.ts` - dummy session and draft persistence]
- [Source: `school-cronicle/api/src/modules/appointments/appointments.service.ts` - in-memory drafts]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Implemented PX4.1: demo gating, canonical seed module, `AuthApiService.resetPitchDemoData`, appointments header control + status message, `PitchDemoModeService` for TestBed-friendly overrides, Vitest suites (no `vi.mock` on relative imports per Angular Vitest patch).

### Completion Notes List

- Added `demo-mode.ts`, `demo-seed.ts`, `pitch-demo-mode.service.ts`; extended `auth-api.service.ts` with clear/seed reset and `usesDummyClientStore()`.
- Wired `AppointmentsComponent` header “Reset demo data” + `demoResetMessage` success/API guidance copy.
- Tests: `auth-api.service.spec.ts` (seed after dummy sign-in, no-op without dummy); `appointments.component.spec.ts` nested configures with `PitchDemoModeService` stub + localStorage stub for dummy path.
- Ran `npx nx test web` — 45/45 passed.

### File List

- `_bmad-output/implementation-artifacts/px4-1-add-demo-data-seed-reset-flow.md`
- `school-cronicle/web/src/app/core/demo-mode.ts`
- `school-cronicle/web/src/app/core/demo-seed.ts`
- `school-cronicle/web/src/app/core/pitch-demo-mode.service.ts`
- `school-cronicle/web/src/app/core/auth-api.service.ts`
- `school-cronicle/web/src/app/core/auth-api.service.spec.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.ts`
- `school-cronicle/web/src/app/features/appointments/appointments.component.spec.ts`
