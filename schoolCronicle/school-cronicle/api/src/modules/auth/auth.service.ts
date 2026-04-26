import { Injectable, Logger } from '@nestjs/common';
import { SessionService } from './session.service';
import { AUTH_ROLES, AuthRole, AuthSession, SignInFailureReason, SignInResult } from './auth.types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly validEmail =
    process.env.SC_TEACHER_EMAIL ?? 'teacher@school.local';
  private readonly validPassword =
    process.env.SC_TEACHER_PASSWORD ?? 'teachpass123';
  private readonly configuredRole = process.env.SC_TEACHER_ROLE ?? 'user';
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

    if (!this.isValidRole(this.configuredRole)) {
      this.logger.warn(
        `Rejected sign-in due to invalid configured role state: "${this.configuredRole}"`,
      );
      return { result: null, failureReason: 'invalid-role-state' };
    }

    this.sessionService.invalidateSession(currentSessionId);
    const session = this.sessionService.createSession(
      'teacher-1',
      email.toLowerCase(),
      this.configuredRole,
    );

    return {
      result: {
        teacherId: session.teacherId,
        email: session.email,
        role: session.role,
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

  getSession(sessionId?: string): AuthSession | undefined {
    return this.sessionService.getSession(sessionId);
  }

  private isValidCredentials(email: string, password: string): boolean {
    return (
      email.toLowerCase() === this.validEmail.toLowerCase() &&
      password === this.validPassword
    );
  }

  private isValidRole(role: string): role is AuthRole {
    return AUTH_ROLES.includes(role as AuthRole);
  }
}
