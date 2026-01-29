# NestJS-Base Folder Structure

**Last Updated:** January 29, 2026

This document provides a comprehensive guide to the folder structure of the NestJS-Base boilerplate. It serves as a reference for understanding where different types of code should live and how to organize your application as it grows.

---

## Current Project Structure

```
NestJS-Base/
├── .husky/              - Git hooks (pre-commit, pre-push)
├── docs/                - Documentation
│   ├── database/        - Database documentation
│   ├── guides/          - Development guides
│   └── FOLDER_STRUCTURE.md (this file)
├── scripts/             - Utility scripts
├── src/                 - Application source code
│   ├── config/          - Configuration files
│   ├── core/            - Core infrastructure modules
│   │   └── database/    - Database module and migrations
│   └── features/        - Feature modules
│       └── users/       - User management (boilerplate)
├── test/                - E2E tests
├── .env                 - Environment variables (gitignored)
├── .gitignore          - Git ignore patterns
├── .prettierrc         - Prettier configuration
├── nest-cli.json       - NestJS CLI configuration
├── package.json        - Dependencies and scripts
├── README.md           - Project documentation
├── tsconfig.json       - TypeScript configuration
└── tsconfig.build.json - Build-specific TypeScript config
```

**Root Level Files:**
- `.env` - Environment variables (never committed to Git)
- `.gitignore` - Git ignore patterns
- `package.json` - Dependencies and npm scripts
- `tsconfig.json` - Main TypeScript configuration
- `tsconfig.build.json` - Build-specific TypeScript config
- `nest-cli.json` - NestJS CLI configuration
- `.prettierrc` - Code formatting rules
- `README.md` - Project documentation

---

## src/ Directory

The `src/` directory contains all application source code.

### Current Structure

```
src/
├── app.controller.ts       - Main health check controller
├── app.controller.spec.ts  - Controller unit tests
├── app.module.ts           - Root application module
├── main.ts                 - Application entry point & bootstrap
├── config/                 - Configuration management
│   ├── app.config.ts       - General app configuration
│   ├── database.config.ts  - Database/TypeORM configuration
│   ├── jwt.config.ts       - JWT authentication settings
│   ├── typeorm-cli.config.ts - TypeORM CLI for migrations
│   └── eslint.config.mjs   - ESLint configuration
├── core/                   - Infrastructure layer
│   └── database/
│       ├── database.module.ts - Database connection module
│       └── migrations/        - TypeORM migrations (future)
└── features/               - Business features
    └── users/              - User management (boilerplate)
        ├── dto/
        │   ├── create-user.dto.ts
        │   └── update-user.dto.ts
        └── entities/
            └── user.entity.ts
```

---

### src/config/
**Purpose:** Centralized configuration management using @nestjs/config

**Current Files:**
- `app.config.ts` - General application settings (port, environment)
- `database.config.ts` - PostgreSQL and TypeORM configuration
- `jwt.config.ts` - JWT token settings for authentication
- `typeorm-cli.config.ts` - Configuration for TypeORM CLI commands
- `eslint.config.mjs` - ESLint 9 flat config

**Rules:**
- Uses @nestjs/config for environment variable management
- Each config file exports a registerAs() function
- Validates environment variables
- No business logic, only configuration mapping

**Example:**
```typescript
export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
}));
```

---

### src/core/
**Purpose:** Infrastructure and technical foundation layer

**Current Structure:**
- `database/` - Database connection and migrations setup

**Intended for:**
- `cache/` - Redis/caching module (future)
- `queue/` - Bull queue setup (future)
- `logger/` - Custom logging (future)
- `health/` - Health check services (future)

**Rules:**
- Infrastructure concerns only
- No business logic
- Reusable across different applications
- Provides foundation for features to consume

---

### src/features/
**Purpose:** Business domain logic organized by feature

**Current Features:**
- `users/` - User entity and DTOs (authentication-ready boilerplate)
  - Includes User entity with TypeORM decorators
  - Create and Update DTOs with validation
  - Ready for authentication implementation

