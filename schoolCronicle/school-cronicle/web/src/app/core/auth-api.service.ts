import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, timeout } from 'rxjs';
import { buildDemoSeedDrafts, buildDemoSeedProfile, DEMO_SEED_VERSION } from './demo-seed';

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
  classGrade?: string;
  guardianName?: string;
  location?: string;
  participantContactIds?: string[];
}

export interface AppointmentParticipant {
  contactId: string;
  name: string;
  role: string;
}

export interface AppointmentDraft {
  id: string;
  teacherId: string;
  schoolId: string;
  title: string;
  appointmentDate: string;
  category: string;
  notes: string;
  classGrade?: string;
  guardianName?: string;
  location?: string;
  status: 'draft' | 'submitted';
  createdAt: string;
  submittedAt?: string;
  editedAfterSubmitAt?: string;
  editedAfterSubmitBy?: string;
  participants?: AppointmentParticipant[];
  chronicleExportEligible?: boolean;
  images: DraftImage[];
}

export interface DraftImage {
  id: string;
  name: string;
  mimeType: string;
  dataUrl: string;
  addedAt: string;
  printableInChronicle?: boolean;
}

export interface TeacherProfile {
  displayName: string;
  contactEmail: string;
}

export type SchoolContactRole = 'teacher' | 'parent' | 'staff' | 'partner';

