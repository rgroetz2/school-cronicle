# Test Case Specification — T1T5 Investor V1 (Epic 1 + Epic 2)

**Document identifier:** TCS-SCHOOLCRONICLE-INVESTOR-V1-T1T5-001  
**Version:** 1.0  
**Date:** 2026-04-22  
**Status:** Draft  
**Related plan:** `_bmad-output/test-artifacts/testplan-investor-V1.md`  
**Method reference:** `_bmad-output/test-artifacts/T1T5-Testdesign.md`

---

## 1. Scope

This test case specification defines T1T5 scenario coverage for currently implemented stories:

- Epic 1: `1.1`, `1.2`, `1.3`, `1.4`
- Epic 2: `2.1`, `2.2`, `2.3`, `2.4`, `2.5`

Case IDs follow structure:

`TC-<Journey>-<T1..T5>-<nn>`

T1T5 names follow:

`<Tx>_<feature>_<inputOrCondition>_<expectedResult>`

---

## 2. Preconditions and shared data

### 2.1 Environments
- Test environment with reachable web and API endpoints.
- Browser matrix: Chrome, Edge, Safari (latest stable) + mobile viewport check.

### 2.2 Test data personas
- `teacher_valid_a@school.local` / valid password
- `teacher_valid_b@school.local` / valid password
- Invalid password credential set for negative login
- Existing drafts for edit/delete/open scenarios

### 2.3 General assumptions
- Dummy/local persistence mode may be active; expected behavior is based on current implemented functionality.
- Support contact path is available on auth error flow.

---

## 3. User Journey UJ-01 — Sign-in, sign-out, session, help path

**Story traceability:** 1.1, 1.2, 1.3, 1.4

### TC-UJ01-T1-01
- **T1 Name:** `T1_login_validTeacherWithCorrectCredentials_userIsSignedInAndSeesAppointmentsWorkspace`
- **Type:** Standard Case
- **Priority:** P0
- **Preconditions:** User is signed out.
- **Steps:**
  1. Open login page.
  2. Enter valid email/password.
  3. Submit login form.
- **Expected results:**
  - Navigation to appointments workspace succeeds.
  - User sees signed-in workspace content.
  - No sensitive data exposed in UI.

### TC-UJ01-T2-01
- **T2 Name:** `T2_login_validTeacherWithStoredSession_userCanAccessWorkspaceWithoutReauthentication`
- **Type:** Alternative Case
- **Priority:** P1
- **Preconditions:** Existing valid session exists.
- **Steps:**
  1. Open app root or protected route.
  2. Observe routing/session check behavior.
- **Expected results:**
  - User remains authenticated.
  - Protected content is accessible without manual re-login.

### TC-UJ01-T3-01
- **T3 Name:** `T3_login_validTeacherWithTemporarySignInFailure_userGetsRecoverableErrorAndHelpPath`
- **Type:** Exception Case
- **Priority:** P1
- **Preconditions:** Force temporary sign-in failure condition.
- **Steps:**
  1. Enter valid credentials.
  2. Trigger sign-in under temporary failure condition.
- **Expected results:**
  - User sees non-sensitive failure message.
  - Help/support path is visible and actionable.
  - App remains responsive for retry.

### TC-UJ01-T4-01
- **T4 Name:** `T4_login_teacherWithWrongPassword_userGetsErrorAndIsNotSignedIn`
- **Type:** Negative Case
- **Priority:** P0
- **Preconditions:** User is signed out.
- **Steps:**
  1. Enter valid email and wrong password.
  2. Submit login.
- **Expected results:**
  - Sign-in is rejected.
  - Non-sensitive error message shown.
  - Help contact path displayed.
  - User remains on login flow.

### TC-UJ01-T5-01
- **T5 Name:** `T5_login_userAttemptsSessionBypassOnProtectedRoute_systemRedirectsToLogin`
- **Type:** Misuse Case
- **Priority:** P0
- **Preconditions:** User has no valid session.
- **Steps:**
  1. Directly open protected appointments route URL.
- **Expected results:**
  - Access is blocked.
  - User is redirected to login or denied protected view.
  - No protected data is rendered.

### TC-UJ01-T5-02
- **T5 Name:** `T5_session_signedOutUserTriesToReusePriorSession_userCannotAccessProtectedContent`
- **Type:** Misuse Case
- **Priority:** P0
- **Preconditions:** Login once, then sign out.
- **Steps:**
  1. Sign out.
  2. Refresh page/open protected route.
- **Expected results:**
  - Session is invalidated.
  - Protected content stays inaccessible.

---

## 4. User Journey UJ-02 — Draft create, list, open, edit metadata/category/date

