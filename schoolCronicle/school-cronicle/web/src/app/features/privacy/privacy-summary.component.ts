import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../../core/auth-api.service';

interface PrivacyCategory {
  title: string;
  summary: string;
}

@Component({
  selector: 'app-privacy-summary',
  imports: [ReactiveFormsModule],
  template: `
    <main class="privacy-page">
      <section class="privacy-card" aria-labelledby="privacy-heading">
        <header class="privacy-header">
          <div>
            <p class="kicker">School Chronicle</p>
            <h2 id="privacy-heading">Privacy data category summary</h2>
            <p class="intro">
              We process only the categories needed to support school chronicle workflows and accountability.
            </p>
          </div>
          <button type="button" class="ghost" (click)="backToAppointments()">Back to appointments</button>
        </header>

        <ul class="category-list" aria-label="Personal data categories">
          @for (category of categories; track category.title) {
            <li class="category-card">
              <h3>{{ category.title }}</h3>
              <p>{{ category.summary }}</p>
            </li>
          }
        </ul>

        <section class="profile-section" aria-labelledby="profile-corrections-heading">
          <h3 id="profile-corrections-heading">Profile metadata corrections</h3>
          <p class="intro">Update editable profile details so your account information stays accurate.</p>

          <form class="profile-form" [formGroup]="profileForm" (ngSubmit)="saveProfile()">
            <label for="displayName">Display name *</label>
            <input id="displayName" formControlName="displayName" type="text" />
            @if (profileForm.controls.displayName.touched && profileForm.controls.displayName.invalid) {
              <p class="field-error">Display name is required.</p>
            }

            <label for="contactEmail">Contact email *</label>
            <input id="contactEmail" formControlName="contactEmail" type="email" />
            @if (profileForm.controls.contactEmail.touched && profileForm.controls.contactEmail.invalid) {
              <p class="field-error">Enter a valid contact email.</p>
            }

            <button type="submit" class="ghost" [disabled]="isSavingProfile">
              {{ isSavingProfile ? 'Saving...' : 'Save profile corrections' }}
            </button>
          </form>

          @if (profileMessage) {
            <p class="intro" role="status">{{ profileMessage }}</p>
          }
        </section>

        <section class="profile-section" aria-labelledby="privacy-rights-heading">
          <h3 id="privacy-rights-heading">Erasure and restriction request path</h3>
          <p class="intro">
            To request erasure or restriction, contact your school privacy office with your name, school account
            email, and the data right you want to invoke.
          </p>
          <p class="intro">
            Contact: <strong>School Privacy Office</strong> -
            <a href="mailto:privacy@school.local">privacy@school.local</a>
          </p>
          <p class="intro">
            Process: We record your initiation request and route it to the designated school process manager for
            verification and next steps.
          </p>
          <div class="rights-actions">
            <button type="button" class="ghost" (click)="initiatePrivacyRequest('erasure')">
              Initiate erasure request
            </button>
            <button type="button" class="ghost" (click)="initiatePrivacyRequest('restriction')">
              Initiate restriction request
            </button>
          </div>
          @if (privacyRequestMessage) {
            <p class="intro" role="status">{{ privacyRequestMessage }}</p>
          }
        </section>
      </section>
    </main>
  `,
  styleUrl: './privacy-summary.component.css',
})
export class PrivacySummaryComponent {
  private readonly authApiService = inject(AuthApiService);
  private readonly router = inject(Router);
  isSavingProfile = false;
  profileMessage = '';
  privacyRequestMessage = '';

  readonly profileForm = new FormGroup({
    displayName: new FormControl('', [Validators.required]),
    contactEmail: new FormControl('', [Validators.required, Validators.email]),
  });

  readonly categories: PrivacyCategory[] = [
    {
      title: 'Account and identity data',
      summary:
        'Your school email and teacher identifier are used to verify access and link your actions to your account.',
    },
    {
      title: 'Appointment metadata',
      summary:
        'Draft and submitted appointment details such as title, date, category, and notes are processed to manage school chronicle entries.',
    },
    {
      title: 'Image attachments',
      summary:
        'Optional image files added to appointments are processed for validation, preview, and appointment context.',
    },
    {
      title: 'Operational activity records',
      summary:
        'Timestamps and status changes (for example draft and submitted states) are processed to keep records accurate and traceable.',
    },
  ];

  constructor() {
    this.authApiService.getTeacherProfile().subscribe({
      next: (profile) => {
        this.profileForm.setValue({
          displayName: profile.displayName,
          contactEmail: profile.contactEmail,
        });
      },
    });
  }

  backToAppointments(): void {
    void this.router.navigateByUrl('/appointments');
  }

  saveProfile(): void {
    this.profileMessage = '';
    this.profileForm.markAllAsTouched();
    if (this.profileForm.invalid || this.isSavingProfile) {
      return;
    }

    this.isSavingProfile = true;
    this.authApiService
      .updateTeacherProfile({
        displayName: this.profileForm.controls.displayName.value ?? '',
        contactEmail: this.profileForm.controls.contactEmail.value ?? '',
      })
      .subscribe({
        next: (profile) => {
          this.isSavingProfile = false;
          this.profileForm.setValue({
            displayName: profile.displayName,
            contactEmail: profile.contactEmail,
          });
          this.profileMessage = 'Profile corrections saved.';
        },
        error: () => {
          this.isSavingProfile = false;
          this.profileMessage = 'Profile correction failed. Try again.';
        },
      });
  }

  initiatePrivacyRequest(type: 'erasure' | 'restriction'): void {
    this.privacyRequestMessage = '';
    this.authApiService.invokePrivacyRequest(type).subscribe({
      next: (event) => {
        const label = type === 'erasure' ? 'Erasure' : 'Restriction';
        this.privacyRequestMessage = `${label} request initiation recorded at ${new Date(
          event.initiatedAt,
        ).toLocaleString()} (reference: ${event.id}).`;
      },
      error: () => {
        this.privacyRequestMessage = 'Request initiation could not be recorded. Contact privacy@school.local.';
      },
    });
  }
}
