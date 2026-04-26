# Release UX MVP 3 - Prioritized Execution Board

## Now (Foundation)

1. **UX3.1** Define shared bottom CRUD action bar contract.
2. **UX3.2** Enforce mode-aware `Create`/`Save`/`Delete` rules.
3. **UX3.4** Add contact delete API method in frontend service.

## Next (Feature Delivery)

4. **UX3.3** Apply shared action bar to appointment editor.
5. **UX3.5** Wire contact delete to bottom `Delete` action.
6. **UX3.6** Introduce colorful CRUD action tokens and states.

## Later (Hardening and Confidence)

7. **UX3.7** Verify cross-screen CRUD consistency with tests.

## Parallelization Lanes

- Lane A (UI foundation): UX3.1, UX3.2
- Lane B (contacts integration): UX3.4, UX3.5
- Lane C (visual system): UX3.6
- Lane D (quality): UX3.7

## Key Dependencies

- UX3.2 depends on UX3.1 action-bar contract.
- UX3.3 depends on UX3.1 and UX3.2.
- UX3.5 depends on UX3.4.
- UX3.7 depends on UX3.3, UX3.5, and UX3.6.

## Suggested Release Milestones

- Milestone 1: action-bar foundation complete (UX3.1 + UX3.2 + UX3.4)
- Milestone 2: CRUD behavior complete for appointments and contacts (UX3.3 + UX3.5)
- Milestone 3: colorful polish + regression confidence (UX3.6 + UX3.7)
