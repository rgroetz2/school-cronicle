import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardShellComponent } from './dashboard-shell.component';

describe('DashboardShellComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardShellComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders all teacher menu entries', () => {
    const fixture = TestBed.createComponent(DashboardShellComponent);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Dashboard');
    expect(text).toContain('Appointments');
    expect(text).toContain('Drafts');
    expect(text).toContain('Submitted');
    expect(text).toContain('Privacy');
    expect(text).toContain('Help');
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
