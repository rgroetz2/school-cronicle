import { Injectable } from '@nestjs/common';
import { SessionService } from './session.service';
import { SignInResult } from './auth.types';

@Injectable()
export class AuthService {
  private readonly validEmail =
    process.env.SC_TEACHER_EMAIL ?? 'teacher@school.local';
  private readonly validPassword =
    process.env.SC_TEACHER_PASSWORD ?? 'teachpass123';

  constructor(private readonly sessionService: SessionService) {}

  signIn(email: string, password: string, currentSessionId?: string): SignInResult | null {
    if (!this.isValidCredentials(email, password)) {
      return null;
    }

    this.sessionService.invalidateSession(currentSessionId);
    const session = this.sessionService.createSession('teacher-1', email.toLowerCase());

    return {
      teacherId: session.teacherId,
      email: session.email,
      sessionId: session.id,
    };
  }

  private isValidCredentials(email: string, password: string): boolean {
    return (
      email.toLowerCase() === this.validEmail.toLowerCase() &&
      password === this.validPassword
    );
  }
}
