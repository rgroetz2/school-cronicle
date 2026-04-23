# School Cronicle App Workspace

This folder contains the main School Cronicle project and BMAD planning/implementation artifacts.

## Prerequisites

- Node.js 20 LTS or 22 LTS
- npm 10+

## Install

From this folder:

```bash
cd school-cronicle
npm install
```

## Run the apps

Start the web app:

```bash
npx nx serve web
```

Start the API (in a second terminal):

```bash
npx nx serve api
```

## Test and lint

```bash
npx nx test web
npx nx test api
npx nx lint web
npx nx lint api
```

## Useful paths

- Application workspace: `school-cronicle/`
- BMAD artifacts: `_bmad-output/`

## Notes

- The app currently supports local dummy flows for authentication and draft work during development.
- If `web:build:production` fails in your environment, use `serve`, `test`, and `lint` as primary development checks.

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
