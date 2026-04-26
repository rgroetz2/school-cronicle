import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { describe, expect, it, afterEach } from 'vitest';
import { AppModule } from '../../app/app.module';

describe('SchoolPersonalController (integration)', () => {
  let app: INestApplication;

  afterEach(async () => {
    if (app) {
      await app.close();
    }
    delete process.env.SC_TEACHER_ROLE;
  });

  it('allows admin to list and create school-personal records', async () => {
    process.env.SC_TEACHER_ROLE = 'admin';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    await app.listen(0);

    const address = app.getHttpServer().address();
    const baseUrl = typeof address === 'string' ? address : `http://127.0.0.1:${address?.port ?? 0}`;

    const signInResponse = await fetch(`${baseUrl}/api/auth/sign-in`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'teacher@school.local', password: 'teachpass123' }),
    });
    const sessionCookie = signInResponse.headers.get('set-cookie');

    const listResponse = await fetch(`${baseUrl}/api/school-personal`, {
      headers: { cookie: sessionCookie ?? '' },
    });
    expect(listResponse.status).toBe(200);
    const listBody = await listResponse.json();
    expect(Array.isArray(listBody.data.records)).toBe(true);

    const createResponse = await fetch(`${baseUrl}/api/school-personal`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: sessionCookie ?? '' },
      body: JSON.stringify({
        teacherId: 'teacher-2',
        name: 'Second Teacher',
        role: 'user',
        jobRole: 'assistant',
        class: '5B',
        startDate: '2026-02-01',
      }),
    });
    expect(createResponse.status).toBe(201);
    expect(await createResponse.json()).toMatchObject({
      data: {
        record: {
          teacherId: 'teacher-2',
          name: 'Second Teacher',
          role: 'user',
          jobRole: 'assistant',
        },
      },
    });
  });

  it('enforces self-only access for user role', async () => {
    process.env.SC_TEACHER_ROLE = 'user';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    await app.listen(0);

    const address = app.getHttpServer().address();
    const baseUrl = typeof address === 'string' ? address : `http://127.0.0.1:${address?.port ?? 0}`;

    const signInResponse = await fetch(`${baseUrl}/api/auth/sign-in`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'teacher@school.local', password: 'teachpass123' }),
    });
    const sessionCookie = signInResponse.headers.get('set-cookie');

    const listResponse = await fetch(`${baseUrl}/api/school-personal`, {
      headers: { cookie: sessionCookie ?? '' },
    });
    expect(listResponse.status).toBe(200);
    const listBody = await listResponse.json();
    expect(listBody.data.records).toHaveLength(1);
    expect(listBody.data.records[0].teacherId).toBe('teacher-1');

    const createResponse = await fetch(`${baseUrl}/api/school-personal`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: sessionCookie ?? '' },
      body: JSON.stringify({
        teacherId: 'teacher-x',
        name: 'Blocked User',
        role: 'user',
        jobRole: 'teacher',
      }),
    });
    expect(createResponse.status).toBe(403);
  });
});
