import { Injectable } from '@nestjs/common';
import { SessionService } from './session.service';
import { SignInFailureReason, SignInResult } from './auth.types';

@Injectable()
export class AuthService {
  private readonly validEmail =
    process.env.SC_TEACHER_EMAIL ?? 'teacher@school.local';
  private readonly validPassword =
    process.env.SC_TEACHER_PASSWORD ?? 'teachpass123';
  private readonly blockedTeacherEmail =
    process.env.SC_BLOCKED_TEACHER_EMAIL ?? 'blocked@school.local';

  constructor(private readonly sessionService: SessionService) {}

  signIn(
    email: string,
    password: string,
    currentSessionId?: string,
  ): { result: SignInResult | null; failureReason?: SignInFailureReason } {
    if (email.toLowerCase() === this.blockedTeacherEmail.toLowerCase()) {
      return { result: null, failureReason: 'account-blocked' };
    }

    if (!this.isValidCredentials(email, password)) {
      return { result: null, failureReason: 'invalid-credentials' };
    }

    this.sessionService.invalidateSession(currentSessionId);
    const session = this.sessionService.createSession('teacher-1', email.toLowerCase());

    return {
      result: {
        teacherId: session.teacherId,
        email: session.email,
        sessionId: session.id,
      },
    };
  }

  signOut(currentSessionId?: string): void {
    this.sessionService.invalidateSession(currentSessionId);
  }

  isSessionValid(sessionId?: string): boolean {
    return Boolean(this.sessionService.getSession(sessionId));
  }

  private isValidCredentials(email: string, password: string): boolean {
    return (
      email.toLowerCase() === this.validEmail.toLowerCase() &&
      password === this.validPassword
    );
  }
}
