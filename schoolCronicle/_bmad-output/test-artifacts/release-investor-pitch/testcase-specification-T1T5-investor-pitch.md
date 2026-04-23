# Test Case Specification - T1T5 Investor-Pitch Release

**Document identifier:** TCS-SCHOOLCRONICLE-INVESTOR-PITCH-T1T5-001  
**Version:** 1.0  
**Date:** 2026-04-23  
**Status:** Draft  
**Method reference:** `_bmad-output/test-artifacts/T1T5-Testdesign.md`  
**Scope reference:** `Pitch UX Epic Track (PX1-PX4)` in `_bmad-output/planning-artifacts/epics.md`

---

## 1. Scope

This specification defines a T1-T5 scenario set for each investor-pitch user journey:

- Epic PX1: Navigation and dashboard IA
- Epic PX2: Filtering and saved views
- Epic PX3: Optional metadata enrichment
- Epic PX4: Demo reliability and scripted sales flow

Case IDs follow:

`TC-<Journey>-<T1..T5>-<nn>`

T1T5 names follow:

`<Tx>_<feature>_<inputOrCondition>_<expectedResult>`

---

## 2. Preconditions and shared data

- Demo mode can be enabled for pitch runs.
- Seedable demo teacher dataset is available.
- At least one account with mixed draft and submitted appointments exists.
- Optional metadata fields (class/grade, guardian name, location) exist in data model.
- Saved filter presets are available or creatable in-session.

---

## 3. User Journey UJ-PX01 - Navigate with left sidebar and clear IA

**Story traceability:** PX1.1

### TC-UJPX01-T1-01
- **T1 Name:** `T1_sidebar_signedInTeacherOpensWorkspace_sidebarShowsAllCoreMenuEntries`
- **Type:** Standard Case
- **Priority:** P0
- **Expected result:** Sidebar shows Dashboard, Appointments, Drafts, Submitted, Privacy, Help; default selection is clear.

### TC-UJPX01-T2-01
- **T2 Name:** `T2_sidebar_teacherUsesKeyboardNavigation_selectedMenuItemChangesWithVisibleFocus`
- **Type:** Alternative Case
- **Priority:** P1
- **Expected result:** Keyboard-only navigation updates active entry correctly and remains accessible.

### TC-UJPX01-T3-01
- **T3 Name:** `T3_sidebar_menuConfigLoadsLate_workspaceRendersAndSidebarRecoversWithoutBrokenNavigation`
- **Type:** Exception Case
- **Priority:** P1
- **Expected result:** Temporary load delay does not break navigation; sidebar recovers and remains usable.

### TC-UJPX01-T4-01
- **T4 Name:** `T4_sidebar_signedOutUserOpensWorkspaceRoute_userIsRedirectedAndSidebarNotShown`
- **Type:** Negative Case
- **Priority:** P0
- **Expected result:** Unauthorized access is blocked and no protected sidebar data is rendered.

### TC-UJPX01-T5-01
- **T5 Name:** `T5_sidebar_userInjectsUnknownMenuRoute_systemRejectsRouteAndKeepsAuthorizedNavigationState`
- **Type:** Misuse Case
- **Priority:** P0
- **Expected result:** Unknown or manipulated route does not expose hidden areas and app remains stable.

---

## 4. User Journey UJ-PX02 - Use dashboard home to route attention quickly

**Story traceability:** PX1.2

### TC-UJPX02-T1-01
- **T1 Name:** `T1_dashboard_teacherOpensHome_summaryCardsShowDraftSubmittedNeedsAttentionCounts`
- **Type:** Standard Case
- **Priority:** P0
- **Expected result:** Summary cards render correct counts and labels.

### TC-UJPX02-T2-01
- **T2 Name:** `T2_dashboard_teacherSelectsSummaryCard_userNavigatesToMatchingFilteredList`
- **Type:** Alternative Case
- **Priority:** P1
- **Expected result:** Card click navigates to list view with the correct applied filter context.