**Story traceability:** 2.1, 2.2, 2.3

### TC-UJ02-T1-01
- **T1 Name:** `T1_draftCreate_teacherEntersRequiredFields_draftIsCreatedAndListed`
- **Type:** Standard Case
- **Priority:** P0
- **Preconditions:** User signed in.
- **Steps:**
  1. Enter title, appointment date, category.
  2. Submit create draft.
  3. Reload/list drafts.
- **Expected results:**
  - Draft creation succeeds.
  - New draft appears in list.
  - Stored metadata matches entered values.

### TC-UJ02-T2-01
- **T2 Name:** `T2_draftList_teacherOpensExistingDraft_formHydratesWithStoredValues`
- **Type:** Alternative Case
- **Priority:** P1
- **Preconditions:** At least one existing draft.
- **Steps:**
  1. Open draft list.
  2. Select an existing draft.
- **Expected results:**
  - Selected draft opens successfully.
  - Form fields hydrate with current draft values.

### TC-UJ02-T2-02
- **T2 Name:** `T2_draftEdit_teacherUpdatesDateAndCategory_draftPersistsUpdatedValues`
- **Type:** Alternative Case
- **Priority:** P1
- **Preconditions:** Existing draft is opened.
- **Steps:**
  1. Change appointment date and category.
  2. Save draft.
  3. Re-open draft.
- **Expected results:**
  - Save succeeds.
  - Updated values persist and re-open correctly.

### TC-UJ02-T3-01
- **T3 Name:** `T3_draftSave_teacherEncountersUpdateFailure_userSeesFailureAndDataIsRetainedForRetry`
- **Type:** Exception Case
- **Priority:** P1
- **Preconditions:** Existing draft opened; force update failure.
- **Steps:**
  1. Modify fields.
  2. Trigger save under failure condition.
- **Expected results:**
  - Failure feedback shown.
  - Unsaved input remains available for retry.

### TC-UJ02-T4-01
- **T4 Name:** `T4_draftCreate_teacherOmitsTitle_validationBlocksCreateWithSpecificMessage`
- **Type:** Negative Case
- **Priority:** P0
- **Preconditions:** Signed in and on draft form.
- **Steps:**
  1. Leave title empty.
  2. Submit create/save.
- **Expected results:**
  - Validation blocks submit.
  - Title-required message shown.

### TC-UJ02-T4-02
- **T4 Name:** `T4_draftCreate_teacherOmitsAppointmentDate_validationBlocksCreateWithSpecificMessage`
- **Type:** Negative Case
- **Priority:** P0
- **Preconditions:** Signed in and on draft form.
- **Steps:**
  1. Leave appointment date empty.
  2. Submit create/save.
- **Expected results:**
  - Validation blocks submit.
  - Date-required message shown.

### TC-UJ02-T4-03
- **T4 Name:** `T4_draftCreate_teacherOmitsCategory_validationBlocksCreateWithSpecificMessage`
- **Type:** Negative Case
- **Priority:** P0
- **Preconditions:** Signed in and on draft form.
- **Steps:**
  1. Leave category empty.
  2. Submit create/save.
- **Expected results:**
  - Validation blocks submit.
  - Category-required message shown.

### TC-UJ02-T5-01
- **T5 Name:** `T5_draftEdit_userSubmitsInvalidCategoryValue_systemRejectsUpdateAtApiBoundary`
- **Type:** Misuse Case
- **Priority:** P0
- **Preconditions:** Existing draft and API access.
- **Steps:**
  1. Send update request with category outside controlled set.
- **Expected results:**
  - API rejects request.
  - Draft data remains unchanged.

### TC-UJ02-T5-02
- **T5 Name:** `T5_draftEdit_userSubmitsMalformedAppointmentDate_systemRejectsInvalidDateFormat`
- **Type:** Misuse Case
- **Priority:** P0
- **Preconditions:** Existing draft and API access.
- **Steps:**
  1. Send create/update request with malformed date (not YYYY-MM-DD).
- **Expected results:**
  - API rejects request with validation error.
  - No invalid data persisted.

---

## 5. User Journey UJ-03 — Submit readiness gate and draft deletion

**Story traceability:** 2.4, 2.5

### TC-UJ03-T1-01
- **T1 Name:** `T1_submitReadiness_selectedCompleteDraft_readinessShowsAllMetadataComplete`
- **Type:** Standard Case
- **Priority:** P0
- **Preconditions:** Open draft with title/date/category complete.
- **Steps:**
  1. Open complete draft.
  2. Review submit readiness panel.
