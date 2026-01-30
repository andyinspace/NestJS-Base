import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'OldPass123!',
    description: 'Current password',
  })
  @IsString()
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword: string;

  @ApiProperty({
    example: 'NewSecurePass123!',
    description: 'New password (minimum 8 characters)',
  })
  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'New password is required' })
  newPassword: string;
}