### TC-UJPX02-T3-01
- **T3 Name:** `T3_dashboard_partialCountServiceFailure_cardsShowFallbackStateAndPageRemainsUsable`
- **Type:** Exception Case
- **Priority:** P1
- **Expected result:** Fallback indicators appear for unavailable counts without blocking navigation.

### TC-UJPX02-T4-01
- **T4 Name:** `T4_dashboard_teacherWithoutAppointments_cardsShowZeroAndNoDataGuidance`
- **Type:** Negative Case
- **Priority:** P1
- **Expected result:** Zero-state cards are clear and do not show misleading values.

### TC-UJPX02-T5-01
- **T5 Name:** `T5_dashboard_userManipulatesCardLinkParams_systemPreventsCrossScopeDataExposure`
- **Type:** Misuse Case
- **Priority:** P0
- **Expected result:** Tampered query parameters do not reveal unauthorized list data.

---

## 5. User Journey UJ-PX03 - Work in focused appointments layout zones

**Story traceability:** PX1.3

### TC-UJPX03-T1-01
- **T1 Name:** `T1_workspace_teacherOpensAppointments_navigationFiltersListEditorAreVisuallySeparated`
- **Type:** Standard Case
- **Priority:** P1
- **Expected result:** Zones are clearly separated; default controls are context-relevant.

### TC-UJPX03-T2-01
- **T2 Name:** `T2_workspace_teacherSelectsListItem_detailEditorZoneUpdatesWithoutLosingFilterContext`
- **Type:** Alternative Case
- **Priority:** P1
- **Expected result:** Detail/editor updates while navigation and filter context remains intact.

### TC-UJPX03-T3-01
- **T3 Name:** `T3_workspace_teacherResizesViewport_layoutReflowsAndPreservesZoneReadability`
- **Type:** Exception Case
- **Priority:** P2
- **Expected result:** Layout adapts to viewport changes without overlapping critical controls.

### TC-UJPX03-T4-01
- **T4 Name:** `T4_workspace_teacherAttemptsEditWithoutSelection_editorActionsStayDisabled`
- **Type:** Negative Case
- **Priority:** P1
- **Expected result:** Edit controls remain disabled until a valid context exists.

### TC-UJPX03-T5-01
- **T5 Name:** `T5_workspace_userForcesHiddenControlViaDomManipulation_actionIsRejectedByStateGuards`
- **Type:** Misuse Case
- **Priority:** P0
- **Expected result:** Client and API guards prevent unauthorized or out-of-context operations.

---

## 6. User Journey UJ-PX04 - Filter appointments with dedicated panel

**Story traceability:** PX2.1

### TC-UJPX04-T1-01
- **T1 Name:** `T1_filters_teacherAppliesCategoryStatusDateHasImages_filtersUpdateListImmediately`
- **Type:** Standard Case
- **Priority:** P0
- **Expected result:** Combined filters update results immediately and accurately.

### TC-UJPX04-T2-01
- **T2 Name:** `T2_filters_teacherAppliesSingleFilterFromPanel_listShowsNarrowedResults`
- **Type:** Alternative Case
- **Priority:** P1
- **Expected result:** Single-filter workflow yields expected narrowed subset.

### TC-UJPX04-T3-01
- **T3 Name:** `T3_filters_largeDatasetFilteringShowsLoadingStateThenStableResults`
- **Type:** Exception Case
- **Priority:** P1
- **Expected result:** Loading state is visible and final result set is consistent.

### TC-UJPX04-T4-01
- **T4 Name:** `T4_filters_teacherSetsInvalidDateRange_validationPreventsApplyAndExplainsIssue`
- **Type:** Negative Case
- **Priority:** P1
- **Expected result:** Invalid range is rejected with clear guidance.

### TC-UJPX04-T5-01
- **T5 Name:** `T5_filters_userInjectsUnsupportedFilterField_apiIgnoresOrRejectsWithoutInstability`
- **Type:** Misuse Case
- **Priority:** P0
- **Expected result:** Unsupported filter keys cannot break query logic or expose data.

