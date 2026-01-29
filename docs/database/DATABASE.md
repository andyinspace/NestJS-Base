# Database Setup and Migrations

## TypeORM Configuration

This project uses TypeORM with PostgreSQL for database management.

## Environment Variables

Copy `.env.example` to `.env` and configure your database connection:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=nestjs_base
```

## Database Setup

1. **Create Database:**
   ```bash
   createdb nestjs_base
   ```

2. **Run Migrations:**
   ```bash
   npm run migration:run
   ```

## Migration Commands

### Generate a Migration (from entity changes)
```bash
npm run migration:generate src/core/database/migrations/MigrationName
```

Or use the helper script:
```bash
./scripts/generate-migration.sh MigrationName
```

### Create an Empty Migration
```bash
npm run migration:create src/core/database/migrations/MigrationName
```

### Run Migrations
```bash
npm run migration:run
```

### Revert Last Migration
```bash
npm run migration:revert
```

### Show Migration Status
```bash
npm run migration:show
```

## Entity Location

All entities should be placed in their respective feature folders:
- `src/features/users/entities/user.entity.ts`
- `src/features/auth/entities/*.entity.ts`

## Configuration Files

- `typeorm.config.ts` - TypeORM CLI configuration
- `src/config/database.config.ts` - NestJS database configuration
- `src/core/database/database.module.ts` - Database module

## Notes

- Entities are auto-loaded by NestJS when synchronize is enabled
- Migrations are stored in `src/core/database/migrations/`
- Seeds can be placed in `src/core/database/seeds/`
- In development, `synchronize: true` is enabled (disable in production!)
