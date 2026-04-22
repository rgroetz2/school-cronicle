import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

interface SignInResponse {
  data: {
    teacherId: string;
    email: string;
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
}
