# NestJS-Base

A production-ready NestJS boilerplate with TypeScript, PostgreSQL, TypeORM, and comprehensive tooling for building scalable backend applications.

## 🚀 Features

- **NestJS Framework** - Modern, progressive Node.js framework
- **TypeScript** - Full TypeScript support with strict type checking
- **PostgreSQL + TypeORM** - Powerful database integration with migrations
- **Authentication Ready** - Pre-configured JWT and Passport structure
- **Validation** - Class-validator for DTO validation
- **Testing** - Jest setup for unit and e2e tests
- **Code Quality** - ESLint, Prettier, and Husky pre-commit hooks
- **API Documentation** - Swagger/OpenAPI ready
- **Security** - Helmet middleware for security headers
- **Rate Limiting** - Throttler for API protection
- **Health Checks** - Built-in health check endpoint

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm
- PostgreSQL (v12 or higher)

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/andyinspace/NestJS-Base.git
cd NestJS-Base
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=AppUser
DB_PASSWORD=AppUser
DB_DATABASE=NestJSBase

# Application
NODE_ENV=development
PORT=3000

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=3600
```

## 🗄️ Database Setup

1. Create PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE "NestJSBase";
CREATE USER "AppUser" WITH PASSWORD 'AppUser';
GRANT ALL PRIVILEGES ON DATABASE "NestJSBase" TO "AppUser";
\q
```

2. Run migrations (when available):
```bash
npm run migration:run
```

## 🏃 Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

## 📁 Project Structure

```
src/
├── app.controller.ts       # Main application controller
├── app.module.ts           # Root application module
├── main.ts                 # Application entry point
├── config/                 # Configuration files
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── eslint.config.mjs
├── core/                   # Core modules (database, etc.)
│   └── database/
├── features/               # Feature modules
│   ├── auth/              # Authentication (structure ready)
│   └── users/             # User management (structure ready)
├── common/                # Shared utilities
└── shared/                # Shared modules

test/                      # E2E tests
docs/                      # Documentation
scripts/                   # Utility scripts
```

## 🔌 API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "ok",
  "datetime": "2026-01-29T16:45:00.000Z"
}
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Start the application |
| `npm run start:dev` | Start in watch mode (development) |
| `npm run start:debug` | Start in debug mode |
| `npm run start:prod` | Start production build |
| `npm run build` | Build the application |
| `npm run format` | Format code with Prettier |
| `npm run lint` | Lint and fix code with ESLint |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Run tests with coverage |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run migration:generate` | Generate a new migration |
| `npm run migration:run` | Run pending migrations |
| `npm run migration:revert` | Revert last migration |

## 🛠️ Technologies

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL
- **ORM**: TypeORM 0.3.x
- **Validation**: class-validator, class-transformer
- **Testing**: Jest, Supertest
- **Code Quality**: ESLint 9.x, Prettier
- **Git Hooks**: Husky, lint-staged
- **API Docs**: Swagger/OpenAPI
- **Security**: Helmet, Throttler

## 🔐 Security Features

- Helmet middleware for HTTP security headers
- Rate limiting with @nestjs/throttler
- JWT authentication structure
- Password hashing ready (bcrypt)
- CORS configuration
- Environment variable validation

## 🎯 Development Workflow

1. **Code Quality**: Husky runs ESLint and Prettier on pre-commit
2. **Testing**: Pre-push hook runs tests and builds
3. **Migrations**: TypeORM CLI for database migrations
4. **Validation**: Strict TypeScript and class-validator for runtime checks

## 📝 Adding New Features

1. Generate a new module:
```bash
nest g module features/your-feature
nest g controller features/your-feature
nest g service features/your-feature
```

2. Create DTOs with validation:
```typescript
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
```

3. Write tests alongside your code

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License.

## 👤 Author

**Andy**
- GitHub: [@andyinspace](https://github.com/andyinspace)

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Inspired by best practices in the NestJS community

---

**Note**: This is a boilerplate/starter template. Remove or modify features as needed for your specific use case.
