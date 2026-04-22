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
  category: string;
  notes: string;
}

interface CreateDraftResponse {
  data: {
    draft: {
      id: string;
      teacherId: string;
      schoolId: string;
      title: string;
      category: string;
      notes: string;
      status: 'draft';
      createdAt: string;
    };
  };
}

interface ListDraftsResponse {
  data: {
    drafts: CreateDraftResponse['data']['draft'][];
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private static readonly DUMMY_SESSION_KEY = 'sc_dummy_session';
  private static readonly DUMMY_DRAFTS_KEY = 'sc_dummy_drafts';
  private static readonly SIGN_IN_TIMEOUT_MS = 10000;
  private readonly http = inject(HttpClient);
  private inMemoryDummySession = false;
  private inMemoryDummyDrafts: CreateDraftResponse['data']['draft'][] = [];

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

  createDraft(input: CreateDraftInput): Observable<CreateDraftResponse['data']['draft']> {
    if (this.hasDummySession()) {
      const draft: CreateDraftResponse['data']['draft'] = {
        id: `draft-${Date.now()}`,
        teacherId: 'teacher-1',
        schoolId: 'school-1',
        title: input.title.trim(),
        category: input.category.trim(),
        notes: input.notes.trim(),
        status: 'draft',
        createdAt: new Date().toISOString(),
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
      return of(this.readDummyDrafts());
    }

    return this.http
      .get<ListDraftsResponse>('/api/appointments/drafts')
      .pipe(map((response) => response.data.drafts));
  }

  private readDummyDrafts(): CreateDraftResponse['data']['draft'][] {
    const storage = this.getStorage();
    if (!storage) {
      return [...this.inMemoryDummyDrafts];
    }

    const serialized = storage.getItem(AuthApiService.DUMMY_DRAFTS_KEY);
    if (!serialized) {
      return [];
    }

    try {
      const parsed = JSON.parse(serialized) as CreateDraftResponse['data']['draft'][];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private writeDummyDrafts(drafts: CreateDraftResponse['data']['draft'][]): void {
    const storage = this.getStorage();
    if (!storage) {
      this.inMemoryDummyDrafts = [...drafts];
      return;
    }

    storage.setItem(AuthApiService.DUMMY_DRAFTS_KEY, JSON.stringify(drafts));
  }
}
