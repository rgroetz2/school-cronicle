import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthApiService } from './auth-api.service';

export const authSessionGuard: CanActivateFn = () => {
  const authApiService = inject(AuthApiService);
  const router = inject(Router);

  return authApiService.verifySession().pipe(
    map((authenticated) => {
      if (authenticated) {
        return true;
      }

      return router.createUrlTree(['/login']);
    }),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
