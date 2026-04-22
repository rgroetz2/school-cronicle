import { Route } from '@angular/router';
import { AppointmentsComponent } from './features/appointments/appointments.component';
import { LoginComponent } from './features/auth/login.component';

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
  },
];
