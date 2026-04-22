---
stepsCompleted:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - _bmad-output/planning-artifacts/product-brief-schoolCronicle.md
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-04-22'
project_name: 'schoolCronicle'
user_name: 'Rudolfgroetz'
date: '2026-04-22'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The product defines 32 FRs across 9 functional domains: access/session, appointment lifecycle, image handling, validation/correction, submission lifecycle, school scoping/access control, export/handoff, GDPR capabilities, and guidance/support. Architecturally this implies clear bounded modules (identity/session, appointment domain, media domain, policy/validation, privacy/audit, export) with explicit contracts between them. The strongest structural requirement is enforced school-scope authorization on every read/write path involving appointments and media.

**Non-Functional Requirements:**
NFRs materially shape architecture: 2s p95 interactive and validation responses, secure transport (TLS 1.2+), encrypted data at rest, hardened sessions, IDOR-resistant authorization, privacy-safe logging, retention and auditability, WCAG 2.2 AA for core flows, and versioned export compatibility. These require deliberate choices around caching, query performance, validation orchestration, security middleware, and observability.

**Scale & Complexity:**
Scope is V1-focused but not trivial: teacher-only UI and no admin screens reduce breadth, while GDPR + security + media pipeline requirements increase depth. Export integrity and school isolation are critical correctness dimensions, not optional enhancements.

- Primary domain: Web application (full-stack, API + SPA + media storage)
- Complexity level: Medium-high
- Estimated architectural components: 8-12 core components/services (identity/session, teacher profile, appointment service, media upload/validation, authorization/policy, audit/retention, export service, notification/help surfaces, plus infra concerns)

### Technical Constraints & Dependencies

- V1 is web-only (responsive), with native mobile deferred.
- No in-app admin UI in V1; onboarding/provisioning are out-of-band and must be operationally supported.
- Image pipeline must enforce server-side format/size validation and preserve valid work during partial failures.
- Exports must be versioned and preserve stable appointment-image relationships.
- GDPR baseline controls and support pathways must be represented in system behavior and documentation.
- Architecture should support pilot-to-full-school concurrency for peak submission windows.

### Cross-Cutting Concerns Identified

- Authentication/session security and account lifecycle boundaries
- School-scoped authorization and anti-IDOR enforcement
- Validation consistency across UI and backend (source-of-truth on server)
- Audit logging of materially significant actions with privacy-safe log hygiene
- Retention policy execution and DSAR-aligned operational hooks
- Performance budgets on key API/use paths (list/open/save/validate/upload)
- Accessibility conformance in dynamic validation and upload feedback states
- Export schema/version governance and downstream compatibility
- Operational resilience for manual provisioning and support runbooks

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web application (Angular SPA + API backend) based on project requirements analysis.

### Starter Options Considered

1. Angular CLI app + separate NestJS API repo
- Pros: Very standard, simple mental model, clean separation.
- Cons: Shared types/contracts require extra tooling and process discipline.

2. Nx monorepo with Angular + Nest apps
- Pros: Shared libs/types, consistent lint/test/build, scalable structure for cross-cutting concerns (auth, policy, audit, export contracts).
- Cons: Slightly higher tooling complexity than separate repos.

3. Community full-stack starters (Angular + Express/Nest variants)
- Pros: Fast bootstrap with many defaults.
- Cons: Variable maintenance quality; weaker long-term predictability for compliance-heavy product.

### Selected Starter: Nx Monorepo (Angular + Nest)

**Rationale for Selection:**
This project has strong cross-cutting concerns (authorization, GDPR policy logic, export contracts, audit events) that benefit from shared libraries and strict boundaries. Nx provides a maintainable foundation while preserving Angular-first frontend development and NestJS backend ergonomics.

**Initialization Command:**

```bash
npx create-nx-workspace@latest school-cronicle --preset=apps --packageManager=npm
```

Then add apps:

