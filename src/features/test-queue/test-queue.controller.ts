import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { TestQueueService } from './test-queue.service';
import { AddTestMessageDto } from './dto/add-test-message.dto';

@Controller('test-queue')
export class TestQueueController {
  constructor(private readonly testQueueService: TestQueueService) {}

  @Post('add')
  async addMessage(@Body() dto: AddTestMessageDto) {
    return this.testQueueService.addMessage(dto);
  }

  @Get('job/:id')
  async getJobStatus(@Param('id') id: string) {
    const status = await this.testQueueService.getJobStatus(id);

    if (!status) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return status;
  }

  @Get('stats')
  async getQueueStats() {
    return this.testQueueService.getQueueStats();
  }
}
