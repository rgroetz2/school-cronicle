import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { firstValueFrom, isObservable } from 'rxjs';
import { vi } from 'vitest';
import { authAdminRoleGuard } from './auth-role.guard';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authUnauthorizedInterceptor } from './auth-unauthorized.interceptor';

describe('authAdminRoleGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authAdminRoleGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authUnauthorizedInterceptor])),
        provideHttpClientTesting(),
        {
          provide: Router,
          useValue: {
            createUrlTree: vi.fn(() => ({ redirected: '/dashboard' } as unknown as UrlTree)),
          },
        },
      ],
    });
  });

  it('redirects non-admin sessions to dashboard', async () => {
    const httpTesting = TestBed.inject(HttpTestingController);
    const router = TestBed.inject(Router) as unknown as { createUrlTree: ReturnType<typeof vi.fn> };
    const guardResult = executeGuard({} as never, {} as never);
    const resultPromise = isObservable(guardResult)
      ? firstValueFrom(guardResult)
      : Promise.resolve(guardResult);

    const request = httpTesting.expectOne('/api/auth/session-context');
    request.flush({
      data: {
        authenticated: true,
        teacherId: 'teacher-1',
        email: 'teacher@school.local',
        role: 'user',
      },
    });

    const result = await resultPromise;
    expect(router.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
    expect(result).toEqual({ redirected: '/dashboard' });
    httpTesting.verify();
  });
});
