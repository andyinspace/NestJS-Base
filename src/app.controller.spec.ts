import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health check', () => {
    it('should return status ok and datetime', () => {
      const result = appController.getHealth();
      expect(result.status).toBe('ok');
      expect(result.datetime).toBeDefined();
      expect(new Date(result.datetime).toString()).not.toBe('Invalid Date');
    });

    it('should return current datetime in ISO format', () => {
      const before = new Date();
      const result = appController.getHealth();
      const after = new Date();
      const resultDate = new Date(result.datetime);

      expect(resultDate.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(resultDate.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });
});
