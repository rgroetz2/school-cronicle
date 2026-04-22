import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { AppointmentsComponent } from './appointments.component';

describe('AppointmentsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
  });

  it('calls sign-out endpoint and redirects to login', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    const router = TestBed.inject(Router);
    const navigateSpy = vi
      .spyOn(router, 'navigateByUrl')
      .mockResolvedValue(true);

    const listRequest = httpTesting.expectOne('/api/appointments/drafts');
    expect(listRequest.request.method).toBe('GET');
    listRequest.flush({
      data: {
        drafts: [],
      },
    });

    fixture.componentInstance.signOut();

    expect(navigateSpy).toHaveBeenCalledWith('/login');
    httpTesting.verify();
  });

  it('shows required field validation and creates a draft', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    const listRequest = httpTesting.expectOne('/api/appointments/drafts');
    expect(listRequest.request.method).toBe('GET');
    listRequest.flush({
      data: {
        drafts: [],
      },
    });
    fixture.detectChanges();

    fixture.componentInstance.createDraft();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Title is required.');
    expect(compiled.textContent).toContain('Category is required.');

    fixture.componentInstance.draftForm.setValue({
      title: 'Parent meeting',
      category: 'meeting',
      notes: 'First draft',
    });
    fixture.componentInstance.createDraft();
    const request = httpTesting.expectOne('/api/appointments/drafts');
    expect(request.request.method).toBe('POST');
    request.flush({
      data: {
        draft: {
          id: 'draft-1',
          teacherId: 'teacher-1',
          schoolId: 'school-1',
          title: 'Parent meeting',
          category: 'meeting',
          notes: 'First draft',
          status: 'draft',
          createdAt: new Date().toISOString(),
        },
      },
    });

    const refreshListRequest = httpTesting.expectOne('/api/appointments/drafts');
    expect(refreshListRequest.request.method).toBe('GET');
    refreshListRequest.flush({
      data: {
        drafts: [
          {
            id: 'draft-1',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Parent meeting',
            category: 'meeting',
            notes: 'First draft',
            status: 'draft',
            createdAt: new Date().toISOString(),
          },
        ],
      },
    });

    fixture.detectChanges();
    expect(compiled.textContent).toContain('Draft created: Parent meeting');
    httpTesting.verify();
  });

  it('renders draft list and opens a selected draft', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    const listRequest = httpTesting.expectOne('/api/appointments/drafts');
    expect(listRequest.request.method).toBe('GET');
    listRequest.flush({
      data: {
        drafts: [
          {
            id: 'draft-7',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Science check-in',
            category: 'progress',
            notes: '',
            status: 'draft',
            createdAt: new Date().toISOString(),
          },
        ],
      },
    });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('ul button') as HTMLButtonElement;
    expect(button?.textContent).toContain('Science check-in');
    button.click();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Opened draft draft-7');
    httpTesting.verify();
  });
});
