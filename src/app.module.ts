import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './core/database/database.module';
import { databaseConfig } from './config/database.config';
import { appConfig } from './config/app.config';
import { jwtConfig } from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, jwtConfig],
      envFilePath: '.env',
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
