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

Start web frontend:

```bash
npx nx serve web
```

Start API backend (new terminal):

```bash
npx nx serve api
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
