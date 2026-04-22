import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AppointmentDraft, AuthApiService, DraftImage } from '../../core/auth-api.service';

type ImageUploadState = 'queued' | 'uploading' | 'attached' | 'failed';

interface ImageUploadStatus {
  id: string;
  name: string;
  state: ImageUploadState;
  detail?: string;
}

type FilterLifecycleState = 'all' | 'needs_attention' | 'ready_to_submit' | 'submitted';

@Component({
  selector: 'app-appointments',
  imports: [ReactiveFormsModule, DatePipe],
  styleUrl: './appointments.component.css',
  template: `
    <main class="workspace">
      <header class="workspace-header">
        <div>
          <p class="kicker">School Chronicle</p>
          <h2>Appointments workspace</h2>
          <p class="subtle">
            Signed in as {{ teacherDisplayName }}. Review drafts, enrich metadata, attach files, and submit confidently.
          </p>
        </div>
        <div class="header-actions">
          <button type="button" class="ghost" (click)="openPrivacySummary()">Privacy summary</button>
          <button type="button" class="ghost" (click)="signOut()" [disabled]="isSigningOut">
            {{ isSigningOut ? 'Signing out...' : 'Sign out' }}
          </button>
        </div>
      </header>

      <div class="workspace-zones">
        <section class="zone zone-results" aria-labelledby="results-zone-heading">
          <header class="zone-header">
            <h3 id="results-zone-heading">List and results</h3>
            <p class="panel-copy">Use filters first, then open the draft you want to work on.</p>
          </header>

          <section class="panel" aria-labelledby="draft-list-heading">
          <h3 id="draft-list-heading">Your drafts</h3>
          <p class="panel-copy">Choose a draft to continue editing and submission checks.</p>
        <div class="filter-panel" aria-label="Appointment filters">
          <h4>Filter list</h4>
          <form [formGroup]="filterForm">
            <div class="filter-grid">
              <label for="filter-category">Category</label>
              <select id="filter-category" formControlName="category">
                <option value="">All categories</option>
                @for (category of categories; track category) {
                  <option [value]="category">{{ category }}</option>
                }
              </select>

              <label for="filter-status">Status</label>
              <select id="filter-status" formControlName="status">
                <option value="all">All statuses</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
              </select>
            </div>
          <details class="filter-advanced" [open]="showAdvancedFilters">
            <summary (click)="toggleAdvancedFilters($event)">Advanced filters</summary>
            <div class="filter-grid advanced-grid">
              <label for="filter-date-from">Date from</label>
              <input id="filter-date-from" type="date" formControlName="dateFrom" />

              <label for="filter-date-to">Date to</label>
              <input id="filter-date-to" type="date" formControlName="dateTo" />

              <label for="filter-has-images">Has images</label>
              <select id="filter-has-images" formControlName="hasImages">
                <option value="all">All</option>
                <option value="yes">With images</option>
                <option value="no">Without images</option>
              </select>

              <label for="filter-lifecycle">Lifecycle state</label>
              <select id="filter-lifecycle" formControlName="lifecycleState">
                <option value="all">All lifecycle states</option>
                <option value="needs_attention">Needs attention</option>
                <option value="ready_to_submit">Ready to submit</option>
                <option value="submitted">Submitted</option>
              </select>
            </div>
          </details>
          </form>
          <div class="filter-actions">
            <button type="button" class="ghost inline" (click)="resetFilters()" [disabled]="!hasActiveFilters">
              Clear filters
            </button>
          </div>
        </div>
        @if (activeListContextLabel) {
          <p class="state-pill">
            Showing: {{ activeListContextLabel }}
            <button type="button" class="ghost inline" (click)="clearListContext()">Clear</button>
          </p>
        }
        @if (isLoadingDrafts) {
          <p class="state-pill loading">Loading drafts...</p>
        } @else if (filteredDrafts.length === 0) {
          <p class="state-pill">
            {{ hasActiveFilters ? 'No appointments match current filters. Adjust or clear filters.' : 'No drafts yet. Create one below to get started.' }}
          </p>
        } @else {
          <ul class="draft-list">
            @for (draft of filteredDrafts; track draft.id) {
              <li>
                <button
                  type="button"
                  class="draft-button"
                  (click)="openDraft(draft.id)"
                  [attr.aria-pressed]="selectedDraftId === draft.id"
                >
                  <span class="draft-title">{{ draft.title }}</span>
                  <span class="draft-meta">
                    {{ draft.category }} - {{ draft.appointmentDate }} - {{ draft.status }}
                    @if (draft.submittedAt) {
                      (submitted {{ draft.submittedAt | date: 'yyyy-MM-dd HH:mm' }})
                    }
                  </span>
                </button>
              </li>
            }
          </ul>
        }
        </section>
        </section>

        <section class="zone zone-detail" aria-labelledby="detail-zone-heading">
          <header class="zone-header">
            <h3 id="detail-zone-heading">Detail and editor</h3>
            <p class="panel-copy">Review readiness and edit selected draft details in one focused area.</p>
          </header>
        <section class="panel" aria-labelledby="submit-readiness-heading">
          <h3 id="submit-readiness-heading">Submit readiness</h3>
          <p class="panel-copy">Required metadata: title, appointment date, and category.</p>
          <ul class="guidance-list" aria-label="Submit guidance">
            <li>Use a clear title so the entry is easy to identify later.</li>
            <li>Set the appointment date in YYYY-MM-DD format.</li>
            <li>Choose one category before trying to submit.</li>
          </ul>
        @if (!selectedDraftId) {
          <p class="state-pill">Select a draft to evaluate submit readiness.</p>
        }
        @if (selectedDraft) {
          <p class="state-pill">
            Current status: {{ selectedDraft.status === 'submitted' ? 'Submitted' : 'Draft' }}
          </p>
          @if (selectedDraft.submittedAt) {
            <p class="state-pill">Submitted at: {{ selectedDraft.submittedAt | date: 'yyyy-MM-dd HH:mm' }}</p>
          }
        }
        @if (missingRequiredFields.length > 0) {
          <p class="state-pill warning">Submission blocked. Missing metadata:</p>
          <ul class="missing-list">
            @for (field of missingRequiredFields; track field) {
              <li>{{ field }}</li>
            }
          </ul>
        }
        @if (failedImageUploadCount > 0) {
          <p class="state-pill warning">Submission blocked. Invalid image uploads:</p>
          <ul class="missing-list">
            @for (upload of imageUploadStatuses; track upload.id) {
              @if (upload.state === 'failed') {
                <li>{{ upload.name }}{{ upload.detail ? ': ' + upload.detail : '' }}</li>
              }
            }
          </ul>
        }
        @if (selectedDraftId && missingRequiredFields.length === 0 && failedImageUploadCount === 0) {
          <p class="state-pill success">All required metadata is complete.</p>
        }
        <button type="button" class="primary" (click)="submitDraft()" [disabled]="!canSubmit || isSubmittingDraft">
          {{ isSubmittingDraft ? 'Submitting...' : 'Submit draft' }}
        </button>
        </section>
        <section class="panel form-panel" aria-label="Draft editor">
          <h3>Draft editor</h3>
          <p class="panel-copy">Create a new draft or update the currently selected one.</p>
          @if (isSelectedDraftSubmitted && selectedDraft) {
            <p class="state-pill warning">Submitted appointments are read-only.</p>
            <dl class="readonly-grid">
              <div>
                <dt>Title</dt>
                <dd>{{ selectedDraft.title }}</dd>
              </div>
              <div>
                <dt>Appointment date</dt>
                <dd>{{ selectedDraft.appointmentDate }}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{{ selectedDraft.category }}</dd>
              </div>
              <div>
                <dt>Submitted at</dt>
                <dd>{{ selectedDraft.submittedAt ? (selectedDraft.submittedAt | date: 'yyyy-MM-dd HH:mm') : '-' }}</dd>
              </div>
              <div class="wide">
                <dt>Notes</dt>
                <dd>{{ selectedDraft.notes || 'No notes provided.' }}</dd>
              </div>
            </dl>
          } @else {
          <form [formGroup]="draftForm" (ngSubmit)="createDraft()" novalidate>
            <label for="draft-title">Title *</label>
            <input id="draft-title" formControlName="title" type="text" />
            <p class="field-hint">Required. Keep it short and specific (example: Parent meeting).</p>
            @if (draftForm.controls.title.touched && draftForm.controls.title.invalid) {
              <p class="field-error">Title is required.</p>
            }

            <label for="draft-date">Appointment date *</label>
            <input id="draft-date" formControlName="appointmentDate" type="date" />
            <p class="field-hint">Required. Select the calendar date for this appointment.</p>
            @if (draftForm.controls.appointmentDate.touched && draftForm.controls.appointmentDate.invalid) {
              <p class="field-error">Appointment date is required.</p>
            }

            <label for="draft-category">Category *</label>
            <select id="draft-category" formControlName="category">
              <option value="">Select category</option>
              @for (category of categories; track category) {
                <option [value]="category">{{ category }}</option>
              }
            </select>
            <p class="field-hint">Required. Choose the category that best fits the appointment.</p>
            @if (draftForm.controls.category.touched && draftForm.controls.category.invalid) {
              <p class="field-error">Category is required.</p>
            }

            <label for="draft-notes">Notes</label>
            <textarea id="draft-notes" formControlName="notes"></textarea>

            <div class="form-actions">
              <button
                type="submit"
                class="primary"
                [disabled]="isCreatingDraft || isSavingDraft || isSelectedDraftSubmitted"
              >
          {{
            isSavingDraft
              ? 'Saving draft...'
              : isCreatingDraft
                ? 'Creating draft...'
                : selectedDraftId
                  ? 'Save draft'
                  : 'Create draft'
          }}
              </button>
              <button
                type="button"
                class="ghost danger"
                (click)="deleteSelectedDraft()"
                [disabled]="!selectedDraftId || isDeletingDraft || isSelectedDraftSubmitted"
              >
                {{ isDeletingDraft ? 'Deleting draft...' : 'Delete selected draft' }}
              </button>
            </div>
          </form>
          }
        </section>
        </section>

        <section class="zone zone-media" aria-labelledby="media-zone-heading">
          <header class="zone-header">
            <h3 id="media-zone-heading">Media and attachments</h3>
            <p class="panel-copy">Add and manage images separately from core draft editing to keep focus.</p>
          </header>
        <section class="panel" aria-labelledby="draft-images-heading">
          <h3 id="draft-images-heading">Attached images</h3>
          <p class="panel-copy">Attach reference photos up to 2 MB each for local draft context.</p>
          <p class="guidance-text">Accepted formats: JPEG, PNG, WebP. Maximum file size: 2 MB per image.</p>
        @if (!selectedDraftId) {
          <p class="state-pill">Select a draft to attach images.</p>
        } @else if (selectedDraft?.status === 'submitted') {
          <p class="state-pill warning">Submitted appointments are read-only. Image changes are disabled.</p>
          @if (selectedDraftImages.length === 0) {
            <p class="state-pill">No images attached.</p>
          } @else {
            <ul class="image-list">
              @for (image of selectedDraftImages; track image.id) {
                <li class="image-card">
                  <img [src]="image.dataUrl" [alt]="image.name" width="84" height="84" />
                  <span class="image-name">{{ image.name }}</span>
                </li>
              }
            </ul>
          }
        } @else {
          <input type="file" class="file-input" accept="image/*" multiple (change)="onImageSelected($event)" />
          <input
            #replaceFileInput
            type="file"
            class="visually-hidden"
            accept="image/*"
            (change)="onReplacementSelected($event)"
          />
          @if (imageUploadStatuses.length > 0) {
            <ul class="upload-status-list" aria-label="Attachment status list">
              @for (upload of imageUploadStatuses; track upload.id) {
                <li class="upload-status">
                  <span class="upload-name">{{ upload.name }}</span>
                  <span
                    class="upload-state"
                    [class.success]="upload.state === 'attached'"
                    [class.warning]="upload.state === 'failed'"
                  >
                    {{ upload.state }}
                  </span>
                  @if (upload.detail) {
                    <span class="upload-detail">{{ upload.detail }}</span>
                  }
                  @if (upload.state === 'failed') {
                    <div class="upload-actions">
                      <button type="button" class="ghost danger" (click)="removeFailedUpload(upload.id)">
                        Remove failed
                      </button>
                      <button
                        type="button"
                        class="ghost"
                        (click)="startReplaceFailedUpload(upload.id, replaceFileInput)"
                      >
                        Replace file
                      </button>
                    </div>
                  }
                </li>
              }
            </ul>
          }
          @if (selectedDraftImages.length === 0) {
            <p class="state-pill">No images attached yet.</p>
          } @else {
            <ul class="image-list">
              @for (image of selectedDraftImages; track image.id) {
                <li class="image-card">
                  <img [src]="image.dataUrl" [alt]="image.name" width="84" height="84" />
                  <span class="image-name">{{ image.name }}</span>
                  <button type="button" class="ghost danger" (click)="removeImage(image.id)">Remove</button>
                </li>
              }
            </ul>
          }
        }
        </section>
        </section>
      </div>

      <section class="status-stack" aria-label="System status">
        @if (draftCreatedMessage) {
          <p class="state-pill success" role="status">{{ draftCreatedMessage }}</p>
        }
        @if (openedDraftMessage) {
          <p class="state-pill" role="status">{{ openedDraftMessage }}</p>
        }
        @if (draftSavedMessage) {
          <p class="state-pill success" role="status">{{ draftSavedMessage }}</p>
        }
        @if (draftSubmitMessage) {
          <p class="state-pill" [class.warning]="draftSubmitMessage.includes('blocked')" role="status">
            {{ draftSubmitMessage }}
          </p>
        }
        @if (imageMessage) {
          <p class="state-pill" [class.warning]="imageMessage.includes('too large')" role="status">
            {{ imageMessage }}
          </p>
        }
        @if (deleteMessage) {
          <p
            class="state-pill"
            [class.warning]="deleteMessage.includes('failed') || deleteMessage.includes('could not')"
            role="status"
          >
            {{ deleteMessage }}
          </p>
        }
      </section>
    </main>
  `,
})
export class AppointmentsComponent {
  private static readonly MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
  private static readonly ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
  private readonly authApiService = inject(AuthApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isSigningOut = false;
  isCreatingDraft = false;
  isSavingDraft = false;
  isSubmittingDraft = false;
  isDeletingDraft = false;
  isLoadingDrafts = false;
  draftCreatedMessage = '';
  openedDraftMessage = '';
  draftSavedMessage = '';
  draftSubmitMessage = '';
  imageMessage = '';
  deleteMessage = '';
  showAdvancedFilters = false;
  imageUploadStatuses: ImageUploadStatus[] = [];
  replacingUploadId: string | null = null;
  selectedDraftId: string | null = null;
  categories: string[] = [];
  drafts: AppointmentDraft[] = [];
  teacherDisplayName = 'Teacher Account';
  activeListContext: 'all' | 'drafts' | 'submitted' | 'attention' = 'all';

  readonly draftForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    appointmentDate: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
  });

  readonly filterForm = new FormGroup({
    category: new FormControl(''),
    status: new FormControl<'all' | 'draft' | 'submitted'>('all'),
    dateFrom: new FormControl(''),
    dateTo: new FormControl(''),
    hasImages: new FormControl<'all' | 'yes' | 'no'>('all'),
    lifecycleState: new FormControl<FilterLifecycleState>('all'),
  });

  constructor() {
    this.loadTeacherProfile();
    this.loadCategories();
    this.loadDrafts();
    this.route.queryParamMap.subscribe((params) => {
      const view = params.get('view');
      this.activeListContext =
        view === 'drafts' || view === 'submitted' || view === 'attention' ? view : 'all';
    });
  }

  get missingRequiredFields(): string[] {
    if (!this.selectedDraftId) {
      return [];
    }

    const missing: string[] = [];
    if (!(this.draftForm.controls.title.value ?? '').trim()) {
      missing.push('title');
    }
    if (!(this.draftForm.controls.appointmentDate.value ?? '').trim()) {
      missing.push('appointmentDate');
    }
    if (!(this.draftForm.controls.category.value ?? '').trim()) {
      missing.push('category');
    }

    return missing;
  }

  get canSubmit(): boolean {
    return (
      Boolean(this.selectedDraftId) &&
      this.missingRequiredFields.length === 0 &&
      this.failedImageUploadCount === 0 &&
      !this.isSelectedDraftSubmitted
    );
  }

  get filteredDrafts(): AppointmentDraft[] {
    let filtered = this.drafts;
    if (this.activeListContext === 'drafts') {
      filtered = filtered.filter((draft) => draft.status === 'draft');
    } else if (this.activeListContext === 'submitted') {
      filtered = filtered.filter((draft) => draft.status === 'submitted');
    } else if (this.activeListContext === 'attention') {
      filtered = filtered.filter((draft) => this.isDraftMissingRequiredMetadata(draft));
    }

    const category = (this.filterForm.controls.category.value ?? '').trim();
    const status = this.filterForm.controls.status.value ?? 'all';
    const dateFrom = this.filterForm.controls.dateFrom.value ?? '';
    const dateTo = this.filterForm.controls.dateTo.value ?? '';
    const hasImages = this.filterForm.controls.hasImages.value ?? 'all';
    const lifecycleState = this.filterForm.controls.lifecycleState.value ?? 'all';

    return filtered.filter((draft) => {
      if (category && draft.category !== category) {
        return false;
      }
      if (status !== 'all' && draft.status !== status) {
        return false;
      }
      if (dateFrom && draft.appointmentDate < dateFrom) {
        return false;
      }
      if (dateTo && draft.appointmentDate > dateTo) {
        return false;
      }
      const hasDraftImages = (draft.images?.length ?? 0) > 0;
      if (hasImages === 'yes' && !hasDraftImages) {
        return false;
      }
      if (hasImages === 'no' && hasDraftImages) {
        return false;
      }
      if (lifecycleState === 'submitted' && draft.status !== 'submitted') {
        return false;
      }
      if (lifecycleState === 'needs_attention' && !this.isDraftMissingRequiredMetadata(draft)) {
        return false;
      }
      if (lifecycleState === 'ready_to_submit' && !this.isDraftReadyToSubmit(draft)) {
        return false;
      }
      return true;
    });
  }

  get activeListContextLabel(): string {
    if (this.activeListContext === 'drafts') {
      return 'Draft appointments';
    }
    if (this.activeListContext === 'submitted') {
      return 'Submitted appointments';
    }
    if (this.activeListContext === 'attention') {
      return 'Needs attention';
    }
    return '';
  }

  get hasActiveFilters(): boolean {
    const {
      category,
      status,
      dateFrom,
      dateTo,
      hasImages,
      lifecycleState,
    } = this.filterForm.getRawValue();
    return Boolean(category) || status !== 'all' || Boolean(dateFrom) || Boolean(dateTo) || hasImages !== 'all' || lifecycleState !== 'all';
  }

  get selectedDraft(): AppointmentDraft | undefined {
    return this.drafts.find((draft) => draft.id === this.selectedDraftId);
  }

  get isSelectedDraftSubmitted(): boolean {
    return this.selectedDraft?.status === 'submitted';
  }

  get selectedDraftImages(): DraftImage[] {
    if (!this.selectedDraftId) {
      return [];
    }

    return this.drafts.find((draft) => draft.id === this.selectedDraftId)?.images ?? [];
  }

  get failedImageUploadCount(): number {
    return this.imageUploadStatuses.reduce(
      (count, upload) => (upload.state === 'failed' ? count + 1 : count),
      0,
    );
  }

  signOut(): void {
    if (this.isSigningOut) {
      return;
    }

    this.isSigningOut = true;
    this.authApiService
      .signOut()
      .pipe(finalize(() => (this.isSigningOut = false)))
      .subscribe({
        next: () => {
          void this.router.navigateByUrl('/login');
        },
        error: () => {
          void this.router.navigateByUrl('/login');
        },
      });
  }

  openPrivacySummary(): void {
    void this.router.navigateByUrl('/privacy');
  }

  clearListContext(): void {
    void this.router.navigate(['/appointments'], {
      queryParams: {},
    });
  }

  resetFilters(): void {
    this.filterForm.reset({
      category: '',
      status: 'all',
      dateFrom: '',
      dateTo: '',
      hasImages: 'all',
      lifecycleState: 'all',
    });
  }

  toggleAdvancedFilters(event: Event): void {
    event.preventDefault();
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  createDraft(): void {
    this.draftCreatedMessage = '';
    this.draftSavedMessage = '';
    this.draftSubmitMessage = '';
    this.imageMessage = '';
    this.deleteMessage = '';
    this.draftForm.markAllAsTouched();

    if (this.draftForm.invalid || this.isCreatingDraft || this.isSavingDraft || this.isSelectedDraftSubmitted) {
      if (this.isSelectedDraftSubmitted) {
        this.draftSavedMessage = 'Submitted appointments are read-only.';
      }
      return;
    }

    const title = this.draftForm.controls.title.value ?? '';
    const appointmentDate = this.draftForm.controls.appointmentDate.value ?? '';
    const category = this.draftForm.controls.category.value ?? '';
    const notes = this.draftForm.controls.notes.value ?? '';

    if (this.selectedDraftId) {
      this.isSavingDraft = true;
      this.authApiService
        .updateDraft(this.selectedDraftId, { title, appointmentDate, category, notes })
        .pipe(finalize(() => (this.isSavingDraft = false)))
        .subscribe({
          next: (draft) => {
            this.draftSavedMessage = `Draft saved: ${draft.title}`;
            this.loadDrafts();
          },
        });
      return;
    }

    this.isCreatingDraft = true;
    this.authApiService
      .createDraft({ title, appointmentDate, category, notes })
      .pipe(finalize(() => (this.isCreatingDraft = false)))
      .subscribe({
        next: (draft) => {
          this.draftCreatedMessage = `Draft created: ${draft.title}`;
          this.draftForm.reset({ title: '', appointmentDate: '', category: '', notes: '' });
          this.loadDrafts();
        },
      });
  }

  openDraft(draftId: string): void {
    const draft = this.drafts.find((item) => item.id === draftId);
    if (!draft) {
      return;
    }

    this.selectedDraftId = draft.id;
    this.imageUploadStatuses = [];
    this.openedDraftMessage = `Opened draft ${draftId}`;
    this.draftSavedMessage = '';
    this.draftForm.setValue({
      title: draft.title,
      appointmentDate: draft.appointmentDate,
      category: draft.category,
      notes: draft.notes,
    });
  }

  submitDraft(): void {
    this.draftSubmitMessage = '';
    if (!this.selectedDraftId || this.isSubmittingDraft || !this.canSubmit) {
      return;
    }

    this.isSubmittingDraft = true;
    this.authApiService
      .submitDraft(this.selectedDraftId)
      .pipe(finalize(() => (this.isSubmittingDraft = false)))
      .subscribe({
        next: (response) => {
          this.replaceDraft(response.draft);
          this.draftSubmitMessage = response.submittedAt
            ? `Draft submitted at ${new Date(response.submittedAt).toLocaleString()}.`
            : 'Draft submitted.';
        },
        error: (error: unknown) => {
          const response = error as HttpErrorResponse;
          const payload = response.error as
            | { missingRequiredFields?: string[]; invalidImages?: Array<{ name?: string }> }
            | undefined;
          const missing = payload?.missingRequiredFields;
          const invalidImages = payload?.invalidImages;
          if (Array.isArray(missing) && missing.length > 0) {
            this.draftSubmitMessage = `Submission blocked: ${missing.join(', ')}`;
            return;
          }
          if (Array.isArray(invalidImages) && invalidImages.length > 0) {
            this.draftSubmitMessage = `Submission blocked: invalid images (${invalidImages
              .map((image) => image.name ?? 'unknown')
              .join(', ')})`;
            return;
          }

          this.draftSubmitMessage = 'Submission failed. Try again.';
        },
      });
  }

  onImageSelected(event: Event): void {
    if (!this.selectedDraftId) {
      return;
    }
    if (this.isSelectedDraftSubmitted) {
      this.imageMessage = 'Submitted appointments are read-only.';
      return;
    }

    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length === 0) {
      return;
    }
    this.processImageFiles(files);
    input.value = '';
  }

  onReplacementSelected(event: Event): void {
    if (this.isSelectedDraftSubmitted) {
      this.imageMessage = 'Submitted appointments are read-only.';
      return;
    }

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.replacingUploadId) {
      return;
    }

    this.processImageFiles([file], this.replacingUploadId);
    this.replacingUploadId = null;
    input.value = '';
  }

  removeFailedUpload(uploadId: string): void {
    this.imageUploadStatuses = this.imageUploadStatuses.filter((upload) => upload.id !== uploadId);
  }

  startReplaceFailedUpload(uploadId: string, fileInput: HTMLInputElement): void {
    if (this.isSelectedDraftSubmitted) {
      this.imageMessage = 'Submitted appointments are read-only.';
      return;
    }
    this.replacingUploadId = uploadId;
    fileInput.click();
  }

  removeImage(imageId: string): void {
    if (!this.selectedDraftId) {
      return;
    }
    if (this.isSelectedDraftSubmitted) {
      this.imageMessage = 'Submitted appointments are read-only.';
      return;
    }

    this.authApiService.removeImageFromDraft(this.selectedDraftId, imageId).subscribe({
      next: (draft) => {
        if (!draft) {
          const fallbackDraft = this.drafts.find((item) => item.id === this.selectedDraftId);
          if (!fallbackDraft) {
            this.imageMessage = 'Draft not found for image removal.';
            return;
          }

          this.replaceDraft({
            ...fallbackDraft,
            images: (fallbackDraft.images ?? []).filter((image) => image.id !== imageId),
          });
          this.imageMessage = 'Image removed.';
          return;
        }

        this.replaceDraft(draft);
        this.imageMessage = 'Image removed.';
      },
    });
  }

  deleteSelectedDraft(): void {
    this.deleteMessage = '';
    if (!this.selectedDraftId || this.isDeletingDraft) {
      return;
    }

    if (!globalThis.confirm('Delete this draft? This cannot be undone.')) {
      return;
    }

    const draftId = this.selectedDraftId;
    this.isDeletingDraft = true;
    this.authApiService
      .deleteDraft(draftId)
      .pipe(finalize(() => (this.isDeletingDraft = false)))
      .subscribe({
        next: (deleted) => {
          if (!deleted) {
            this.deleteMessage = 'Draft could not be deleted.';
            return;
          }

          this.drafts = this.drafts.filter((draft) => draft.id !== draftId);
          this.selectedDraftId = null;
          this.imageUploadStatuses = [];
          this.draftForm.reset({ title: '', appointmentDate: '', category: '', notes: '' });
          this.deleteMessage = 'Draft deleted.';
        },
        error: () => {
          this.deleteMessage = 'Draft deletion failed.';
        },
      });
  }

  private loadDrafts(): void {
    this.isLoadingDrafts = true;
    this.authApiService
      .listDrafts()
      .pipe(finalize(() => (this.isLoadingDrafts = false)))
      .subscribe({
        next: (drafts) => {
          this.drafts = drafts;
        },
        error: () => {
          this.drafts = [];
        },
      });
  }

  private replaceDraft(updatedDraft: AppointmentDraft): void {
    this.drafts = this.drafts.map((draft) => (draft.id === updatedDraft.id ? updatedDraft : draft));
  }

  private loadCategories(): void {
    this.authApiService.listCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: () => {
        this.categories = [];
      },
    });
  }

  private loadTeacherProfile(): void {
    this.authApiService.getTeacherProfile().subscribe({
      next: (profile) => {
        this.teacherDisplayName = profile.displayName;
      },
      error: () => {
        this.teacherDisplayName = 'Teacher Account';
      },
    });
  }

  private updateUploadStatus(uploadId: string, state: ImageUploadState, detail?: string): void {
    this.imageUploadStatuses = this.imageUploadStatuses.map((upload) =>
      upload.id === uploadId
        ? {
            ...upload,
            state,
            detail,
          }
        : upload,
    );
  }

  private processImageFiles(files: File[], replacingUploadId?: string): void {
    this.imageMessage = '';
    for (const file of files) {
      const uploadId = replacingUploadId ?? `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      if (!replacingUploadId) {
        this.imageUploadStatuses = [
          ...this.imageUploadStatuses,
          { id: uploadId, name: file.name, state: 'queued' },
        ];
      } else {
        this.imageUploadStatuses = this.imageUploadStatuses.map((upload) =>
          upload.id === uploadId ? { ...upload, name: file.name, state: 'queued', detail: '' } : upload,
        );
      }

      if (file.size > AppointmentsComponent.MAX_IMAGE_SIZE_BYTES) {
        this.updateUploadStatus(uploadId, 'failed', 'Maximum size is 2 MB.');
        this.imageMessage = 'Image is too large. Maximum size is 2 MB.';
        continue;
      }
      if (!AppointmentsComponent.ALLOWED_IMAGE_TYPES.has(file.type)) {
        this.updateUploadStatus(uploadId, 'failed', 'Unsupported format. Use JPEG, PNG, or WebP.');
        this.imageMessage = 'Unsupported image format. Use JPEG, PNG, or WebP.';
        continue;
      }

      this.updateUploadStatus(uploadId, 'uploading');
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = typeof reader.result === 'string' ? reader.result : '';
        if (!dataUrl) {
          this.updateUploadStatus(uploadId, 'failed', 'Image could not be loaded.');
          this.imageMessage = 'Image could not be loaded.';
          return;
        }

        this.authApiService
          .attachImageToDraft(this.selectedDraftId as string, {
            name: file.name,
            mimeType: file.type || 'image/*',
            dataUrl,
          })
          .subscribe({
            next: (draft) => {
              if (!draft) {
                const fallbackDraft = this.drafts.find((item) => item.id === this.selectedDraftId);
                if (!fallbackDraft) {
                  this.updateUploadStatus(uploadId, 'failed', 'Draft not found for image attach.');
                  this.imageMessage = 'Draft not found for image attach.';
                  return;
                }

                const appended: DraftImage = {
                  id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                  name: file.name,
                  mimeType: file.type || 'image/*',
                  dataUrl,
                  addedAt: new Date().toISOString(),
                };
                this.replaceDraft({
                  ...fallbackDraft,
                  images: [...(fallbackDraft.images ?? []), appended],
                });
                this.updateUploadStatus(uploadId, 'attached');
                this.imageMessage = `Attached image: ${file.name}`;
                return;
              }

              this.replaceDraft(draft);
              this.updateUploadStatus(uploadId, 'attached');
              this.imageMessage = `Attached image: ${file.name}`;
            },
            error: () => {
              this.updateUploadStatus(uploadId, 'failed', 'Attachment failed. Try again.');
              this.imageMessage = 'Image attachment failed.';
            },
          });
      };
      reader.readAsDataURL(file);
    }
  }

  private isDraftMissingRequiredMetadata(draft: AppointmentDraft): boolean {
    if (draft.status !== 'draft') {
      return false;
    }
    return !draft.title.trim() || !draft.appointmentDate.trim() || !draft.category.trim();
  }

  private isDraftReadyToSubmit(draft: AppointmentDraft): boolean {
    return draft.status === 'draft' && !this.isDraftMissingRequiredMetadata(draft);
  }
}
