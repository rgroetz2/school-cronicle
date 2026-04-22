import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { DashboardHomeComponent } from './dashboard-home.component';

describe('DashboardHomeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHomeComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
  });

  it('renders summary counts from drafts list', () => {
    const fixture = TestBed.createComponent(DashboardHomeComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'd-1',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Draft one',
            appointmentDate: '2026-05-01',
            category: 'meeting',
            notes: '',
            status: 'draft',
            createdAt: new Date().toISOString(),
            images: [],
          },
          {
            id: 's-1',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Submitted one',
            appointmentDate: '2026-05-02',
            category: 'meeting',
            notes: '',
            status: 'submitted',
            submittedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            images: [],
          },
          {
            id: 'a-1',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: '',
            appointmentDate: '',
            category: '',
            notes: '',
            status: 'draft',
            createdAt: new Date().toISOString(),
            images: [],
          },
        ],
      },
    });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Drafts');
    expect(text).toContain('Submitted');
    expect(text).toContain('Needs attention');
    expect(fixture.componentInstance.draftCount).toBe(2);
    expect(fixture.componentInstance.submittedCount).toBe(1);
    expect(fixture.componentInstance.needsAttentionCount).toBe(1);
  });

  it('navigates to appointments list context from cards', () => {
    const fixture = TestBed.createComponent(DashboardHomeComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    httpTesting.expectOne('/api/appointments/drafts').flush({ data: { drafts: [] } });
    fixture.detectChanges();

    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('.summary-card');
    (cards.item(0) as HTMLButtonElement).click();
    (cards.item(1) as HTMLButtonElement).click();
    (cards.item(2) as HTMLButtonElement).click();

    expect(navigateSpy).toHaveBeenCalledWith(['/appointments'], { queryParams: { view: 'drafts' } });
    expect(navigateSpy).toHaveBeenCalledWith(['/appointments'], { queryParams: { view: 'submitted' } });
    expect(navigateSpy).toHaveBeenCalledWith(['/appointments'], { queryParams: { view: 'attention' } });
  });
});
