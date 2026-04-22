import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly http = inject(HttpClient);

  signIn(email: string, password: string): Observable<SignInResponse['data']> {
    return this.http
      .post<SignInResponse>('/api/auth/sign-in', { email, password })
      .pipe(map((response) => response.data));
  }

  signOut(): Observable<boolean> {
    return this.http
      .post<SignOutResponse>('/api/auth/sign-out', {})
      .pipe(map((response) => response.data.signedOut));
  }

  verifySession(): Observable<boolean> {
    return this.http
      .get<SessionProbeResponse>('/api/auth/session')
      .pipe(map((response) => response.data.authenticated));
  }
}