export interface SchoolContact {
  id: string;
  schoolId: string;
  createdByTeacherId: string;
  name: string;
  role: SchoolContactRole;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertSchoolContactInput {
  name: string;
  role: SchoolContactRole;
  email?: string;
  phone?: string;
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

interface ListContactsResponse {
  data: {
    contacts: SchoolContact[];
  };
}

interface UpsertContactResponse {
  data: {
    contact: SchoolContact;
  };
}

interface DeleteContactResponse {
  data: {
    deleted: boolean;
    contactId: string;
  };
}

interface ChronicleExportResponse {
  data: {
    fileName: string;
    mimeType: string;
    base64: string;
    exportedAppointmentIds: string[];
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
  private static readonly DUMMY_CONTACTS_KEY = 'sc_dummy_contacts';
  private static readonly DUMMY_CATEGORIES = ['meeting', 'consultation', 'progress', 'special_event'];
  private static readonly DUMMY_CONTACT_ROLES: SchoolContactRole[] = ['teacher', 'parent', 'staff', 'partner'];
  private static readonly SIGN_IN_TIMEOUT_MS = 10000;
  private readonly http = inject(HttpClient);
  private inMemoryDummySession = false;
  private inMemoryDummyDrafts: AppointmentDraft[] = [];
  private inMemoryDummyProfile: TeacherProfile = {
    displayName: 'Teacher Account',
    contactEmail: 'teacher@school.local',
  };
  private inMemoryPrivacyEvents: PrivacyRequestAuditEvent[] = [];
  private inMemoryDummyContacts: SchoolContact[] = [];

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
      const contacts = this.readDummyContacts();
      const draft: AppointmentDraft = {
        id: `draft-${Date.now()}`,
        teacherId: 'teacher-1',
        schoolId: 'school-1',
        title: input.title.trim(),
        appointmentDate: input.appointmentDate.trim(),
        category: input.category.trim(),
        notes: input.notes.trim(),
        classGrade: input.classGrade?.trim() || undefined,
        guardianName: input.guardianName?.trim() || undefined,
        location: input.location?.trim() || undefined,
        participants: (input.participantContactIds ?? [])
          .map((contactId) => contacts.find((contact) => contact.id === contactId))
          .filter((contact): contact is SchoolContact => Boolean(contact))
          .map((contact) => ({ contactId: contact.id, name: contact.name, role: contact.role })),
        chronicleExportEligible: input.category.trim() === 'special_event',
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
          classGrade: input.classGrade?.trim() || undefined,
          guardianName: input.guardianName?.trim() || undefined,
          location: input.location?.trim() || undefined,
          participants: [],
          chronicleExportEligible: input.category.trim() === 'special_event',
          status: 'draft',
          createdAt: new Date().toISOString(),
          images: [],
        });
      }
      target.title = input.title.trim();
      target.appointmentDate = input.appointmentDate.trim();
      target.category = input.category.trim();
      target.notes = input.notes.trim();
      target.classGrade = input.classGrade?.trim() || undefined;
      target.guardianName = input.guardianName?.trim() || undefined;
      target.location = input.location?.trim() || undefined;
      target.chronicleExportEligible = input.category.trim() === 'special_event';
      if (Array.isArray(input.participantContactIds)) {
        const contacts = this.readDummyContacts();
        target.participants = input.participantContactIds
          .map((contactId) => contacts.find((contact) => contact.id === contactId))
          .filter((contact): contact is SchoolContact => Boolean(contact))
          .map((contact) => ({ contactId: contact.id, name: contact.name, role: contact.role }));
      }
      if (target.status === 'submitted') {
        target.editedAfterSubmitAt = new Date().toISOString();
        target.editedAfterSubmitBy = target.teacherId;
      }
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
            classGrade: undefined,
            guardianName: undefined,
            location: undefined,
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
    if (draft.images.length >= 5) {
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
        printableInChronicle: false,
      },
    ];
    this.writeDummyDrafts(drafts);
    return of(draft);
  }

  setImagePrintable(
    draftId: string,
    imageId: string,
    printable: boolean,
  ): Observable<AppointmentDraft | undefined> {
    if (!this.hasDummySession()) {
      return this.http
        .patch<CreateDraftResponse>(`/api/appointments/drafts/${draftId}/images/${imageId}/printable`, {
          printable,
        })
        .pipe(map((response) => response.data.draft));
    }
    const drafts = this.readDummyDrafts();
    const draft = drafts.find((item) => item.id === draftId);
    if (!draft || draft.status === 'submitted') {
      return of(draft);
    }
    const target = draft.images.find((image) => image.id === imageId);
    if (!target) {
      return of(draft);
    }
    if (printable) {
      const printableCount = draft.images.filter((image) => image.printableInChronicle).length;
      if (!target.printableInChronicle && printableCount >= 3) {
        return of(draft);
      }
    }
    target.printableInChronicle = printable;
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
      const nextDrafts = drafts.filter((draft) => draft.id !== draftId);
      this.writeDummyDrafts(nextDrafts);
      return of(nextDrafts.length !== drafts.length);
    }

    return this.http
      .delete<DeleteDraftResponse>(`/api/appointments/drafts/${draftId}`)
      .pipe(map((response) => response.data.deleted));
  }

  listContactRoles(): SchoolContactRole[] {
    return [...AuthApiService.DUMMY_CONTACT_ROLES];
  }

  listContacts(): Observable<SchoolContact[]> {
    if (this.hasDummySession()) {
      return of(this.readDummyContacts());
    }

    return this.http.get<ListContactsResponse>('/api/contacts').pipe(map((response) => response.data.contacts));
  }

  createContact(input: UpsertSchoolContactInput): Observable<SchoolContact> {
    if (this.hasDummySession()) {
      const contacts = this.readDummyContacts();
      const now = new Date().toISOString();
      const contact: SchoolContact = {
        id: `contact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        schoolId: 'school-1',
        createdByTeacherId: 'teacher-1',
        name: input.name.trim(),
        role: input.role,
        email: input.email?.trim().toLowerCase() || undefined,
        phone: input.phone?.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      };
      contacts.push(contact);
      this.writeDummyContacts(contacts);
      return of(contact);
    }

    return this.http.post<UpsertContactResponse>('/api/contacts', input).pipe(map((response) => response.data.contact));
  }

  updateContact(contactId: string, input: UpsertSchoolContactInput): Observable<SchoolContact> {
    if (this.hasDummySession()) {
      const contacts = this.readDummyContacts();
      const target = contacts.find((contact) => contact.id === contactId);
      if (!target) {
        return this.createContact(input);
      }
      target.name = input.name.trim();
      target.role = input.role;
      target.email = input.email?.trim().toLowerCase() || undefined;
      target.phone = input.phone?.trim() || undefined;
      target.updatedAt = new Date().toISOString();
      this.writeDummyContacts(contacts);
      return of(target);
    }

    return this.http
      .patch<UpsertContactResponse>(`/api/contacts/${contactId}`, input)
      .pipe(map((response) => response.data.contact));
  }

  deleteContact(contactId: string): Observable<boolean> {
    if (this.hasDummySession()) {
      const contacts = this.readDummyContacts();
      const nextContacts = contacts.filter((contact) => contact.id !== contactId);
      this.writeDummyContacts(nextContacts);
      return of(nextContacts.length !== contacts.length);
    }

    return this.http
      .delete<DeleteContactResponse>(`/api/contacts/${contactId}`)
      .pipe(map((response) => response.data.deleted));
  }

  exportChronicle(appointmentIds: string[]): Observable<ChronicleExportResponse['data']> {
    if (this.hasDummySession()) {
      return of({
        fileName: `chronicle-${new Date().toISOString().slice(0, 10)}.docx`,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        base64: '',
        exportedAppointmentIds: [],
      });
    }

    return this.http
      .post<ChronicleExportResponse>('/api/appointments/chronicle/export', { appointmentIds })
      .pipe(map((response) => response.data));
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

  /**
   * True when the in-browser dummy store is active (local demo / pitch path).
   */
  usesDummyClientStore(): boolean {
    return this.hasDummySession();
  }

  /**
   * Clears dummy drafts/profile/privacy events and restores the canonical pitch seed.
   * No-op when not in a dummy session (API-backed sessions are unchanged).
   */
  resetPitchDemoData(): Observable<{ version: string; draftCount: number }> {
    if (!this.hasDummySession()) {
      return of({ version: DEMO_SEED_VERSION, draftCount: 0 });
    }

    this.clearDummyTenantState();
    const drafts = buildDemoSeedDrafts();
    this.writeDummyDrafts(drafts);
    this.writeTeacherProfile(buildDemoSeedProfile());
    return of({ version: DEMO_SEED_VERSION, draftCount: drafts.length });
  }

  private clearDummyTenantState(): void {
    const storage = this.getStorage();
    if (storage) {
      storage.removeItem(AuthApiService.DUMMY_DRAFTS_KEY);
      storage.removeItem(AuthApiService.DUMMY_PROFILE_KEY);
      storage.removeItem(AuthApiService.DUMMY_PRIVACY_EVENTS_KEY);
      storage.removeItem(AuthApiService.DUMMY_CONTACTS_KEY);
    }
    this.inMemoryDummyDrafts = [];
    this.inMemoryDummyProfile = {
      displayName: 'Teacher Account',
      contactEmail: 'teacher@school.local',
    };
    this.inMemoryPrivacyEvents = [];
    this.inMemoryDummyContacts = [];
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

  private readDummyContacts(): SchoolContact[] {
    const storage = this.getStorage();
    if (!storage) {
      return [...this.inMemoryDummyContacts];
    }
    const serialized = storage.getItem(AuthApiService.DUMMY_CONTACTS_KEY);
    if (!serialized) {
      return [];
    }
    try {
      const parsed = JSON.parse(serialized) as SchoolContact[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private writeDummyContacts(contacts: SchoolContact[]): void {
    const storage = this.getStorage();
    if (!storage) {
      this.inMemoryDummyContacts = [...contacts];
      return;
    }
    storage.setItem(AuthApiService.DUMMY_CONTACTS_KEY, JSON.stringify(contacts));
  }

  private normalizeDraftImages(draft: AppointmentDraft): AppointmentDraft {
    return {
      ...draft,
      status: draft.status === 'submitted' ? 'submitted' : 'draft',
      submittedAt: draft.status === 'submitted' ? draft.submittedAt : undefined,
      editedAfterSubmitAt:
        draft.status === 'submitted' ? (draft.editedAfterSubmitAt?.trim() || undefined) : undefined,
      editedAfterSubmitBy:
        draft.status === 'submitted' ? (draft.editedAfterSubmitBy?.trim() || undefined) : undefined,
      classGrade: typeof draft.classGrade === 'string' ? draft.classGrade.trim() || undefined : undefined,
      guardianName: typeof draft.guardianName === 'string' ? draft.guardianName.trim() || undefined : undefined,
      location: typeof draft.location === 'string' ? draft.location.trim() || undefined : undefined,
      participants: Array.isArray(draft.participants)
        ? draft.participants.filter((item) => Boolean(item?.contactId && item?.name && item?.role))
        : [],
      chronicleExportEligible: draft.category === 'special_event',
      images: Array.isArray(draft.images)
        ? draft.images.map((image) => ({
            ...image,
            printableInChronicle: Boolean(image.printableInChronicle),
          }))
        : [],
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