---

## 7. User Journey UJ-PX05 - Use optional metadata filters and no-match clarity

**Story traceability:** PX2.2

### TC-UJPX05-T1-01
- **T1 Name:** `T1_optionalFilters_teacherFiltersByClassGuardianLocation_listReturnsCorrectMatches`
- **Type:** Standard Case
- **Priority:** P0
- **Expected result:** Results match optional metadata criteria exactly.

### TC-UJPX05-T2-01
- **T2 Name:** `T2_optionalFilters_teacherCombinesOptionalAndCoreFilters_resultsRemainAccurate`
- **Type:** Alternative Case
- **Priority:** P1
- **Expected result:** Combined filter logic behaves predictably across metadata types.

### TC-UJPX05-T3-01
- **T3 Name:** `T3_optionalFilters_someRecordsMissingOptionalFields_filterEngineHandlesNullValuesGracefully`
- **Type:** Exception Case
- **Priority:** P1
- **Expected result:** Missing optional fields do not crash filtering; expected exclusions apply.

### TC-UJPX05-T4-01
- **T4 Name:** `T4_optionalFilters_teacherAppliesNoMatchCriteria_emptyStateExplainsNoResultsClearly`
- **Type:** Negative Case
- **Priority:** P1
- **Expected result:** Empty state message is explicit and actionable.

### TC-UJPX05-T5-01
- **T5 Name:** `T5_optionalFilters_userAttemptsWildcardInjectionInGuardianFilter_systemSanitizesInput`
- **Type:** Misuse Case
- **Priority:** P0
- **Expected result:** Injection-like patterns are sanitized; no query abuse or leakage occurs.

---

## 8. User Journey UJ-PX06 - Manage filter chips and saved presets

**Story traceability:** PX2.3

### TC-UJPX06-T1-01
- **T1 Name:** `T1_presets_teacherWithActiveFilters_seesRemovableChipsAndCanClearAll`
- **Type:** Standard Case
- **Priority:** P0
- **Expected result:** Active chips are visible, individually removable, and clear-all resets state.

### TC-UJPX06-T2-01
- **T2 Name:** `T2_presets_teacherLoadsNeedsCompletionPreset_listMatchesPresetDefinition`
- **Type:** Alternative Case
- **Priority:** P1
- **Expected result:** Saved preset loads expected filter combination and result set.

### TC-UJPX06-T3-01
- **T3 Name:** `T3_presets_savedPresetRefersToDeprecatedFilter_systemRecoversWithFallbackNotice`
- **Type:** Exception Case
- **Priority:** P1
- **Expected result:** Deprecated filter keys do not break UI; user receives fallback notice.

### TC-UJPX06-T4-01
- **T4 Name:** `T4_presets_teacherClearsAllWithoutActiveFilters_systemShowsNoOpFeedback`
- **Type:** Negative Case
- **Priority:** P2
- **Expected result:** No-op clear-all is handled gracefully and state remains unchanged.

### TC-UJPX06-T5-01
- **T5 Name:** `T5_presets_userAttemptsTamperedPresetPayload_systemValidatesAndRejectsCorruptPreset`
- **Type:** Misuse Case
- **Priority:** P0
- **Expected result:** Corrupt or tampered preset payload is rejected without data corruption.

---

## 9. User Journey UJ-PX07 - Capture and display optional metadata without submit blocking

**Story traceability:** PX3.1, PX3.2, PX3.3

### TC-UJPX07-T1-01
- **T1 Name:** `T1_optionalMetadata_teacherAddsClassGuardianLocation_valuesPersistAndDisplayInListAndDetail`
- **Type:** Standard Case
- **Priority:** P0
- **Expected result:** Optional values persist and appear as secondary metadata in list/detail views.

### TC-UJPX07-T2-01
- **T2 Name:** `T2_optionalMetadata_teacherLeavesOptionalFieldsEmpty_submitReadinessRemainsUnchanged`
- **Type:** Alternative Case
- **Priority:** P0
- **Expected result:** Empty optional fields do not add new blockers to submission flow.

