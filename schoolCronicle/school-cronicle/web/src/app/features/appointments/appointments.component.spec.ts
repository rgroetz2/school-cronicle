import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AppointmentsComponent } from './appointments.component';
import { AuthApiService } from '../../core/auth-api.service';
import { DEMO_SEED_VERSION } from '../../core/demo-seed';
import { PitchDemoModeService } from '../../core/pitch-demo-mode.service';

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

  it('navigates to privacy summary from header action', () => {
    const authApiService = TestBed.inject(AuthApiService);
    vi.spyOn(authApiService, 'getTeacherProfile').mockReturnValue(
      of({
        displayName: 'Teacher Updated',
        contactEmail: 'teacher.updated@school.local',
      }),
    );
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: { drafts: [] },
    });
    fixture.detectChanges();

    const buttons = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('header button'));
    const privacyButton = buttons.find((button) => button.textContent?.includes('Privacy summary')) as
      | HTMLButtonElement
      | undefined;
    privacyButton?.click();

    expect(navigateSpy).toHaveBeenCalledWith('/privacy');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Signed in as Teacher Updated');
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
    expect(compiled.textContent).toContain('Required. Keep it short and specific');
    expect(compiled.textContent).toContain('Required. Select the calendar date for this appointment.');
    expect(compiled.textContent).toContain('Required. Choose the category that best fits the appointment.');

    fixture.componentInstance.draftForm.setValue({
      title: 'Parent meeting',
      appointmentDate: '2026-04-22',
      category: 'meeting',
      notes: 'First draft',
      classGrade: '3A',
      guardianName: 'Miller',
      location: 'Room 12',
    });
    fixture.componentInstance.createDraft();
    const request = httpTesting.expectOne('/api/appointments/drafts');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toMatchObject({
      classGrade: '3A',
      guardianName: 'Miller',
      location: 'Room 12',
    });
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
          classGrade: '3A',
          guardianName: 'Miller',
          location: 'Room 12',
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
            classGrade: '3A',
            guardianName: 'Miller',
            location: 'Room 12',
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

  it('shows contextual guidance for required fields and image formats', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'draft-guidance',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Guidance draft',
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
    fixture.componentInstance.openDraft('draft-guidance');
    fixture.componentInstance.imageUploadStatuses = [
      { id: 'up-fail', name: 'invalid.gif', state: 'failed', detail: 'Unsupported format. Use JPEG, PNG, or WebP.' },
    ];
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Use a clear title so the entry is easy to identify later.');
    expect(text).toContain('Set the appointment date in YYYY-MM-DD format.');
    expect(text).toContain('Choose one category before trying to submit.');
    expect(text).toContain('Accepted formats: JPEG, PNG, WebP. Maximum file size: 2 MB per image.');
    expect(text).toContain('Unsupported format. Use JPEG, PNG, or WebP.');
  });

  it('renders clear workspace zones for list and media', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: { drafts: [] },
    });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('List and results');
    expect(text).toContain('Media and attachments');
  });

  it('hides demo walkthrough when demo mode is off', () => {
    TestBed.overrideProvider(PitchDemoModeService, { useValue: { isEnabled: () => false } });
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: { drafts: [] },
    });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).not.toContain('7-minute teacher demo path');
  });

  it('keeps advanced filters collapsed by default and toggles on demand', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: { drafts: [] },
    });
    fixture.detectChanges();

    const details = (fixture.nativeElement as HTMLElement).querySelector('details.filter-advanced') as HTMLDetailsElement;
    expect(details.open).toBe(false);

    const summary = details.querySelector('summary') as HTMLElement;
    summary.click();
    fixture.detectChanges();
    expect(details.open).toBe(true);
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

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Opened appointment draft-7');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Edit appointment');
    httpTesting.verify();
  });

  it('opens create modal and creates appointment without route navigation', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: { drafts: [] },
    });
    fixture.detectChanges();

    const createButton = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Create appointment'),
    ) as HTMLButtonElement | undefined;
    createButton?.click();
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Create appointment');

    fixture.componentInstance.draftForm.setValue({
      title: 'Modal created',
      appointmentDate: '2026-06-01',
      category: 'meeting',
      notes: 'created from modal',
      classGrade: '',
      guardianName: '',
      location: '',
    });
    fixture.componentInstance.createDraft();
    const createRequest = httpTesting.expectOne('/api/appointments/drafts');
    expect(createRequest.request.method).toBe('POST');
    createRequest.flush({
      data: {
        draft: {
          id: 'modal-1',
          teacherId: 'teacher-1',
          schoolId: 'school-1',
          title: 'Modal created',
          appointmentDate: '2026-06-01',
          category: 'meeting',
          notes: 'created from modal',
          status: 'draft',
          createdAt: new Date().toISOString(),
          images: [],
        },
      },
    });
    const refreshRequest = httpTesting.expectOne('/api/appointments/drafts');
    expect(refreshRequest.request.method).toBe('GET');
    refreshRequest.flush({
      data: {
        drafts: [
          {
            id: 'modal-1',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Modal created',
            appointmentDate: '2026-06-01',
            category: 'meeting',
            notes: 'created from modal',
            status: 'draft',
            createdAt: new Date().toISOString(),
            images: [],
          },
        ],
      },
    });
    fixture.detectChanges();
    expect(fixture.componentInstance.isEditorModalOpen).toBe(false);
  });

  it('applies dedicated filters and supports clear/reset behavior', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'draft-filter-1',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Math meeting',
            appointmentDate: '2026-05-01',
            category: 'meeting',
            notes: '',
            status: 'draft',
            createdAt: new Date().toISOString(),
            images: [],
          },
          {
            id: 'draft-filter-2',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Submitted consult',
            appointmentDate: '2026-05-02',
            category: 'consultation',
            notes: '',
            status: 'submitted',
            submittedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            images: [
              {
                id: 'img-filter-1',
                name: 'proof.png',
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

    fixture.componentInstance.filterForm.patchValue({
      category: 'consultation',
      status: 'submitted',
      hasImages: 'yes',
      lifecycleState: 'submitted',
    });
    fixture.detectChanges();

    expect(fixture.componentInstance.filteredDrafts.length).toBe(1);
    expect(fixture.componentInstance.filteredDrafts[0]?.id).toBe('draft-filter-2');
    expect(fixture.componentInstance.hasActiveFilters).toBe(true);

    fixture.componentInstance.resetFilters();
    fixture.detectChanges();
    expect(fixture.componentInstance.filteredDrafts.length).toBe(2);
    expect(fixture.componentInstance.hasActiveFilters).toBe(false);
  });

  it('filters appointments by unified search term across key fields', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'search-1',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Townhall walkthrough',
            appointmentDate: '2026-05-10',
            category: 'meeting',
            notes: 'Planning route',
            classGrade: '7A',
            guardianName: 'Miller',
            location: 'Town Hall',
            status: 'draft',
            createdAt: new Date().toISOString(),
            images: [],
          },
          {
            id: 'search-2',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Sports day',
            appointmentDate: '2026-05-11',
            category: 'progress',
            notes: 'Field updates',
            classGrade: '5B',
            guardianName: 'Taylor',
            location: 'Gym',
            status: 'submitted',
            submittedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            images: [],
          },
        ],
      },
    });
    fixture.detectChanges();

    fixture.componentInstance.filterForm.patchValue({ searchTerm: 'town hall' });
    fixture.detectChanges();
    expect(fixture.componentInstance.filteredDrafts.length).toBe(1);
    expect(fixture.componentInstance.filteredDrafts[0]?.id).toBe('search-1');

    fixture.componentInstance.filterForm.patchValue({ searchTerm: 'submitted' });
    fixture.detectChanges();
    expect(fixture.componentInstance.filteredDrafts.length).toBe(1);
    expect(fixture.componentInstance.filteredDrafts[0]?.id).toBe('search-2');
  });

  it('filters by class/grade, guardian name, and location metadata', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'meta-1',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Alpha',
            appointmentDate: '2026-05-01',
            category: 'meeting',
            notes: '',
            classGrade: '3A',
            guardianName: 'Miller',
            location: 'Room 101',
            status: 'draft',
            createdAt: new Date().toISOString(),
            images: [],
          },
          {
            id: 'meta-2',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Beta',
            appointmentDate: '2026-05-01',
            category: 'meeting',
            notes: '',
            classGrade: '4B',
            guardianName: 'Schmidt',
            location: 'Room 202',
            status: 'draft',
            createdAt: new Date().toISOString(),
            images: [],
          },
        ],
      },
    });
    fixture.detectChanges();

    fixture.componentInstance.filterForm.patchValue({
      classGrade: '3a',
      guardianName: 'mill',
      location: '101',
    });

    expect(fixture.componentInstance.filteredDrafts.length).toBe(1);
    expect(fixture.componentInstance.filteredDrafts[0]?.id).toBe('meta-1');
  });

  it('combines metadata filters with base filters deterministically', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'combo-1',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Ready combo',
            appointmentDate: '2026-05-02',
            category: 'consultation',
            notes: '',
            classGrade: '5A',
            guardianName: 'Taylor',
            location: 'Main Building',
            status: 'submitted',
            submittedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            images: [],
          },
          {
            id: 'combo-2',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Wrong location',
            appointmentDate: '2026-05-02',
            category: 'consultation',
            notes: '',
            classGrade: '5A',
            guardianName: 'Taylor',
            location: 'Gym',
            status: 'submitted',
            submittedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            images: [],
          },
        ],
      },
    });
    fixture.detectChanges();

    fixture.componentInstance.filterForm.patchValue({
      category: 'consultation',
      status: 'submitted',
      classGrade: '5a',
      guardianName: 'tay',
      location: 'main',
    });
    fixture.detectChanges();

    expect(fixture.componentInstance.filteredDrafts.length).toBe(1);
    expect(fixture.componentInstance.filteredDrafts[0]?.id).toBe('combo-1');
  });

  it('shows no-results guidance when filters have no matches', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'draft-filter-empty',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Only meeting',
            appointmentDate: '2026-05-01',
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

    fixture.componentInstance.filterForm.patchValue({
      category: 'consultation',
    });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('No appointments match current filters. Adjust or clear filters.');
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
      classGrade: '5C',
      guardianName: 'Taylor',
      location: 'East Wing',
    });
    fixture.componentInstance.createDraft();

    const updateRequest = httpTesting.expectOne('/api/appointments/drafts/draft-11');
    expect(updateRequest.request.method).toBe('PATCH');
    expect(updateRequest.request.body).toMatchObject({
      classGrade: '5C',
      guardianName: 'Taylor',
      location: 'East Wing',
    });
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
          classGrade: '5C',
          guardianName: 'Taylor',
          location: 'East Wing',
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
            classGrade: '5C',
            guardianName: 'Taylor',
            location: 'East Wing',
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

  it('opens legacy drafts missing optional metadata without breaking form state', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'legacy-1',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Legacy draft',
            appointmentDate: '2026-05-11',
            category: 'meeting',
            notes: 'no optional fields',
            status: 'draft',
            createdAt: new Date().toISOString(),
            images: [],
          },
        ],
      },
    });
    fixture.detectChanges();

    fixture.componentInstance.openDraft('legacy-1');

    expect(fixture.componentInstance.draftForm.value.classGrade).toBe('');
    expect(fixture.componentInstance.draftForm.value.guardianName).toBe('');
    expect(fixture.componentInstance.draftForm.value.location).toBe('');
    expect(fixture.componentInstance.canSubmit).toBe(true);
  });

  it('keeps submit readiness unchanged when optional metadata is empty', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'draft-optional-empty',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Required-only draft',
            appointmentDate: '2026-05-14',
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

    fixture.componentInstance.openDraft('draft-optional-empty');
    fixture.detectChanges();

    expect(fixture.componentInstance.missingRequiredFields).toEqual([]);
    expect(fixture.componentInstance.canSubmit).toBe(true);

    expect(fixture.componentInstance.draftForm.value.classGrade).toBe('');
    expect(fixture.componentInstance.draftForm.value.guardianName).toBe('');
    expect(fixture.componentInstance.draftForm.value.location).toBe('');
  });

  it('allows submit when optional metadata is only partially filled', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'draft-optional-partial',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Partial optional draft',
            appointmentDate: '2026-05-15',
            category: 'consultation',
            notes: '',
            classGrade: '6A',
            guardianName: '',
            location: undefined,
            status: 'draft',
            createdAt: new Date().toISOString(),
            images: [],
          },
        ],
      },
    });
    fixture.detectChanges();

    fixture.componentInstance.openDraft('draft-optional-partial');
    fixture.detectChanges();

    expect(fixture.componentInstance.missingRequiredFields).toEqual([]);
    expect(fixture.componentInstance.canSubmit).toBe(true);
  });

  it('submits a complete draft and shows submitted timestamp feedback', () => {
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

    fixture.componentInstance.openDraft('draft-20');
    fixture.detectChanges();
    expect(fixture.componentInstance.canSubmit).toBe(true);
    fixture.componentInstance.submitDraft();
    const submitRequest = httpTesting.expectOne('/api/appointments/drafts/draft-20/submit');
    expect(submitRequest.request.method).toBe('POST');
    const submittedAt = new Date().toISOString();
    submitRequest.flush({
      data: {
        submitted: true,
        draftId: 'draft-20',
        submittedAt,
        draft: {
          id: 'draft-20',
          teacherId: 'teacher-1',
          schoolId: 'school-1',
          title: 'Submit me',
          appointmentDate: '2026-04-28',
          category: 'meeting',
          notes: 'ready',
          status: 'submitted',
          submittedAt,
          createdAt: new Date().toISOString(),
          images: [],
        },
      },
    });

    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Draft submitted at');
    expect(fixture.componentInstance.isSelectedDraftSubmitted).toBe(true);
    httpTesting.verify();
  });

  it('shows submit appointment action in modal for selected draft', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'draft-submit-action',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Draft to submit',
            appointmentDate: '2026-06-10',
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

    fixture.componentInstance.openDraft('draft-submit-action');
    fixture.detectChanges();

    const submitButton = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.modal-panel button')).find(
      (button) => button.textContent?.includes('Submit appointment'),
    ) as HTMLButtonElement | undefined;
    expect(submitButton).toBeTruthy();
    expect(submitButton?.disabled).toBe(false);
  });

  it('blocks submit while failed image uploads exist and unblocks after recovery', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'draft-21',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Valid metadata',
            appointmentDate: '2026-04-28',
            category: 'meeting',
            notes: 'ready',
            status: 'draft',
            createdAt: new Date().toISOString(),
            images: [],
          },
        ],
      },
    });
    fixture.detectChanges();
    fixture.componentInstance.openDraft('draft-21');
    fixture.componentInstance.imageUploadStatuses = [
      { id: 'up-fail', name: 'bad.gif', state: 'failed', detail: 'Unsupported format' },
    ];
    expect(fixture.componentInstance.failedImageUploadCount).toBe(1);
    expect(fixture.componentInstance.canSubmit).toBe(false);

    fixture.componentInstance.removeFailedUpload('up-fail');
    expect(fixture.componentInstance.failedImageUploadCount).toBe(0);
    expect(fixture.componentInstance.canSubmit).toBe(true);
  });

  it('allows editing core fields for submitted appointments in modal', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'draft-submitted',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Submitted item',
            appointmentDate: '2026-04-28',
            category: 'meeting',
            notes: 'ready',
            status: 'submitted',
            submittedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            images: [
              {
                id: 'img-submitted',
                name: 'submitted-proof.png',
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
    fixture.componentInstance.openDraft('draft-submitted');
    fixture.detectChanges();

    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Submitted appointments are read-only. Image changes are disabled.');
    expect(html.textContent).toContain('Submitted at');
    expect(html.textContent).toContain('submitted-proof.png');
    expect(html.textContent).toContain('Save appointment');
    expect(html.textContent).toContain('Submit appointment');
    expect(fixture.componentInstance.canSubmit).toBe(false);
    expect(fixture.componentInstance.isSelectedDraftSubmitted).toBe(true);
  });

  it('renders mixed draft and submitted states with explicit text labels', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    const submittedAt = new Date().toISOString();

    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'draft-a',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Draft appointment',
            appointmentDate: '2026-06-01',
            category: 'meeting',
            notes: '',
            status: 'draft',
            createdAt: new Date().toISOString(),
            images: [],
          },
          {
            id: 'draft-b',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Submitted appointment',
            appointmentDate: '2026-06-02',
            category: 'consultation',
            notes: '',
            status: 'submitted',
            submittedAt,
            createdAt: new Date().toISOString(),
            images: [],
          },
        ],
      },
    });
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Draft appointment');
    expect(text).toContain('Submitted appointment');
    expect(text).toContain('draft');
    expect(text).toContain('submitted');
    expect(text).toContain('Last update:');
    expect(text).toContain('submitted ');
  });

  it('shows edited-after-submit indicator in modal for selected submitted entry', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const httpTesting = TestBed.inject(HttpTestingController);
    const submittedAt = new Date('2026-06-02T10:30:00.000Z').toISOString();

    httpTesting.expectOne('/api/appointments/categories').flush({
      data: { categories: ['meeting', 'consultation', 'progress'] },
    });
    httpTesting.expectOne('/api/appointments/drafts').flush({
      data: {
        drafts: [
          {
            id: 'draft-detail-submitted',
            teacherId: 'teacher-1',
            schoolId: 'school-1',
            title: 'Submitted detail',
            appointmentDate: '2026-06-02',
            category: 'progress',
            notes: '',
            status: 'submitted',
            submittedAt,
            editedAfterSubmitAt: submittedAt,
            editedAfterSubmitBy: 'teacher-1',
            createdAt: new Date().toISOString(),
            images: [],
          },
        ],
      },
    });
    fixture.detectChanges();

    fixture.componentInstance.openDraft('draft-detail-submitted');
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Last edited after submit:');
    expect(text).toContain('by teacher-1');
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
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No appointments yet. Create one below to get started.');
    confirmSpy.mockRestore();
  });

  describe('pitch demo reset UI', () => {
    beforeEach(async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [AppointmentsComponent],
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          provideRouter([]),
          { provide: PitchDemoModeService, useValue: { isEnabled: () => true } },
        ],
      }).compileComponents();
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('shows demo reset when pitch demo mode is on and explains API-only sessions', () => {
      const fixture = TestBed.createComponent(AppointmentsComponent);
      const httpTesting = TestBed.inject(HttpTestingController);
      httpTesting.expectOne('/api/appointments/categories').flush({
        data: { categories: ['meeting', 'consultation', 'progress'] },
      });
      httpTesting.expectOne('/api/appointments/drafts').flush({
        data: { drafts: [] },
      });
      fixture.detectChanges();

      const resetButton = Array.from(
        (fixture.nativeElement as HTMLElement).querySelectorAll('.header-actions button'),
      ).find((button) => button.textContent?.includes('Reset demo data')) as HTMLButtonElement | undefined;
      expect(resetButton).toBeTruthy();
      resetButton?.click();
      fixture.detectChanges();

      const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
      expect(text).toContain('in-browser demo store');
    });

    it('does not render the 7-minute teacher demo path panel', () => {
      const fixture = TestBed.createComponent(AppointmentsComponent);
      const httpTesting = TestBed.inject(HttpTestingController);
      httpTesting.expectOne('/api/appointments/categories').flush({
        data: { categories: ['meeting', 'consultation', 'progress'] },
      });
      httpTesting.expectOne('/api/appointments/drafts').flush({
        data: {
          drafts: [
            {
              id: 'demo-ready',
              teacherId: 'teacher-1',
              schoolId: 'school-1',
              title: 'Ready draft',
              appointmentDate: '2026-06-10',
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

      const html = fixture.nativeElement as HTMLElement;
      const panelText = html.textContent ?? '';
      expect(panelText).not.toContain('7-minute teacher demo path');
    });
  });

  describe('pitch demo reset with dummy session', () => {
    const memoryStore: Record<string, string> = {};

    beforeEach(async () => {
      TestBed.resetTestingModule();
      for (const key of Object.keys(memoryStore)) {
        delete memoryStore[key];
      }
      vi.stubGlobal('localStorage', {
        getItem: (key: string) => memoryStore[key] ?? null,
        setItem: (key: string, value: string) => {
          memoryStore[key] = value;
        },
        removeItem: (key: string) => {
          delete memoryStore[key];
        },
        clear: () => {
          for (const key of Object.keys(memoryStore)) {
            delete memoryStore[key];
          }
        },
        key: (index: number) => Object.keys(memoryStore)[index] ?? null,
        get length() {
          return Object.keys(memoryStore).length;
        },
      });
      globalThis.localStorage.setItem('sc_dummy_session', 'active');

      await TestBed.configureTestingModule({
        imports: [AppointmentsComponent],
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          provideRouter([]),
          { provide: PitchDemoModeService, useValue: { isEnabled: () => true } },
        ],
      }).compileComponents();
    });

    afterEach(() => {
      vi.unstubAllGlobals();
      TestBed.resetTestingModule();
    });

    it('restores canonical seed drafts without HTTP list calls', async () => {
      const fixture = TestBed.createComponent(AppointmentsComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(fixture.componentInstance.drafts.length).toBe(0);

      fixture.componentInstance.onResetPitchDemo();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(fixture.componentInstance.drafts.map((d) => d.id).sort()).toEqual(
        ['demo-seed-attention-1', 'demo-seed-filters-1', 'demo-seed-ready-1', 'demo-seed-submitted-1'].sort(),
      );
      const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
      expect(text).toContain(DEMO_SEED_VERSION);
      expect(text).toContain('restored');
    });
  });
});
