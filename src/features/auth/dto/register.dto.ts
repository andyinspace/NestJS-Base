import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'Password (minimum 8 characters)',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name (2-50 characters, letters only)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  @Matches(/^[a-zA-Z\s'-]+$/, {
    message:
      'First name must contain only letters, spaces, hyphens, and apostrophes',
  })
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name (2-50 characters, letters only)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  @Matches(/^[a-zA-Z\s'-]+$/, {
    message:
      'Last name must contain only letters, spaces, hyphens, and apostrophes',
  })
  lastName?: string;
}
