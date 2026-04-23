import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app/app.module';

describe('ContactsController (integration)', () => {
  let app: INestApplication;

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('creates and updates a school contact', async () => {
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

    const createResponse = await fetch(`${baseUrl}/api/contacts`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: sessionCookie ?? '' },
      body: JSON.stringify({
        name: 'Jane Parent',
        role: 'parent',
        email: 'jane.parent@school.local',
        phone: '+41-79-111-22-33',
      }),
    });
    expect(createResponse.status).toBe(201);
    const createBody = await createResponse.json();
    expect(createBody.data.contact).toMatchObject({
      name: 'Jane Parent',
      role: 'parent',
      email: 'jane.parent@school.local',
      phone: '+41-79-111-22-33',
      schoolId: 'school-1',
      createdByTeacherId: 'teacher-1',
    });

    const updateResponse = await fetch(`${baseUrl}/api/contacts/${createBody.data.contact.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', cookie: sessionCookie ?? '' },
      body: JSON.stringify({
        name: 'Jane Parent Updated',
        role: 'partner',
        email: 'jane.parent.updated@school.local',
        phone: '+41-79-333-22-11',
      }),
    });
    expect(updateResponse.status).toBe(200);
    expect(await updateResponse.json()).toMatchObject({
      data: {
        contact: {
          id: createBody.data.contact.id,
          name: 'Jane Parent Updated',
          role: 'partner',
        },
      },
    });
  });

  it('rejects duplicate contact email+phone for same school', async () => {
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

    await fetch(`${baseUrl}/api/contacts`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: sessionCookie ?? '' },
      body: JSON.stringify({
        name: 'First Staff',
        role: 'staff',
        email: 'staff.dup@school.local',
        phone: '+41-44-100-20-30',
      }),
    });

    const duplicateResponse = await fetch(`${baseUrl}/api/contacts`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: sessionCookie ?? '' },
      body: JSON.stringify({
        name: 'Second Staff',
        role: 'staff',
        email: 'staff.dup@school.local',
        phone: '+41-44-100-20-30',
      }),
    });

    expect(duplicateResponse.status).toBe(400);
    expect(await duplicateResponse.json()).toMatchObject({
      message: 'Contact already exists for this school.',
      code: 'CONTACT_DUPLICATE',
    });
  });

  it('allows creating a contact without email and phone', async () => {
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

    const createResponse = await fetch(`${baseUrl}/api/contacts`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: sessionCookie ?? '' },
      body: JSON.stringify({
        name: 'No Contact Data',
        role: 'staff',
      }),
    });

    expect(createResponse.status).toBe(201);
    expect(await createResponse.json()).toMatchObject({
      data: {
        contact: {
          name: 'No Contact Data',
          role: 'staff',
        },
      },
    });
  });
});
