import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface DashboardNavItem {
  label: string;
  path: string;
  fragment?: string;
}

interface ReleaseChangeItem {
  title: string;
  deliveredAt: string;
}

@Component({
  selector: 'app-dashboard-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  styleUrl: './dashboard-shell.component.css',
  template: `
    <main class="dashboard-shell">
      <aside id="teacher-sidebar" class="sidebar" [class.open]="isMenuOpen" aria-label="Teacher workspace menu">
        <div class="sidebar-header">
          <p class="kicker">School Chronicle</p>
          <h2>Teacher workspace</h2>
        </div>

        <nav aria-label="Primary">
          <ul class="menu-list">
            @for (item of navItems; track item.path) {
              <li>
                <a
                  [routerLink]="item.path"
                  [fragment]="item.fragment"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{ exact: true }"
                  (click)="isMenuOpen = false"
                >
                  {{ item.label }}
                </a>
              </li>
            }
          </ul>
        </nav>

        <section class="release-notes" aria-label="Latest delivered changes">
          <h3>Latest changes</h3>
          <ul class="release-notes-list">
            @for (change of latestChanges; track change.title) {
              <li>
                <span class="change-title">{{ change.title }}</span>
                <span class="change-date">{{ change.deliveredAt }}</span>
              </li>
            }
          </ul>
        </section>
      </aside>

      <div class="content">
        <header class="mobile-header">
          <button
            type="button"
            class="menu-toggle"
            (click)="toggleMenu()"
            [attr.aria-expanded]="isMenuOpen"
            aria-controls="teacher-sidebar"
          >
            {{ isMenuOpen ? 'Close menu' : 'Open menu' }}
          </button>
        </header>
        <router-outlet></router-outlet>
      </div>
    </main>
  `,
})
export class DashboardShellComponent {
  isMenuOpen = false;

  readonly navItems: DashboardNavItem[] = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Appointments', path: '/appointments' },
    { label: 'Contacts', path: '/contacts' },
    { label: 'Privacy', path: '/privacy' },
    { label: 'Help', path: '/help' },
  ];

  readonly latestChanges: ReleaseChangeItem[] = [
    { title: 'M2.11 Introduce neutral accessible color tokens', deliveredAt: 'Apr 2026' },
    { title: 'M2.10 Apply fixed chronicle layout independent of image count', deliveredAt: 'Apr 2026' },
    { title: 'M2.9 Generate chronicle .docx from manual appointment selection', deliveredAt: 'Apr 2026' },
  ];

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
