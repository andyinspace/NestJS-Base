import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
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
