import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthApiService } from '../../core/auth-api.service';
import { PitchDemoModeService } from '../../core/pitch-demo-mode.service';
import { AppointmentsComponent } from './appointments.component';

describe('AppointmentsComponent mode actions', () => {
  const authApiMock = {
    listContactRoles: vi.fn(() => ['teacher']),
    getTeacherProfile: vi.fn(() => of({ displayName: 'Teacher Account' })),
    listCategories: vi.fn(() => of([])),
    listDrafts: vi.fn(() => of([])),
    listContacts: vi.fn(() => of([])),
    exportChronicle: vi.fn(() =>
      of({
        fileName: 'chronicle.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        base64: 'UEsDBAoAAAAA',
        exportedAppointmentIds: ['draft-1'],
      }),
    ),
    exportChronicleMarkdown: vi.fn(() =>
      of({
        fileName: 'chronicle.md',
        mimeType: 'text/markdown; charset=utf-8',
        base64: 'IyBDaHJvbmljbGUgRXhwb3J0',
        exportedAppointmentIds: ['draft-1'],
      }),
    ),
  };
  const pitchDemoMock = { isEnabled: vi.fn(() => false) };
  const activatedRouteMock = { queryParamMap: of(convertToParamMap({})) };
  const routerMock = { navigate: vi.fn(), navigateByUrl: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthApiService, useValue: authApiMock },
        { provide: PitchDemoModeService, useValue: pitchDemoMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('allows create action only in create mode', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const component = fixture.componentInstance;
    const createSpy = vi.spyOn(component, 'createDraft');

    component.selectedDraftId = null;
    component.onAppointmentCreateAction();
    expect(createSpy).toHaveBeenCalledTimes(1);

    component.selectedDraftId = 'existing';
    component.onAppointmentCreateAction();
    expect(createSpy).toHaveBeenCalledTimes(1);
  });

  it('allows save action only in edit mode', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const component = fixture.componentInstance;
    const createSpy = vi.spyOn(component, 'createDraft');

    component.selectedDraftId = null;
    component.onAppointmentSaveAction();
    expect(createSpy).toHaveBeenCalledTimes(0);

    component.selectedDraftId = 'existing';
    component.onAppointmentSaveAction();
    expect(createSpy).toHaveBeenCalledTimes(1);
  });

  it('shows create-only action labels in create mode', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const component = fixture.componentInstance;
    component.isEditorModalOpen = true;
    component.selectedDraftId = null;
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Create appointment');
    expect(text).not.toContain('Save appointment');
    expect(text).not.toContain('Delete appointment');
  });

  it('shows save-and-delete labels in edit mode', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const component = fixture.componentInstance;
    component.isEditorModalOpen = true;
    component.selectedDraftId = 'draft-1';
    fixture.detectChanges();

    const modalPanel = (fixture.nativeElement as HTMLElement).querySelector('.modal-panel') as HTMLElement;
    const text = modalPanel?.textContent ?? '';
    expect(text).toContain('Save appointment');
    expect(text).toContain('Delete appointment');
    expect(text).not.toContain('Create appointment');
  });

  it('preserves selection and shows feedback when markdown export fails', () => {
    const fixture = TestBed.createComponent(AppointmentsComponent);
    const component = fixture.componentInstance;
    const originalCreateObjectURL = URL.createObjectURL;
    const originalRevokeObjectURL = URL.revokeObjectURL;
    const createObjectURLSpy = vi.fn(() => 'blob:failed-md-export');
    const revokeObjectURLSpy = vi.fn();
    URL.createObjectURL = createObjectURLSpy;
    URL.revokeObjectURL = revokeObjectURLSpy;
    authApiMock.exportChronicleMarkdown.mockReturnValueOnce(
      throwError(() => new Error('export failed')),
    );

    component.selectedChronicleAppointmentIds = ['draft-1'];
    component.exportChronicleMarkdown();

    expect(component.selectedChronicleAppointmentIds).toEqual(['draft-1']);
    expect(component.draftSavedMessage).toBe('Chronicle markdown export failed.');
    expect(createObjectURLSpy).not.toHaveBeenCalled();
    expect(component.isExportingChronicleMarkdown).toBe(false);

    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });
});
