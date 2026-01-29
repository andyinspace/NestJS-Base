# NestJS Application Folder Structure

**Last Updated:** January 29, 2026

This document provides a comprehensive guide to the folder structure of this NestJS application. It serves as a reference for understanding where different types of code should live.

---

## Root Level Structure

```
src/              - Application source code
test/             - All test files (unit, integration, e2e)
docs/             - User-facing documentation
ai-docs/          - AI assistant reference documentation
scripts/          - Utility scripts for development/deployment
.env              - Environment variables (gitignored)
.env.example      - Environment variables template
```

**Root Level Files:**
- `.env` - Environment variables (never committed)
- `.env.example` - Template for environment variables
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `nest-cli.json` - NestJS CLI configuration
- `.gitignore` - Git ignore patterns

---

## src/ Directory

### src/common/
**Purpose:** Shared utilities and cross-cutting concerns used throughout the application

**Contains:**
- `decorators/` - Custom decorators (e.g., @CurrentUser, @ApiPaginatedResponse)
- `filters/` - Exception filters for error handling
- `guards/` - Shared guards (e.g., rate limiting, feature flags)
- `interceptors/` - Shared interceptors (e.g., logging, response transformation)
- `pipes/` - Validation and transformation pipes
- `middleware/` - Custom middleware (e.g., request logging, correlation ID)
- `interfaces/` - Shared TypeScript interfaces and types
- `constants/` - Application-wide constants and enums
- `utils/` - Pure utility functions with no dependencies

**Rules:**
- No business logic
- No feature-specific code
- Must be framework-agnostic where possible
- Should be reusable across any feature

---

### src/config/
**Purpose:** Configuration management for different environments and services

**Contains:**
- `database.config.ts` - TypeORM/database configuration
- `typeorm-cli.config.ts` - TypeORM CLI configuration for migrations
- `jwt.config.ts` - JWT authentication settings
- `redis.config.ts` - Redis/cache configuration
- `queue.config.ts` - Bull queue configuration
- `app.config.ts` - General application settings

**Rules:**
- Uses @nestjs/config for environment variable management
- Each config file exports a function returning configuration object
- Includes validation schemas for environment variables
- No business logic, only configuration mapping

---

### src/core/
**Purpose:** Infrastructure and technical foundation layer

**Contains:**

#### core/database/
- `migrations/` - TypeORM migration files
- `seeds/` - Database seeding scripts for development
- `database.module.ts` - Database connection module

#### core/cache/
- Cache module setup (Redis)
- Cache manager configuration

#### core/queue/
- `processors/` - Base queue processors
- `queue.module.ts` - Bull queue setup

#### core/logger/
- Custom logging implementation
- Log formatting and transport configuration

#### core/health/
- Health check endpoints
- Database, Redis, and service health indicators

**Rules:**
- Infrastructure concerns only
- No business logic
- Reusable across different applications
- Provides foundation for features to consume

---

### src/features/
**Purpose:** Business domain logic organized by feature/domain

**Structure Pattern (per feature):**
```
features/[feature-name]/
├── dto/              - Data Transfer Objects (request/response)
├── entities/         - TypeORM entities (database models)
├── interfaces/       - Feature-specific interfaces
├── guards/           - Feature-specific guards
├── strategies/       - Passport strategies (for auth)
├── processors/       - Feature-specific queue processors
├── subscribers/      - TypeORM entity subscribers
├── [feature].controller.ts  - HTTP endpoints
├── [feature].service.ts     - Business logic
├── [feature].module.ts      - Feature module
└── [feature].repository.ts  - Custom repositories (optional)
```

**Current Features:**
- `auth/` - Authentication and authorization
- `users/` - User management

**Rules:**
- Each feature is self-contained
- Features can import from common/, core/, and shared/
- Features should minimize dependencies on other features
- All business logic stays in services
- Controllers are thin, delegating to services
- Each feature has its own module

---

### src/shared/
**Purpose:** Reusable business logic services used across multiple features

**Contains:**
- `email/` - Email service (SendGrid, SES, etc.)
- `sms/` - SMS service (Twilio, etc.)
- `file-upload/` - File handling (S3, local storage)
- `payment/` - Payment processing (Stripe, PayPal)

**Rules:**
- Contains business logic (unlike common/)
- Provides services consumed by features
- Each shared module should be independent
- Can depend on core/ infrastructure

**Difference from common/:**
- common/ = pure utilities, no business logic
- shared/ = business logic services reused by features

---

## test/ Directory

### test/unit/
**Purpose:** Unit tests for isolated components

**Structure:** Mirrors src/ structure
```
unit/
├── features/
│   ├── auth/
│   │   ├── auth.service.spec.ts
│   │   └── auth.controller.spec.ts
│   └── users/
└── common/
```

