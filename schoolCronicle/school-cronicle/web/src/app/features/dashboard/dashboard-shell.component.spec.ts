import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthApiService } from '../../core/auth-api.service';
import { PitchDemoModeService } from '../../core/pitch-demo-mode.service';
import { DashboardShellComponent } from './dashboard-shell.component';

describe('DashboardShellComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardShellComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthApiService,
          useValue: {
            signOut: () => of(true),
            resetPitchDemoData: () => of({ version: 'v1', draftCount: 1 }),
            getSessionContext: () =>
              of({
                authenticated: true,
                teacherId: 'teacher-1',
                email: 'teacher@school.local',
                role: 'user' as const,
              }),
          } satisfies Pick<AuthApiService, 'signOut' | 'resetPitchDemoData' | 'getSessionContext'>,
        },
        {
          provide: PitchDemoModeService,
          useValue: {
            isEnabled: () => true,
          } satisfies Pick<PitchDemoModeService, 'isEnabled'>,
        },
      ],
    }).compileComponents();
  });

  it('hides admin-only actions for user role', () => {
    const fixture = TestBed.createComponent(DashboardShellComponent);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Dashboard');
    expect(text).toContain('Appointments');
    expect(text).toContain('Contacts');
    expect(text).toContain('Privacy');
    expect(text).toContain('Help');
    expect(text).not.toContain('Reset demo data');
    expect(text).not.toContain('Admin');
    expect(text).toContain('Privacy summary');
    expect(text).toContain('Sign out');
    expect(text).not.toContain('Latest changes');
  });

  it('shows admin-only actions for admin role', async () => {
    TestBed.overrideProvider(AuthApiService, {
      useValue: {
        signOut: () => of(true),
        resetPitchDemoData: () => of({ version: 'v1', draftCount: 1 }),
        getSessionContext: () =>
          of({
            authenticated: true,
            teacherId: 'teacher-1',
            email: 'admin@school.local',
            role: 'admin' as const,
          }),
      } satisfies Pick<AuthApiService, 'signOut' | 'resetPitchDemoData' | 'getSessionContext'>,
    });

    const fixture = TestBed.createComponent(DashboardShellComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Admin');
    expect(text).toContain('Reset demo data');
  });

  it('toggles sidebar state from menu button', () => {
    const fixture = TestBed.createComponent(DashboardShellComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.isMenuOpen).toBe(false);

    const button = (fixture.nativeElement as HTMLElement).querySelector('button.menu-toggle') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    expect(component.isMenuOpen).toBe(true);
  });
});
