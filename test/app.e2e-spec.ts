import { INestApplication } from '@nestjs/common';
import { describe, it } from 'node:test';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  it('/ (GET)', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
