import { Test, TestingModule } from '@nestjs/testing';
import { TestQueueController } from './test-queue.controller';
import { TestQueueService } from './test-queue.service';

describe('TestQueueController', () => {
  let controller: TestQueueController;
  let service: TestQueueService;

  const mockQueueService = {
    addMessage: jest.fn(),
    getJobStatus: jest.fn(),
    getQueueStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestQueueController],
      providers: [
        {
          provide: TestQueueService,
          useValue: mockQueueService,
        },
      ],
    }).compile();

    controller = module.get<TestQueueController>(TestQueueController);
    service = module.get<TestQueueService>(TestQueueService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addMessage', () => {
    it('should add a message to the queue', async () => {
      const dto = { message: 'Test message' };
      const expectedResult = {
        jobId: '1',
        message: 'Message added to queue successfully',
        data: {
          message: 'Test message',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          timestamp: expect.any(String),
        },
      };

      mockQueueService.addMessage.mockResolvedValue(expectedResult);

      const result = await controller.addMessage(dto);

      expect(result).toEqual(expectedResult);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.addMessage).toHaveBeenCalledWith(dto);
    });
  });

  describe('getJobStatus', () => {
    it('should return job status', async () => {
      const jobId = '1';
      const expectedStatus = {
        jobId: '1',
        state: 'completed',
        progress: 100,
        data: { message: 'Test' },
      };

      mockQueueService.getJobStatus.mockResolvedValue(expectedStatus);

      const result = await controller.getJobStatus(jobId);

      expect(result).toEqual(expectedStatus);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.getJobStatus).toHaveBeenCalledWith(jobId);
    });

    it('should throw NotFoundException when job not found', async () => {
      const jobId = 'non-existent';
      mockQueueService.getJobStatus.mockResolvedValue(null);

      await expect(controller.getJobStatus(jobId)).rejects.toThrow(
        `Job with ID ${jobId} not found`,
      );
    });
  });

  describe('getQueueStats', () => {
    it('should return queue statistics', async () => {
      const expectedStats = {
        waiting: 2,
        active: 1,
        completed: 10,
        failed: 0,
        delayed: 0,
        total: 13,
      };

      mockQueueService.getQueueStats.mockResolvedValue(expectedStats);

      const result = await controller.getQueueStats();

      expect(result).toEqual(expectedStats);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.getQueueStats).toHaveBeenCalled();
    });
  });
});
