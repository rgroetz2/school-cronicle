import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AppointmentsComponent } from './appointments.component';
import { AuthApiService } from '../../core/auth-api.service';

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

  it('shows per-file upload status after image attach', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    const authApiService = TestBed.inject(AuthApiService);
    const attachSpy = vi.spyOn(authApiService, 'attachImageToDraft').mockReturnValue(
      of({
        id: 'draft-50',
        teacherId: 'teacher-1',
        schoolId: 'school-1',
        title: 'Attach status',
        appointmentDate: '2026-05-04',
        category: 'meeting',
        notes: '',
        status: 'draft',
        createdAt: new Date().toISOString(),
        images: [
          {
            id: 'img-status-1',
            name: 'status.png',
            mimeType: 'image/png',
            dataUrl: 'data:image/png;base64,AAA',
            addedAt: new Date().toISOString(),
          },
        ],
      }),
    );

    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'draft-50',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Attach status',
            appointmentDate: '2026-05-04',
            category: 'meeting',
            notes: '',
            status: 'draft',
            createdAt: new Date().toISOString(),
            images: [],
          },
        ],
      },
    });
    fixture.detectChanges();
    fixture.componentInstance.openDraft('draft-50');

    class MockFileReader {
      result: string | ArrayBuffer | null = null;
      onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null = null;

      readAsDataURL(file: Blob): void {
        this.result = `data:image/png;base64,${file.size}`;
        this.onload?.call(this as unknown as FileReader, {} as ProgressEvent<FileReader>);
      }
    }

    vi.stubGlobal('FileReader', MockFileReader as unknown as typeof FileReader);

    const input = document.createElement('input');
    input.type = 'file';
    const file = new File(['abc'], 'status.png', { type: 'image/png' });
    Object.defineProperty(input, 'files', { value: [file], configurable: true });

    fixture.componentInstance.onImageSelected({ target: input } as unknown as Event);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(attachSpy).toHaveBeenCalled();
    expect(text).toContain('status.png');
    expect(text).toContain('attached');
    expect(text).toContain('Attached image: status.png');

    vi.unstubAllGlobals();
  });

  it('keeps valid image attached while invalid type shows reason', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    const authApiService = TestBed.inject(AuthApiService);
    const attachSpy = vi.spyOn(authApiService, 'attachImageToDraft').mockReturnValue(
      of({
        id: 'draft-51',
        teacherId: 'teacher-1',
        schoolId: 'school-1',
        title: 'Mixed upload',
        appointmentDate: '2026-05-04',
        category: 'meeting',
        notes: '',
        status: 'draft',
        createdAt: new Date().toISOString(),
        images: [
          {
            id: 'img-valid',
            name: 'valid.png',
            mimeType: 'image/png',
            dataUrl: 'data:image/png;base64,AAA',
            addedAt: new Date().toISOString(),
          },
        ],
      }),
    );

    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'draft-51',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Mixed upload',
            appointmentDate: '2026-05-04',
            category: 'meeting',
            notes: '',
            status: 'draft',
            createdAt: new Date().toISOString(),
            images: [],
          },
        ],
      },
    });
    fixture.detectChanges();
    fixture.componentInstance.openDraft('draft-51');

    class MockFileReader {
      result: string | ArrayBuffer | null = null;
      onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null = null;

      readAsDataURL(file: Blob): void {
        this.result = `data:image/png;base64,${file.size}`;
        this.onload?.call(this as unknown as FileReader, {} as ProgressEvent<FileReader>);
      }
    }

    vi.stubGlobal('FileReader', MockFileReader as unknown as typeof FileReader);

    const input = document.createElement('input');
    input.type = 'file';
    const validFile = new File(['abc'], 'valid.png', { type: 'image/png' });
    const invalidFile = new File(['abc'], 'invalid.gif', { type: 'image/gif' });
    Object.defineProperty(input, 'files', { value: [validFile, invalidFile], configurable: true });

    fixture.componentInstance.onImageSelected({ target: input } as unknown as Event);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(attachSpy).toHaveBeenCalledTimes(1);
    expect(text).toContain('valid.png');
    expect(text).toContain('invalid.gif');
    expect(text).toContain('attached');
    expect(text).toContain('Unsupported format. Use JPEG, PNG, or WebP.');
    expect(text).toContain('Unsupported image format. Use JPEG, PNG, or WebP.');

    vi.unstubAllGlobals();
  });

  it('removes failed upload entry without clearing valid attached images', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'draft-52',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Recovery',
            appointmentDate: '2026-05-04',
            category: 'meeting',
            notes: '',
            status: 'draft',
            createdAt: new Date().toISOString(),
            images: [
              {
                id: 'img-valid',
                name: 'valid.png',
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
    fixture.componentInstance.openDraft('draft-52');

    fixture.componentInstance.imageUploadStatuses = [
      { id: 'up-fail', name: 'invalid.gif', state: 'failed', detail: 'Unsupported format' },
    ];
    fixture.componentInstance.removeFailedUpload('up-fail');
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('valid.png');
    expect(text).not.toContain('invalid.gif');
  });

  it('replaces failed image and keeps previously valid attachments intact', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    const authApiService = TestBed.inject(AuthApiService);
    const attachSpy = vi.spyOn(authApiService, 'attachImageToDraft').mockReturnValue(
      of({
        id: 'draft-53',
        teacherId: 'teacher-1',
        schoolId: 'school-1',
        title: 'Replace failed',
        appointmentDate: '2026-05-04',
        category: 'meeting',
        notes: '',
        status: 'draft',
        createdAt: new Date().toISOString(),
        images: [
          {
            id: 'img-valid',
            name: 'already-valid.png',
            mimeType: 'image/png',
            dataUrl: 'data:image/png;base64,AAA',
            addedAt: new Date().toISOString(),
          },
          {
            id: 'img-replaced',
            name: 'replacement.png',
            mimeType: 'image/png',
            dataUrl: 'data:image/png;base64,BBB',
            addedAt: new Date().toISOString(),
          },
        ],
      }),
    );

    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'draft-53',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Replace failed',
            appointmentDate: '2026-05-04',
            category: 'meeting',
            notes: '',
            status: 'draft',
            createdAt: new Date().toISOString(),
            images: [
              {
                id: 'img-valid',
                name: 'already-valid.png',
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
    fixture.componentInstance.openDraft('draft-53');
    fixture.componentInstance.imageUploadStatuses = [
      { id: 'up-fail', name: 'invalid.gif', state: 'failed', detail: 'Unsupported format' },
    ];

    class MockFileReader {
      result: string | ArrayBuffer | null = null;
      onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown) | null = null;

      readAsDataURL(file: Blob): void {
        this.result = `data:image/png;base64,${file.size}`;
        this.onload?.call(this as unknown as FileReader, {} as ProgressEvent<FileReader>);
      }
    }
    vi.stubGlobal('FileReader', MockFileReader as unknown as typeof FileReader);

    const replacementInput = document.createElement('input');
    replacementInput.type = 'file';
    const replacementFile = new File(['abc'], 'replacement.png', { type: 'image/png' });
    Object.defineProperty(replacementInput, 'files', { value: [replacementFile], configurable: true });

    fixture.componentInstance.replacingUploadId = 'up-fail';
    fixture.componentInstance.onReplacementSelected({ target: replacementInput } as unknown as Event);
    fixture.detectChanges();

    expect(attachSpy).toHaveBeenCalledTimes(1);
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('already-valid.png');
    expect(text).toContain('replacement.png');
    expect(text).toContain('attached');

    vi.unstubAllGlobals();
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
