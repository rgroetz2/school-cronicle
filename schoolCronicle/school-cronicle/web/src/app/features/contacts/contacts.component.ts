import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthApiService, SchoolContact, SchoolContactRole } from '../../core/auth-api.service';
import { CrudActionBarComponent } from '../../shared/crud-action-bar.component';

@Component({
  selector: 'app-contacts',
  imports: [ReactiveFormsModule, DatePipe, CrudActionBarComponent],
  styleUrl: './contacts.component.css',
  template: `
    <main class="workspace">
      <header class="workspace-header">
        <div>
          <p class="kicker">School Chronicle</p>
          <h2>Contacts workspace</h2>
          <p class="subtle">Manage school-wide teacher, parent, staff, and partner contacts.</p>
        </div>
      </header>

      <section class="panel">
        <h3>Contacts list</h3>
        <p class="panel-copy">Use one list to find, open, and maintain contacts.</p>

        <div class="filter-panel">
          <form [formGroup]="filterForm">
            <div class="filter-grid">
              <label for="contact-search">Search</label>
              <input id="contact-search" type="search" formControlName="searchTerm" placeholder="Search name, role, email, phone" />

              <label for="contact-role-filter">Role</label>
              <select id="contact-role-filter" formControlName="role">
                <option value="">All roles</option>
                @for (role of roleOptions; track role) {
                  <option [value]="role">{{ role }}</option>
                }
              </select>
            </div>
          </form>
          <div class="filter-actions">
            <button type="button" class="ghost inline" (click)="resetFilters()" [disabled]="!hasActiveFilters">Clear filters</button>
            <button type="button" class="ghost inline" (click)="openCreateModal()">Create contact</button>
          </div>
        </div>

        @if (isLoadingContacts) {
          <p class="state-pill loading">Loading contacts...</p>
        } @else if (filteredContacts.length === 0) {
          <p class="state-pill">{{ hasActiveFilters ? 'No contacts match current filters.' : 'No contacts yet. Create your first contact.' }}</p>
        } @else {
          <div class="contacts-grid" role="table" aria-label="Contacts grid">
            <div class="grid-header" role="row">
              <span class="grid-cell">Name</span>
              <span class="grid-cell">Role</span>
              <span class="grid-cell">Email</span>
              <span class="grid-cell">Phone</span>
              <span class="grid-cell">Last update</span>
            </div>
            <ul class="contact-list">
              @for (contact of filteredContacts; track contact.id) {
                <li>
                  <button
                    type="button"
                    class="contact-button contact-grid-row"
                    [attr.aria-pressed]="selectedContactId === contact.id"
                    (click)="openContact(contact.id)"
                  >
                    <span class="grid-cell">{{ contact.name }}</span>
                    <span class="grid-cell">{{ contact.role }}</span>
                    <span class="grid-cell">{{ contact.email || '-' }}</span>
                    <span class="grid-cell">{{ contact.phone || '-' }}</span>
                    <span class="grid-cell">{{ contact.updatedAt | date: 'yyyy-MM-dd HH:mm' }}</span>
                  </button>
                </li>
              }
            </ul>
          </div>
        }
      </section>

      @if (isEditorModalOpen) {
        <div class="modal-backdrop" role="presentation" (click)="closeModal()">
          <section
            class="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            (click)="$event.stopPropagation()"
            (keydown.enter)="$event.stopPropagation()"
          >
            <header class="modal-header">
              <h3 id="contact-modal-title">{{ selectedContactId ? 'Maintain contact' : 'Create contact' }}</h3>
              <div class="modal-header-actions">
                <button type="button" class="ghost inline" (click)="closeModal()">Close</button>
              </div>
            </header>

            <form [formGroup]="contactForm" novalidate>
              <label for="contact-name">Name *</label>
              <input id="contact-name" type="text" formControlName="name" />

              <label for="contact-role">Role *</label>
              <select id="contact-role" formControlName="role">
                <option value="">Select role</option>
                @for (role of roleOptions; track role) {
                  <option [value]="role">{{ role }}</option>
                }
              </select>

              <label for="contact-email">Email</label>
              <input id="contact-email" type="email" formControlName="email" />

              <label for="contact-phone">Phone</label>
              <input id="contact-phone" type="text" formControlName="phone" />
            </form>
            <div class="contact-modal-footer">
              <app-crud-action-bar
                ariaLabel="Contact CRUD actions"
                [showCreate]="isContactCreateMode"
                [showSave]="isContactEditMode"
                [showDelete]="isContactEditMode"
                [createDisabled]="isSavingContact"
                [saveDisabled]="isSavingContact"
                [deleteDisabled]="isSavingContact"
                [createLabel]="isSavingContact ? 'Creating contact...' : 'Create contact'"
                [saveLabel]="isSavingContact ? 'Saving contact...' : 'Save contact'"
                deleteLabel="Delete contact"
                (createClicked)="onContactCreateAction()"
                (saveClicked)="onContactSaveAction()"
                (deleteClicked)="showDeleteUnavailableMessage()"
              >
                <button crud-secondary type="button" class="ghost" (click)="closeModal()">Cancel</button>
              </app-crud-action-bar>
            </div>
          </section>
        </div>
      }

      <section class="status-stack">
        @if (contactMessage) {
          <p class="state-pill" [class.warning]="contactMessage.includes('failed')">{{ contactMessage }}</p>
        }
      </section>
    </main>
  `,
})
export class ContactsComponent {
  private readonly authApiService = inject(AuthApiService);

