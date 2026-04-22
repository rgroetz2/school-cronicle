import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthApiService } from '../../core/auth-api.service';

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
        <input id="draft-category" formControlName="category" type="text" />
        @if (draftForm.controls.category.touched && draftForm.controls.category.invalid) {
          <p>Category is required.</p>
        }

        <label for="draft-notes">Notes</label>
        <textarea id="draft-notes" formControlName="notes"></textarea>

        <button type="submit" [disabled]="isCreatingDraft">
          {{ isCreatingDraft ? 'Creating draft...' : 'Create draft' }}
        </button>
      </form>

      @if (draftCreatedMessage) {
        <p role="status">{{ draftCreatedMessage }}</p>
      }
      @if (openedDraftMessage) {
        <p role="status">{{ openedDraftMessage }}</p>
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
  isLoadingDrafts = false;
  draftCreatedMessage = '';
  openedDraftMessage = '';
  drafts: Array<{ id: string; title: string; category: string }> = [];

  readonly draftForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
  });

  constructor() {
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
    this.draftForm.markAllAsTouched();

    if (this.draftForm.invalid || this.isCreatingDraft) {
      return;
    }

    const title = this.draftForm.controls.title.value ?? '';
    const category = this.draftForm.controls.category.value ?? '';
    const notes = this.draftForm.controls.notes.value ?? '';

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
    this.openedDraftMessage = `Opened draft ${draftId}`;
  }

  private loadDrafts(): void {
    this.isLoadingDrafts = true;
    this.authApiService
      .listDrafts()
      .pipe(finalize(() => (this.isLoadingDrafts = false)))
      .subscribe({
        next: (drafts) => {
          this.drafts = drafts.map((draft) => ({
            id: draft.id,
            title: draft.title,
            category: draft.category,
          }));
        },
        error: () => {
          this.drafts = [];
        },
      });
  }
}
