import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../../src/app.module';

describe('TestQueue (e2e)', () => {
  let app: INestApplication<App>;
  let jobId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/test-queue/add (POST)', () => {
    it('should add a message to the queue', async () => {
      const response = await request(app.getHttpServer())
        .post('/test-queue/add')
        .send({
          message: 'Test message from e2e test',
          metadata: { testId: 1 },
        })
        .expect(201);

      expect(response.body).toHaveProperty('jobId');
      expect(response.body).toHaveProperty(
        'message',
        'Message added to queue successfully',
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.data).toHaveProperty(
        'message',
        'Test message from e2e test',
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.data).toHaveProperty('timestamp');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      jobId = response.body.jobId;
    });

    it('should fail validation when message is empty', async () => {
      await request(app.getHttpServer())
        .post('/test-queue/add')
        .send({
          message: '',
        })
        .expect(400);
    });

    it('should fail validation when message is missing', async () => {
      await request(app.getHttpServer())
        .post('/test-queue/add')
        .send({})
        .expect(400);
    });
  });

  describe('/test-queue/job/:id (GET)', () => {
    it('should get job status', async () => {
      // Wait a bit for the job to be processed
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await request(app.getHttpServer())
        .get(`/test-queue/job/${jobId}`)
        .expect(200);

      expect(response.body).toHaveProperty('jobId', jobId);
      expect(response.body).toHaveProperty('state');
      expect(response.body).toHaveProperty('data');
    });

    it('should return 404 for non-existent job', async () => {
      await request(app.getHttpServer())
        .get('/test-queue/job/non-existent-job-id')
        .expect(404);
    });
  });

  describe('/test-queue/stats (GET)', () => {
    it('should get queue statistics', async () => {
      const response = await request(app.getHttpServer())
        .get('/test-queue/stats')
        .expect(200);

      expect(response.body).toHaveProperty('waiting');
      expect(response.body).toHaveProperty('active');
      expect(response.body).toHaveProperty('completed');
      expect(response.body).toHaveProperty('failed');
      expect(response.body).toHaveProperty('delayed');
      expect(response.body).toHaveProperty('total');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(typeof response.body.waiting).toBe('number');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(typeof response.body.completed).toBe('number');
    });
  });
});
