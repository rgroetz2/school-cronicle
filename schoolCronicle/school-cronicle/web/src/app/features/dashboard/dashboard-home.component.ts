import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from '../../core/auth-api.service';

@Component({
  selector: 'app-dashboard-home',
  styleUrl: './dashboard-home.component.css',
  template: `
    <main class="dashboard-home">
      <header class="dashboard-header">
        <p class="kicker">Teacher dashboard</p>
        <h2>Focus for today</h2>
        <p class="intro">Start from the area that needs attention and jump directly into your appointment workflow.</p>
      </header>

      <section class="card-grid" aria-label="Dashboard summary cards">
        <button type="button" class="summary-card" (click)="openContext('drafts')" [disabled]="isLoading">
          <span class="card-title">Drafts</span>
          <strong class="card-value">{{ draftCount }}</strong>
          <span class="card-copy">Open drafts that are still in progress.</span>
        </button>

        <button type="button" class="summary-card" (click)="openContext('submitted')" [disabled]="isLoading">
          <span class="card-title">Submitted</span>
          <strong class="card-value">{{ submittedCount }}</strong>
          <span class="card-copy">Review appointments already submitted.</span>
        </button>

        <button type="button" class="summary-card" (click)="openContext('attention')" [disabled]="isLoading">
          <span class="card-title">Needs attention</span>
          <strong class="card-value">{{ needsAttentionCount }}</strong>
          <span class="card-copy">Drafts missing required metadata.</span>
        </button>
      </section>

      @if (isLoading) {
        <p class="state-pill">Loading dashboard metrics...</p>
      } @else if (hasNoAppointments) {
        <p class="state-pill">No appointments yet. Create your first draft from the Appointments menu.</p>
      }
    </main>
  `,
})
export class DashboardHomeComponent {
  private readonly authApiService = inject(AuthApiService);
  private readonly router = inject(Router);

  isLoading = false;
  draftCount = 0;
  submittedCount = 0;
  needsAttentionCount = 0;

  get hasNoAppointments(): boolean {
    return this.draftCount + this.submittedCount === 0;
  }

  constructor() {
    this.loadSummary();
  }

  openContext(context: 'drafts' | 'submitted' | 'attention'): void {
    void this.router.navigate(['/appointments'], { queryParams: { view: context } });
  }

  private loadSummary(): void {
    this.isLoading = true;
    this.authApiService.listDrafts().subscribe({
      next: (drafts) => {
        this.draftCount = drafts.filter((draft) => draft.status === 'draft').length;
        this.submittedCount = drafts.filter((draft) => draft.status === 'submitted').length;
        this.needsAttentionCount = drafts.filter((draft) => this.isMissingRequiredMetadata(draft)).length;
        this.isLoading = false;
      },
      error: () => {
        this.draftCount = 0;
        this.submittedCount = 0;
        this.needsAttentionCount = 0;
        this.isLoading = false;
      },
    });
  }

  private isMissingRequiredMetadata(draft: { title: string; appointmentDate: string; category: string; status: string }): boolean {
    if (draft.status !== 'draft') {
      return false;
    }
    return !draft.title.trim() || !draft.appointmentDate.trim() || !draft.category.trim();
  }
}