```bash
npx nx g @nx/angular:app web
npx nx g @nx/nest:app api
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript-first workspace for both frontend and backend.

**Styling Solution:**
Angular defaults initially; add Angular Material during setup to align with UX direction.

**Build Tooling:**
Nx task graph/caching and workspace orchestration for build/test/lint.

**Testing Framework:**
Generator-provided defaults per app type; centralized task execution through Nx.

**Code Organization:**
Monorepo structure with apps + shared libs, enabling domain-based libraries (e.g., auth, appointments, media, export, policy, audit).

**Development Experience:**
Unified commands, consistent project conventions, easier refactoring across frontend/backend boundaries.

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Data storage baseline: PostgreSQL primary datastore (initially without Redis)
- Authentication strategy: server-side sessions with secure cookie configuration
- Authorization strategy: RBAC with mandatory school-scope enforcement guards
- API style: REST JSON with consistent error and policy envelope
- Frontend state/form strategy: Angular Signals + feature services + Reactive Forms
- Deployment baseline: single VM/traditional hosting for V1

**Important Decisions (Shape Architecture):**
- OpenAPI-first endpoint documentation and contract governance
- CSRF protection and session lifecycle controls (rotation/invalidation)
- Domain-local frontend state boundaries and validation consistency
- Structured logs/audit event model aligned with GDPR and security NFRs
- Explicit extension points for future Redis introduction if performance/rate-limiting requires it

**Deferred Decisions (Post-MVP):**
- Redis adoption for distributed cache/session/rate-limiting (deferred until operational need is proven)
- Migration from single VM to container orchestration/serverless model
- Advanced API gateway patterns and multi-region scaling
- Global state framework introduction (NgRx) unless cross-feature complexity grows

### Data Architecture

- **Primary DB:** PostgreSQL (current stable line: 18.x)
- **ORM / Data access:** Prisma ORM (production line: 7.x)
- **Modeling approach:** strongly relational schema for appointment-image-export integrity and audit linkage
- **Migration approach:** Prisma migrations under version control, forward-only in CI/CD
- **Caching approach:** no Redis in V1; rely on DB indexing/query optimization and application-level short-lived in-memory caching where safe
- **Rationale:** aligns with strict referential integrity, school isolation, and GDPR/audit requirements while minimizing initial operational overhead

### Authentication & Security

- **Authentication method:** server-side sessions (cookie-based)
- **Cookie policy:** `HttpOnly`, `Secure`, `SameSite` configured by environment and threat model
- **Authorization pattern:** RBAC + school-scope policy guards on every appointment/media/export access path
- **Session security:** session rotation at login, invalidation on logout, idle/absolute TTL policies
- **API security controls:** CSRF defenses, input validation at boundary, centralized authZ checks, security headers, and privacy-safe logging
- **Rationale:** best fit for a browser-first V1 while enforcing strict tenant/school isolation and operationally clear control points

### API & Communication Patterns

- **API style:** REST JSON
- **Endpoint conventions:** resource-oriented routes for appointments, images, submissions, exports, and privacy operations
- **Documentation:** OpenAPI contract as source of truth
- **Error handling standard:** uniform error envelope with machine-readable codes and user-safe messages
- **Rate limiting strategy:** baseline per-IP/per-session throttling at app/reverse-proxy layer; revisit advanced controls if abuse or load requires
- **Rationale:** simpler policy/audit enforcement and easier governance for compliance-heavy CRUD workflows

### Frontend Architecture

- **State management:** Angular Signals for reactive UI state, domain service facades per feature
- **Form strategy:** Angular Reactive Forms with shared validator utilities
- **Routing strategy:** feature-based route boundaries with auth guards and role/scope checks
- **Performance strategy:** lazy loading for feature modules/routes, optimized change detection patterns, and upload flow feedback optimization
- **Component strategy:** Angular Material + small custom components already identified in UX spec
- **Rationale:** keeps V1 implementation lean and understandable while supporting complex validation and upload interactions

### Infrastructure & Deployment

- **V1 hosting model:** single VM / traditional host
- **Runtime topology:** web app + API deployment on VM(s), managed or hosted PostgreSQL, object storage for media
- **Environment config:** strict env separation (dev/stage/prod), secret management discipline, and secure TLS termination
- **CI/CD baseline:** automated lint/test/build + migration checks + deployment pipeline with rollback path
- **Monitoring/logging:** centralized logs, error monitoring, and basic service/DB health metrics
- **Scaling strategy:** vertical scaling + selective horizontal split later; define migration path to containerized architecture when utilization thresholds are met
- **Rationale:** minimizes operational complexity for pilot launch while preserving clear upgrade paths

### Decision Impact Analysis

**Implementation Sequence:**
1. Initialize workspace and baseline project structure
2. Establish DB schema, migrations, and core domain models
3. Implement session auth + school-scope authorization guard framework
4. Define REST contracts and error standards
5. Build feature slices (appointments, images, submission lifecycle)
6. Add audit, retention, and export capabilities
7. Harden observability, security checks, and deployment automation

**Cross-Component Dependencies:**
- Auth/session and scope guards are prerequisites for nearly all feature endpoints
- Data model decisions directly shape API contracts and frontend form models
- Error envelope and validation strategy must be consistent across API and UI
- Infrastructure constraints (single VM) influence performance budgeting, background processing, and rollout strategy

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
5 areas where AI agents could make different choices and create integration friction: naming, structure, format, communication, and process patterns.

### Naming Patterns

**Database Naming Conventions:**
- Tables: `snake_case` plural (e.g., `appointments`, `appointment_images`, `audit_events`)
- Columns: `snake_case` (e.g., `school_id`, `created_at`)
- Foreign keys: `<referenced_table_singular>_id` (e.g., `appointment_id`, `teacher_id`)
- Indexes: `idx_<table>_<column_list>` (e.g., `idx_appointments_school_id_status`)
- Unique constraints: `uq_<table>_<column_list>`

**API Naming Conventions:**
- REST resources are plural nouns: `/appointments`, `/images`, `/exports`
- Path params use `:id` style in router definitions and OpenAPI templated paths in docs
- Query params are `camelCase` for frontend ergonomics (e.g., `submittedAfter`, `pageSize`)
- Headers: standard HTTP casing; custom headers prefixed with `X-` only when required

**Code Naming Conventions:**
- TypeScript symbols: `PascalCase` for classes/types/components, `camelCase` for vars/functions
- File names: `kebab-case` (e.g., `appointment-list.component.ts`, `auth-session.guard.ts`)
- Angular selectors: `sc-` prefix (e.g., `sc-appointment-status-badge`)
- Environment variables: `SCREAMING_SNAKE_CASE`

### Structure Patterns

**Project Organization:**
- Organize by feature/domain, not by technical layer only
- Nx libraries split into:
  - `libs/domain/*` (business rules/types)
  - `libs/application/*` (use-cases/services)
  - `libs/infrastructure/*` (db/storage/adapters)
  - `libs/ui/*` (shared UI building blocks)
- Backend modules mirror product domains: `auth`, `appointments`, `media`, `export`, `privacy`, `audit`

**File Structure Patterns:**
- Tests are co-located (`*.spec.ts`) for units; integration/e2e in dedicated app-level test folders
- Shared validators in `libs/domain/validation/*`
- API contracts/OpenAPI in `apps/api/docs/*` with generated artifacts committed or reproducibly generated in CI
- Migration files versioned under Prisma migration directory only

### Format Patterns

**API Response Formats:**
- Success:
  - Collection: `{ data: [...], meta: { page, pageSize, total } }`
  - Single: `{ data: {...} }`
- Error:
  - `{ error: { code, message, details?, requestId } }`
- Validation errors:
  - `code = "VALIDATION_ERROR"` with field-level `details`

**Data Exchange Formats:**
- JSON fields: `camelCase` at API boundary
- Persistence layer: `snake_case` in DB (mapped via Prisma)
- Date/time: ISO-8601 UTC strings in API (`2026-04-22T10:15:30Z`)
- Booleans: strict `true/false`
- Null handling: explicit `null` only when semantically meaningful; otherwise omit optional fields

### Communication Patterns

**Event System Patterns:**
- Internal domain event naming: `domain.entity.action.v1` (e.g., `appointment.submitted.v1`)
- Event payloads include: `eventId`, `occurredAt`, `actorId`, `schoolId`, `entityId`, `version`
- Version events explicitly when payload schema changes

**State Management Patterns:**
- Frontend state is feature-local Signals in facades/services
- No global store unless explicitly approved in future architecture revision
- Async state convention per feature:
  - `idle | loading | success | error`
- UI components consume facades, not raw HTTP clients directly

### Process Patterns

**Error Handling Patterns:**
- Backend: throw typed domain/application errors and map centrally to API error envelope
- Frontend: display user-safe messages; technical diagnostics go to logs/monitoring only
- Always separate user-facing text from internal diagnostic metadata

**Loading State Patterns:**
- Use local loading states at interaction scope (page/form/row), avoid app-wide blocking spinners
- Upload flow shows per-file progress/state
- Retry patterns:
  - idempotent requests may auto-retry with backoff
  - mutating requests require explicit user retry unless idempotency key is implemented

### Enforcement Guidelines

**All AI Agents MUST:**
- Follow naming/format conventions exactly as defined above
- Use the shared API error/success envelopes
- Enforce school-scope authorization checks on every protected data access path
- Keep frontend state in feature facades with Signals and Reactive Forms
- Add/maintain OpenAPI and tests for every new endpoint behavior

**Pattern Enforcement:**
- PR checklist includes pattern-conformance items
- Linting/formatting and contract tests run in CI
- Pattern violations are documented in ADR/architecture notes before exceptions are allowed
- Pattern updates require architecture document update first, then implementation changes

### Pattern Examples

**Good Examples:**
- `GET /appointments?status=submitted&pageSize=20`
- Error payload:
  `{ "error": { "code": "FORBIDDEN_SCOPE", "message": "You are not allowed to access this appointment.", "requestId": "..." } }`
- DB column: `submitted_at`, API field: `submittedAt`

**Anti-Patterns:**
- Mixed naming styles in same boundary (`school_id` and `schoolId` in one JSON object)
- Returning raw exception stacks to clients
- Introducing ad-hoc response envelopes per endpoint
- Writing feature logic directly in Angular components without facade/service boundaries

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
school-cronicle/
├── README.md
├── package.json
├── nx.json
├── tsconfig.base.json
├── .gitignore
├── .editorconfig
├── .prettierrc
├── .eslintrc.json
├── .env.example
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── apps/
│   ├── web/
│   │   ├── project.json
│   │   ├── tsconfig.app.json
│   │   ├── tsconfig.spec.json
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── index.html
│   │   │   ├── styles.scss
│   │   │   ├── app/
│   │   │   │   ├── app.component.ts
│   │   │   │   ├── app.config.ts
│   │   │   │   ├── app.routes.ts
│   │   │   │   ├── core/
│   │   │   │   │   ├── auth/
│   │   │   │   │   │   ├── auth.facade.ts
│   │   │   │   │   │   ├── auth-api.service.ts
│   │   │   │   │   │   └── auth.guard.ts
│   │   │   │   │   ├── http/
│   │   │   │   │   │   ├── api-client.service.ts
│   │   │   │   │   │   ├── error.interceptor.ts
│   │   │   │   │   │   └── request-id.interceptor.ts
│   │   │   │   │   └── config/
│   │   │   │   │       └── env.token.ts
│   │   │   │   ├── features/
│   │   │   │   │   ├── appointments/
│   │   │   │   │   │   ├── pages/
│   │   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── appointment.facade.ts
│   │   │   │   │   │   ├── appointment-form.validators.ts
│   │   │   │   │   │   └── appointment-api.service.ts
│   │   │   │   │   ├── media/
│   │   │   │   │   │   ├── image-upload-row.component.ts
│   │   │   │   │   │   ├── media.facade.ts
│   │   │   │   │   │   └── media-api.service.ts
│   │   │   │   │   ├── exports/
│   │   │   │   │   │   ├── export-api.service.ts
│   │   │   │   │   │   └── pages/
│   │   │   │   │   └── privacy/
│   │   │   │   │       ├── privacy-summary.page.ts
│   │   │   │   │       └── privacy-api.service.ts
│   │   │   │   └── shared/
│   │   │   │       ├── ui/
│   │   │   │       └── utils/
│   │   │   └── assets/
│   │   │       ├── i18n/
│   │   │       └── images/
│   │   └── test/
│   │       ├── setup.ts
│   │       └── e2e-smoke/
│   └── api/
│       ├── project.json
│       ├── tsconfig.app.json
│       ├── tsconfig.spec.json
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── common/
│       │   │   ├── guards/
│       │   │   │   ├── auth-session.guard.ts
│       │   │   │   ├── school-scope.guard.ts
│       │   │   │   └── roles.guard.ts
│       │   │   ├── interceptors/
│       │   │   │   ├── error-mapping.interceptor.ts
│       │   │   │   └── request-context.interceptor.ts
│       │   │   ├── filters/
│       │   │   │   └── http-exception.filter.ts
│       │   │   ├── dto/
│       │   │   └── validation/
│       │   ├── config/
│       │   │   ├── env.validation.ts
│       │   │   ├── session.config.ts
│       │   │   └── security-headers.config.ts
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── appointments/
│       │   │   ├── media/
│       │   │   ├── exports/
│       │   │   ├── privacy/
│       │   │   └── audit/
│       │   ├── infrastructure/
│       │   │   ├── prisma/
│       │   │   │   ├── prisma.service.ts
│       │   │   │   └── prisma.module.ts
│       │   │   ├── storage/
│       │   │   └── logging/
│       │   └── docs/
│       │       └── openapi/
│       │           └── openapi.yaml
│       └── test/
│           ├── unit/
│           ├── integration/
│           └── e2e/
├── libs/
│   ├── domain/
│   │   ├── appointments/
│   │   ├── media/
│   │   ├── privacy/
│   │   ├── audit/
│   │   └── validation/
│   ├── application/
│   │   ├── auth/
│   │   ├── exports/
│   │   └── policies/
│   ├── infrastructure/
│   │   ├── prisma-models/
│   │   ├── storage-contracts/
│   │   └── telemetry/
│   └── ui/
│       ├── appointment-status-badge/
│       ├── submit-readiness-summary/
│       └── form-field-helpers/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── tools/
│   ├── scripts/
│   │   ├── generate-openapi.ts
│   │   └── verify-patterns.ts
│   └── generators/
├── docs/
│   ├── architecture/
│   ├── api/
│   └── runbooks/
└── dist/
```

### Architectural Boundaries

**API Boundaries:**
- External boundary is REST-only under API app routes; no direct DB access from frontend.
- Auth boundary: session validation in global guards, then school-scope guard at resource layer.
- Authorization is policy-driven in application layer, never only at controller level.
- OpenAPI contract in `apps/api/src/docs/openapi` is authoritative for endpoint shape.

**Component Boundaries:**
- Angular components are presentation-focused; business logic resides in feature facades/services.
- Shared UI components live in `libs/ui/*`; feature-specific UI stays in feature directories.
- Cross-feature state is minimized; signals are feature-local unless explicitly promoted.

**Service Boundaries:**
- `libs/domain/*` contains entities/rules; `libs/application/*` orchestration/use-cases.
- `apps/api` modules call application services; infrastructure adapters are injected behind interfaces.
- Audit and privacy concerns are cross-cutting modules, invoked by domain actions.

**Data Boundaries:**
- Prisma is the only relational persistence gateway.
- DB schema in `snake_case`; API payloads in `camelCase` mapped at boundaries.
- Media binaries are external object storage; DB stores metadata and relational references.

### Requirements to Structure Mapping

**Feature Mapping:**
- Access/session (FR1-FR4) -> `apps/api/src/modules/auth`, `apps/web/src/app/core/auth`
- Appointments (FR5-FR10, FR18-FR21) -> `modules/appointments`, `features/appointments`
- Images + validation (FR11-FR17) -> `modules/media`, `features/media`, `libs/domain/validation`
- School scope (FR22-FR23) -> `common/guards/school-scope.guard.ts`, `libs/application/policies`
- Export (FR24-FR25) -> `modules/exports`, `features/exports`
- GDPR/audit (FR26-FR30) -> `modules/privacy`, `modules/audit`, `docs/runbooks`
- Guidance/support (FR31-FR32) -> `features/privacy`, shared content components

**Cross-Cutting Concerns:**
- Error envelope + request context -> `common/interceptors`, `common/filters`
- Security headers/session policy -> `config/security-headers.config.ts`, `config/session.config.ts`
- Traceability/tests -> app-level and module-level test directories

### Integration Points

**Internal Communication:**
- Frontend communicates with API through typed service layer only.
- Backend modules communicate via application services and domain events.
- Audit events emitted on material actions (submit/export/privacy actions).

**External Integrations:**
- Object storage for media files.
- Optional email/help/contact integration (if configured).
- Export delivery channel integration under `modules/exports`.

**Data Flow:**
- UI form input -> frontend validators -> API DTO validation -> domain rules -> persistence
- Upload flow: file select -> upload endpoint -> validation state -> appointment linkage
- Submission flow: draft validation -> status transition -> audit record -> export eligibility

### File Organization Patterns

**Configuration Files:**
- Workspace-level config at root; app-specific config under each app directory.
- Environment examples centralized in `.env.example`; runtime-specific values injected per environment.

**Source Organization:**
- Feature-first in apps, layered boundaries in libs.
- No mixed concerns: controllers do not contain domain business rules.

**Test Organization:**
- Unit tests co-located for local logic.
- Integration/e2e tests in app test folders (`apps/api/test`, `apps/web/test`).
- Shared fixtures in dedicated test support folders.

**Asset Organization:**
- UI static assets in web app assets folder.
- Generated API docs and architecture docs in `docs/`.

### Development Workflow Integration

**Development Server Structure:**
- Independent local serve for `web` and `api` apps via Nx.
- Shared libs update both apps during local development.

**Build Process Structure:**
- Nx target graph controls lint/test/build order with cache reuse.
- API contract generation/validation runs before integration test gate.

**Deployment Structure:**
- Build artifacts from `dist/` deployed to single VM topology.
- DB migrations and config validation are deployment prerequisites.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All major decisions are compatible: Nx monorepo + Angular + Nest + Prisma/PostgreSQL + REST + session-based auth fit together cleanly. The deferred Redis and deferred containerization choices do not conflict with current design because extension points are explicitly documented.

**Pattern Consistency:**
Naming, structure, API format, and process patterns align with the chosen stack. API `camelCase` boundary with DB `snake_case` persistence is consistently defined. Frontend Signal-based local state is consistent with the selected Angular architecture.

**Structure Alignment:**
Project structure supports all architecture decisions and maps clearly to modules and domains. Boundaries between frontend, API, domain libs, and infrastructure libs are explicit and enforceable.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
All FR categories are mapped to concrete modules/directories:
- Auth/session
- Appointments lifecycle
- Image upload/validation
- School-scope enforcement
- Export/handoff
- GDPR/privacy/audit
- Guidance/support surfaces

**Functional Requirements Coverage:**
All FR1-FR32 have architectural support. Cross-cutting FRs (school scoping, auditability, validation consistency) are addressed in shared guards/interceptors/domain-policy layers.

**Non-Functional Requirements Coverage:**
- **Performance:** indexing/migration strategy, API structure, and deployment model support optimization path
- **Security:** session hardening, CSRF, scope guards, secure headers, centralized authZ
- **Scalability:** explicit future migration path (Redis, containerization) documented
- **Compliance:** GDPR-aligned privacy/audit/retention architecture is represented
- **Accessibility:** frontend structure supports component-level consistency and UX accessibility requirements

### Implementation Readiness Validation ✅

**Decision Completeness:**
Critical decisions are documented with versions/lines (PostgreSQL 18.x, Prisma 7.x, Angular/Nest/Nx current lines). Deferred decisions are explicitly listed, reducing ambiguity for AI agents.

**Structure Completeness:**
Complete project tree is defined with root config, apps, libs, data layer, test layout, tooling, docs, and deployment artifacts.

**Pattern Completeness:**
Potential conflict points are addressed across naming, format, communication, and process patterns, with positive examples and anti-patterns included.

### Gap Analysis Results

**Critical Gaps:** None identified.

**Important Gaps (recommended to address in implementation stories):**
1. Define exact CSRF strategy implementation details (double-submit cookie vs framework-native middleware composition).
2. Specify concrete session store for single-VM setup (in-memory vs DB-backed) and failover expectations.
3. Define explicit retention job schedule/ownership and operational runbook acceptance criteria.
4. Pin exact Node.js LTS target in architecture (e.g., current LTS major) to eliminate environment drift.

**Nice-to-Have Gaps:**
- Add ADR templates for future deferred decisions (Redis/containerization).
- Add explicit API versioning policy (`/v1` path vs header strategy).
- Add observability event taxonomy (audit vs operational telemetry naming matrix).

### Validation Issues Addressed

No blocking issues found. Important gaps are documented as implementation-time clarifications and do not prevent architecture handoff.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Strong coherence across stack, patterns, and structure
- Explicit support for security/compliance-critical requirements
- Clear module boundaries for multi-agent parallel implementation
- Deferred decisions clearly marked to avoid hidden ambiguity

**Areas for Future Enhancement:**
- Operational hardening details (session store, retention automation runbooks)
- Formal API versioning policy
- Incremental scaling architecture triggers and thresholds

### Implementation Handoff

**AI Agent Guidelines:**
- Follow architectural decisions and consistency rules verbatim
- Keep domain boundaries and shared contracts stable
- Implement API and DB naming/format mappings consistently
- Treat school-scope authZ and audit as mandatory cross-cutting controls

**First Implementation Priority:**
Initialize workspace and scaffold the chosen Nx Angular+Nest structure, then implement auth/session + school-scope guard foundations before feature modules.
