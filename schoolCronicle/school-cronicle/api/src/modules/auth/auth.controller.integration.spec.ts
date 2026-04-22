import { afterEach, describe, expect, it } from 'vitest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app/app.module';
import { INestApplication } from '@nestjs/common';

describe('AuthController integration', () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    if (app) {
      await app.close();
      app = undefined;
    }
  });

  it('creates a session cookie for valid credentials', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    await app.listen(0);

    const address = app.getHttpServer().address();
    const baseUrl =
      typeof address === 'string'
        ? address
        : `http://127.0.0.1:${address?.port ?? 0}`;

    const response = await fetch(`${baseUrl}/api/auth/sign-in`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'teacher@school.local',
        password: 'teachpass123',
      }),
    });

    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toEqual({
      data: { teacherId: 'teacher-1', email: 'teacher@school.local' },
    });
    expect(response.headers.get('set-cookie')).toContain('sc_session=');
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
    expect(response.headers.get('set-cookie')).toContain('SameSite=Lax');
  });

  it('returns a non-sensitive error message for invalid credentials', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    await app.listen(0);

    const address = app.getHttpServer().address();
    const baseUrl =
      typeof address === 'string'
        ? address
        : `http://127.0.0.1:${address?.port ?? 0}`;

    const response = await fetch(`${baseUrl}/api/auth/sign-in`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'teacher@school.local',
        password: 'wrong-password',
      }),
    });

    const responseBody = await response.json();

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe(
      'Sign-in failed. Check your credentials and try again.',
    );
    expect(responseBody.code).toBe('AUTH_SIGN_IN_FAILED');
    expect(responseBody.reason).toBe('invalid-credentials');
    expect(responseBody.support.email).toBe('support@school.local');
  });

  it('returns non-sensitive message with blocked reason for blocked account attempts', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    await app.listen(0);

    const address = app.getHttpServer().address();
    const baseUrl =
      typeof address === 'string'
        ? address
        : `http://127.0.0.1:${address?.port ?? 0}`;

    const response = await fetch(`${baseUrl}/api/auth/sign-in`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'blocked@school.local',
        password: 'any',
      }),
    });

    const responseBody = await response.json();
    expect(response.status).toBe(401);
    expect(responseBody.message).toBe(
      'Sign-in failed. Check your credentials and try again.',
    );
    expect(responseBody.reason).toBe('account-blocked');
  });

  it('invalidates session on sign-out and blocks protected probe route', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    await app.listen(0);

    const address = app.getHttpServer().address();
    const baseUrl =
      typeof address === 'string'
        ? address
        : `http://127.0.0.1:${address?.port ?? 0}`;

    const signInResponse = await fetch(`${baseUrl}/api/auth/sign-in`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'teacher@school.local',
        password: 'teachpass123',
      }),
    });
    const sessionCookie = signInResponse.headers.get('set-cookie');
    expect(sessionCookie).toContain('sc_session=');

    const sessionProbeBeforeSignOut = await fetch(`${baseUrl}/api/auth/session`, {
      headers: { cookie: sessionCookie ?? '' },
    });
    expect(sessionProbeBeforeSignOut.status).toBe(200);

    const signOutResponse = await fetch(`${baseUrl}/api/auth/sign-out`, {
      method: 'POST',
      headers: { cookie: sessionCookie ?? '' },
    });
    expect(signOutResponse.status).toBe(200);

    const signOutBody = await signOutResponse.json();
    expect(signOutBody).toEqual({ data: { signedOut: true } });

    const sessionProbeAfterSignOut = await fetch(`${baseUrl}/api/auth/session`, {
      headers: { cookie: sessionCookie ?? '' },
    });
    expect(sessionProbeAfterSignOut.status).toBe(401);
    expect(await sessionProbeAfterSignOut.json()).toMatchObject({
      message: 'Authentication required.',
    });
  });
});
