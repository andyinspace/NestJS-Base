# Data Validation in NestJS

This application uses `class-validator` and `class-transformer` for automatic validation of incoming data.

## Global Validation Setup

Validation is configured globally in `src/main.ts` with the following options:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,              // Strip non-decorated properties
    forbidNonWhitelisted: true,   // Throw error for non-whitelisted properties
    transform: true,              // Auto-transform to DTO classes
    transformOptions: {
      enableImplicitConversion: true,  // Auto-convert types
    },
  }),
);
```

## Creating DTOs with Validation

### Example: Create User DTO

```typescript
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
```

## Common Validation Decorators

### Type Validation
- `@IsString()` - Must be a string
- `@IsNumber()` - Must be a number
- `@IsBoolean()` - Must be a boolean
- `@IsArray()` - Must be an array
- `@IsObject()` - Must be an object
- `@IsDate()` - Must be a date

### String Validation
- `@IsEmail()` - Must be valid email
- `@IsUrl()` - Must be valid URL
- `@IsUUID()` - Must be valid UUID
- `@MinLength(n)` - Minimum string length
- `@MaxLength(n)` - Maximum string length
- `@Matches(pattern)` - Must match regex pattern

### Number Validation
- `@Min(n)` - Minimum value
- `@Max(n)` - Maximum value
- `@IsPositive()` - Must be positive
- `@IsNegative()` - Must be negative
- `@IsInt()` - Must be integer

### Required/Optional
- `@IsNotEmpty()` - Cannot be empty
- `@IsOptional()` - Field is optional
- `@IsDefined()` - Must be defined (not null/undefined)

### Nested Validation
- `@ValidateNested()` - Validate nested objects
- `@Type(() => ClassName)` - Transform to class instance

## Using DTOs in Controllers

```typescript
@Controller('users')
export class UsersController {
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // createUserDto is automatically validated
    // If validation fails, NestJS returns 400 Bad Request
    return this.usersService.create(createUserDto);
  }
}
```

## Update DTOs with PartialType

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// Makes all properties optional
export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

## Custom Validation Messages

```typescript
@IsEmail({}, { message: 'Please provide a valid email address' })
email: string;

@MinLength(8, { message: 'Password must be at least 8 characters' })
password: string;
```

## Validation Groups

```typescript
class CreateUserDto {
  @IsNotEmpty({ groups: ['create'] })
  password: string;
}

// In controller
@Post()
create(@Body(new ValidationPipe({ groups: ['create'] })) dto: CreateUserDto) {
  // Only validates fields with 'create' group
}
```

## Array Validation

```typescript
@IsArray()
@ArrayMinSize(1)
@ArrayMaxSize(10)
@IsString({ each: true })  // Validate each item
tags: string[];
```

## Conditional Validation

```typescript
import { ValidateIf } from 'class-validator';

@ValidateIf(o => o.email !== '')
@IsEmail()
email: string;
```

## Custom Validators

```typescript
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
        },
      },
    });
  };
}

// Usage
@IsStrongPassword({ message: 'Password must contain uppercase, lowercase, number and special character' })
password: string;
```

## Error Response Format

When validation fails, NestJS returns:

```json
{
  "statusCode": 400,
  "message": [
    "Invalid email format",
    "Password must be at least 8 characters long"
  ],
  "error": "Bad Request"
}
```

## Best Practices

1. **Always use DTOs** - Never use plain objects for request bodies
2. **Put DTOs in `dto/` folder** - Keep them organized by feature
3. **Use meaningful error messages** - Help API consumers understand errors
4. **Enable whitelist** - Prevent mass assignment vulnerabilities
5. **Use PartialType for updates** - Makes all fields optional automatically
6. **Validate nested objects** - Use `@ValidateNested()` and `@Type()`
7. **Keep validation in DTOs** - Don't mix validation with business logic

## Documentation

- [class-validator docs](https://github.com/typestack/class-validator)
- [NestJS Validation](https://docs.nestjs.com/techniques/validation)
