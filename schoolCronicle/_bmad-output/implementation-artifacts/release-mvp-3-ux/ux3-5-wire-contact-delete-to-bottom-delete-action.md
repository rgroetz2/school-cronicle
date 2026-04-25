# Story UX3.5: Wire Contact Delete to Bottom Delete Action

Status: drafted

## Story

As a teacher,  
I want to delete an existing contact from the bottom action bar,  
so that I can maintain a clean participants directory.

## Acceptance Criteria

1. Given contact edit mode, when I click `Delete` and confirm, then the contact is deleted.
2. Given delete success, then the contacts list refreshes and the modal/editor exits or reflects removal.
3. Given confirmation cancel, then no deletion occurs and data remains unchanged.

## Tasks / Subtasks

- [ ] Add contact delete confirmation flow in contact editor.
- [ ] Trigger frontend contact delete service method from bottom action bar.
- [ ] Add regression tests for confirm/cancel/error paths.
