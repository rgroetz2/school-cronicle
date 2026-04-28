import { Route } from '@angular/router';
import { authSessionGuard } from './core/auth-session.guard';
import { authAdminRoleGuard } from './core/auth-role.guard';
import { AppointmentsComponent } from './features/appointments/appointments.component';
import { LoginComponent } from './features/auth/login.component';
import { DashboardHomeComponent } from './features/dashboard/dashboard-home.component';
import { DashboardShellComponent } from './features/dashboard/dashboard-shell.component';
import { WorkspacePlaceholderComponent } from './features/dashboard/workspace-placeholder.component';
import { ContactsComponent } from './features/contacts/contacts.component';
import { PrivacySummaryComponent } from './features/privacy/privacy-summary.component';
import { SchoolPersonalComponent } from './features/school-personal/school-personal.component';
import { SchoolComponent } from './features/school/school.component';

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
    path: '',
    component: DashboardShellComponent,
    canActivate: [authSessionGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardHomeComponent,
      },
      {
        path: 'appointments',
        component: AppointmentsComponent,
      },
      {
        path: 'contacts',
        component: ContactsComponent,
      },
      {
        path: 'school-personal',
        component: SchoolPersonalComponent,
      },
      {
        path: 'schools',
        component: SchoolComponent,
      },
      {
        path: 'drafts',
        component: WorkspacePlaceholderComponent,
        data: {
          title: 'Drafts',
          description: 'This dedicated draft view is planned in the next pitch UX story. Use appointments in the meantime.',
        },
      },
      {
        path: 'submitted',
        component: WorkspacePlaceholderComponent,
        data: {
          title: 'Submitted',
          description:
            'This dedicated submitted view is planned in the next pitch UX story. Use appointments in the meantime.',
        },
      },
      {
        path: 'privacy',
        component: PrivacySummaryComponent,
      },
      {
        path: 'help',
        component: WorkspacePlaceholderComponent,
        data: {
          title: 'Help',
          description:
            'Teacher support resources are reachable here. Use Privacy for current privacy and account support details.',
        },
      },
      {
        path: 'admin',
        component: WorkspacePlaceholderComponent,
        canActivate: [authAdminRoleGuard],
        data: {
          title: 'Admin',
          description: 'Admin-only workspace.',
        },
      },
    ],
  },
];
