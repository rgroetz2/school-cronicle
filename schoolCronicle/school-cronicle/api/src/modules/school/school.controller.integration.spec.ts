import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { AppModule } from '../../app/app.module';

describe('SchoolController (integration)', () => {
  let app: INestApplication;

  afterEach(async () => {
    if (app) {
      await app.close();
    }
    delete process.env.SC_TEACHER_ROLE;
  });

  it('allows admin to create and update schools', async () => {
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

    const createResponse = await fetch(`${baseUrl}/api/schools`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: sessionCookie ?? '' },
      body: JSON.stringify({
        name: 'Secondary School West',
        type: 'private',
        address: 'Schulgasse 2, 8001 Zurich',
        description: '',
        comment: '',
      }),
    });
    expect(createResponse.status).toBe(201);
    const createBody = await createResponse.json();
    expect(createBody.data.record).toMatchObject({
      name: 'Secondary School West',
      type: 'private',
      address: 'Schulgasse 2, 8001 Zurich',
    });

    const updateResponse = await fetch(`${baseUrl}/api/schools/${createBody.data.record.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', cookie: sessionCookie ?? '' },
      body: JSON.stringify({
        name: 'Secondary School West Updated',
        type: 'private',
        address: 'Schulgasse 2, 8001 Zurich',
        description: 'Updated description',
      }),
    });
    expect(updateResponse.status).toBe(200);
    expect(await updateResponse.json()).toMatchObject({
      data: {
        record: {
          id: createBody.data.record.id,
          name: 'Secondary School West Updated',
          description: 'Updated description',
        },
      },
    });
  });

  it('allows school CRUD for user role', async () => {
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

    const createResponse = await fetch(`${baseUrl}/api/schools`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: sessionCookie ?? '' },
      body: JSON.stringify({
        name: 'User Managed School',
        type: 'public',
        address: 'User access street',
      }),
    });
    expect(createResponse.status).toBe(201);
  });
});
