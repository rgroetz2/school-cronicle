import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AuthSession } from './auth.types';

@Injectable()
export class SessionService {
  private readonly sessions = new Map<string, AuthSession>();

  createSession(teacherId: string, email: string): AuthSession {
    const session: AuthSession = {
      id: randomUUID(),
      teacherId,
      email,
      createdAt: Date.now(),
    };

    this.sessions.set(session.id, session);
    return session;
  }

  invalidateSession(sessionId?: string): void {
    if (!sessionId) {
      return;
    }

    this.sessions.delete(sessionId);
  }
}
