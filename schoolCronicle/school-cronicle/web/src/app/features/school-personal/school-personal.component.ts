import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import {
  AuthApiService,
  SchoolPersonalJobRole,
  SchoolPersonalRecord,
  UpsertSchoolPersonalInput,
  UserRole,
} from '../../core/auth-api.service';
import { SaveCancelActionBarComponent } from '../../shared/save-cancel-action-bar.component';
import { GridRecordOpenDirective } from '../../shared/grid-record-open.directive';

@Component({
  selector: 'app-school-personal',
  imports: [ReactiveFormsModule, DatePipe, SaveCancelActionBarComponent, GridRecordOpenDirective],
  styleUrl: './school-personal.component.css',
  template: `
    <main class="workspace">
      <header class="workspace-header">
        <div>
          <p class="kicker">School Chronicle</p>
          <h2>School-personal workspace</h2>
          <p class="subtle">Manage people accounts with role-aware permissions and profile ownership safeguards.</p>
        </div>
      </header>

      <section class="panel">
        <h3>School-personal list</h3>
        <div class="filter-panel">
          <form [formGroup]="filterForm">
            <div class="filter-grid">
              <label for="personal-search">Search</label>
              <input id="personal-search" type="search" formControlName="searchTerm" placeholder="Search name, role, job role, class" />

              <label for="personal-role-filter">Role</label>
              <select id="personal-role-filter" formControlName="role">
                <option value="">All roles</option>
                <option value="admin">admin</option>
                <option value="user">user</option>
              </select>

              <label for="personal-job-role-filter">Job role</label>
              <select id="personal-job-role-filter" formControlName="jobRole">
                <option value="">All job roles</option>
                @for (jobRole of jobRoleOptions; track jobRole) {
                  <option [value]="jobRole">{{ jobRole }}</option>
                }
              </select>
            </div>
          </form>
          <div class="filter-actions">
            <button type="button" class="ghost inline" (click)="resetFilters()">Clear filters</button>
            <button type="button" class="ghost inline" (click)="openCreateModal()">Create profile</button>
          </div>
        </div>

        @if (isLoading) {
          <p class="state-pill loading">Loading profiles...</p>
        } @else if (records.length === 0) {
          <p class="state-pill">No profiles found.</p>
        } @else {
          <table class="excel-grid" aria-label="School personal grid">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Job role</th>
                <th>Class</th>
                <th>Start date</th>
                <th>Last update</th>
              </tr>
            </thead>
            <tbody>
              @for (record of records; track record.id) {
                <tr [class.selected]="selectedRecordId === record.id">
                  <td appGridRecordOpen [recordId]="record.id" (recordOpen)="openRecord($event)">{{ record.name }}</td>
                  <td appGridRecordOpen [recordId]="record.id" (recordOpen)="openRecord($event)">{{ record.role }}</td>
                  <td appGridRecordOpen [recordId]="record.id" (recordOpen)="openRecord($event)">{{ record.jobRole }}</td>
                  <td appGridRecordOpen [recordId]="record.id" (recordOpen)="openRecord($event)">{{ record.class || '-' }}</td>
                  <td appGridRecordOpen [recordId]="record.id" (recordOpen)="openRecord($event)">{{ record.startDate || '-' }}</td>
                  <td appGridRecordOpen [recordId]="record.id" (recordOpen)="openRecord($event)">{{ record.updatedAt | date: 'yyyy-MM-dd HH:mm' }}</td>
                </tr>
              }
            </tbody>
          </table>
        }
      </section>

      @if (isEditorOpen) {
        <div class="modal-backdrop" role="presentation" (click)="onCancel()" (keydown.enter)="onCancel()">
          <section
            class="modal-panel"
            role="dialog"
            aria-modal="true"
            (click)="$event.stopPropagation()"
            (keydown.enter)="$event.stopPropagation()"
          >
            <header class="modal-header">
              <h3>{{ selectedRecordId ? 'Edit profile' : 'Create profile' }}</h3>
            </header>
            <form [formGroup]="recordForm" novalidate>
              <label for="record-name">Name *</label>
              <input id="record-name" type="text" formControlName="name" />

              <label for="record-role">Role *</label>
              <select id="record-role" formControlName="role">
                <option value="">Select role</option>
                <option value="admin">admin</option>
                <option value="user">user</option>
              </select>

              <label for="record-job-role">Job role *</label>
              <select id="record-job-role" formControlName="jobRole">
                <option value="">Select job role</option>
                @for (jobRole of jobRoleOptions; track jobRole) {
                  <option [value]="jobRole">{{ jobRole }}</option>
                }
              </select>

              <label for="record-class">Class</label>
              <input id="record-class" type="text" formControlName="class" />

              <label for="record-start-date">Start date</label>
              <input id="record-start-date" type="date" formControlName="startDate" />
            </form>

            <app-save-cancel-action-bar
              ariaLabel="School-personal CRUD actions"
              [saveDisabled]="isSaving"
              [cancelDisabled]="isSaving"
              (saveClicked)="onSave()"
              (cancelClicked)="onCancel()"
            />
          </section>
        </div>
      }
      @if (message) {
        <p class="state-pill" [class.warning]="message.includes('failed')">{{ message }}</p>
      }
    </main>
  `,
})
export class SchoolPersonalComponent implements OnInit {
  private readonly authApiService = inject(AuthApiService);

