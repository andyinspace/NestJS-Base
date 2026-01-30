import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../../src/features/users/entities/user.entity';

describe('Users (e2e)', () => {
  let app: INestApplication<App>;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await userRepository.delete({});
  });

  describe('/users/profile (GET)', () => {
    let accessToken: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'profile@example.com',
          password: 'Password123!',
          firstName: 'John',
          lastName: 'Doe',
        });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      accessToken = response.body.accessToken as string;
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', 'profile@example.com');
      expect(response.body).toHaveProperty('firstName', 'John');
      expect(response.body).toHaveProperty('lastName', 'Doe');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should reject request without token', async () => {
      await request(app.getHttpServer()).get('/users/profile').expect(401);
    });

    it('should reject request with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('/users/profile (PATCH)', () => {
    let accessToken: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'updateprofile@example.com',
          password: 'Password123!',
          firstName: 'John',
          lastName: 'Doe',
        });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      accessToken = response.body.accessToken as string;
    });

    it('should update first name only', async () => {
      const updateDto = {
        firstName: 'Jane',
      };

      const response = await request(app.getHttpServer())
        .patch('/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toHaveProperty('firstName', 'Jane');
      expect(response.body).toHaveProperty('lastName', 'Doe');
    });

    it('should update last name only', async () => {
      const updateDto = {
        lastName: 'Smith',
      };

      const response = await request(app.getHttpServer())
        .patch('/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toHaveProperty('firstName', 'John');
      expect(response.body).toHaveProperty('lastName', 'Smith');
    });

    it('should update both first and last name', async () => {
      const updateDto = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const response = await request(app.getHttpServer())
        .patch('/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toHaveProperty('firstName', 'Jane');
      expect(response.body).toHaveProperty('lastName', 'Smith');
    });

    it('should reject invalid first name (too short)', async () => {
      const updateDto = {
        firstName: 'J',
      };

      await request(app.getHttpServer())
        .patch('/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateDto)
        .expect(400);
    });

    it('should reject first name with numbers', async () => {
      const updateDto = {
        firstName: 'John123',
      };

      await request(app.getHttpServer())
        .patch('/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateDto)
        .expect(400);
    });

    it('should reject request without token', async () => {
      const updateDto = {
        firstName: 'Jane',
      };

      await request(app.getHttpServer())
        .patch('/users/profile')
        .send(updateDto)
        .expect(401);
    });
  });

  describe('/users/email (PATCH)', () => {
    let accessToken: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'changeemail@example.com',
          password: 'Password123!',
        });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      accessToken = response.body.accessToken as string;
    });

    it('should change email successfully', async () => {
      const changeEmailDto = {
        email: 'newemail@example.com',
      };

      const response = await request(app.getHttpServer())
        .patch('/users/email')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(changeEmailDto)
        .expect(200);

      expect(response.body).toHaveProperty('email', 'newemail@example.com');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should reject duplicate email', async () => {
      await request(app.getHttpServer()).post('/auth/register').send({
        email: 'existing@example.com',
        password: 'Password123!',
      });

      const changeEmailDto = {
        email: 'existing@example.com',
      };

      await request(app.getHttpServer())
        .patch('/users/email')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(changeEmailDto)
        .expect(409);
    });

    it('should allow keeping same email', async () => {
      const changeEmailDto = {
        email: 'changeemail@example.com',
      };

      const response = await request(app.getHttpServer())
        .patch('/users/email')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(changeEmailDto)
        .expect(200);

      expect(response.body).toHaveProperty('email', 'changeemail@example.com');
    });

    it('should reject invalid email format', async () => {
      const changeEmailDto = {
        email: 'invalid-email',
      };

      await request(app.getHttpServer())
        .patch('/users/email')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(changeEmailDto)
        .expect(400);
    });

    it('should reject request without token', async () => {
      const changeEmailDto = {
        email: 'newemail@example.com',
      };

      await request(app.getHttpServer())
        .patch('/users/email')
        .send(changeEmailDto)
        .expect(401);
    });
  });
});