**Standard Feature Structure:**
```
features/[feature-name]/
├── dto/              - Data Transfer Objects
├── entities/         - TypeORM entities
├── interfaces/       - Feature-specific interfaces
├── guards/           - Feature guards
├── [feature].controller.ts  - HTTP endpoints
├── [feature].service.ts     - Business logic
├── [feature].module.ts      - Feature module
└── [feature].repository.ts  - Custom repositories (optional)
```

**Rules:**
- Each feature is self-contained
- Features can import from config/ and core/
- Features should minimize dependencies on other features
- All business logic stays in services
- Controllers are thin, delegating to services
- Each feature has its own module

**Adding a New Feature:**
```bash
nest g module features/products
nest g controller features/products
nest g service features/products
```

---

## src/main.ts
**Purpose:** Application entry point and bootstrap

**Current Setup:**
- NestFactory bootstrap
- Global validation pipe
- CORS configuration
- Port configuration from environment

**Can be extended with:**
- Swagger documentation setup
- Helmet security headers
- Rate limiting
- Logging configuration
- Graceful shutdown hooks

---

## test/ Directory

**Current Structure:**
```
test/
├── app.e2e-spec.ts  - End-to-end tests for health endpoint
└── jest-e2e.json    - E2E test configuration
```

**Test Organization (recommended):**
**Test Organization (recommended):**
```
test/
├── unit/              - Unit tests (co-located with source is also fine)
├── integration/       - Integration tests
├── e2e/              - End-to-end tests
│   ├── fixtures/     - Test data
│   └── *.e2e-spec.ts
└── helpers/          - Test utilities
```

**Current Tests:**
- Health check endpoint E2E tests
- App controller unit tests (in src/)

**Testing Commands:**
- `npm test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run test:cov` - Test coverage
- `npm run test:watch` - Watch mode

**File Naming:**
- Unit tests: `*.spec.ts` (next to source file or in test/unit/)
- E2E tests: `*.e2e-spec.ts` (in test/ directory)

---

## docs/ Directory
**Purpose:** Project documentation

**Current Structure:**
```
docs/
├── database/
│   └── DATABASE.md       - Database documentation
├── guides/
│   └── VALIDATION.md     - Validation guide
└── FOLDER_STRUCTURE.md   - This file
```

**Add as needed:**
- API documentation
- Architecture Decision Records (ADRs)
- Deployment guides
- Development workflows

---

## scripts/ Directory
**Purpose:** Automation and utility scripts

**Current Files:**
- `generate-migration.sh` - Create TypeORM migrations

**Add as needed:**
- Database seeding scripts
- Deployment automation
- Data migration scripts
- Development setup scripts

---

## .husky/ Directory
**Purpose:** Git hooks for code quality

**Current Hooks:**
- `pre-commit` - Runs lint-staged (ESLint + Prettier on staged files)
- `pre-push` - Runs tests and build before pushing

**Benefits:**
- Ensures consistent code formatting
- Catches errors before commit
- Validates build before push

---

## Quick Decision Tree

**Where does my code go?**

1. **Is it configuration?** → `src/config/`
2. **Is it infrastructure (database, cache, etc.)?** → `src/core/`
3. **Is it domain/business logic?** → `src/features/[feature-name]/`
4. **Is it a test?** → `test/` or co-located `*.spec.ts`
5. **Is it documentation?** → `docs/`
6. **Is it a utility script?** → `scripts/`
7. **Is it the app entry point?** → `src/main.ts`

---

## File Naming Conventions

- Controllers: `[feature].controller.ts`
- Services: `[feature].service.ts`
- Modules: `[feature].module.ts`
- Entities: `[name].entity.ts`
- DTOs: `create-[name].dto.ts`, `update-[name].dto.ts`
- Guards: `[name].guard.ts`
- Decorators: `[name].decorator.ts`
- Pipes: `[name].pipe.ts`
- Filters: `[name].filter.ts`
- Interceptors: `[name].interceptor.ts`
- Unit tests: `*.spec.ts`
- E2E tests: `*.e2e-spec.ts`

---

## Expanding the Structure

As your application grows, consider adding:

