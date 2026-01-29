import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [],
    }).compile();

    healthController = app.get<HealthController>(HealthController);
  });

  describe('health check', () => {
    it('should return status ok and datetime', () => {
      const result = healthController.getHealth();
      expect(result.status).toBe('ok');
      expect(result.datetime).toBeDefined();
      expect(new Date(result.datetime).toString()).not.toBe('Invalid Date');
    });

    it('should return current datetime in ISO format', () => {
      const before = new Date();
      const result = healthController.getHealth();
      const after = new Date();
      const resultDate = new Date(result.datetime);

      expect(resultDate.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(resultDate.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });
});
