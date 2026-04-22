import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-workspace-placeholder',
  template: `
    <main class="placeholder-page">
      <section class="placeholder-card">
        <p class="kicker">Teacher workspace</p>
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
        <button type="button" class="ghost" (click)="goToAppointments()">
          Open appointments
        </button>
      </section>
    </main>
  `,
  styles: `
    .placeholder-page {
      max-width: 56rem;
      margin: 0 auto;
      padding: 1.5rem 1rem;
    }

    .placeholder-card {
      border: 1px solid var(--border);
      border-radius: 1rem;
      background: var(--surface);
      padding: 1rem;
      box-shadow: var(--shadow-soft);
    }

    .placeholder-card h2 {
      margin: 0.3rem 0 0.5rem;
    }

    .placeholder-card p {
      color: var(--text-muted);
      margin: 0.35rem 0;
    }

    .kicker {
      margin: 0;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.72rem;
      font-weight: 600;
    }

    .ghost {
      margin-top: 0.75rem;
      border: 1px solid var(--border);
      border-radius: 0.65rem;
      background: #fff;
      padding: 0.6rem 0.85rem;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
  `,
})
export class WorkspacePlaceholderComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  get title(): string {
    return this.route.snapshot.data['title'] ?? 'Workspace';
  }

  get description(): string {
    return (
      this.route.snapshot.data['description'] ??
      'This section is ready for the next pitch-focused implementation stories.'
    );
  }

  goToAppointments(): void {
    void this.router.navigateByUrl('/appointments');
  }
}
