import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AddTestMessageDto } from './dto/add-test-message.dto';
import { TestMessageJob } from './interfaces/test-message.interface';

@Injectable()
export class TestQueueService {
  private readonly logger = new Logger(TestQueueService.name);

  constructor(
    @InjectQueue('test-messages')
    private readonly testMessagesQueue: Queue<TestMessageJob>,
  ) {}

  async addMessage(dto: AddTestMessageDto) {
    const jobData: TestMessageJob = {
      message: dto.message,
      timestamp: new Date().toISOString(),
      metadata: dto.metadata,
    };

    const job = await this.testMessagesQueue.add(
      'process-test-message',
      jobData,
    );

    this.logger.log(`Added job ${job.id} to queue`);

    return {
      jobId: job.id,
      message: 'Message added to queue successfully',
      data: jobData,
    };
  }

  async getJobStatus(jobId: string) {
    const job = await this.testMessagesQueue.getJob(jobId);

    if (!job) {
      return null;
    }

    const state = await job.getState();
    const progress = job.progress;

    return {
      jobId: job.id,
      state,
      progress,
      data: job.data,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      returnvalue: job.returnvalue,
      failedReason: job.failedReason,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
    };
  }

  async getQueueStats() {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.testMessagesQueue.getWaitingCount(),
      this.testMessagesQueue.getActiveCount(),
      this.testMessagesQueue.getCompletedCount(),
      this.testMessagesQueue.getFailedCount(),
      this.testMessagesQueue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed,
    };
  }
}
