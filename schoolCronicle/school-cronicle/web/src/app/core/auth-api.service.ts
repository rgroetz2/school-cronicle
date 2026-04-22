import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, timeout } from 'rxjs';

interface SignInResponse {
  data: {
    teacherId: string;
    email: string;
  };
}

interface SessionProbeResponse {
  data: {
    authenticated: boolean;
  };
}

export interface CreateDraftInput {
  title: string;
  appointmentDate: string;
  category: string;
  notes: string;
}

export interface AppointmentDraft {
  id: string;
  teacherId: string;
  schoolId: string;
  title: string;
  appointmentDate: string;
  category: string;
  notes: string;
  status: 'draft' | 'submitted';
  createdAt: string;
  submittedAt?: string;
  images: DraftImage[];
}

export interface DraftImage {
  id: string;
  name: string;
  mimeType: string;
  dataUrl: string;
  addedAt: string;
}

export interface TeacherProfile {
  displayName: string;
  contactEmail: string;
}

export interface PrivacyRequestAuditEvent {
  id: string;
  type: 'erasure' | 'restriction';
  teacherId: string;
  initiatedAt: string;
}

interface CreateDraftResponse {
  data: {
    draft: AppointmentDraft;
  };
}

interface ListDraftsResponse {
  data: {
    drafts: AppointmentDraft[];
  };
}

interface ListCategoriesResponse {
  data: {
    categories: string[];
  };
}

interface SubmitDraftResponse {
  data: {
    submitted: boolean;
    draftId: string;
    submittedAt?: string;
    draft: AppointmentDraft;
  };
}

interface DeleteDraftResponse {
  data: {
    deleted: boolean;
    draftId: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private static readonly DUMMY_SESSION_KEY = 'sc_dummy_session';
  private static readonly DUMMY_DRAFTS_KEY = 'sc_dummy_drafts';
  private static readonly DUMMY_PROFILE_KEY = 'sc_dummy_profile';
  private static readonly DUMMY_PRIVACY_EVENTS_KEY = 'sc_dummy_privacy_events';
  private static readonly DUMMY_CATEGORIES = ['meeting', 'consultation', 'progress'];
  private static readonly SIGN_IN_TIMEOUT_MS = 10000;
  private readonly http = inject(HttpClient);
  private inMemoryDummySession = false;
  private inMemoryDummyDrafts: AppointmentDraft[] = [];
  private inMemoryDummyProfile: TeacherProfile = {
    displayName: 'Teacher Account',
    contactEmail: 'teacher@school.local',
  };
  private inMemoryPrivacyEvents: PrivacyRequestAuditEvent[] = [];

  signIn(email: string, password: string): Observable<SignInResponse['data']> {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password.trim()) {
      return this.http
        .post<SignInResponse>('/api/auth/sign-in', { email, password })
        .pipe(
          timeout(AuthApiService.SIGN_IN_TIMEOUT_MS),
          map((response) => response.data),
        );
    }

    this.setDummySession();
    return of({
      teacherId: 'teacher-1',
      email: normalizedEmail,
    });
  }

  signOut(): Observable<boolean> {
    this.clearDummySession();
    return of(true);
  }

  verifySession(): Observable<boolean> {
    const hasDummySession = this.hasDummySession();
    if (hasDummySession) {
      return of(true);
    }

    return this.http
      .get<SessionProbeResponse>('/api/auth/session')
      .pipe(map((response) => response.data.authenticated));
  }

  private hasDummySession(): boolean {
    const storage = this.getStorage();
    if (!storage) {
      return this.inMemoryDummySession;
    }

    return storage.getItem(AuthApiService.DUMMY_SESSION_KEY) === 'active';
  }

  private setDummySession(): void {
    const storage = this.getStorage();
    if (!storage) {
      this.inMemoryDummySession = true;
      return;
    }

    storage.setItem(AuthApiService.DUMMY_SESSION_KEY, 'active');
  }

  private clearDummySession(): void {
    const storage = this.getStorage();
    if (!storage) {
      this.inMemoryDummySession = false;
      return;
    }

    storage.removeItem(AuthApiService.DUMMY_SESSION_KEY);
  }

  private getStorage():
    | {
        getItem(key: string): string | null;
        setItem(key: string, value: string): void;
        removeItem(key: string): void;
      }
    | undefined {
    const candidate = (globalThis as { localStorage?: unknown }).localStorage as
      | {
          getItem?: unknown;
          setItem?: unknown;
          removeItem?: unknown;
        }
      | undefined;

    if (
      candidate &&
      typeof candidate.getItem === 'function' &&
      typeof candidate.setItem === 'function' &&
      typeof candidate.removeItem === 'function'
    ) {
      return candidate as {
        getItem(key: string): string | null;
        setItem(key: string, value: string): void;
        removeItem(key: string): void;
      };
    }

    return undefined;
  }

