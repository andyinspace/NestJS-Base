import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/health (GET)', () => {
    it('should return 200 status', () => {
      return request(app.getHttpServer()).get('/health').expect(200);
    });

    it('should return ok status and datetime', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');

      expect(response.body).toHaveProperty('datetime');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(typeof response.body.datetime).toBe('string');
    });

    it('should return valid ISO datetime', async () => {
      const before = new Date().toISOString();

      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      const after = new Date().toISOString();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { datetime } = response.body;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      expect(new Date(datetime).toString()).not.toBe('Invalid Date');
      expect(datetime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(datetime >= before && datetime <= after).toBe(true);
    });

    it('should return JSON content type', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });
});
