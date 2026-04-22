import { afterEach, describe, expect, it } from 'vitest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app/app.module';
import { INestApplication } from '@nestjs/common';

describe('AppointmentsController integration', () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    if (app) {
      await app.close();
      app = undefined;
    }
  });

  it('creates a draft for an authenticated teacher with school scope', async () => {
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

    const response = await fetch(`${baseUrl}/api/appointments/drafts`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: sessionCookie ?? '',
      },
      body: JSON.stringify({
        title: 'Parent meeting',
        category: 'meeting',
        notes: 'First draft',
      }),
    });

    const body = await response.json();
    expect(response.status).toBe(201);
    expect(body.data.draft.status).toBe('draft');
    expect(body.data.draft.teacherId).toBe('teacher-1');
    expect(body.data.draft.schoolId).toBe('school-1');
    expect(body.data.draft.title).toBe('Parent meeting');
    expect(body.data.draft.category).toBe('meeting');
  });

  it('rejects unauthenticated draft creation requests', async () => {
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

    const response = await fetch(`${baseUrl}/api/appointments/drafts`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Parent meeting',
        category: 'meeting',
      }),
    });

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({
      message: 'Authentication required.',
    });
  });
});
