import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import {
  AppointmentDraft,
  AuthApiService,
  DraftImage,
  SchoolContact,
  SchoolContactRole,
} from '../../core/auth-api.service';
import { PitchDemoModeService } from '../../core/pitch-demo-mode.service';
import { CrudActionBarComponent } from '../../shared/crud-action-bar.component';

type ImageUploadState = 'queued' | 'uploading' | 'attached' | 'failed';

interface ImageUploadStatus {
  id: string;
  name: string;
  state: ImageUploadState;
  detail?: string;
}

type FilterLifecycleState = 'all' | 'needs_attention' | 'ready_to_submit' | 'submitted';
type DemoStepId = 'navigation' | 'filtering' | 'draft-work' | 'submit-readiness' | 'fallback';

interface DemoStep {
  id: DemoStepId;
  title: string;
  timing: string;
  valueMessage: string;
  actionPrompt: string;
}

@Component({
  selector: 'app-appointments',
  imports: [ReactiveFormsModule, FormsModule, DatePipe, CrudActionBarComponent],
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
          @if (pitchDemoModeEnabled) {
            <button
              type="button"
              class="ghost"
              (click)="onResetPitchDemo()"
              [disabled]="isResettingDemoData"
              aria-label="Reset demo data to canonical seed"
            >
              {{ isResettingDemoData ? 'Resetting demo…' : 'Reset demo data' }}
            </button>
          }
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

          <section class="panel" aria-labelledby="appointments-list-heading">
          <h3 id="appointments-list-heading">Your appointments</h3>
          <p class="panel-copy">One unified list for draft and submitted appointments. Use "Create appointment" to add a new one.</p>
        <div class="filter-actions">
          <button type="button" class="primary" (click)="openCreateModal()">Create appointment</button>
          <button
            type="button"
            class="ghost"
            (click)="exportChronicle()"
            [disabled]="selectedChronicleAppointmentIds.length === 0 || isExportingChronicle"
          >
            {{ isExportingChronicle ? 'Exporting chronicle...' : 'Export chronicle (.docx)' }}
          </button>
        </div>
        @if (selectedChronicleAppointmentIds.length > 0) {
          <p class="state-pill">
            Chronicle selection: {{ selectedChronicleAppointmentIds.length }} selected
            <button type="button" class="ghost inline" (click)="clearChronicleSelection()">Clear</button>
          </p>
        }
        <div class="filter-panel" aria-label="Appointment filters">
          <h4>Filter list</h4>
          <form [formGroup]="filterForm">
            <div class="filter-grid">
              <label for="filter-search">Search</label>
              <input
                id="filter-search"
                type="search"
                formControlName="searchTerm"
                placeholder="Search title, notes, status, metadata"
              />

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

              <label for="filter-class-grade">Class/grade</label>
              <input id="filter-class-grade" type="text" formControlName="classGrade" />

              <label for="filter-guardian-name">Guardian name</label>
              <input id="filter-guardian-name" type="text" formControlName="guardianName" />

              <label for="filter-location">Location</label>
              <input id="filter-location" type="text" formControlName="location" />
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
          <p class="state-pill loading">Loading appointments...</p>
        } @else if (filteredDrafts.length === 0) {
          <p class="state-pill">
            {{ hasActiveFilters ? 'No appointments match current filters. Adjust or clear filters.' : 'No appointments yet. Create one below to get started.' }}
          </p>
        } @else {
          <div class="appointments-grid" role="table" aria-label="Appointments grid">
            <div class="grid-header" role="row">
              <span class="grid-cell grid-cell-select" aria-hidden="true"></span>
              <span class="grid-cell">Title</span>
              <span class="grid-cell">Category</span>
              <span class="grid-cell">Date</span>
              <span class="grid-cell">Status</span>
              <span class="grid-cell">Images</span>
              <span class="grid-cell">Last update</span>
            </div>
          <ul class="draft-list">
            @for (draft of filteredDrafts; track draft.id) {
              <li>
                <div
                  class="draft-button draft-grid-row"
                  role="button"
                  tabindex="0"
                  [attr.aria-pressed]="selectedDraftId === draft.id"
                  (click)="openDraft(draft.id)"
                  (keydown.enter)="openDraft(draft.id)"
                >
                  <span class="grid-cell grid-cell-select">
                    @if (isChronicleExportEligible(draft)) {
                      <input
                        type="checkbox"
                        [checked]="selectedChronicleAppointmentIds.includes(draft.id)"
                        (click)="$event.stopPropagation()"
                        (change)="toggleChronicleSelection(draft.id)"
                      />
                    } @else {
                      -
                    }
                  </span>
                  <span class="grid-cell">{{ draft.title }}</span>
                  <span class="grid-cell">{{ draft.category }}</span>
                  <span class="grid-cell">{{ draft.appointmentDate }}</span>
                  <span class="grid-cell">
                    {{ draft.status }}
                    @if (draft.editedAfterSubmitAt) {
                      (edited after submit)
                    }
                  </span>
                  <span class="grid-cell">{{ draft.images.length }}</span>
                  <span class="grid-cell">{{
                    (draft.editedAfterSubmitAt ? draft.editedAfterSubmitAt : draft.submittedAt ? draft.submittedAt : draft.createdAt)
                      | date: 'yyyy-MM-dd HH:mm'
                  }}</span>
                </div>
              </li>
            }
          </ul>
          </div>
        }
        </section>
        </section>

      </div>

      @if (isEditorModalOpen) {
        <div class="modal-backdrop" role="presentation" (click)="closeEditorModal()">
          <section
            class="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="editor-modal-title"
            (click)="$event.stopPropagation()"
            (keydown.enter)="$event.stopPropagation()"
          >
            <header class="modal-header">
              <h3 id="editor-modal-title">
                {{ selectedDraftId ? 'Edit appointment' : 'Create appointment' }}
              </h3>
              <button type="button" class="ghost inline" (click)="closeEditorModal()">Close</button>
            </header>

            <form [formGroup]="draftForm" (ngSubmit)="createDraft()" novalidate>
              @if (selectedDraft?.editedAfterSubmitAt) {
                <p class="state-pill">
                  Last edited after submit:
                  {{ selectedDraft?.editedAfterSubmitAt | date: 'yyyy-MM-dd HH:mm' }}
                  @if (selectedDraft?.editedAfterSubmitBy) {
                    by {{ selectedDraft?.editedAfterSubmitBy }}
                  }
                </p>
              }
                <label for="modal-draft-title">Title *</label>
                <input id="modal-draft-title" formControlName="title" type="text" />
                @if (draftForm.controls.title.touched && draftForm.controls.title.invalid) {
                  <p class="field-error">Title is required.</p>
                }

                <label for="modal-draft-date">Appointment date *</label>
                <input id="modal-draft-date" formControlName="appointmentDate" type="date" />
                @if (draftForm.controls.appointmentDate.touched && draftForm.controls.appointmentDate.invalid) {
                  <p class="field-error">Appointment date is required.</p>
                }

                <label for="modal-draft-category">Category *</label>
                <select id="modal-draft-category" formControlName="category">
                  <option value="">Select category</option>
                  @for (category of categories; track category) {
                    <option [value]="category">{{ category }}</option>
                  }
                </select>
                @if (draftForm.controls.category.touched && draftForm.controls.category.invalid) {
                  <p class="field-error">Category is required.</p>
                }

                <label for="modal-draft-notes">{{ isSpecialEventDraft ? 'Narrative description *' : 'Notes' }}</label>
                <textarea id="modal-draft-notes" formControlName="notes"></textarea>
                @if (isSpecialEventDraft && !(draftForm.controls.notes.value ?? '').trim()) {
                  <p class="field-error">Narrative description is required for special events.</p>
                }

                <label for="modal-draft-class-grade">Class/grade</label>
                <input id="modal-draft-class-grade" formControlName="classGrade" type="text" />

                <label for="modal-draft-guardian-name">Guardian name</label>
                <input id="modal-draft-guardian-name" formControlName="guardianName" type="text" />

                <label for="modal-draft-location">Location</label>
                <input id="modal-draft-location" formControlName="location" type="text" />

                <label for="modal-participant-select">Participants</label>
                <div class="form-actions">
                  <select
                    id="modal-participant-select"
                    [(ngModel)]="pendingParticipantContactId"
                    [ngModelOptions]="{ standalone: true }"
                  >
                    <option value="">Select participant</option>
                    @for (contact of availableParticipantContacts; track contact.id) {
                      <option [value]="contact.id">
                        {{ contact.name }} | {{ contact.role }} | {{ contact.email || '-' }} | {{ contact.phone || '-' }}
                      </option>
                    }
                  </select>
                  <button
                    type="button"
                    class="ghost"
                    (click)="addSelectedParticipant()"
                    [disabled]="!pendingParticipantContactId"
                  >
                    Add participant
                  </button>
                </div>
                @if (selectedParticipants.length > 0) {
                  <ul class="contact-list">
                    @for (participant of selectedParticipants; track participant.id) {
                      <li>
                        <button type="button" class="contact-button" (click)="removeParticipant(participant.id)">
                          Remove | {{ participant.name }} | {{ participant.role }} | {{ participant.email || '-' }} | {{ participant.phone || '-' }}
                        </button>
                      </li>
                    }
                  </ul>
                } @else {
                  <p class="state-pill">No participants selected.</p>
                }
                @if (participantLimitMessage) {
                  <p class="field-error">{{ participantLimitMessage }}</p>
                }

                <label for="modal-appointment-media">Optional media/documents (images)</label>
                <p class="state-pill">
                  Uploaded: {{ selectedDraftImages.length }}/5 | Printable: {{ printableImageCount }}/3
                </p>
                <input
                  id="modal-appointment-media"
                  type="file"
                  class="file-input"
                  accept="image/*"
                  multiple
                  [disabled]="!selectedDraftId"
                  (change)="onImageSelected($event)"
                />
                @if (!selectedDraftId) {
                  <p class="state-pill">Save the appointment once before uploading images.</p>
                }
                @if (selectedDraftImages.length === 0) {
                  <p class="state-pill">No media attached yet.</p>
                } @else {
                  <ul class="image-list">
                    @for (image of selectedDraftImages; track image.id) {
                      <li class="image-card">
                        <img [src]="image.dataUrl" [alt]="image.name" width="84" height="84" />
                        <span class="image-name">{{ image.name }}</span>
                        <button
                          type="button"
                          class="ghost"
                          (click)="togglePrintable(image.id)"
                        >
                          {{ image.printableInChronicle ? 'Unmark printable' : 'Mark printable' }}
                        </button>
                        <button type="button" class="ghost danger" (click)="removeImage(image.id)">Remove</button>
                      </li>
                    }
                  </ul>
                }

                <app-crud-action-bar
                  ariaLabel="Appointment CRUD actions"
                  [showCreate]="!selectedDraftId"
                  [showSave]="!!selectedDraftId"
                  [showDelete]="!!selectedDraftId"
                  [createDisabled]="isCreatingDraft || isSavingDraft"
                  [saveDisabled]="isCreatingDraft || isSavingDraft"
                  [deleteDisabled]="isDeletingDraft"
                  [createLabel]="isCreatingDraft ? 'Creating appointment...' : 'Create appointment'"
                  [saveLabel]="isSavingDraft ? 'Saving appointment...' : 'Save appointment'"
                  [deleteLabel]="isDeletingDraft ? 'Deleting...' : 'Delete appointment'"
                  (createClicked)="createDraft()"
                  (saveClicked)="createDraft()"
                  (deleteClicked)="deleteSelectedDraft()"
                >
                  @if (selectedDraftId) {
                    <button
                      crud-secondary
                      type="button"
                      class="ghost"
                      (click)="submitDraft()"
                      [disabled]="!canSubmit || isSubmittingDraft"
                    >
                      {{ isSubmittingDraft ? 'Submitting...' : 'Submit appointment' }}
                    </button>
                  }
                </app-crud-action-bar>
              </form>
          </section>
        </div>
      }

    </main>
  `,
})
export class AppointmentsComponent {
  private static readonly MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
  private static readonly ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
  private static readonly MAX_PARTICIPANTS_PER_APPOINTMENT = 3;
  private readonly authApiService = inject(AuthApiService);
  private readonly pitchDemoModeService = inject(PitchDemoModeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isSigningOut = false;
  isCreatingDraft = false;
  isSavingDraft = false;
  isSubmittingDraft = false;
  isDeletingDraft = false;
  isExportingChronicle = false;
  isLoadingDrafts = false;
  isLoadingContacts = false;
  isSavingContact = false;
  isEditorModalOpen = false;
  draftCreatedMessage = '';
  openedDraftMessage = '';
  draftSavedMessage = '';
  draftSubmitMessage = '';
  imageMessage = '';
  deleteMessage = '';
  demoResetMessage = '';
  contactSavedMessage = '';
  isResettingDemoData = false;
  showAdvancedFilters = false;
  imageUploadStatuses: ImageUploadStatus[] = [];
  replacingUploadId: string | null = null;
  selectedDraftId: string | null = null;
  pendingParticipantContactId = '';
  selectedParticipantContactIds: string[] = [];
  participantLimitMessage = '';
  selectedChronicleAppointmentIds: string[] = [];
  categories: string[] = [];
  drafts: AppointmentDraft[] = [];
  contacts: SchoolContact[] = [];
  selectedContactId: string | null = null;
  readonly contactRoleOptions: SchoolContactRole[] = this.authApiService.listContactRoles();
  teacherDisplayName = 'Teacher Account';
  activeListContext: 'all' | 'drafts' | 'submitted' | 'attention' = 'all';
  readonly demoPathTargetDuration = '6m 45s';
  readonly demoPathSteps: DemoStep[] = [
    {
      id: 'navigation',
      title: '1) Navigate from dashboard to workspace',
      timing: '1m 10s',
      actionPrompt: 'Open Appointments and orient the audience to list, detail, and media zones.',
      valueMessage: 'Teachers immediately see where to act next without hunting through menus.',
    },
    {
      id: 'filtering',
      title: '2) Apply filters to narrow focus',
      timing: '1m 30s',
      actionPrompt: 'Use category/status/metadata filters to reduce the list to relevant records.',
      valueMessage: 'Fast filtering reduces cognitive load and surfaces the right appointment quickly.',
    },
    {
      id: 'draft-work',
      title: '3) Open and refine a draft',
      timing: '2m 00s',
      actionPrompt: 'Open one draft, review optional metadata, and show editability for in-progress work.',
      valueMessage: 'Structured draft editing captures context early while keeping workflow flexible.',
    },
    {
      id: 'submit-readiness',
      title: '4) Confirm submit readiness',
      timing: '1m 20s',
      actionPrompt: 'Use the readiness panel to show required fields and submission confidence.',
      valueMessage: 'Clear readiness signals prevent bad submissions and reduce downstream rework.',
    },
    {
      id: 'fallback',
      title: '5) Recovery / skip path',
      timing: '0m 45s',
      actionPrompt: 'If a step fails live, reset demo data and continue from the next scripted point.',
      valueMessage: 'Presenter stays in control and keeps the narrative predictable under time pressure.',
    },
  ];

  readonly draftForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    appointmentDate: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
    classGrade: new FormControl(''),
    guardianName: new FormControl(''),
    location: new FormControl(''),
  });

  readonly filterForm = new FormGroup({
    searchTerm: new FormControl(''),
    category: new FormControl(''),
    status: new FormControl<'all' | 'draft' | 'submitted'>('all'),
    dateFrom: new FormControl(''),
    dateTo: new FormControl(''),
    hasImages: new FormControl<'all' | 'yes' | 'no'>('all'),
    lifecycleState: new FormControl<FilterLifecycleState>('all'),
    classGrade: new FormControl(''),
    guardianName: new FormControl(''),
    location: new FormControl(''),
  });

  readonly contactForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    role: new FormControl<SchoolContactRole | ''>('', [Validators.required]),
    email: new FormControl('', [Validators.email]),
    phone: new FormControl(''),
  });

  get pitchDemoModeEnabled(): boolean {
    return this.pitchDemoModeService.isEnabled();
  }

  get completedDemoStepsCount(): number {
    return this.demoPathSteps.filter((step) => step.id !== 'fallback' && this.isDemoStepDone(step.id)).length;
  }

  constructor() {
    this.loadTeacherProfile();
    this.loadCategories();
    this.loadDrafts();
    this.loadContacts();
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
    if ((this.draftForm.controls.category.value ?? '').trim() === 'special_event' && !(this.draftForm.controls.notes.value ?? '').trim()) {
      missing.push('notes');
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
    const searchTerm = (this.filterForm.controls.searchTerm.value ?? '').trim().toLowerCase();
    const dateFrom = this.filterForm.controls.dateFrom.value ?? '';
    const dateTo = this.filterForm.controls.dateTo.value ?? '';
    const hasImages = this.filterForm.controls.hasImages.value ?? 'all';
    const lifecycleState = this.filterForm.controls.lifecycleState.value ?? 'all';
    const classGradeFilter = (this.filterForm.controls.classGrade.value ?? '').trim().toLowerCase();
    const guardianNameFilter = (this.filterForm.controls.guardianName.value ?? '').trim().toLowerCase();
    const locationFilter = (this.filterForm.controls.location.value ?? '').trim().toLowerCase();

    return filtered.filter((draft) => {
      if (searchTerm) {
        const searchableContent = [
          draft.title,
          draft.notes,
          draft.category,
          draft.appointmentDate,
          draft.status,
          draft.classGrade ?? '',
          draft.guardianName ?? '',
          draft.location ?? '',
          ...(draft.participants ?? []).map((participant) => `${participant.name} ${participant.role}`),
        ]
          .join(' ')
          .toLowerCase();
        if (!searchableContent.includes(searchTerm)) {
          return false;
        }
      }
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
      const classGrade = (draft.classGrade ?? '').trim().toLowerCase();
      if (classGradeFilter && !classGrade.includes(classGradeFilter)) {
        return false;
      }
      const guardianName = (draft.guardianName ?? '').trim().toLowerCase();
      if (guardianNameFilter && !guardianName.includes(guardianNameFilter)) {
        return false;
      }
      const location = (draft.location ?? '').trim().toLowerCase();
      if (locationFilter && !location.includes(locationFilter)) {
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
      searchTerm,
      status,
      dateFrom,
      dateTo,
      hasImages,
      lifecycleState,
      classGrade,
      guardianName,
      location,
    } = this.filterForm.getRawValue();
    return (
      Boolean(searchTerm) ||
      Boolean(category) ||
      status !== 'all' ||
      Boolean(dateFrom) ||
      Boolean(dateTo) ||
      hasImages !== 'all' ||
      lifecycleState !== 'all' ||
      Boolean(classGrade) ||
      Boolean(guardianName) ||
      Boolean(location)
    );
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

  get printableImageCount(): number {
    return this.selectedDraftImages.filter((image) => image.printableInChronicle).length;
  }
  get isSpecialEventDraft(): boolean {
    return (this.draftForm.controls.category.value ?? '').trim() === 'special_event';
  }

  get availableParticipantContacts(): SchoolContact[] {
    return this.contacts.filter((contact) => !this.selectedParticipantContactIds.includes(contact.id));
  }

  get selectedParticipants(): SchoolContact[] {
    if (this.selectedParticipantContactIds.length === 0) {
      return [];
    }
    return this.selectedParticipantContactIds
      .map((contactId) => this.contacts.find((contact) => contact.id === contactId))
      .filter((contact): contact is SchoolContact => Boolean(contact));
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

  onResetPitchDemo(): void {
    this.demoResetMessage = '';
    this.draftCreatedMessage = '';
    this.draftSavedMessage = '';
    this.draftSubmitMessage = '';
    this.imageMessage = '';
    this.deleteMessage = '';
    if (this.isResettingDemoData) {
      return;
    }

    this.isResettingDemoData = true;
    this.authApiService
      .resetPitchDemoData()
      .pipe(finalize(() => (this.isResettingDemoData = false)))
      .subscribe({
        next: (result) => {
          if (!this.authApiService.usesDummyClientStore()) {
            this.demoResetMessage =
              'Demo reset only applies to the in-browser demo store. API sessions are unchanged—use local demo sign-in to restore seed data.';
            return;
          }
          if (result.draftCount === 0) {
            this.demoResetMessage = 'Demo reset completed but no seed rows were applied.';
            return;
          }

          this.selectedDraftId = null;
          this.imageUploadStatuses = [];
          this.draftForm.reset({
            title: '',
            appointmentDate: '',
            category: '',
            notes: '',
            classGrade: '',
            guardianName: '',
            location: '',
          });
          this.loadDrafts();
          this.loadTeacherProfile();
          this.demoResetMessage = `Demo dataset ${result.version} restored (${result.draftCount} appointments).`;
        },
      });
  }

  isDemoStepDone(stepId: DemoStepId): boolean {
    if (stepId === 'navigation') {
      return this.activeListContext !== 'all';
    }
    if (stepId === 'filtering') {
      return this.hasActiveFilters;
    }
    if (stepId === 'draft-work') {
      return Boolean(this.selectedDraftId);
    }
    if (stepId === 'submit-readiness') {
      return Boolean(this.selectedDraftId) && this.missingRequiredFields.length === 0 && this.failedImageUploadCount === 0;
    }
    return false;
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
      searchTerm: '',
      category: '',
      status: 'all',
      dateFrom: '',
      dateTo: '',
      hasImages: 'all',
      lifecycleState: 'all',
      classGrade: '',
      guardianName: '',
      location: '',
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

    if (this.draftForm.invalid || this.isCreatingDraft || this.isSavingDraft) {
      return;
    }

    const title = this.draftForm.controls.title.value ?? '';
    const appointmentDate = this.draftForm.controls.appointmentDate.value ?? '';
    const category = this.draftForm.controls.category.value ?? '';
    const notes = this.draftForm.controls.notes.value ?? '';
    const classGrade = this.draftForm.controls.classGrade.value ?? '';
    const guardianName = this.draftForm.controls.guardianName.value ?? '';
    const location = this.draftForm.controls.location.value ?? '';

    if (category.trim() === 'special_event' && !notes.trim()) {
      this.draftSavedMessage = 'Narrative description is required for special events.';
      return;
    }

    if (this.selectedDraftId) {
      this.isSavingDraft = true;
      this.authApiService
        .updateDraft(this.selectedDraftId, {
          title,
          appointmentDate,
          category,
          notes,
          classGrade,
          guardianName,
          location,
          participantContactIds: this.selectedParticipantContactIds,
        })
        .pipe(finalize(() => (this.isSavingDraft = false)))
        .subscribe({
          next: (draft) => {
            this.draftSavedMessage = `Draft saved: ${draft.title}`;
            this.loadDrafts();
          this.closeEditorModal();
          },
        });
      return;
    }

    this.isCreatingDraft = true;
    this.authApiService
      .createDraft({
        title,
        appointmentDate,
        category,
        notes,
        classGrade,
        guardianName,
        location,
        participantContactIds: this.selectedParticipantContactIds,
      })
      .pipe(finalize(() => (this.isCreatingDraft = false)))
      .subscribe({
        next: (draft) => {
          this.draftCreatedMessage = `Draft created: ${draft.title}`;
          this.draftForm.reset({
            title: '',
            appointmentDate: '',
            category: '',
            notes: '',
            classGrade: '',
            guardianName: '',
            location: '',
          });
          this.loadDrafts();
          this.closeEditorModal();
        },
      });
  }

  openDraft(draftId: string): void {
    const draft = this.drafts.find((item) => item.id === draftId);
    if (!draft) {
      return;
    }

    this.selectedDraftId = draft.id;
    this.selectedParticipantContactIds = (draft.participants ?? []).map((participant) => participant.contactId);
    this.pendingParticipantContactId = '';
    this.participantLimitMessage = '';
    this.imageUploadStatuses = [];
    this.openedDraftMessage = `Opened appointment ${draftId}`;
    this.draftSavedMessage = '';
    this.draftForm.setValue({
      title: draft.title,
      appointmentDate: draft.appointmentDate,
      category: draft.category,
      notes: draft.notes,
      classGrade: draft.classGrade ?? '',
      guardianName: draft.guardianName ?? '',
      location: draft.location ?? '',
    });
    this.isEditorModalOpen = true;
  }

  openCreateModal(): void {
    this.selectedDraftId = null;
    this.selectedParticipantContactIds = [];
    this.pendingParticipantContactId = '';
    this.participantLimitMessage = '';
    this.imageUploadStatuses = [];
    this.draftForm.reset({
      title: '',
      appointmentDate: '',
      category: '',
      notes: '',
      classGrade: '',
      guardianName: '',
      location: '',
    });
    this.isEditorModalOpen = true;
  }

  closeEditorModal(): void {
    this.isEditorModalOpen = false;
  }

  addSelectedParticipant(): void {
    const contactId = this.pendingParticipantContactId.trim();
    if (!contactId) {
      return;
    }
    this.participantLimitMessage = '';
    if (this.selectedParticipantContactIds.includes(contactId)) {
      this.pendingParticipantContactId = '';
      return;
    }
    if (this.selectedParticipantContactIds.length >= AppointmentsComponent.MAX_PARTICIPANTS_PER_APPOINTMENT) {
      this.participantLimitMessage = `Maximum ${AppointmentsComponent.MAX_PARTICIPANTS_PER_APPOINTMENT} participants per appointment.`;
      return;
    }
    this.selectedParticipantContactIds = [...this.selectedParticipantContactIds, contactId];
    this.pendingParticipantContactId = '';
  }

  removeParticipant(contactId: string): void {
    this.participantLimitMessage = '';
    this.selectedParticipantContactIds = this.selectedParticipantContactIds.filter((id) => id !== contactId);
  }

  formatParticipantSummary(draft: AppointmentDraft): string {
    const participants = draft.participants ?? [];
    if (participants.length <= 2) {
      return participants.map((participant) => participant.name).join(', ');
    }
    const firstTwo = participants.slice(0, 2).map((participant) => participant.name).join(', ');
    return `${firstTwo} +${participants.length - 2}`;
  }

  isChronicleExportEligible(draft: AppointmentDraft): boolean {
    return draft.status === 'submitted' || draft.chronicleExportEligible === true;
  }

  toggleChronicleSelection(draftId: string): void {
    if (this.selectedChronicleAppointmentIds.includes(draftId)) {
      this.selectedChronicleAppointmentIds = this.selectedChronicleAppointmentIds.filter((id) => id !== draftId);
      return;
    }
    this.selectedChronicleAppointmentIds = [...this.selectedChronicleAppointmentIds, draftId];
  }

  clearChronicleSelection(): void {
    this.selectedChronicleAppointmentIds = [];
  }

  exportChronicle(): void {
    if (this.selectedChronicleAppointmentIds.length === 0 || this.isExportingChronicle) {
      return;
    }
    this.isExportingChronicle = true;
    this.draftSavedMessage = '';
    this.authApiService
      .exportChronicle(this.selectedChronicleAppointmentIds)
      .pipe(finalize(() => (this.isExportingChronicle = false)))
      .subscribe({
        next: (artifact) => {
          const byteCharacters = globalThis.atob(artifact.base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let index = 0; index < byteCharacters.length; index += 1) {
            byteNumbers[index] = byteCharacters.charCodeAt(index);
          }
          const blob = new Blob([new Uint8Array(byteNumbers)], { type: artifact.mimeType });
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = artifact.fileName;
          anchor.click();
          URL.revokeObjectURL(url);
          this.draftSavedMessage = `Chronicle exported: ${artifact.fileName}`;
        },
        error: () => {
          this.draftSavedMessage = 'Chronicle export failed.';
        },
      });
  }

  saveContact(): void {
    this.contactSavedMessage = '';
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
          this.contactSavedMessage = this.selectedContactId
            ? `Contact updated: ${contact.name}`
            : `Contact created: ${contact.name}`;
          this.clearContactSelection();
          this.loadContacts();
        },
        error: () => {
          this.contactSavedMessage = 'Contact save failed.';
        },
      });
  }

  openContactForEdit(contactId: string): void {
    const contact = this.contacts.find((entry) => entry.id === contactId);
    if (!contact) {
      return;
    }
    this.selectedContactId = contact.id;
    this.contactForm.setValue({
      name: contact.name,
      role: contact.role,
      email: contact.email ?? '',
      phone: contact.phone ?? '',
    });
  }

  clearContactSelection(): void {
    this.selectedContactId = null;
    this.contactForm.reset({
      name: '',
      role: '',
      email: '',
      phone: '',
    });
  }

  refreshContacts(): void {
    this.loadContacts();
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
      this.imageMessage = 'Save the appointment once before uploading images.';
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

  togglePrintable(imageId: string): void {
    if (!this.selectedDraftId) {
      return;
    }
    const image = this.selectedDraftImages.find((entry) => entry.id === imageId);
    if (!image) {
      return;
    }
    if (!image.printableInChronicle && this.printableImageCount >= 3) {
      this.imageMessage = 'A maximum of 3 images can be marked printable.';
      return;
    }
    this.authApiService.setImagePrintable(this.selectedDraftId, imageId, !image.printableInChronicle).subscribe({
      next: (draft) => {
        if (draft) {
          this.replaceDraft(draft);
          this.imageMessage = draft.images.find((entry) => entry.id === imageId)?.printableInChronicle
            ? 'Image marked printable.'
            : 'Image unmarked printable.';
        }
      },
      error: () => {
        this.imageMessage = 'Printable selection update failed.';
      },
    });
  }

  deleteSelectedDraft(): void {
    this.deleteMessage = '';
    if (!this.selectedDraftId || this.isDeletingDraft) {
      return;
    }

    if (!globalThis.confirm('Delete this appointment? This cannot be undone.')) {
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
            this.deleteMessage = 'Appointment could not be deleted.';
            return;
          }

          this.drafts = this.drafts.filter((draft) => draft.id !== draftId);
          this.selectedDraftId = null;
          this.imageUploadStatuses = [];
          this.draftForm.reset({
            title: '',
            appointmentDate: '',
            category: '',
            notes: '',
            classGrade: '',
            guardianName: '',
            location: '',
          });
          this.deleteMessage = 'Appointment deleted.';
        },
        error: () => {
          this.deleteMessage = 'Appointment deletion failed.';
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
      if (this.selectedDraftImages.length >= 5) {
        this.updateUploadStatus(uploadId, 'failed', 'Maximum 5 images per appointment.');
        this.imageMessage = 'A maximum of 5 images can be uploaded per appointment.';
        continue;
      }
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
