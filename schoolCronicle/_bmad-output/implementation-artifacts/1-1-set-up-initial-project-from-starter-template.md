# Story 1.1: Set Up Initial Project from Starter Template

Status: review

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

- [x] Initialize Nx workspace from approved starter command (AC: 1)
  - [x] Run `npx create-nx-workspace@latest school-cronicle --preset=apps --packageManager=npm`
  - [x] Verify root files exist (`nx.json`, `package.json`, `tsconfig.base.json`)
- [x] Generate `web` Angular app (AC: 2)
  - [x] Run `npx nx g @nx/angular:app web`
  - [x] Confirm app entry and serve target work
- [x] Generate `api` Nest app (AC: 2)
  - [x] Run `npx nx g @nx/nest:app api`
  - [x] Confirm API app can start and respond on default route
- [x] Validate baseline quality gates (AC: 3)
  - [x] Run `npx nx run-many -t lint,test,build --all`
  - [x] Resolve generated config issues if present
- [x] Align baseline with architecture conventions (AC: 1, 2, 3)
  - [x] Keep naming and folder strategy aligned with architecture doc
  - [x] Keep status updates compatible with sprint workflow (`backlog` -> `ready-for-dev`)

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
- Nx workspace scaffolded in `schoolCronicle/school-cronicle` with `apps` preset and npm.
- Added required Nx plugins (`@nx/angular`, `@nx/nest`) before generating `web` and `api`.
- Verified `web` serve target startup on `http://localhost:4200/`.
- Verified `api` serve target startup and default response on `http://localhost:3000/api` (`{"message":"Hello API"}`).
- Fixed generated baseline config issues for CI gate:
  - Updated `api` build command to use `npx webpack-cli build`.
  - Added explicit lint targets for `api`, `api-e2e`, and `web-e2e` to avoid inferred-target dependency resolution failures.

### Completion Notes List

- Nx starter workspace was created successfully with baseline config files in place (`nx.json`, `package.json`, `tsconfig.base.json`).
- Angular `web` app and Nest `api` app were generated and both serve targets were validated.
- Full baseline quality gate ran successfully: `npx nx run-many -t lint,test,build --all`.
- Minor generated configuration incompatibilities were resolved without adding business/domain logic.
- Story implementation is complete and ready for code review.

### File List

- `schoolCronicle/school-cronicle/.editorconfig`
- `schoolCronicle/school-cronicle/.gitignore`
- `schoolCronicle/school-cronicle/.prettierignore`
- `schoolCronicle/school-cronicle/.prettierrc`
- `schoolCronicle/school-cronicle/.vscode/extensions.json`
- `schoolCronicle/school-cronicle/.vscode/launch.json`
- `schoolCronicle/school-cronicle/eslint.config.mjs`
- `schoolCronicle/school-cronicle/nx.json`
- `schoolCronicle/school-cronicle/package-lock.json`
- `schoolCronicle/school-cronicle/package.json`
- `schoolCronicle/school-cronicle/tsconfig.base.json`
- `schoolCronicle/school-cronicle/api/project.json`
- `schoolCronicle/school-cronicle/api/package.json`
- `schoolCronicle/school-cronicle/api/webpack.config.js`
- `schoolCronicle/school-cronicle/api/tsconfig.json`
- `schoolCronicle/school-cronicle/api/tsconfig.app.json`
- `schoolCronicle/school-cronicle/api/src/main.ts`
- `schoolCronicle/school-cronicle/api/src/assets/.gitkeep`
- `schoolCronicle/school-cronicle/api/src/app/app.module.ts`
- `schoolCronicle/school-cronicle/api/src/app/app.controller.ts`
- `schoolCronicle/school-cronicle/api/src/app/app.service.ts`
- `schoolCronicle/school-cronicle/api-e2e/project.json`
- `schoolCronicle/school-cronicle/api-e2e/package.json`
- `schoolCronicle/school-cronicle/api-e2e/jest.config.cts`
- `schoolCronicle/school-cronicle/api-e2e/tsconfig.json`
- `schoolCronicle/school-cronicle/api-e2e/tsconfig.spec.json`
- `schoolCronicle/school-cronicle/api-e2e/src/api/api.spec.ts`
- `schoolCronicle/school-cronicle/api-e2e/src/support/global-setup.ts`
- `schoolCronicle/school-cronicle/api-e2e/src/support/global-teardown.ts`
- `schoolCronicle/school-cronicle/api-e2e/src/support/test-setup.ts`
- `schoolCronicle/school-cronicle/web/project.json`
- `schoolCronicle/school-cronicle/web/eslint.config.mjs`
- `schoolCronicle/school-cronicle/web/tsconfig.json`
- `schoolCronicle/school-cronicle/web/tsconfig.app.json`
- `schoolCronicle/school-cronicle/web/tsconfig.spec.json`
- `schoolCronicle/school-cronicle/web/public/favicon.ico`
- `schoolCronicle/school-cronicle/web/src/index.html`
- `schoolCronicle/school-cronicle/web/src/styles.css`
- `schoolCronicle/school-cronicle/web/src/main.ts`
- `schoolCronicle/school-cronicle/web/src/app/app.ts`
- `schoolCronicle/school-cronicle/web/src/app/app.spec.ts`
- `schoolCronicle/school-cronicle/web/src/app/app.config.ts`
- `schoolCronicle/school-cronicle/web/src/app/app.routes.ts`
- `schoolCronicle/school-cronicle/web/src/app/app.html`
- `schoolCronicle/school-cronicle/web/src/app/app.css`
- `schoolCronicle/school-cronicle/web/src/app/nx-welcome.ts`
- `schoolCronicle/school-cronicle/web-e2e/project.json`
- `schoolCronicle/school-cronicle/web-e2e/eslint.config.mjs`
- `schoolCronicle/school-cronicle/web-e2e/playwright.config.ts`
- `schoolCronicle/school-cronicle/web-e2e/tsconfig.json`
- `schoolCronicle/school-cronicle/web-e2e/src/example.spec.ts`
- `_bmad-output/implementation-artifacts/1-1-set-up-initial-project-from-starter-template.md`

### Change Log

- 2026-04-22: Implemented Story 1.1 baseline scaffolding, validated app run/build/lint/test gates, and moved story status to `review`.
