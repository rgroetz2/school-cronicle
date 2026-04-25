import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { DEMO_SEED_VERSION } from './demo-seed';

describe('AuthApiService pitch demo reset', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [AuthApiService, provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('restore canonical seed after dummy sign-in and clears prior dummy drafts', async () => {
    const service = TestBed.inject(AuthApiService);
    await firstValueFrom(service.signIn('presenter@school.local', 'demo-pass'));

    await firstValueFrom(
      service.createDraft({
        title: 'Scratch',
        appointmentDate: '2026-07-01',
        category: 'meeting',
        notes: 'to be cleared',
      }),
    );

    const before = await firstValueFrom(service.listDrafts());
    expect(before.length).toBeGreaterThanOrEqual(1);

    const reset = await firstValueFrom(service.resetPitchDemoData());
    expect(reset.version).toBe(DEMO_SEED_VERSION);
    expect(reset.draftCount).toBe(4);

    const after = await firstValueFrom(service.listDrafts());
    expect(after.map((d) => d.id).sort()).toEqual(
      ['demo-seed-attention-1', 'demo-seed-filters-1', 'demo-seed-ready-1', 'demo-seed-submitted-1'].sort(),
    );

    const profile = await firstValueFrom(service.getTeacherProfile());
    expect(profile.displayName).toContain('Alex Teacher');
    expect(profile.contactEmail).toBe('demo.teacher@school.local');

    TestBed.inject(HttpTestingController).verify();
  });

  it('returns zero drafts when reset runs without dummy session', async () => {
    const service = TestBed.inject(AuthApiService);
    const reset = await firstValueFrom(service.resetPitchDemoData());
    expect(reset.draftCount).toBe(0);
    TestBed.inject(HttpTestingController).verify();
  });
});

describe('AuthApiService deleteContact', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [AuthApiService, provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('deletes contact in dummy session and returns true', async () => {
    const service = TestBed.inject(AuthApiService);
    await firstValueFrom(service.signIn('teacher@school.local', 'password'));
    const created = await firstValueFrom(
      service.createContact({
        name: 'Delete Me',
        role: 'teacher',
        email: 'delete@school.local',
      }),
    );

    const deleted = await firstValueFrom(service.deleteContact(created.id));
    expect(deleted).toBe(true);

    const contacts = await firstValueFrom(service.listContacts());
    expect(contacts.some((contact) => contact.id === created.id)).toBe(false);

    TestBed.inject(HttpTestingController).verify();
  });

  it('calls contacts delete endpoint and returns deleted flag', async () => {
    const service = TestBed.inject(AuthApiService);
    const httpTesting = TestBed.inject(HttpTestingController);
    const pending = firstValueFrom(service.deleteContact('contact-123'));
    const request = httpTesting.expectOne('/api/contacts/contact-123');
    expect(request.request.method).toBe('DELETE');
    request.flush({
      data: {
        deleted: true,
        contactId: 'contact-123',
      },
    });

    await expect(pending).resolves.toBe(true);
    httpTesting.verify();
  });

  it('propagates api errors for delete failures', async () => {
    const service = TestBed.inject(AuthApiService);
    const httpTesting = TestBed.inject(HttpTestingController);
    const pending = firstValueFrom(service.deleteContact('contact-missing'));
    const request = httpTesting.expectOne('/api/contacts/contact-missing');
    request.flush({ error: 'not found' }, { status: 404, statusText: 'Not Found' });

    await expect(pending).rejects.toBeTruthy();
    httpTesting.verify();
  });
});

describe('AuthApiService chronicle export command paths', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [AuthApiService, provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('calls markdown export endpoint for markdown command path', async () => {
    const service = TestBed.inject(AuthApiService);
    const httpTesting = TestBed.inject(HttpTestingController);
    const pending = firstValueFrom(service.exportChronicleMarkdown(['draft-1']));

    const request = httpTesting.expectOne('/api/appointments/chronicle/export-md');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ appointmentIds: ['draft-1'] });
    request.flush({
      data: {
        fileName: 'chronicle-2026-04-25.md',
        mimeType: 'text/markdown; charset=utf-8',
        base64: 'IyBDaHJvbmljbGUgRXhwb3J0',
        exportedAppointmentIds: ['draft-1'],
      },
    });

    await expect(pending).resolves.toMatchObject({
      fileName: 'chronicle-2026-04-25.md',
      mimeType: 'text/markdown; charset=utf-8',
      exportedAppointmentIds: ['draft-1'],
    });
    httpTesting.verify();
  });

  it('keeps docx export endpoint unchanged', async () => {
    const service = TestBed.inject(AuthApiService);
    const httpTesting = TestBed.inject(HttpTestingController);
    const pending = firstValueFrom(service.exportChronicle(['draft-2']));

    const request = httpTesting.expectOne('/api/appointments/chronicle/export');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ appointmentIds: ['draft-2'] });
    request.flush({
      data: {
        fileName: 'chronicle-2026-04-25.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        base64: 'UEsDBAoAAAAA',
        exportedAppointmentIds: ['draft-2'],
      },
    });

    await expect(pending).resolves.toMatchObject({
      fileName: 'chronicle-2026-04-25.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      exportedAppointmentIds: ['draft-2'],
    });
    httpTesting.verify();
  });

  it('includes contacts and selected appointments in dummy markdown export', async () => {
    const service = TestBed.inject(AuthApiService);
    await firstValueFrom(service.signIn('teacher@school.local', 'password'));

    const contact = await firstValueFrom(
      service.createContact({
        name: 'Nora Parent',
        role: 'parent',
        email: 'nora@school.local',
      }),
    );
    const draft = await firstValueFrom(
      service.createDraft({
        title: 'Selected appointment',
        appointmentDate: '2026-09-10',
        category: 'meeting',
        notes: 'Selected notes',
        participantContactIds: [contact.id],
      }),
    );

    const artifact = await firstValueFrom(service.exportChronicleMarkdown([draft.id]));
    const markdown = globalThis.atob(artifact.base64);

    expect(markdown).toContain('## Contact persons');
    expect(markdown).toContain(`id=${contact.id}; name=${contact.name}; role=${contact.role}`);
    expect(markdown).toContain('## Appointments');
    expect(markdown).toContain(`### ${draft.title}`);
    expect(artifact.exportedAppointmentIds).toEqual([draft.id]);
    expect(markdown).not.toContain('Demo appointment metadata');

    TestBed.inject(HttpTestingController).verify();
  });

  it('supports utf-8 contact names in dummy markdown export', async () => {
    const service = TestBed.inject(AuthApiService);
    await firstValueFrom(service.signIn('teacher@school.local', 'password'));

    const contact = await firstValueFrom(
      service.createContact({
        name: 'Rüdolf Parent',
        role: 'parent',
      }),
    );
    const draft = await firstValueFrom(
      service.createDraft({
        title: 'Unicode appointment',
        appointmentDate: '2026-09-11',
        category: 'meeting',
        notes: 'Nötë',
        participantContactIds: [contact.id],
      }),
    );

    const artifact = await firstValueFrom(service.exportChronicleMarkdown([draft.id]));
    const binary = globalThis.atob(artifact.base64);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const markdown = new TextDecoder().decode(bytes);

    expect(markdown).toContain('Rüdolf Parent');
    expect(artifact.exportedAppointmentIds).toEqual([draft.id]);
    TestBed.inject(HttpTestingController).verify();
  });
});
