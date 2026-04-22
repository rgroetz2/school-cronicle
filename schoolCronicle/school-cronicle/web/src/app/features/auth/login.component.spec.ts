import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();
  });

  it('shows validation errors when submitting empty form', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

    fixture.componentInstance.submit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Enter a valid email address.');
    expect(compiled.textContent).toContain('Password is required.');
  });

  it('navigates to appointments after successful sign-in', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    const router = TestBed.inject(Router);
    const navigateSpy = vi
      .spyOn(router, 'navigateByUrl')
      .mockResolvedValue(true);

    fixture.componentInstance.signInForm.setValue({
      email: 'teacher@school.local',
      password: 'teachpass123',
    });
    fixture.componentInstance.submit();

    const request = httpTesting.expectOne('/api/auth/sign-in');
    expect(request.request.method).toBe('POST');
    request.flush({
      data: { teacherId: 'teacher-1', email: 'teacher@school.local' },
    });

    expect(navigateSpy).toHaveBeenCalledWith('/appointments');
    httpTesting.verify();
  });

  it('shows a non-sensitive error on failed sign-in', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const httpTesting = TestBed.inject(HttpTestingController);

    fixture.componentInstance.signInForm.setValue({
      email: 'teacher@school.local',
      password: 'bad',
    });
    fixture.componentInstance.submit();

    const request = httpTesting.expectOne('/api/auth/sign-in');
    request.flush(
      {
        message: 'Sign-in failed. Check your credentials and try again.',
        support: {
          label: 'School account support',
          email: 'support@school.local',
        },
      },
      { status: 401, statusText: 'Unauthorized' },
    );

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(
      'Sign-in failed. Check your credentials and try again.',
    );
    expect(compiled.textContent).toContain('Need help signing in? Contact');
    const helpLink = compiled.querySelector(
      '[data-testid="support-contact-link"]',
    ) as HTMLAnchorElement | null;
    expect(helpLink?.getAttribute('href')).toBe('mailto:support@school.local');
    httpTesting.verify();
  });

  it('shows support contact for blocked-account-mapped failures', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const httpTesting = TestBed.inject(HttpTestingController);

    fixture.componentInstance.signInForm.setValue({
      email: 'blocked@school.local',
      password: 'any',
    });
    fixture.componentInstance.submit();

    const request = httpTesting.expectOne('/api/auth/sign-in');
    request.flush(
      {
        message: 'Sign-in failed. Check your credentials and try again.',
        reason: 'account-blocked',
        support: {
          label: 'School account support',
          email: 'support@school.local',
        },
      },
      { status: 401, statusText: 'Unauthorized' },
    );

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(
      'Sign-in failed. Check your credentials and try again.',
    );
    expect(compiled.textContent).toContain('School account support');
    httpTesting.verify();
  });
});