- **Expected results:**
  - Readiness indicates complete metadata.
  - Submit action is enabled (unless actively submitting).

### TC-UJ03-T2-01
- **T2 Name:** `T2_submitReadiness_teacherFixesMissingFields_stateTransitionsFromBlockedToReady`
- **Type:** Alternative Case
- **Priority:** P1
- **Preconditions:** Open draft with missing required metadata.
- **Steps:**
  1. Observe blocked readiness and listed missing fields.
  2. Complete missing fields.
  3. Save/open readiness again.
- **Expected results:**
  - Missing-field list updates correctly.
  - State transitions to ready when complete.

### TC-UJ03-T3-01
- **T3 Name:** `T3_deleteDraft_teacherConfirmsDeletion_selectedDraftIsRemovedAndListUpdates`
- **Type:** Exception Case
- **Priority:** P1
- **Preconditions:** Selected draft exists.
- **Steps:**
  1. Trigger delete selected draft.
  2. Confirm deletion dialog.
- **Expected results:**
  - Draft is deleted.
  - Draft disappears from list.
  - Selection clears and form resets.
  - Status message indicates success.

### TC-UJ03-T4-01
- **T4 Name:** `T4_submitReadiness_teacherAttemptsSubmitWithMissingMetadata_submissionIsBlockedWithFieldList`
- **Type:** Negative Case
- **Priority:** P0
- **Preconditions:** Selected draft missing required metadata.
- **Steps:**
  1. Attempt submit action.
- **Expected results:**
  - Submit is blocked.
  - Missing metadata fields are shown clearly.
  - No status transition to submitted.

### TC-UJ03-T4-02
- **T4 Name:** `T4_deleteDraft_teacherCancelsDeleteConfirmation_noDeletionOccurs`
- **Type:** Negative Case
- **Priority:** P1
- **Preconditions:** Selected draft exists.
- **Steps:**
  1. Trigger delete action.
  2. Cancel confirmation.
- **Expected results:**
  - Draft remains unchanged.
  - No deletion success message shown.

### TC-UJ03-T5-01
- **T5 Name:** `T5_deleteDraft_unauthenticatedUserRequestsDelete_operationIsRejected`
- **Type:** Misuse Case
- **Priority:** P0
- **Preconditions:** No authenticated session.
- **Steps:**
  1. Call delete draft API endpoint.
- **Expected results:**
  - Request rejected as unauthorized.
  - No draft data changed.

### TC-UJ03-T5-02
- **T5 Name:** `T5_submitReadiness_unauthenticatedUserRequestsSubmit_operationIsRejected`
- **Type:** Misuse Case
- **Priority:** P0
- **Preconditions:** No authenticated session.
- **Steps:**
  1. Call submit endpoint for draft.
- **Expected results:**
  - Request rejected as unauthorized.
  - Draft state unchanged.

---

## 6. Coverage summary

| Journey | T1 | T2 | T3 | T4 | T5 | Total |
| ------- | -- | -- | -- | -- | -- | ----- |
| UJ-01 Auth/session | 1 | 1 | 1 | 1 | 2 | 6 |
| UJ-02 Draft core/edit | 1 | 2 | 1 | 3 | 2 | 9 |
| UJ-03 Gate/delete | 1 | 1 | 1 | 2 | 2 | 7 |
| **Total** | **3** | **4** | **3** | **6** | **6** | **22** |

---

## 7. Automation candidacy

### Automate first (P0)
- `TC-UJ01-T1-01`, `TC-UJ01-T4-01`, `TC-UJ01-T5-01`
- `TC-UJ02-T1-01`, `TC-UJ02-T4-01`, `TC-UJ02-T4-02`, `TC-UJ02-T4-03`, `TC-UJ02-T5-01`, `TC-UJ02-T5-02`
- `TC-UJ03-T1-01`, `TC-UJ03-T4-01`, `TC-UJ03-T5-01`, `TC-UJ03-T5-02`

### Manual/exploratory emphasis
- Exception behaviors requiring environment manipulation (`T3` cases)
- UX clarity and investor-demo quality checks (readability, feedback consistency)

---

## 8. Entry and exit criteria for this TCS set

### Entry
- Test environment deployed and reachable.
- Defined persona accounts available.
- At least one seed draft present for open/edit/delete scenarios.

### Exit
- All P0 cases executed and passing.
- Any failed P1/P2 cases triaged with severity and decision.
- T1T5 category coverage complete per journey (or waiver approved).

---

## 9. Approval

| Role | Name | Signature / Date |
| ---- | ---- | ---------------- |
| Provider Test Manager | | |
| Provider Lead Test Analyst | | |
| Client Product Owner | | |

