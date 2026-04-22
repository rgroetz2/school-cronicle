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
