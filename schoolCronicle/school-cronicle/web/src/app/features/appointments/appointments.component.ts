import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AppointmentDraft, AuthApiService, DraftImage } from '../../core/auth-api.service';

@Component({
  selector: 'app-appointments',
  imports: [ReactiveFormsModule],
  template: `
    <main>
      <h2>Appointments workspace</h2>
      <p>You are signed in.</p>

      <section aria-labelledby="draft-list-heading">
        <h3 id="draft-list-heading">Your drafts</h3>
        @if (isLoadingDrafts) {
          <p>Loading drafts...</p>
        } @else if (drafts.length === 0) {
          <p>No drafts yet. Create one below to get started.</p>
        } @else {
          <ul>
            @for (draft of drafts; track draft.id) {
              <li>
                <button type="button" (click)="openDraft(draft.id)">
                  Open draft: {{ draft.title }} ({{ draft.category }}) on {{ draft.appointmentDate }}
                </button>
              </li>
            }
          </ul>
        }
      </section>

      <section aria-labelledby="submit-readiness-heading">
        <h3 id="submit-readiness-heading">Submit readiness</h3>
        @if (!selectedDraftId) {
          <p>Select a draft to evaluate submit readiness.</p>
        }
        @if (missingRequiredFields.length > 0) {
          <p>Submission blocked. Missing metadata:</p>
          <ul>
            @for (field of missingRequiredFields; track field) {
              <li>{{ field }}</li>
            }
          </ul>
        } @else if (selectedDraftId) {
          <p>All required metadata is complete.</p>
        }
        <button type="button" (click)="submitDraft()" [disabled]="!canSubmit || isSubmittingDraft">
          {{ isSubmittingDraft ? 'Submitting...' : 'Submit draft' }}
        </button>
      </section>

      <section aria-labelledby="draft-images-heading">
        <h3 id="draft-images-heading">Attached images</h3>
        @if (!selectedDraftId) {
          <p>Select a draft to attach images.</p>
        } @else {
          <input type="file" accept="image/*" (change)="onImageSelected($event)" />
          @if (selectedDraftImages.length === 0) {
            <p>No images attached yet.</p>
          } @else {
            <ul>
              @for (image of selectedDraftImages; track image.id) {
                <li>
                  <img [src]="image.dataUrl" [alt]="image.name" width="64" height="64" />
                  <span>{{ image.name }}</span>
                  <button type="button" (click)="removeImage(image.id)">Remove</button>
                </li>
              }
            </ul>
          }
        }
      </section>

      <form [formGroup]="draftForm" (ngSubmit)="createDraft()" novalidate>
        <label for="draft-title">Title *</label>
        <input id="draft-title" formControlName="title" type="text" />
        @if (draftForm.controls.title.touched && draftForm.controls.title.invalid) {
          <p>Title is required.</p>
        }

        <label for="draft-date">Appointment date *</label>
        <input id="draft-date" formControlName="appointmentDate" type="date" />
        @if (draftForm.controls.appointmentDate.touched && draftForm.controls.appointmentDate.invalid) {
          <p>Appointment date is required.</p>
        }

        <label for="draft-category">Category *</label>
        <select id="draft-category" formControlName="category">
          <option value="">Select category</option>
          @for (category of categories; track category) {
            <option [value]="category">{{ category }}</option>
          }
        </select>
        @if (draftForm.controls.category.touched && draftForm.controls.category.invalid) {
          <p>Category is required.</p>
        }

        <label for="draft-notes">Notes</label>
        <textarea id="draft-notes" formControlName="notes"></textarea>

        <button type="submit" [disabled]="isCreatingDraft || isSavingDraft">
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
      </form>

      @if (draftCreatedMessage) {
        <p role="status">{{ draftCreatedMessage }}</p>
      }
      @if (openedDraftMessage) {
        <p role="status">{{ openedDraftMessage }}</p>
      }
      @if (draftSavedMessage) {
        <p role="status">{{ draftSavedMessage }}</p>
      }
      @if (draftSubmitMessage) {
        <p role="status">{{ draftSubmitMessage }}</p>
      }
      @if (imageMessage) {
        <p role="status">{{ imageMessage }}</p>
      }
      @if (deleteMessage) {
        <p role="status">{{ deleteMessage }}</p>
      }

      <button type="button" (click)="signOut()" [disabled]="isSigningOut">
        {{ isSigningOut ? 'Signing out...' : 'Sign out' }}
      </button>
      <button type="button" (click)="deleteSelectedDraft()" [disabled]="!selectedDraftId || isDeletingDraft">
        {{ isDeletingDraft ? 'Deleting draft...' : 'Delete selected draft' }}
      </button>
    </main>
  `,
})
export class AppointmentsComponent {
  private static readonly MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
  private readonly authApiService = inject(AuthApiService);
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
  selectedDraftId: string | null = null;
  categories: string[] = [];
  drafts: AppointmentDraft[] = [];

  readonly draftForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    appointmentDate: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
  });

  constructor() {
    this.loadCategories();
    this.loadDrafts();
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
    return Boolean(this.selectedDraftId) && this.missingRequiredFields.length === 0;
  }

  get selectedDraftImages(): DraftImage[] {
    if (!this.selectedDraftId) {
      return [];
    }

    return this.drafts.find((draft) => draft.id === this.selectedDraftId)?.images ?? [];
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
        next: () => {
          this.draftSubmitMessage = 'Draft is ready for submission.';
        },
        error: (error: unknown) => {
          const response = error as HttpErrorResponse;
          const missing = (response.error as { missingRequiredFields?: string[] } | undefined)
            ?.missingRequiredFields;
          if (Array.isArray(missing) && missing.length > 0) {
            this.draftSubmitMessage = `Submission blocked: ${missing.join(', ')}`;
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

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    if (file.size > AppointmentsComponent.MAX_IMAGE_SIZE_BYTES) {
      this.imageMessage = 'Image is too large. Maximum size is 2 MB.';
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) {
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
              this.imageMessage = `Attached image: ${file.name}`;
              return;
            }

            this.replaceDraft(draft);
            this.imageMessage = `Attached image: ${file.name}`;
          },
        });
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  removeImage(imageId: string): void {
    if (!this.selectedDraftId) {
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
}
