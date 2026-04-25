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
