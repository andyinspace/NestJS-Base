import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../../src/features/users/entities/user.entity';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Enable validation
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
    // Clean up test users before each test
    await userRepository.delete({});
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.user).toHaveProperty('email', registerDto.email);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.user).toHaveProperty(
        'firstName',
        registerDto.firstName,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.user).toHaveProperty(
        'lastName',
        registerDto.lastName,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should register without optional fields', async () => {
      const registerDto = {
        email: 'minimal@example.com',
        password: 'SecurePass123!',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.user).toHaveProperty('email', registerDto.email);
    });

    it('should reject duplicate email', async () => {
      const registerDto = {
        email: 'duplicate@example.com',
        password: 'SecurePass123!',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(409);

      expect(response.body).toHaveProperty(
        'message',
        'Email address already exists',
      );
    });

    it('should reject invalid email format', async () => {
      const registerDto = {
        email: 'invalid-email',
        password: 'SecurePass123!',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);
    });

    it('should reject short password', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'short',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);
    });

    it('should reject invalid first name', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'J',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);
    });

    it('should reject first name with numbers', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John123',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    beforeEach(async () => {
      await request(app.getHttpServer()).post('/auth/register').send({
        email: 'logintest@example.com',
        password: 'LoginPass123!',
        firstName: 'Test',
        lastName: 'User',
      });
    });

    it('should login with valid credentials', async () => {
      const loginDto = {
        email: 'logintest@example.com',
        password: 'LoginPass123!',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.user).toHaveProperty('email', loginDto.email);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject invalid password', async () => {
      const loginDto = {
        email: 'logintest@example.com',
        password: 'WrongPassword',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);
    });

    it('should reject non-existent user', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'SomePassword123!',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);
    });

    it('should reject invalid email format', async () => {
      const loginDto = {
        email: 'invalid-email',
        password: 'SomePassword123!',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(400);
    });
  });

  describe('/auth/change-password (POST)', () => {
    let accessToken: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'changepass@example.com',
          password: 'OldPassword123!',
        });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      accessToken = response.body.accessToken as string;
    });

    it('should change password with valid current password', async () => {
      const changePasswordDto = {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
      };

      await request(app.getHttpServer())
        .post('/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(changePasswordDto)
        .expect(200);

      // Try logging in with new password
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'changepass@example.com',
          password: 'NewPassword123!',
        })
        .expect(200);
    });

    it('should reject incorrect current password', async () => {
      const changePasswordDto = {
        currentPassword: 'WrongPassword',
        newPassword: 'NewPassword123!',
      };

      await request(app.getHttpServer())
        .post('/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(changePasswordDto)
        .expect(401);
    });

    it('should reject same password as new password', async () => {
      const changePasswordDto = {
        currentPassword: 'OldPassword123!',
        newPassword: 'OldPassword123!',
      };

      await request(app.getHttpServer())
        .post('/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(changePasswordDto)
        .expect(400);
    });

    it('should reject request without auth token', async () => {
      const changePasswordDto = {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
      };

      await request(app.getHttpServer())
        .post('/auth/change-password')
        .send(changePasswordDto)
        .expect(401);
    });
  });

  describe('/auth/password-reset/request (POST)', () => {
    it('should return success message for existing email', async () => {
      await request(app.getHttpServer()).post('/auth/register').send({
        email: 'reset@example.com',
        password: 'Password123!',
      });

      const response = await request(app.getHttpServer())
        .post('/auth/password-reset/request')
        .send({ email: 'reset@example.com' })
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    it('should return success message for non-existing email (security)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/password-reset/request')
        .send({ email: 'nonexistent@example.com' })
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('/auth/password-reset/confirm (POST)', () => {
    beforeEach(async () => {
      await request(app.getHttpServer()).post('/auth/register').send({
        email: 'resetconfirm@example.com',
        password: 'OldPassword123!',
      });
    });

    it('should reset password successfully', async () => {
      const resetDto = {
        email: 'resetconfirm@example.com',
        newPassword: 'NewResetPass123!',
      };

      await request(app.getHttpServer())
        .post('/auth/password-reset/confirm')
        .send(resetDto)
        .expect(200);

      // Try logging in with new password
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'resetconfirm@example.com',
          password: 'NewResetPass123!',
        })
        .expect(200);
    });

    it('should reject for non-existing user', async () => {
      const resetDto = {
        email: 'nonexistent@example.com',
        newPassword: 'NewPassword123!',
      };

      await request(app.getHttpServer())
        .post('/auth/password-reset/confirm')
        .send(resetDto)
        .expect(404);
    });
  });
});
