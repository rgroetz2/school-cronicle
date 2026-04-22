# Pitch UX Epics and Stories

## Intent

This document defines a teacher-first BMAD epic stream to prepare the product for sales demos by reducing UI overload and improving navigation and filtering clarity.

## Scope Principles

- Parallel to current Epics 1-6 (not blocked by full completion).
- Focus on high-impact web UX improvements with low backend risk.
- Keep current required-field and submission gate behavior intact.
- New appointment fields remain optional in this stream.

## Epic and Story Backlog

## Epic PX1: Teacher Dashboard Navigation and Menu IA

### Story PX1.1: Introduce Left Sidebar Dashboard Shell
- Add persistent sidebar menu for teacher routes.
- Ensure active state, keyboard navigation, and responsive collapse behavior.

### Story PX1.2: Create Teacher Dashboard Home View
- Add overview cards (drafts, submitted, needs attention).
- Link cards to filtered appointment list views.

### Story PX1.3: Re-layout Workspace into Clear Zones
- Split layout into menu, filters, list, and detail/editor regions.
- Remove overloaded stacked sections from primary viewport.

## Epic PX2: Dedicated Filtering and Saved Views

### Story PX2.1: Build Dedicated Filter Panel
- Add filters: category, status, date range, has images, draft/submitted.
- Show immediate list updates and clear empty-state copy.

### Story PX2.2: Add Optional Metadata Filters
- Add filter fields: class/grade, guardian name, location.
- Ensure filtering works with mixed old/new records.

### Story PX2.3: Active Filter Chips and Saved Presets
- Show active chips with per-chip remove.
- Add clear-all action.
- Add saved presets (Needs Completion, Submitted This Week).

## Epic PX3: Appointment Data Enrichment for Teacher UX

### Story PX3.1: Add Optional Fields to Appointment Model
- Extend create/edit/read model with:
  - class/grade
  - guardian name
  - location
- Keep backward compatibility for existing drafts/submissions.

### Story PX3.2: Surface Optional Metadata in List and Detail
- Show optional metadata in compact list secondary lines.
- Show full metadata in detail/editor view.

### Story PX3.3: Preserve Submit Behavior with Optional Metadata
- Keep submit gate tied to existing required metadata.
- Ensure optional fields never block submit.

## Epic PX4: Demo Reliability and Replayability

### Story PX4.1: Add Demo Data Seed/Reset Capability
- Provide deterministic sample teacher records.
- Add reset flow for repeated live demos.

### Story PX4.2: Create Scripted 7-Minute Teacher Demo Journey
- Define step-by-step in-app flow.
- Add concise presenter cues for value articulation.

## Recommended Delivery Order

1. PX1.1
2. PX1.2
3. PX2.1
4. PX2.2
5. PX3.1
6. PX3.2
7. PX2.3
8. PX1.3
9. PX3.3
10. PX4.1
11. PX4.2

## BMAD Workflow Notes

- Use `bmad-create-story` in the sequence above.
- Keep story files under `_bmad-output/implementation-artifacts/` using IDs like:
  - `px1-1-introduce-left-sidebar-dashboard-shell.md`
  - `px2-1-build-dedicated-filter-panel.md`
- Keep sprint tracking separate from core epic numbering to avoid conflicts.
