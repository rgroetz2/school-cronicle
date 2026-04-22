import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthApiService } from '../../core/auth-api.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authApiService = inject(AuthApiService);
  private readonly router = inject(Router);

  errorMessage = '';
  isSubmitting = false;

  readonly signInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  submit(): void {
    this.errorMessage = '';
    this.signInForm.markAllAsTouched();

    if (this.signInForm.invalid || this.isSubmitting) {
      return;
    }

    const email = this.signInForm.controls.email.value ?? '';
    const password = this.signInForm.controls.password.value ?? '';
    this.isSubmitting = true;

    this.authApiService
      .signIn(email, password)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          void this.router.navigateByUrl('/appointments');
        },
        error: () => {
          this.errorMessage = 'Sign-in failed. Check your credentials and try again.';
        },
      });
  }
}
