import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface DashboardNavItem {
  label: string;
  path: string;
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
    { label: 'Drafts', path: '/drafts' },
    { label: 'Submitted', path: '/submitted' },
    { label: 'Privacy', path: '/privacy' },
    { label: 'Help', path: '/help' },
  ];

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
