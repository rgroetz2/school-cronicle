import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthApiService } from '../../core/auth-api.service';
import { ContactsComponent } from './contacts.component';

describe('ContactsComponent mode actions', () => {
  const authApiMock = {
    listContactRoles: vi.fn(() => ['teacher']),
    listContacts: vi.fn(() => of([])),
    createContact: vi.fn(() => of({ id: 'c1', name: 'A', role: 'teacher', updatedAt: new Date().toISOString() })),
    updateContact: vi.fn(() => of({ id: 'c1', name: 'A', role: 'teacher', updatedAt: new Date().toISOString() })),
    deleteContact: vi.fn(() => of(true)),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [{ provide: AuthApiService, useValue: authApiMock }],
    });
  });

  it('allows create action only in create mode', () => {
    const fixture = TestBed.createComponent(ContactsComponent);
    const component = fixture.componentInstance;
    const saveSpy = vi.spyOn(component, 'saveContact');

    component.selectedContactId = null;
    component.onContactCreateAction();
    expect(saveSpy).toHaveBeenCalledTimes(1);

    component.selectedContactId = 'existing';
    component.onContactCreateAction();
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  it('allows save action only in edit mode', () => {
    const fixture = TestBed.createComponent(ContactsComponent);
    const component = fixture.componentInstance;
    const saveSpy = vi.spyOn(component, 'saveContact');

    component.selectedContactId = null;
    component.onContactSaveAction();
    expect(saveSpy).toHaveBeenCalledTimes(0);

    component.selectedContactId = 'existing';
    component.onContactSaveAction();
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  it('allows delete action only in edit mode', () => {
    const fixture = TestBed.createComponent(ContactsComponent);
    const component = fixture.componentInstance;
    const deleteSpy = vi.spyOn(component, 'deleteContact');

    component.selectedContactId = null;
    component.onContactDeleteAction();
    expect(deleteSpy).toHaveBeenCalledTimes(0);

    component.selectedContactId = 'existing';
    component.onContactDeleteAction();
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('deletes contact after confirmation and refreshes list', () => {
    const fixture = TestBed.createComponent(ContactsComponent);
    const component = fixture.componentInstance;
    const confirmSpy = vi.spyOn(globalThis, 'confirm').mockReturnValue(true);
    const closeSpy = vi.spyOn(component, 'closeModal');

    component.selectedContactId = 'c1';
    component.contactForm.setValue({ name: 'A', role: 'teacher', email: '', phone: '' });
    component.deleteContact();

    expect(authApiMock.deleteContact).toHaveBeenCalledWith('c1');
    expect(component.contactMessage).toBe('Contact deleted.');
    expect(component.selectedContactId).toBe(null);
    expect(closeSpy).toHaveBeenCalled();
    expect(confirmSpy).toHaveBeenCalled();
  });

  it('cancels deletion when confirmation is declined', () => {
    const fixture = TestBed.createComponent(ContactsComponent);
    const component = fixture.componentInstance;
    vi.spyOn(globalThis, 'confirm').mockReturnValue(false);

    component.selectedContactId = 'c1';
    component.deleteContact();

    expect(authApiMock.deleteContact).not.toHaveBeenCalled();
    expect(component.selectedContactId).toBe('c1');
    expect(component.isEditorModalOpen).toBe(false);
  });

  it('surfaces delete failure message on API error', () => {
    authApiMock.deleteContact.mockReturnValueOnce(throwError(() => new Error('boom')));
    const fixture = TestBed.createComponent(ContactsComponent);
    const component = fixture.componentInstance;
    vi.spyOn(globalThis, 'confirm').mockReturnValue(true);
    component.selectedContactId = 'c1';

    component.deleteContact();

    expect(component.contactMessage).toBe('Contact delete failed.');
    expect(component.selectedContactId).toBe('c1');
  });
});
