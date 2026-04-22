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
  draftCreatedMessage = '';

  readonly draftForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
  });

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
        },
      });
  }
}
