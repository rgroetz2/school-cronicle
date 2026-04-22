import { appRoutes } from './app.routes';
import { authSessionGuard } from './core/auth-session.guard';
import { DashboardShellComponent } from './features/dashboard/dashboard-shell.component';

describe('appRoutes', () => {
  it('protects dashboard shell with auth guard and exposes privacy child route', () => {
    const shellRoute = appRoutes.find((route) => route.component === DashboardShellComponent);
    expect(shellRoute).toBeDefined();
    expect(shellRoute?.canActivate).toEqual([authSessionGuard]);

    const privacyChild = shellRoute?.children?.find((route) => route.path === 'privacy');
    expect(privacyChild).toBeDefined();
  });
});
