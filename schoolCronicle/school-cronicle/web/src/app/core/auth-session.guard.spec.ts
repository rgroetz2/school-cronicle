import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { firstValueFrom, isObservable } from 'rxjs';
import { vi } from 'vitest';
import { authSessionGuard } from './auth-session.guard';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authUnauthorizedInterceptor } from './auth-unauthorized.interceptor';

describe('authSessionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authSessionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authUnauthorizedInterceptor])),
        provideHttpClientTesting(),
        {
          provide: Router,
          useValue: {
            createUrlTree: vi.fn(() => ({ redirected: '/login' } as unknown as UrlTree)),
            navigateByUrl: vi.fn().mockResolvedValue(true),
          },
        },
      ],
    });
  });

  it('returns UrlTree to login when session probe is unauthorized', async () => {
    const httpTesting = TestBed.inject(HttpTestingController);
    const router = TestBed.inject(Router) as unknown as {
      createUrlTree: ReturnType<typeof vi.fn>;
    };
    const guardResult = executeGuard({} as never, {} as never);
    const resultPromise = isObservable(guardResult)
      ? firstValueFrom(guardResult)
      : Promise.resolve(guardResult);

    const request = httpTesting.expectOne('/api/auth/session');
    request.flush({ message: 'Authentication required.' }, { status: 401, statusText: 'Unauthorized' });

    const result = await resultPromise;
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toEqual({ redirected: '/login' });
    httpTesting.verify();
  });
});
