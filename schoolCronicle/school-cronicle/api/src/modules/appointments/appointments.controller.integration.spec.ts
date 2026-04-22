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
        appointmentDate: '2026-04-22',
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
    expect(body.data.draft.appointmentDate).toBe('2026-04-22');
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
        appointmentDate: '2026-04-22',
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
        appointmentDate: '2026-04-22',
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
        appointmentDate: '2026-04-23',
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
        appointmentDate: '2026-04-20',
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
        appointmentDate: '2026-04-24',
        category: 'consultation',
        notes: 'after',
      }),
    });

    const updateBody = await updateResponse.json();
    expect(updateResponse.status).toBe(200);
    expect(updateBody.data.draft.title).toBe('Updated');
    expect(updateBody.data.draft.appointmentDate).toBe('2026-04-24');
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
        appointmentDate: '2026-04-20',
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
        appointmentDate: '2026-04-24',
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

  it('rejects draft creation with invalid appointment date', async () => {
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
        title: 'Bad date',
        appointmentDate: '22-04-2026',
        category: 'meeting',
      }),
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      message: 'Appointment date must be a valid ISO date (YYYY-MM-DD).',
      code: 'APPOINTMENT_INVALID_DATE',
    });
  });

  it('returns ready-to-submit for complete draft metadata', async () => {
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
        title: 'Ready draft',
        appointmentDate: '2026-04-22',
        category: 'meeting',
        notes: 'ok',
      }),
    });
    const createBody = await createResponse.json();

    const submitResponse = await fetch(`${baseUrl}/api/appointments/drafts/${createBody.data.draft.id}/submit`, {
      method: 'POST',
      headers: {
        cookie: sessionCookie ?? '',
      },
    });

    expect(submitResponse.status).toBe(201);
    const body = await submitResponse.json();
    expect(body.data.submitted).toBe(false);
    expect(body.data.readyToSubmit).toBe(true);
  });

  it('rejects unauthenticated submit attempts', async () => {
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

    const submitResponse = await fetch(`${baseUrl}/api/appointments/drafts/non-existent/submit`, {
      method: 'POST',
    });

    expect(submitResponse.status).toBe(401);
    expect(await submitResponse.json()).toMatchObject({
      message: 'Authentication required.',
    });
  });

  it('deletes a teacher-owned draft and removes it from list', async () => {
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
        title: 'Delete me',
        appointmentDate: '2026-05-10',
        category: 'meeting',
        notes: '',
      }),
    });
    const createBody = await createResponse.json();

    const deleteResponse = await fetch(`${baseUrl}/api/appointments/drafts/${createBody.data.draft.id}`, {
      method: 'DELETE',
      headers: {
        cookie: sessionCookie ?? '',
      },
    });
    expect(deleteResponse.status).toBe(200);
    expect(await deleteResponse.json()).toMatchObject({
      data: {
        deleted: true,
        draftId: createBody.data.draft.id,
      },
    });

    const listResponse = await fetch(`${baseUrl}/api/appointments/drafts`, {
      headers: {
        cookie: sessionCookie ?? '',
      },
    });
    const listBody = await listResponse.json();
    expect(listResponse.status).toBe(200);
    expect(listBody.data.drafts.some((draft: { id: string }) => draft.id === createBody.data.draft.id)).toBe(false);
  });

  it('rejects unauthenticated draft deletion requests', async () => {
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

    const deleteResponse = await fetch(`${baseUrl}/api/appointments/drafts/non-existent`, {
      method: 'DELETE',
    });
    expect(deleteResponse.status).toBe(401);
    expect(await deleteResponse.json()).toMatchObject({
      message: 'Authentication required.',
    });
  });

  it('attaches an image to a teacher-owned draft', async () => {
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
        title: 'Image draft',
        appointmentDate: '2026-05-12',
        category: 'meeting',
      }),
    });
    const createBody = await createResponse.json();

    const attachResponse = await fetch(
      `${baseUrl}/api/appointments/drafts/${createBody.data.draft.id}/images`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          cookie: sessionCookie ?? '',
        },
        body: JSON.stringify({
          name: 'photo.png',
          mimeType: 'image/png',
          dataUrl: 'data:image/png;base64,AAA',
        }),
      },
    );

    expect(attachResponse.status).toBe(201);
    const attachBody = await attachResponse.json();
    expect(Array.isArray(attachBody.data.draft.images)).toBe(true);
    expect(attachBody.data.draft.images[0]).toMatchObject({
      name: 'photo.png',
      mimeType: 'image/png',
    });
  });

  it('rejects unauthenticated image attach requests', async () => {
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

    const attachResponse = await fetch(`${baseUrl}/api/appointments/drafts/non-existent/images`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        name: 'photo.png',
        mimeType: 'image/png',
        dataUrl: 'data:image/png;base64,AAA',
      }),
    });

    expect(attachResponse.status).toBe(401);
    expect(await attachResponse.json()).toMatchObject({
      message: 'Authentication required.',
    });
  });
});
