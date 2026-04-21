# Product Brief: SchoolCronicle

## Executive Summary

SchoolCronicle helps schools create their yearly chronicle by moving content capture to the source: teachers. Instead of collecting scattered content manually through one coordinator, teachers submit appointments and images directly in a structured workflow.

The product is intended to be available as a **web frontend** and as **native mobile apps for iOS and Android**, so teachers can contribute from any device they use day to day. **V1 ships only the web frontend** (responsive, mobile-friendly in the browser); native apps follow in a later release.

Today, one teacher (Doris) receives contributions from all teachers and then manually compiles the chronicle in a document file. This creates repeated delays, missing information, and heavy rework because contributions are late, incomplete, or in the wrong format. SchoolCronicle reduces this bottleneck by standardizing input at creation time.

The first version focuses strictly on teacher input workflows on the web. The goal is to reduce coordination overhead, improve media quality, and make chronicle preparation predictable throughout the school year.

## The Problem

The current process is manual and fragile:

- Teachers send content inconsistently and often too late.
- Images arrive in wrong formats or unusable quality.
- Important appointment details are forgotten or incomplete.
- Doris spends significant time reformatting, converting images, and chasing missing information.

The cost of this process is high coordination effort, repeated back-and-forth communication, and avoidable production stress near chronicle deadlines.

## The Solution

SchoolCronicle provides a guided teacher workflow for chronicle-ready submissions, delivered as a responsive web application in V1 so the same experience works on desktop and in mobile browsers until dedicated iOS and Android apps ship.

- Teachers create appointment entries using a structured form.
- Teachers upload images with automatic format and quality checks.
- The system enforces required metadata before submission.
- Content is stored in a consistent structure ready for downstream chronicle compilation.

By validating inputs early, the app prevents avoidable corrections later.

## What Makes This Different

- Solves a concrete school workflow bottleneck rather than acting as a generic CMS.
- Focuses on input quality gates at the source (teachers), where errors originate.
- Keeps V1 intentionally narrow to deliver immediate operational value.
- Reduces dependency on one coordinator for basic data cleanup tasks.

## Who This Serves

- **Primary users:** Teachers who submit appointments and images throughout the year.
- **Operational beneficiary:** Doris (chronicle coordinator), who receives cleaner, complete inputs and less manual rework.
- **Secondary stakeholders:** School leadership, who benefit from better process reliability.

## Success Criteria

- 90% of submitted appointments include all required fields.
- 85% of uploaded images pass format/quality checks on first attempt.
- 50% reduction in coordinator time spent on reformatting and follow-up requests.
- 40% reduction in missing/late chronicle contributions compared with previous year.

## Scope

### In Scope (V1)

- Web frontend only (responsive layout; usable on phones via browser).
- Teacher authentication and role-based access.
- Appointment creation with required fields and validation.
- Image upload with file-type, size, and basic quality constraints.
- Submission status visibility for teachers (e.g., draft/submitted).
- Basic export-ready structured data storage for later chronicle production.

### Out of Scope (V1)

- Native mobile applications (iOS and Android); these are planned after the web product proves the workflow.
- Coordinator/editor workflows for assembling final chronicle inside the app.
- Full chronicle document generation and publishing.
- Student/parent-facing portals.
- Advanced analytics and reporting dashboards.
- Third-party integrations (SIS/LMS/cloud DAM).

## Vision

If SchoolCronicle succeeds, schools replace annual content collection chaos with a continuous, reliable contribution process. Over time, the platform can expand from teacher input capture to full chronicle production workflows, editorial review, and publication-ready outputs—and from web-first delivery to **dedicated iOS and Android apps** aligned with the same backend and submission model.

## Key Assumptions

- Teachers are willing to submit chronicle content directly if the workflow is fast and clear.
- Input validation at upload time will significantly reduce downstream correction effort.
- Narrowing V1 to teacher input workflows on the web provides the fastest path to measurable impact; native apps reuse that proven API and UX patterns later.
