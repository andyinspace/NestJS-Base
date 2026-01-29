import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database/database.module';
import { QueueModule } from './core/queue/queue.module';
import { HealthModule } from './core/health/health.module';
import { TestQueueModule } from './features/test-queue/test-queue.module';
import { databaseConfig } from './config/database.config';
import { appConfig } from './config/app.config';
import { jwtConfig } from './config/jwt.config';
import { queueConfig } from './config/queue.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, jwtConfig, queueConfig],
      envFilePath: '.env',
    }),
    DatabaseModule,
    QueueModule,
    HealthModule,
    TestQueueModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
