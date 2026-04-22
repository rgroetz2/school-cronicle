import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthApiService } from '../../core/auth-api.service';

@Component({
  selector: 'app-appointments',
  template: `
    <main>
      <h2>Appointments workspace</h2>
      <p>You are signed in.</p>
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
}
