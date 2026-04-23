# School Cronicle

**School Cronicle** helps a school produce its **yearly chronicle** by collecting structured contributions from **teachers** instead of funneling everything through a single coordinator. Teachers record **appointments** (for example parents’ evenings, ceremonies, conferences), **events** (excursions, courses, workshops, trips), and **images**, which later feed **chronicle** chapters and sub-chapters.

Early versions focus on **reliable capture**: consistent metadata, acceptable image formats, and clear submission status so chronicle work stays predictable.

## Repository layout

- **`schoolCronicle/`** — application code (e.g. Angular web frontend) and BMAD outputs.

## Spec-driven development (BMAD)

This project is built in **spec-driven** mode using **[BMAD Method](https://docs.bmad-method.org/)** (Build More Architect Dreams): guided workflows and artifacts (product brief, PRD, and downstream planning) define what gets built before implementation details drive the work.

Planning artifacts for this app live under `schoolCronicle/_bmad-output/` (for example `planning-artifacts/prd.md`).

## Installation

### Prerequisites

- Node.js 20 LTS or 22 LTS
- npm 10+

### 1) Clone and enter repository

```bash
git clone <your-repo-url>
cd school-cronicle
```

### 2) Install dependencies (Nx workspace)

The runnable app lives in the Nx workspace at `schoolCronicle/school-cronicle`:

```bash
cd schoolCronicle/school-cronicle
npm install
```

### 3) Run the applications

Run commands from the Nx workspace at `schoolCronicle/school-cronicle`.

Start web frontend:

```bash
cd schoolCronicle/school-cronicle
env -u npm_config_devdir -u NPM_CONFIG_DEVDIR npx nx serve web
```

Start API backend (new terminal):

```bash
cd schoolCronicle/school-cronicle
env -u npm_config_devdir -u NPM_CONFIG_DEVDIR npx nx serve api
```

Web app URL (default):

```text
http://localhost:4200
```

### 4) Run tests and lint

```bash
npx nx test web
npx nx test api
npx nx lint web
npx nx lint api
```

### Notes

- If port conflicts occur, Nx will print alternatives in terminal output.
- Some environments may fail on production web builds; for local development, `serve`, `test`, and `lint` are the primary workflows.
- If you see `The current directory isn't part of an Nx workspace`, run `pwd` and confirm you are inside `schoolCronicle/school-cronicle` before running `npx nx ...`.

## Demo mode and demo data seed/reset

The web app includes a deterministic pitch/demo dataset and a one-click reset flow.

### Enable demo mode

Demo controls are available when:

- the app runs in Angular dev mode (`npx nx serve web`), or
- you explicitly enable the session flag in the browser:

```js
sessionStorage.setItem('sc_pitch_demo', '1');
```

To disable the explicit flag later:

```js
sessionStorage.removeItem('sc_pitch_demo');
```

### Seed/reset demo data

1. Sign in through the local dummy flow (any non-empty email/password in the current local setup).
2. Open the appointments workspace.
3. Click `Reset demo data` in the header.

This restores the canonical seeded dataset (stable demo drafts/submitted rows and demo profile values) and shows a success message with the seed version.

### Important behavior

- Reset applies to the in-browser dummy store (`localStorage`-backed demo data).
- API-backed sessions are not overwritten by this button.
- Reset is idempotent: running it multiple times returns the same logical demo dataset.