  records: SchoolPersonalRecord[] = [];
  selectedRecordId: string | null = null;
  isEditorOpen = false;
  isLoading = false;
  isSaving = false;
  message = '';
  readonly jobRoleOptions = this.authApiService.listSchoolPersonalJobRoles();

  readonly filterForm = new FormGroup({
    searchTerm: new FormControl(''),
    role: new FormControl<UserRole | ''>(''),
    jobRole: new FormControl<SchoolPersonalJobRole | ''>(''),
  });

  readonly recordForm = new FormGroup({
    teacherId: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    role: new FormControl<UserRole | ''>('', [Validators.required]),
    jobRole: new FormControl<SchoolPersonalJobRole | ''>('', [Validators.required]),
    class: new FormControl(''),
    startDate: new FormControl(''),
  });

  ngOnInit(): void {
    this.authApiService.getSessionContext().subscribe({
      next: () => {
        this.loadRecords();
      },
      error: () => {
        this.loadRecords();
      },
    });
  }

  resetFilters(): void {
    this.filterForm.reset({ searchTerm: '', role: '', jobRole: '' });
    this.loadRecords();
  }

  openCreateModal(): void {
    this.selectedRecordId = null;
    this.recordForm.reset({
      teacherId: '',
      name: '',
      role: 'user',
      jobRole: '',
      class: '',
      startDate: '',
    });
    this.isEditorOpen = true;
  }

  openRecord(recordId: string): void {
    const record = this.records.find((item) => item.id === recordId);
    if (!record) {
      return;
    }
    this.selectedRecordId = record.id;
    this.recordForm.reset({
      teacherId: record.teacherId,
      name: record.name,
      role: record.role,
      jobRole: record.jobRole,
      class: record.class ?? '',
      startDate: record.startDate ?? '',
    });
    this.isEditorOpen = true;
  }

  onSave(): void {
    this.message = '';
    this.recordForm.markAllAsTouched();
    if (this.recordForm.invalid || this.isSaving) {
      return;
    }
    const formValue = this.recordForm.getRawValue();
    const payload: UpsertSchoolPersonalInput = {
      teacherId: formValue.teacherId?.trim() || undefined,
      name: formValue.name ?? '',
      role: (formValue.role ?? 'user') as UserRole,
      jobRole: (formValue.jobRole ?? 'teacher') as SchoolPersonalJobRole,
      class: formValue.class ?? '',
      startDate: formValue.startDate ?? '',
    };
    this.isSaving = true;
    const request$ = this.selectedRecordId
      ? this.authApiService.updateSchoolPersonal(this.selectedRecordId, payload)
      : this.authApiService.createSchoolPersonal(payload);
    request$
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.handleSaveSuccess('Profile saved.');
        },
        error: () => {
          this.message = 'Profile save failed.';
        },
      });
  }

  onCancel(): void {
    this.closeEditor();
  }

  private loadRecords(): void {
    this.isLoading = true;
    const rawFilters = this.filterForm.getRawValue();
    const filters = {
      searchTerm: rawFilters.searchTerm ?? undefined,
      role: rawFilters.role ?? '',
      jobRole: rawFilters.jobRole ?? '',
    };
    this.authApiService
      .listSchoolPersonal(filters)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (records) => {
          this.records = records;
        },
        error: () => {
          this.records = [];
          this.message = 'Profile loading failed.';
        },
      });
  }

  private handleSaveSuccess(message: string): void {
    this.message = message;
    this.closeEditor();
    this.loadRecords();
  }

  private closeEditor(): void {
    this.isEditorOpen = false;
    this.selectedRecordId = null;
  }
}
