import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, timeout } from 'rxjs';

interface SignInResponse {
  data: {
    teacherId: string;
    email: string;
  };
}

interface SignOutResponse {
  data: {
    signedOut: boolean;
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

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private static readonly DUMMY_SESSION_KEY = 'sc_dummy_session';
  private static readonly SIGN_IN_TIMEOUT_MS = 10000;
  private readonly http = inject(HttpClient);
  private inMemoryDummySession = false;

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
    return this.http
      .post<CreateDraftResponse>('/api/appointments/drafts', input)
      .pipe(map((response) => response.data.draft));
  }
}
