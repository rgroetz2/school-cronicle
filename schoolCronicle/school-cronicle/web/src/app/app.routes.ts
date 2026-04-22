import { Route } from '@angular/router';
import { authSessionGuard } from './core/auth-session.guard';
import { AppointmentsComponent } from './features/appointments/appointments.component';
import { LoginComponent } from './features/auth/login.component';
import { PrivacySummaryComponent } from './features/privacy/privacy-summary.component';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'appointments',
    component: AppointmentsComponent,
    canActivate: [authSessionGuard],
  },
  {
    path: 'privacy',
    component: PrivacySummaryComponent,
    canActivate: [authSessionGuard],
  },
];
