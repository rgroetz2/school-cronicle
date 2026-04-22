import { appRoutes } from './app.routes';
import { authSessionGuard } from './core/auth-session.guard';

describe('appRoutes', () => {
  it('protects privacy route with auth guard', () => {
    const privacyRoute = appRoutes.find((route) => route.path === 'privacy');
    expect(privacyRoute).toBeDefined();
    expect(privacyRoute?.canActivate).toEqual([authSessionGuard]);
  });
});
