# Story 1.1: Set Up Initial Project from Starter Template

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,  
I want to scaffold the Nx workspace with Angular web and Nest API apps,  
so that all subsequent features are built on the agreed architecture baseline.

## Acceptance Criteria

1. Given an empty implementation repository, when Nx workspace creation is run, then the workspace is created successfully with standard config files.
2. Given the created workspace, when Angular `web` and Nest `api` apps are generated, then both apps are runnable via Nx commands.
3. Given generated apps, when lint/test/build are executed in CI mode, then they complete successfully without structural errors.
4. Given the sprint tracking file, when this story file is created, then story status can move from `backlog` to `ready-for-dev`.

## Tasks / Subtasks

- [ ] Initialize Nx workspace from approved starter command (AC: 1)
  - [ ] Run `npx create-nx-workspace@latest school-cronicle --preset=apps --packageManager=npm`
  - [ ] Verify root files exist (`nx.json`, `package.json`, `tsconfig.base.json`)
- [ ] Generate `web` Angular app (AC: 2)
  - [ ] Run `npx nx g @nx/angular:app web`
  - [ ] Confirm app entry and serve target work
- [ ] Generate `api` Nest app (AC: 2)
  - [ ] Run `npx nx g @nx/nest:app api`
  - [ ] Confirm API app can start and respond on default route
- [ ] Validate baseline quality gates (AC: 3)
  - [ ] Run `npx nx run-many -t lint,test,build --all`
  - [ ] Resolve generated config issues if present
- [ ] Align baseline with architecture conventions (AC: 1, 2, 3)
  - [ ] Keep naming and folder strategy aligned with architecture doc
  - [ ] Keep status updates compatible with sprint workflow (`backlog` -> `ready-for-dev`)

## Dev Notes

- This story is the required starter-template bootstrap identified in architecture and epics.
- Keep the workspace minimal; do not implement business features in this story.
- Preserve generated defaults unless they conflict with mandatory architecture patterns.
- No database schema or domain logic should be introduced yet beyond what generators create.

### Project Structure Notes

- Implementation artifacts are tracked in `_bmad-output/implementation-artifacts`.
- Target code structure follows architecture guidance for apps and domain-oriented libs.
- Story output file naming uses sprint key format: `1-1-set-up-initial-project-from-starter-template.md`.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` - Story 1.1]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Starter Template Evaluation]
- [Source: `_bmad-output/planning-artifacts/architecture.md` - Project Structure & Boundaries]
- [Source: `_bmad-output/planning-artifacts/prd.md` - Web Application Specific Requirements]

## Dev Agent Record

### Agent Model Used

gpt-5.3-codex

### Debug Log References

- Story created from sprint backlog auto-selection (`1-1-set-up-initial-project-from-starter-template`)

### Completion Notes List

- Comprehensive story context generated from epics + architecture + PRD.
- Story prepared for handoff to `dev-story`.

### File List

- `_bmad-output/implementation-artifacts/1-1-set-up-initial-project-from-starter-template.md`