  createDraft(input: CreateDraftInput): Observable<AppointmentDraft> {
    if (this.hasDummySession()) {
      const draft: AppointmentDraft = {
        id: `draft-${Date.now()}`,
        teacherId: 'teacher-1',
        schoolId: 'school-1',
        title: input.title.trim(),
        appointmentDate: input.appointmentDate.trim(),
        category: input.category.trim(),
        notes: input.notes.trim(),
        status: 'draft',
        createdAt: new Date().toISOString(),
        images: [],
      };

      const drafts = this.readDummyDrafts();
      drafts.push(draft);
      this.writeDummyDrafts(drafts);

      return of(draft);
    }

    return this.http
      .post<CreateDraftResponse>('/api/appointments/drafts', input)
      .pipe(map((response) => response.data.draft));
  }

  listDrafts(): Observable<CreateDraftResponse['data']['draft'][]> {
    if (this.hasDummySession()) {
      return of(this.readDummyDrafts().map((draft) => this.normalizeDraftImages(draft)));
    }

    return this.http
      .get<ListDraftsResponse>('/api/appointments/drafts')
      .pipe(map((response) => response.data.drafts.map((draft) => this.normalizeDraftImages(draft))));
  }

  updateDraft(draftId: string, input: CreateDraftInput): Observable<AppointmentDraft> {
    if (this.hasDummySession()) {
      const drafts = this.readDummyDrafts();
      const target = drafts.find((draft) => draft.id === draftId);
      if (!target) {
        return of({
          id: draftId,
          teacherId: 'teacher-1',
          schoolId: 'school-1',
          title: input.title.trim(),
          appointmentDate: input.appointmentDate.trim(),
          category: input.category.trim(),
          notes: input.notes.trim(),
          status: 'draft',
          createdAt: new Date().toISOString(),
          images: [],
        });
      }
      if (target.status === 'submitted') {
        return of(target);
      }

      target.title = input.title.trim();
      target.appointmentDate = input.appointmentDate.trim();
      target.category = input.category.trim();
      target.notes = input.notes.trim();
      this.writeDummyDrafts(drafts);
      return of(target);
    }

    return this.http
      .patch<CreateDraftResponse>(`/api/appointments/drafts/${draftId}`, input)
      .pipe(map((response) => response.data.draft));
  }

  listCategories(): Observable<string[]> {
    if (this.hasDummySession()) {
      return of([...AuthApiService.DUMMY_CATEGORIES]);
    }

    return this.http
      .get<ListCategoriesResponse>('/api/appointments/categories')
      .pipe(map((response) => response.data.categories));
  }

