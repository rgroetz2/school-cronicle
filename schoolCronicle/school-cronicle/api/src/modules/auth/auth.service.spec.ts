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
    const result = service.signIn('teacher@school.local', 'teachpass123');

    expect(result).toBeTruthy();
    expect(result?.teacherId).toBe('teacher-1');
    expect(result?.sessionId).toBeTruthy();
  });

  it('returns null for invalid credentials', () => {
    const result = service.signIn('teacher@school.local', 'wrong-pass');

    expect(result).toBeNull();
  });
});