### src/common/ (When Needed)
For shared utilities used across features:
- `decorators/` - Custom decorators
- `filters/` - Exception filters
- `guards/` - Shared guards
- `interceptors/` - Shared interceptors
- `pipes/` - Validation pipes
- `interfaces/` - Shared TypeScript interfaces
- `constants/` - Application constants
- `utils/` - Pure utility functions

### src/shared/ (When Needed)
For reusable business services:
- `email/` - Email service
- `file-upload/` - File handling
- `payment/` - Payment processing
- `notifications/` - Notification service

**Key Difference:**
- `common/` = Technical utilities (no business logic)
- `shared/` = Business services (reusable across features)

---

## Database & TypeORM

**Entity Location:** 
- Entities live in their feature: `features/users/entities/user.entity.ts`

**Migrations:**
- Location: `src/core/database/migrations/`
- Generate: `npm run migration:generate -- src/core/database/migrations/MigrationName`
- Run: `npm run migration:run`
- Revert: `npm run migration:revert`

**Configuration:**
- Connection: `src/config/database.config.ts`
- CLI: `src/config/typeorm-cli.config.ts`

---

## Environment Variables

**Required Variables (.env):**
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=AppUser
DB_PASSWORD=AppUser
DB_DATABASE=NestJSBase

# Application
NODE_ENV=development
PORT=3000

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=3600
```

**Best Practices:**
- Never commit `.env` to Git
- Use `.env.example` as a template
- Validate environment variables in config files
- Use different values per environment

---

## Import Guidelines

**Recommended Import Order:**
1. External packages (NestJS, TypeORM, etc.)
2. Config imports
3. Core imports
4. Shared/Common imports
5. Feature imports
6. Relative imports

**Import Rules:**
```
features/ → can import → config/, core/, common/, shared/
shared/   → can import → config/, core/, common/
core/     → can import → config/, common/
common/   → standalone (no internal dependencies)
config/   → standalone (only @nestjs/config)
```

**Avoid:**
- Circular dependencies between features
- Features importing from other features (use shared/ instead)
- Core importing from features

---

## Module Organization

1. **Root Module** (`app.module.ts`)
   - Imports ConfigModule globally
   - Imports DatabaseModule
   - Imports feature modules
   - Provides app-level controllers/services

2. **Feature Modules**
   - Self-contained
   - Export services that other modules might need
   - Import what they need from core/shared

3. **Core Modules**
   - Often global (@Global() decorator)
   - Provide infrastructure services

---

## Code Quality Tools

**ESLint:**
- Config: `src/config/eslint.config.mjs`
- Run: `npm run lint`
- Auto-fix on commit via Husky

**Prettier:**
- Config: `.prettierrc`
- Run: `npm run format`
- Auto-format on commit via Husky

**TypeScript:**
- Config: `tsconfig.json`
- Strict mode enabled
- Path aliases configured if needed

---

## Testing Strategy

**Unit Tests:**
- Test individual components in isolation
- Mock all dependencies
- Co-locate with source or in test/unit/
- Goal: 80%+ coverage

**E2E Tests:**
- Test complete user flows
- Test actual HTTP requests
- Use test database
- Focus on critical paths
- Located in test/ directory

**Pre-push:**
- All tests must pass before push
- Enforced by Husky hook

---

## Future Considerations

As the application scales, consider:

1. **Microservices**
   - Split features into separate services
   - Add gRPC or message queue communication

2. **CQRS**
   - Add `commands/` and `queries/` folders
   - Separate read and write operations

3. **Event-Driven**
   - Add `events/` folders
   - Implement event sourcing

4. **GraphQL**
   - Add `graphql/` with resolvers
   - Replace or supplement REST APIs

5. **Monorepo**
   - Use Nx or similar for multiple apps
   - Share code between services

---

## Summary

This boilerplate provides a solid foundation with:
- ✅ Clean folder structure
- ✅ TypeScript + NestJS best practices
- ✅ Database integration ready
- ✅ Testing setup
- ✅ Code quality tools
- ✅ Git hooks for consistency
- ✅ Health check endpoint
- ✅ Configuration management
- ✅ Documentation

Start building your features in `src/features/` and expand the structure as your application grows!
