import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthApiService } from '../../core/auth-api.service';
import { ContactsComponent } from './contacts.component';

describe('ContactsComponent mode actions', () => {
  const authApiMock = {
    listContactRoles: vi.fn(() => ['teacher']),
    listContacts: vi.fn(() => of([])),
    createContact: vi.fn(() => of({ id: 'c1', name: 'A', role: 'teacher', updatedAt: new Date().toISOString() })),
    updateContact: vi.fn(() => of({ id: 'c1', name: 'A', role: 'teacher', updatedAt: new Date().toISOString() })),
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
});
