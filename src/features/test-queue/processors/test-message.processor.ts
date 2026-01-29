import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { TestMessageJob } from '../interfaces/test-message.interface';

@Processor('test-messages')
export class TestMessageProcessor extends WorkerHost {
  private readonly logger = new Logger(TestMessageProcessor.name);

  async process(job: Job<TestMessageJob>): Promise<any> {
    this.logger.log(
      `Processing job ${job.id} with message: ${job.data.message}`,
    );

    // Simulate some processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.logger.log(`Successfully processed job ${job.id}`);

    return {
      processed: true,
      message: job.data.message,
      timestamp: job.data.timestamp,
      processedAt: new Date().toISOString(),
    };
  }
}