  submitDraft(draftId: string): Observable<SubmitDraftResponse['data']> {
    if (this.hasDummySession()) {
      const drafts = this.readDummyDrafts();
      const draft = drafts.find((item) => item.id === draftId);
      const missingRequiredFields = [
        !draft?.title.trim() ? 'title' : null,
        !draft?.appointmentDate.trim() ? 'appointmentDate' : null,
        !draft?.category.trim() ? 'category' : null,
      ].filter((value): value is string => Boolean(value));
      if (!draft) {
        return of({
          submitted: false,
          draftId,
          draft: {
            id: draftId,
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
        });
      }
      if (missingRequiredFields.length > 0 || draft.status === 'submitted') {
        return of({
          submitted: false,
          draftId,
          draft,
        });
      }

      draft.status = 'submitted';
      draft.submittedAt = new Date().toISOString();
      this.writeDummyDrafts(drafts);

      return of({
        submitted: true,
        draftId,
        submittedAt: draft.submittedAt,
        draft,
      });
    }

    return this.http
      .post<SubmitDraftResponse>(`/api/appointments/drafts/${draftId}/submit`, {})
      .pipe(map((response) => response.data));
  }

  attachImageToDraft(
    draftId: string,
    image: Omit<DraftImage, 'id' | 'addedAt'>,
  ): Observable<AppointmentDraft | undefined> {
    if (!this.hasDummySession()) {
      return this.http
        .post<CreateDraftResponse>(`/api/appointments/drafts/${draftId}/images`, image)
        .pipe(map((response) => response.data.draft));
    }

    const drafts = this.readDummyDrafts();
    const draft = drafts.find((item) => item.id === draftId);
    if (!draft) {
      return of(undefined);
    }
    if (draft.status === 'submitted') {
      return of(draft);
    }

    draft.images = [
      ...draft.images,
      {
        id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: image.name,
        mimeType: image.mimeType,
        dataUrl: image.dataUrl,
        addedAt: new Date().toISOString(),
      },
    ];
    this.writeDummyDrafts(drafts);
    return of(draft);
  }

  removeImageFromDraft(draftId: string, imageId: string): Observable<AppointmentDraft | undefined> {
    const drafts = this.readDummyDrafts();
    const draft = drafts.find((item) => item.id === draftId);
    if (!draft) {
      return of(undefined);
    }
    if (draft.status === 'submitted') {
      return of(draft);
    }

    draft.images = draft.images.filter((image) => image.id !== imageId);
    this.writeDummyDrafts(drafts);
    return of(draft);
  }

  deleteDraft(draftId: string): Observable<boolean> {
    if (this.hasDummySession()) {
      const drafts = this.readDummyDrafts();
      const target = drafts.find((draft) => draft.id === draftId);
      if (target?.status === 'submitted') {
        return of(false);
      }
      const nextDrafts = drafts.filter((draft) => draft.id !== draftId);
      this.writeDummyDrafts(nextDrafts);
      return of(nextDrafts.length !== drafts.length);
    }

    return this.http
      .delete<DeleteDraftResponse>(`/api/appointments/drafts/${draftId}`)
      .pipe(map((response) => response.data.deleted));
  }

  getTeacherProfile(): Observable<TeacherProfile> {
    return of(this.readTeacherProfile());
  }

  updateTeacherProfile(profile: TeacherProfile): Observable<TeacherProfile> {
    const normalized: TeacherProfile = {
      displayName: profile.displayName.trim(),
      contactEmail: profile.contactEmail.trim().toLowerCase(),
    };
    this.writeTeacherProfile(normalized);
    return of(normalized);
  }

  invokePrivacyRequest(type: 'erasure' | 'restriction'): Observable<PrivacyRequestAuditEvent> {
    const event: PrivacyRequestAuditEvent = {
      id: `privacy-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      teacherId: 'teacher-1',
      initiatedAt: new Date().toISOString(),
    };
    this.writePrivacyAuditEvent(event);
    return of(event);
  }

  private readDummyDrafts(): AppointmentDraft[] {
    const storage = this.getStorage();
    if (!storage) {
      return [...this.inMemoryDummyDrafts].map((draft) => this.normalizeDraftImages(draft));
    }

    const serialized = storage.getItem(AuthApiService.DUMMY_DRAFTS_KEY);
    if (!serialized) {
      return [];
    }

    try {
      const parsed = JSON.parse(serialized) as AppointmentDraft[];
      return Array.isArray(parsed) ? parsed.map((draft) => this.normalizeDraftImages(draft)) : [];
    } catch {
      return [];
    }
  }

  private writeDummyDrafts(drafts: AppointmentDraft[]): void {
    const storage = this.getStorage();
    if (!storage) {
      this.inMemoryDummyDrafts = [...drafts];
      return;
    }

    storage.setItem(AuthApiService.DUMMY_DRAFTS_KEY, JSON.stringify(drafts));
  }

  private normalizeDraftImages(draft: AppointmentDraft): AppointmentDraft {
    return {
      ...draft,
      status: draft.status === 'submitted' ? 'submitted' : 'draft',
      submittedAt: draft.status === 'submitted' ? draft.submittedAt : undefined,
      images: Array.isArray(draft.images) ? draft.images : [],
    };
  }

  private readTeacherProfile(): TeacherProfile {
    const fallback: TeacherProfile = {
      displayName: 'Teacher Account',
      contactEmail: 'teacher@school.local',
    };
    const storage = this.getStorage();
    if (!storage) {
      return this.inMemoryDummyProfile;
    }

    const serialized = storage.getItem(AuthApiService.DUMMY_PROFILE_KEY);
    if (!serialized) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(serialized) as Partial<TeacherProfile>;
      const displayName = typeof parsed.displayName === 'string' ? parsed.displayName.trim() : '';
      const contactEmail = typeof parsed.contactEmail === 'string' ? parsed.contactEmail.trim() : '';
      if (!displayName || !contactEmail) {
        return fallback;
      }
      return {
        displayName,
        contactEmail,
      };
    } catch {
      return fallback;
    }
  }

  private writeTeacherProfile(profile: TeacherProfile): void {
    const storage = this.getStorage();
    if (!storage) {
      this.inMemoryDummyProfile = profile;
      return;
    }

    storage.setItem(AuthApiService.DUMMY_PROFILE_KEY, JSON.stringify(profile));
  }

  private writePrivacyAuditEvent(event: PrivacyRequestAuditEvent): void {
    const storage = this.getStorage();
    if (!storage) {
      this.inMemoryPrivacyEvents = [event, ...this.inMemoryPrivacyEvents].slice(0, 50);
      return;
    }

    const serialized = storage.getItem(AuthApiService.DUMMY_PRIVACY_EVENTS_KEY);
    let current: PrivacyRequestAuditEvent[] = [];
    if (serialized) {
      try {
        current = (JSON.parse(serialized) as PrivacyRequestAuditEvent[]) ?? [];
      } catch {
        current = [];
      }
    }
    const next = [event, ...current].slice(0, 50);
    storage.setItem(AuthApiService.DUMMY_PRIVACY_EVENTS_KEY, JSON.stringify(next));
  }
}