  contacts: SchoolContact[] = [];
  selectedContactId: string | null = null;
  isLoadingContacts = false;
  isSavingContact = false;
  isEditorModalOpen = false;
  contactMessage = '';
  readonly roleOptions: SchoolContactRole[] = this.authApiService.listContactRoles();

  readonly filterForm = new FormGroup({
    searchTerm: new FormControl(''),
    role: new FormControl<SchoolContactRole | ''>(''),
  });

  readonly contactForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    role: new FormControl<SchoolContactRole | ''>('', [Validators.required]),
    email: new FormControl('', [Validators.email]),
    phone: new FormControl(''),
  });

  constructor() {
    this.loadContacts();
  }

  get hasActiveFilters(): boolean {
    const { searchTerm, role } = this.filterForm.getRawValue();
    return Boolean(searchTerm) || Boolean(role);
  }

  get filteredContacts(): SchoolContact[] {
    const searchTerm = (this.filterForm.controls.searchTerm.value ?? '').trim().toLowerCase();
    const role = this.filterForm.controls.role.value ?? '';
    return this.contacts.filter((contact) => {
      if (role && contact.role !== role) {
        return false;
      }
      if (!searchTerm) {
        return true;
      }
      const value = [contact.name, contact.role, contact.email ?? '', contact.phone ?? ''].join(' ').toLowerCase();
      return value.includes(searchTerm);
    });
  }

  get isContactCreateMode(): boolean {
    return !this.selectedContactId;
  }

  get isContactEditMode(): boolean {
    return !!this.selectedContactId;
  }

  resetFilters(): void {
    this.filterForm.reset({ searchTerm: '', role: '' });
  }

  openCreateModal(): void {
    this.selectedContactId = null;
    this.contactForm.reset({ name: '', role: '', email: '', phone: '' });
    this.isEditorModalOpen = true;
  }

  openContact(contactId: string): void {
    const target = this.contacts.find((contact) => contact.id === contactId);
    if (!target) {
      return;
    }
    this.selectedContactId = target.id;
    this.contactForm.setValue({
      name: target.name,
      role: target.role,
      email: target.email ?? '',
      phone: target.phone ?? '',
    });
    this.isEditorModalOpen = true;
  }

  closeModal(): void {
    this.isEditorModalOpen = false;
  }

  saveContact(): void {
    this.contactMessage = '';
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid || this.isSavingContact) {
      return;
    }

    const payload = {
      name: this.contactForm.controls.name.value ?? '',
      role: (this.contactForm.controls.role.value ?? '') as SchoolContactRole,
      email: this.contactForm.controls.email.value ?? '',
      phone: this.contactForm.controls.phone.value ?? '',
    };

    this.isSavingContact = true;
    const request$ = this.selectedContactId
      ? this.authApiService.updateContact(this.selectedContactId, payload)
      : this.authApiService.createContact(payload);

    request$
      .pipe(finalize(() => (this.isSavingContact = false)))
      .subscribe({
        next: (contact) => {
          this.contactMessage = this.selectedContactId ? `Contact updated: ${contact.name}` : `Contact created: ${contact.name}`;
          this.closeModal();
          this.loadContacts();
        },
        error: () => {
          this.contactMessage = 'Contact save failed.';
        },
      });
  }

  onContactCreateAction(): void {
    if (!this.isContactCreateMode) {
      return;
    }
    this.saveContact();
  }

  onContactSaveAction(): void {
    if (!this.isContactEditMode) {
      return;
    }
    this.saveContact();
  }

  showDeleteUnavailableMessage(): void {
    this.contactMessage = 'Delete contact will be enabled in UX3.2.';
  }

  private loadContacts(): void {
    this.isLoadingContacts = true;
    this.authApiService
      .listContacts()
      .pipe(finalize(() => (this.isLoadingContacts = false)))
      .subscribe({
        next: (contacts) => {
          this.contacts = contacts;
        },
        error: () => {
          this.contacts = [];
        },
      });
  }
}
