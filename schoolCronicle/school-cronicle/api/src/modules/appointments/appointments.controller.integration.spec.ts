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

  it('lists only drafts scoped to current teacher session', async () => {
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

    await fetch(`${baseUrl}/api/appointments/drafts`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: sessionCookie ?? '',
      },
      body: JSON.stringify({
        title: 'Draft A',
        category: 'meeting',
        notes: 'first',
      }),
    });

    await fetch(`${baseUrl}/api/appointments/drafts`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: sessionCookie ?? '',
      },
      body: JSON.stringify({
        title: 'Draft B',
        category: 'consultation',
        notes: 'second',
      }),
    });

    const listResponse = await fetch(`${baseUrl}/api/appointments/drafts`, {
      headers: {
        cookie: sessionCookie ?? '',
      },
    });

    const listBody = await listResponse.json();
    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listBody.data.drafts)).toBe(true);
    expect(listBody.data.drafts.length).toBe(2);
    expect(listBody.data.drafts.every((draft: { teacherId: string }) => draft.teacherId === 'teacher-1')).toBe(
      true,
    );
  });

  it('updates a teacher-owned draft metadata and category', async () => {
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

    const createResponse = await fetch(`${baseUrl}/api/appointments/drafts`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: sessionCookie ?? '',
      },
      body: JSON.stringify({
        title: 'Original',
        category: 'meeting',
        notes: 'before',
      }),
    });
    const createBody = await createResponse.json();

    const updateResponse = await fetch(`${baseUrl}/api/appointments/drafts/${createBody.data.draft.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        cookie: sessionCookie ?? '',
      },
      body: JSON.stringify({
        title: 'Updated',
        category: 'consultation',
        notes: 'after',
      }),
    });

    const updateBody = await updateResponse.json();
    expect(updateResponse.status).toBe(200);
    expect(updateBody.data.draft.title).toBe('Updated');
    expect(updateBody.data.draft.category).toBe('consultation');
    expect(updateBody.data.draft.notes).toBe('after');
  });

  it('rejects draft update with invalid category', async () => {
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

    const createResponse = await fetch(`${baseUrl}/api/appointments/drafts`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: sessionCookie ?? '',
      },
      body: JSON.stringify({
        title: 'Original',
        category: 'meeting',
        notes: 'before',
      }),
    });
    const createBody = await createResponse.json();

    const updateResponse = await fetch(`${baseUrl}/api/appointments/drafts/${createBody.data.draft.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        cookie: sessionCookie ?? '',
      },
      body: JSON.stringify({
        title: 'Updated',
        category: 'invalid-category',
        notes: 'after',
      }),
    });

    expect(updateResponse.status).toBe(400);
    expect(await updateResponse.json()).toMatchObject({
      message: 'Category must be one of the allowed values.',
      code: 'APPOINTMENT_INVALID_CATEGORY',
    });
  });
});
