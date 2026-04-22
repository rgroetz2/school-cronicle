import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { AppointmentsComponent } from './appointments.component';

describe('AppointmentsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
  });

  it('calls sign-out endpoint and redirects to login', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    const router = TestBed.inject(Router);
    const navigateSpy = vi
      .spyOn(router, 'navigateByUrl')
      .mockResolvedValue(true);

    fixture.componentInstance.signOut();

    const request = httpTesting.expectOne('/api/auth/sign-out');
    expect(request.request.method).toBe('POST');
    request.flush({ data: { signedOut: true } });

    expect(navigateSpy).toHaveBeenCalledWith('/login');
    httpTesting.verify();
  });
});
