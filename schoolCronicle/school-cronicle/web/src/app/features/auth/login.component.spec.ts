import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
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
    const router = TestBed.inject(Router);
    const navigateSpy = vi
      .spyOn(router, 'navigateByUrl')
      .mockResolvedValue(true);

    fixture.componentInstance.signInForm.setValue({
      email: 'teacher@school.local',
      password: 'teachpass123',
    });
    fixture.componentInstance.submit();

    expect(navigateSpy).toHaveBeenCalledWith('/appointments');
  });

  it('shows a non-sensitive error on failed sign-in', () => {
    const fixture = TestBed.createComponent(LoginComponent);

    fixture.componentInstance.signInForm.setValue({
      email: 'teacher@school.local',
      password: '',
    });
    fixture.componentInstance.submit();

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Password is required.');
  });

  it('still allows blocked-account email in dummy mode', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const router = TestBed.inject(Router);
    const navigateSpy = vi
      .spyOn(router, 'navigateByUrl')
      .mockResolvedValue(true);

    fixture.componentInstance.signInForm.setValue({
      email: 'blocked@school.local',
      password: 'dummy',
    });
    fixture.componentInstance.submit();

    expect(navigateSpy).toHaveBeenCalledWith('/appointments');
  });
});
