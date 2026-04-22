import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AppointmentDraft, AuthApiService } from '../../core/auth-api.service';

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
                  Open draft: {{ draft.title }} ({{ draft.category }})
                </button>
              </li>
            }
          </ul>
        }
      </section>

      <form [formGroup]="draftForm" (ngSubmit)="createDraft()" novalidate>
        <label for="draft-title">Title *</label>
        <input id="draft-title" formControlName="title" type="text" />
        @if (draftForm.controls.title.touched && draftForm.controls.title.invalid) {
          <p>Title is required.</p>
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

      <button type="button" (click)="signOut()" [disabled]="isSigningOut">
        {{ isSigningOut ? 'Signing out...' : 'Sign out' }}
      </button>
    </main>
  `,
})
export class AppointmentsComponent {
  private readonly authApiService = inject(AuthApiService);
  private readonly router = inject(Router);

  isSigningOut = false;
  isCreatingDraft = false;
  isSavingDraft = false;
  isLoadingDrafts = false;
  draftCreatedMessage = '';
  openedDraftMessage = '';
  draftSavedMessage = '';
  selectedDraftId: string | null = null;
  categories: string[] = [];
  drafts: AppointmentDraft[] = [];

  readonly draftForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
  });

  constructor() {
    this.loadCategories();
    this.loadDrafts();
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
    this.draftForm.markAllAsTouched();

    if (this.draftForm.invalid || this.isCreatingDraft || this.isSavingDraft) {
      return;
    }

    const title = this.draftForm.controls.title.value ?? '';
    const category = this.draftForm.controls.category.value ?? '';
    const notes = this.draftForm.controls.notes.value ?? '';

    if (this.selectedDraftId) {
      this.isSavingDraft = true;
      this.authApiService
        .updateDraft(this.selectedDraftId, { title, category, notes })
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
      .createDraft({ title, category, notes })
      .pipe(finalize(() => (this.isCreatingDraft = false)))
      .subscribe({
        next: (draft) => {
          this.draftCreatedMessage = `Draft created: ${draft.title}`;
          this.draftForm.reset({ title: '', category: '', notes: '' });
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
      category: draft.category,
      notes: draft.notes,
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
