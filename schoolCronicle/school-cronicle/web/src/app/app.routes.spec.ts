import { appRoutes } from './app.routes';
import { authAdminRoleGuard } from './core/auth-role.guard';
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

  it('protects admin route with role guard', () => {
    const shellRoute = appRoutes.find((route) => route.component === DashboardShellComponent);
    const adminChild = shellRoute?.children?.find((route) => route.path === 'admin');
    expect(adminChild).toBeDefined();
    expect(adminChild?.canActivate).toEqual([authAdminRoleGuard]);
  });
});
