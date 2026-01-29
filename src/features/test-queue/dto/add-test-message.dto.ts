import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddTestMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
