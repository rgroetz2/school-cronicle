import { appRoutes } from './app.routes';
import { authAdminRoleGuard } from './core/auth-role.guard';
import { authSessionGuard } from './core/auth-session.guard';
import { DashboardShellComponent } from './features/dashboard/dashboard-shell.component';

describe('appRoutes', () => {
  it('protects dashboard shell with auth guard and exposes privacy and school-personal child routes', () => {
    const shellRoute = appRoutes.find((route) => route.component === DashboardShellComponent);
    expect(shellRoute).toBeDefined();
    expect(shellRoute?.canActivate).toEqual([authSessionGuard]);

    const privacyChild = shellRoute?.children?.find((route) => route.path === 'privacy');
    expect(privacyChild).toBeDefined();
    const schoolPersonalChild = shellRoute?.children?.find((route) => route.path === 'school-personal');
    expect(schoolPersonalChild).toBeDefined();
  });

  it('protects admin route with role guard', () => {
    const shellRoute = appRoutes.find((route) => route.component === DashboardShellComponent);
    const adminChild = shellRoute?.children?.find((route) => route.path === 'admin');
    expect(adminChild).toBeDefined();
    expect(adminChild?.canActivate).toEqual([authAdminRoleGuard]);
  });
});
