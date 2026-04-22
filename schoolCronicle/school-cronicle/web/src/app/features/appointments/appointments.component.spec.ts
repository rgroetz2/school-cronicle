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

    const categoriesRequest = httpTesting.expectOne('/api/appointments/categories');
    expect(categoriesRequest.request.method).toBe('GET');
    categoriesRequest.flush({
      data: {
        categories: ['meeting', 'consultation', 'progress'],
      },
    });

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
    const categoriesRequest = httpTesting.expectOne('/api/appointments/categories');
    expect(categoriesRequest.request.method).toBe('GET');
    categoriesRequest.flush({
      data: {
        categories: ['meeting', 'consultation', 'progress'],
      },
    });
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
    expect(compiled.textContent).toContain('Appointment date is required.');
    expect(compiled.textContent).toContain('Category is required.');

    fixture.componentInstance.draftForm.setValue({
      title: 'Parent meeting',
      appointmentDate: '2026-04-22',
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
          appointmentDate: '2026-04-22',
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
            appointmentDate: '2026-04-22',
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
    const categoriesRequest = httpTesting.expectOne('/api/appointments/categories');
    expect(categoriesRequest.request.method).toBe('GET');
    categoriesRequest.flush({
      data: {
        categories: ['meeting', 'consultation', 'progress'],
      },
    });
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
            appointmentDate: '2026-04-23',
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
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('All required metadata is complete.');
    httpTesting.verify();
  });

  it('updates an opened draft with controlled category', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    const categoriesRequest = httpTesting.expectOne('/api/appointments/categories');
    categoriesRequest.flush({
      data: {
        categories: ['meeting', 'consultation', 'progress'],
      },
    });

    const listRequest = httpTesting.expectOne('/api/appointments/drafts');
    listRequest.flush({
      data: {
        drafts: [
          {
            id: 'draft-11',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Old title',
            appointmentDate: '2026-04-20',
            category: 'meeting',
            notes: 'Old notes',
            status: 'draft',
            createdAt: new Date().toISOString(),
          },
        ],
      },
    });
    fixture.detectChanges();

    fixture.componentInstance.openDraft('draft-11');
    fixture.componentInstance.draftForm.setValue({
      title: 'Updated title',
      appointmentDate: '2026-04-24',
      category: 'consultation',
      notes: 'Updated notes',
    });
    fixture.componentInstance.createDraft();

    const updateRequest = httpTesting.expectOne('/api/appointments/drafts/draft-11');
    expect(updateRequest.request.method).toBe('PATCH');
    updateRequest.flush({
      data: {
        draft: {
          id: 'draft-11',
          teacherId: 'teacher-1',
          schoolId: 'school-1',
          title: 'Updated title',
          appointmentDate: '2026-04-24',
          category: 'consultation',
          notes: 'Updated notes',
          status: 'draft',
          createdAt: new Date().toISOString(),
        },
      },
    });

    const refreshRequest = httpTesting.expectOne('/api/appointments/drafts');
    refreshRequest.flush({
      data: {
        drafts: [
          {
            id: 'draft-11',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Updated title',
            appointmentDate: '2026-04-24',
            category: 'consultation',
            notes: 'Updated notes',
            status: 'draft',
            createdAt: new Date().toISOString(),
          },
        ],
      },
    });

    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Draft saved: Updated title');
    httpTesting.verify();
  });

  it('blocks submit until a complete draft is selected and calls submit endpoint', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'draft-20',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Submit me',
            appointmentDate: '2026-04-28',
            category: 'meeting',
            notes: 'ready',
            status: 'draft',
            createdAt: new Date().toISOString(),
          },
        ],
      },
    });
    fixture.detectChanges();

    let submitButton = fixture.nativeElement.querySelector(
      'section[aria-labelledby="submit-readiness-heading"] button',
    ) as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);

    fixture.componentInstance.openDraft('draft-20');
    fixture.detectChanges();
    submitButton = fixture.nativeElement.querySelector(
      'section[aria-labelledby="submit-readiness-heading"] button',
    ) as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);

    submitButton.click();
    const submitRequest = httpTesting.expectOne('/api/appointments/drafts/draft-20/submit');
    expect(submitRequest.request.method).toBe('POST');
    submitRequest.flush({
      data: {
        submitted: false,
        draftId: 'draft-20',
        readyToSubmit: true,
      },
    });

    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Draft is ready for submission.');
    httpTesting.verify();
  });

  it('shows attached images for selected draft and removes one', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'draft-30',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'With image',
            appointmentDate: '2026-05-01',
            category: 'meeting',
            notes: '',
            status: 'draft',
            createdAt: new Date().toISOString(),
            images: [
              {
                id: 'img-1',
                name: 'photo.png',
                mimeType: 'image/png',
                dataUrl: 'data:image/png;base64,AAA',
                addedAt: new Date().toISOString(),
              },
            ],
          },
        ],
      },
    });
    fixture.detectChanges();

    fixture.componentInstance.openDraft('draft-30');
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('photo.png');

    const removeButton = fixture.nativeElement.querySelector(
      'section[aria-labelledby="draft-images-heading"] ul button',
    ) as HTMLButtonElement;
    removeButton.click();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Image removed.');
  });

  it('deletes selected draft after confirmation and updates list', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    const confirmSpy = vi.spyOn(globalThis, 'confirm').mockReturnValue(true);

    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'draft-40',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Delete draft',
            appointmentDate: '2026-05-03',
            category: 'meeting',
            notes: '',
            status: 'draft',
            createdAt: new Date().toISOString(),
          },
        ],
      },
    });
    fixture.detectChanges();

    fixture.componentInstance.openDraft('draft-40');
    fixture.detectChanges();

    fixture.componentInstance.deleteSelectedDraft();

    const deleteRequest = httpTesting.expectOne('/api/appointments/drafts/draft-40');
    expect(deleteRequest.request.method).toBe('DELETE');
    deleteRequest.flush({
      data: {
        deleted: true,
        draftId: 'draft-40',
      },
    });

    fixture.detectChanges();
    expect(confirmSpy).toHaveBeenCalled();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Draft deleted.');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No drafts yet. Create one below to get started.');
    confirmSpy.mockRestore();
  });
});
