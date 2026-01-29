import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TestQueueController } from './test-queue.controller';
import { TestQueueService } from './test-queue.service';
import { TestMessageProcessor } from './processors/test-message.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'test-messages',
    }),
  ],
  controllers: [TestQueueController],
  providers: [TestQueueService, TestMessageProcessor],
  exports: [TestQueueService],
})
export class TestQueueModule {}
