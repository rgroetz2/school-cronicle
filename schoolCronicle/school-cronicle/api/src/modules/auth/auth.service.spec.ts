import { describe, expect, it, beforeEach } from 'vitest';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    const sessionService = new SessionService();
    service = new AuthService(sessionService);
  });

  it('returns a session for valid credentials', () => {
    const attempt = service.signIn('teacher@school.local', 'teachpass123');
    const result = attempt.result;

    expect(result).toBeTruthy();
    expect(result?.teacherId).toBe('teacher-1');
    expect(result?.sessionId).toBeTruthy();
  });

  it('returns null for invalid credentials', () => {
    const attempt = service.signIn('teacher@school.local', 'wrong-pass');
    const result = attempt.result;

    expect(result).toBeNull();
    expect(attempt.failureReason).toBe('invalid-credentials');
  });

  it('maps blocked account sign-in to blocked reason without leaking account state', () => {
    const attempt = service.signIn('blocked@school.local', 'any-pass');

    expect(attempt.result).toBeNull();
    expect(attempt.failureReason).toBe('account-blocked');
  });
});