### TC-UJPX07-T3-01
- **T3 Name:** `T3_optionalMetadata_legacyAppointmentWithoutNewFields_rendersWithoutErrorsAndRemainsValid`
- **Type:** Exception Case
- **Priority:** P1
- **Expected result:** Backward compatibility is preserved for pre-enrichment records.

### TC-UJPX07-T4-01
- **T4 Name:** `T4_optionalMetadata_teacherEntersOverlongLocation_validationRejectsWithHelpfulMessage`
- **Type:** Negative Case
- **Priority:** P1
- **Expected result:** Invalid optional value is rejected with clear field-level feedback.

### TC-UJPX07-T5-01
- **T5 Name:** `T5_optionalMetadata_userAttemptsScriptInjectionInGuardianName_outputIsEscapedAndStoredSafely`
- **Type:** Misuse Case
- **Priority:** P0
- **Expected result:** Malicious content is neutralized and never executed in UI.

---

## 10. User Journey UJ-PX08 - Reset demo data and run scripted 7-minute pitch path

**Story traceability:** PX4.1, PX4.2

### TC-UJPX08-T1-01
- **T1 Name:** `T1_demoFlow_presenterResetsDemoData_knownDatasetRestoresAndScriptedPathCompletesUnderSevenMinutes`
- **Type:** Standard Case
- **Priority:** P0
- **Expected result:** Reset restores deterministic dataset and full scripted value path fits target duration.

### TC-UJPX08-T2-01
- **T2 Name:** `T2_demoFlow_presenterStartsFromSeededStateWithoutReset_scriptStillCompletesWithClearValueNarrative`
- **Type:** Alternative Case
- **Priority:** P1
- **Expected result:** Scripted flow remains coherent when starting from already-seeded state.

### TC-UJPX08-T3-01
- **T3 Name:** `T3_demoFlow_resetActionExperiencesTransientFailure_userCanRetryAndRecoverDeterministicState`
- **Type:** Exception Case
- **Priority:** P1
- **Expected result:** Retry path is available and successful without manual data cleanup.

### TC-UJPX08-T4-01
- **T4 Name:** `T4_demoFlow_presenterRunsScriptWithDemoModeDisabled_systemExplainsPrerequisiteAndBlocksPath`
- **Type:** Negative Case
- **Priority:** P0
- **Expected result:** App clearly indicates demo-mode requirement and prevents misleading run.

### TC-UJPX08-T5-01
- **T5 Name:** `T5_demoFlow_userManipulatesSeedPayloadOrTiming_systemPreventsInconsistentDemoState`
- **Type:** Misuse Case
- **Priority:** P0
- **Expected result:** State tampering cannot produce inconsistent or cross-session leaked demo data.

---

## 11. Traceability Matrix

| User Journey | Stories | T1 | T2 | T3 | T4 | T5 |
| --- | --- | --- | --- | --- | --- | --- |
| UJ-PX01 | PX1.1 | 1 | 1 | 1 | 1 | 1 |
| UJ-PX02 | PX1.2 | 1 | 1 | 1 | 1 | 1 |
| UJ-PX03 | PX1.3 | 1 | 1 | 1 | 1 | 1 |
| UJ-PX04 | PX2.1 | 1 | 1 | 1 | 1 | 1 |
| UJ-PX05 | PX2.2 | 1 | 1 | 1 | 1 | 1 |
| UJ-PX06 | PX2.3 | 1 | 1 | 1 | 1 | 1 |
| UJ-PX07 | PX3.1, PX3.2, PX3.3 | 1 | 1 | 1 | 1 | 1 |
| UJ-PX08 | PX4.1, PX4.2 | 1 | 1 | 1 | 1 | 1 |

---

## 12. Notes for Execution

- Keep T1 and T4/T5 for each journey in the PR smoke or pre-demo gate.
- Run T2/T3 coverage in full pitch-regression packs.
- Re-run all UJ-PX08 tests before any live investor session.
