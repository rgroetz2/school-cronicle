import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

interface PrivacyCategory {
  title: string;
  summary: string;
}

@Component({
  selector: 'app-privacy-summary',
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
      </section>
    </main>
  `,
  styleUrl: './privacy-summary.component.css',
})
export class PrivacySummaryComponent {
  private readonly router = inject(Router);

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

  backToAppointments(): void {
    void this.router.navigateByUrl('/appointments');
  }
}
