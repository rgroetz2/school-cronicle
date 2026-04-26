import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthApiService, UserRole } from '../../core/auth-api.service';
import { PitchDemoModeService } from '../../core/pitch-demo-mode.service';

interface DashboardNavItem {
  label: string;
  path: string;
  fragment?: string;
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
            @if (isAdmin) {
              <li>
                <a
                  [routerLink]="adminNavItem.path"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{ exact: true }"
                  (click)="isMenuOpen = false"
                >
                  {{ adminNavItem.label }}
                </a>
              </li>
            }
          </ul>
        </nav>
        <section class="menu-actions" aria-label="Workspace quick actions">
          @if (pitchDemoModeEnabled && isAdmin) {
            <button type="button" class="menu-action-button" (click)="resetDemoData()" [disabled]="isResettingDemoData">
              {{ isResettingDemoData ? 'Resetting demo…' : 'Reset demo data' }}
            </button>
          }
          <button type="button" class="menu-action-button" (click)="openPrivacySummary()">Privacy summary</button>
          <button type="button" class="menu-action-button" (click)="signOut()" [disabled]="isSigningOut">
            {{ isSigningOut ? 'Signing out...' : 'Sign out' }}
          </button>
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
export class DashboardShellComponent implements OnInit {
  private readonly authApiService = inject(AuthApiService);
  private readonly pitchDemoModeService = inject(PitchDemoModeService);
  private readonly router = inject(Router);

  isMenuOpen = false;
  isSigningOut = false;
  isResettingDemoData = false;
  userRole: UserRole = 'user';

  readonly navItems: DashboardNavItem[] = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Appointments', path: '/appointments' },
    { label: 'Contacts', path: '/contacts' },
    { label: 'Privacy', path: '/privacy' },
    { label: 'Help', path: '/help' },
  ];

  readonly adminNavItem: DashboardNavItem = { label: 'Admin', path: '/admin' };

  ngOnInit(): void {
    this.authApiService.getSessionContext().subscribe({
      next: (context) => {
        this.userRole = context.role;
      },
      error: () => {
        this.userRole = 'user';
      },
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  get pitchDemoModeEnabled(): boolean {
    return this.pitchDemoModeService.isEnabled();
  }

  get isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  openPrivacySummary(): void {
    void this.router.navigateByUrl('/privacy');
    this.isMenuOpen = false;
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

  resetDemoData(): void {
    if (this.isResettingDemoData) {
      return;
    }
    this.isResettingDemoData = true;
    this.authApiService
      .resetPitchDemoData()
      .pipe(finalize(() => (this.isResettingDemoData = false)))
      .subscribe();
  }
}