**Rules:**
- Test single units in isolation
- Mock all dependencies
- Fast execution
- File naming: `*.spec.ts`

---

### test/integration/
**Purpose:** Integration tests for multiple components working together

**Contains:**
- Tests for database interactions
- Tests for queue processing
- Tests for multiple services interacting

**Rules:**
- May use test database
- Tests actual integration between components
- File naming: `*.integration.spec.ts`

---

### test/e2e/
**Purpose:** End-to-end tests simulating real user scenarios

**Contains:**
- Full HTTP request/response tests
- Multi-step workflow tests
- `fixtures/` - Test data and factories

**Rules:**
- Tests complete user flows
- Uses test database
- File naming: `*.e2e-spec.ts`
- Should run against a real (test) application instance

---

### test/helpers/
**Purpose:** Shared test utilities

**Contains:**
- `test-database.helper.ts` - Database setup/teardown
- `mock-factory.helper.ts` - Factory functions for test data
- `test-app.helper.ts` - Application bootstrap helpers

---

## docs/ Directory
**Purpose:** User-facing documentation

**Contains:**
- `api/` - API documentation (Swagger, Postman collections)
- `architecture/` - Architecture decisions and diagrams
  - `ADRs/` - Architecture Decision Records
- `guides/` - Development guides and tutorials
- `database/` - Database schema documentation and ERDs

**Rules:**
- Written for human developers
- Keep up to date with code changes
- Use clear examples

---

## ai-docs/ Directory
**Purpose:** AI assistant reference documentation

**Contains:**
- This file (FOLDER_STRUCTURE.md)
- Additional context files for AI to reference
- Development patterns and conventions

**Rules:**
- Technical and detailed
- Optimized for AI comprehension
- Updated as architecture evolves

---

## scripts/ Directory
**Purpose:** Automation and utility scripts

**Contains:**
- `generate-migration.sh` - Create new TypeORM migration
- `seed-database.sh` - Run database seeders
- `deploy.sh` - Deployment automation

---

## Quick Decision Tree

**Where does my code go?**

1. **Is it infrastructure setup?** → `core/`
2. **Is it a pure utility with no business logic?** → `common/`
3. **Is it a reusable business service?** → `shared/`
4. **Is it domain-specific business logic?** → `features/`
5. **Is it configuration?** → `config/`
6. **Is it a test?** → `test/unit/`, `test/integration/`, or `test/e2e/`
7. **Is it documentation?** → `docs/` or `ai-docs/`
8. **Is it a script?** → `scripts/`

---

## File Naming Conventions

- Controllers: `[feature].controller.ts`
- Services: `[feature].service.ts`
- Modules: `[feature].module.ts`
- Entities: `[name].entity.ts`
- DTOs: `[name].dto.ts` or `create-[name].dto.ts`
- Interfaces: `[name].interface.ts`
- Guards: `[name].guard.ts`
- Decorators: `[name].decorator.ts`
- Pipes: `[name].pipe.ts`
- Filters: `[name].filter.ts`
- Interceptors: `[name].interceptor.ts`
- Unit tests: `*.spec.ts`
- Integration tests: `*.integration.spec.ts`
- E2E tests: `*.e2e-spec.ts`

---

## Import Rules

**Allowed Import Directions:**
```
features/ → can import from → common/, core/, shared/
shared/   → can import from → common/, core/
core/     → can import from → common/
common/   → standalone (no internal dependencies)
```

**Forbidden:**
- core/ should NOT import from features/ or shared/
- common/ should NOT import from any internal folder
- Minimize feature-to-feature dependencies

---

## Module Organization Best Practices

1. **Keep features independent** - Minimize cross-feature dependencies
2. **One feature = one module** - Each feature folder exports one module
3. **Lazy load when possible** - Use dynamic imports for large features
4. **Shared modules are global** - Use @Global() decorator for widely-used modules
5. **Configuration is validated** - Use class-validator in config files

---

## Database & TypeORM Organization

- **Entities** live in their feature folder: `features/users/entities/user.entity.ts`
- **Migrations** live in core: `core/database/migrations/`
- **Seeds** live in core: `core/database/seeds/`
- **Custom repositories** live with their feature (optional)
- **Subscribers** live in feature folder: `features/users/subscribers/`

---

## Testing Strategy

1. **Unit Tests** - 70% of tests, fast, isolated
2. **Integration Tests** - 20% of tests, test component interactions
3. **E2E Tests** - 10% of tests, critical user flows only

**Coverage Goals:**
- Overall: 80%+
- Services: 90%+
- Controllers: 80%+
- Utilities: 95%+

---

## Future Considerations

As the application scales, consider:
- Adding `modules/` within features for sub-domains
- Implementing CQRS (add `commands/` and `queries/`)
- Adding `events/` folders for event-driven architecture
- Microservices separation if needed
- GraphQL layer (add `graphql/` with resolvers)
