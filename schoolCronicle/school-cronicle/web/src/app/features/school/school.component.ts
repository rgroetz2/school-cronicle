import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthApiService, SchoolEntityRecord, UpsertSchoolEntityInput } from '../../core/auth-api.service';
import { SaveCancelActionBarComponent } from '../../shared/save-cancel-action-bar.component';
import { GridRecordOpenDirective } from '../../shared/grid-record-open.directive';

@Component({
  selector: 'app-school',
  imports: [ReactiveFormsModule, DatePipe, SaveCancelActionBarComponent, GridRecordOpenDirective],
  styleUrl: './school.component.css',
  template: `
    <main class="workspace">
      <header class="workspace-header">
        <div>
          <p class="kicker">School Chronicle</p>
          <h2>School workspace</h2>
          <p class="subtle">Manage school records with list filtering and standardized editor interactions.</p>
        </div>
      </header>

      <section class="panel">
        <h3>School list</h3>
        <div class="filter-panel">
          <form [formGroup]="filterForm">
            <div class="filter-grid">
              <label for="school-search">Search</label>
              <input id="school-search" type="search" formControlName="searchTerm" placeholder="Search name, type, address" />

              <label for="school-type-filter">Type</label>
              <input id="school-type-filter" type="text" formControlName="type" placeholder="Filter by type" />
            </div>
          </form>
          <div class="filter-actions">
            <button type="button" class="ghost inline" (click)="resetFilters()">Clear filters</button>
            <button type="button" class="ghost inline" (click)="openCreateModal()">Create school</button>
          </div>
        </div>

        @if (isLoading) {
          <p class="state-pill loading">Loading schools...</p>
        } @else if (records.length === 0) {
          <p class="state-pill">No schools found.</p>
        } @else {
          <table class="excel-grid" aria-label="School grid">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Address</th>
                <th>Description</th>
                <th>Comment</th>
                <th>Last update</th>
              </tr>
            </thead>
            <tbody>
              @for (record of records; track record.id) {
                <tr [class.selected]="selectedRecordId === record.id">
                  <td appGridRecordOpen [recordId]="record.id" (recordOpen)="openRecord($event)">{{ record.name }}</td>
                  <td appGridRecordOpen [recordId]="record.id" (recordOpen)="openRecord($event)">{{ record.type }}</td>
                  <td appGridRecordOpen [recordId]="record.id" (recordOpen)="openRecord($event)">{{ record.address }}</td>
                  <td appGridRecordOpen [recordId]="record.id" (recordOpen)="openRecord($event)">{{ record.description || '-' }}</td>
                  <td appGridRecordOpen [recordId]="record.id" (recordOpen)="openRecord($event)">{{ record.comment || '-' }}</td>
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
              <h3>{{ selectedRecordId ? 'Edit school' : 'Create school' }}</h3>
            </header>

            <form [formGroup]="recordForm" novalidate>
              <label for="school-name">Name *</label>
              <input id="school-name" type="text" formControlName="name" />

              <label for="school-type">Type *</label>
              <input id="school-type" type="text" formControlName="type" />

              <label for="school-address">Address *</label>
              <input id="school-address" type="text" formControlName="address" />

              <label for="school-description">Description</label>
              <textarea id="school-description" rows="3" formControlName="description"></textarea>

              <label for="school-comment">Comment</label>
              <textarea id="school-comment" rows="3" formControlName="comment"></textarea>
            </form>

            <app-save-cancel-action-bar
              ariaLabel="School CRUD actions"
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
export class SchoolComponent implements OnInit {
  private readonly authApiService = inject(AuthApiService);

  records: SchoolEntityRecord[] = [];
  selectedRecordId: string | null = null;
  isEditorOpen = false;
  isLoading = false;
  isSaving = false;
  message = '';

  readonly filterForm = new FormGroup({
    searchTerm: new FormControl(''),
    type: new FormControl(''),
  });

  readonly recordForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    comment: new FormControl(''),
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
    this.filterForm.reset({ searchTerm: '', type: '' });
    this.loadRecords();
  }

  openCreateModal(): void {
    this.selectedRecordId = null;
    this.recordForm.reset({ name: '', type: '', address: '', description: '', comment: '' });
    this.isEditorOpen = true;
  }

  openRecord(recordId: string): void {
    const record = this.records.find((item) => item.id === recordId);
    if (!record) {
      return;
    }
    this.selectedRecordId = record.id;
    this.recordForm.reset({
      name: record.name,
      type: record.type,
      address: record.address,
      description: record.description ?? '',
      comment: record.comment ?? '',
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
    const payload: UpsertSchoolEntityInput = {
      name: formValue.name ?? '',
      type: formValue.type ?? '',
      address: formValue.address ?? '',
      description: formValue.description ?? '',
      comment: formValue.comment ?? '',
    };
    this.isSaving = true;
    const request$ = this.selectedRecordId
      ? this.authApiService.updateSchool(this.selectedRecordId, payload)
      : this.authApiService.createSchool(payload);
    request$
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.handleSaveSuccess('School saved.');
        },
        error: () => {
          this.message = 'School save failed.';
        },
      });
  }

  onCancel(): void {
    this.closeEditor();
  }

  private loadRecords(): void {
    this.isLoading = true;
    const filters = this.filterForm.getRawValue();
    this.authApiService
      .listSchools({
        searchTerm: filters.searchTerm ?? undefined,
        type: filters.type ?? undefined,
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (records) => {
          this.records = records;
        },
        error: () => {
          this.records = [];
          this.message = 'School loading failed.';
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
