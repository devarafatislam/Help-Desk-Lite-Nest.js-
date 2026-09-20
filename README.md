# HelpDesk Lite

A production-oriented REST API built with **NestJS**. The project is designed around clean backend architecture, separation of responsibilities, request validation, authorization, middleware, interceptors, and production deployment.

## Overview

HelpDesk Lite is a lightweight helpdesk/ticket management backend.

The project focuses on building a maintainable NestJS REST API with a clear separation between:

- HTTP/API handling
- Business logic
- Request validation
- Authorization
- Cross-cutting concerns
- Response transformation
- Production deployment

The current version uses in-memory data and does **not** require a database.

---

## Features

- RESTful API architecture
- Modular NestJS structure
- Controllers for HTTP request handling
- Services/providers for business logic
- Dependency Injection
- Dynamic route parameters
- Query parameter filtering
- DTO-based request structure
- Runtime request validation
- Global `ValidationPipe`
- Ticket creation
- Ticket retrieval
- Ticket filtering
- Ticket update with `PATCH`
- Request logging middleware
- Authorization guards
- Standardized API responses with interceptors
- Production-ready build
- GitHub-based deployment workflow
- Render deployment support

---

## Tech Stack

### Backend

- **NestJS**
- **Node.js**
- **TypeScript**

### Package Manager

- **Bun**

### Development

- NestJS CLI
- Git
- GitHub
- Postman / Thunder Client

### Deployment

- **Render**

### Database

Currently:

> No database. The project uses in-memory data for learning and architecture development.

A database can be introduced in a future version.

---

# Architecture

The application follows NestJS's modular architecture.

```text
                    Client
                      │
                      ▼
                HTTP Request
                      │
                      ▼
                 Middleware
                      │
                      ▼
                   Guards
                      │
                      ▼
                Interceptors
                      │
                      ▼
              Validation / Pipes
                      │
                      ▼
                 Controller
                      │
                      ▼
                   Service
                      │
                      ▼
               Business Logic
                      │
                      ▼
                Interceptors
                      │
                      ▼
                HTTP Response
```

### Responsibility separation

| Component | Responsibility |
|---|---|
| Module | Feature organization and dependency management |
| Controller | HTTP routes and request handling |
| Service | Business logic |
| DTO | Request data structure |
| ValidationPipe | Runtime request validation |
| Middleware | Request-level cross-cutting processing |
| Guard | Authorization/access decisions |
| Interceptor | Request/response transformation and cross-cutting behavior |

---

# Project Structure

The project follows a feature-oriented structure.

```text
helpdesk-lite/
│
├── src/
│   │
│   ├── tickets/
│   │   ├── dto/
│   │   │   ├── create-ticket.dto.ts
│   │   │   └── update-ticket.dto.ts
│   │   │
│   │   ├── tickets.controller.ts
│   │   ├── tickets.service.ts
│   │   └── tickets.module.ts
│   │
│   ├── common/
│   │   ├── middleware/
│   │   ├── guards/
│   │   └── interceptors/
│   │
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── app.module.ts
│   └── main.ts
│
├── test/
│
├── package.json
├── bun.lock
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
└── README.md
```

> The exact file structure may evolve as the project grows.

---

# Ticket API

The primary resource of HelpDesk Lite is a **Ticket**.

A ticket represents a customer support issue.

Example:

```json
{
  "id": "1",
  "title": "Unable to login",
  "description": "The user cannot access the account",
  "status": "open"
}
```

---

# API Endpoints

Base URL:

```text
http://localhost:3000
```

Production:

```text
https://<your-render-service>.onrender.com
```

## Tickets

### Get all tickets

```http
GET /tickets
```

Returns all available tickets.

---

### Filter tickets

```http
GET /tickets?status=open
```

Example:

```http
GET /tickets?status=closed
```

Query parameters can be used to filter the ticket collection.

---

### Get a single ticket

```http
GET /tickets/:id
```

Example:

```http
GET /tickets/1
```

---

### Create a ticket

```http
POST /tickets
```

Example request body:

```json
{
  "title": "Unable to login",
  "description": "The user cannot access the account"
}
```

---

### Update a ticket

```http
PATCH /tickets/:id
```

Example:

```http
PATCH /tickets/1
```

Request body:

```json
{
  "status": "closed"
}
```

PATCH is used for partial updates.

---

# DTOs

DTO stands for **Data Transfer Object**.

DTOs define the expected structure of incoming request data.

Example:

```ts
export class CreateTicketDto {
  title: string;
  description: string;
}
```

With validation:

```ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
```

DTOs provide a clear boundary between external request data and application logic.

---

# Validation

The application uses NestJS `ValidationPipe` together with `class-validator` and `class-transformer`.

Global validation is configured in `main.ts`.

Example:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
);
```

### Validation flow

```text
Request
   ↓
DTO
   ↓
ValidationPipe
   ↓
Valid?
 ┌───────┴───────┐
 No              Yes
 ↓                ↓
Error          Controller
                  ↓
                Service
```

This prevents invalid request data from reaching business logic.

---

# Dependency Injection

NestJS uses Dependency Injection to manage providers.

Example:

```ts
@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
  ) {}
}
```

The controller does not manually create the service.

NestJS resolves and injects the dependency.

This keeps components loosely coupled and easier to maintain and test.

---

# Controllers

Controllers are responsible for handling HTTP requests.

Example:

```ts
@Controller('tickets')
export class TicketsController {
  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }
}
```

Controllers should remain thin.

Business rules should live inside services.

---

# Services

Services contain business logic.

Example:

```ts
@Injectable()
export class TicketsService {
  findAll() {
    return this.tickets;
  }

  findOne(id: string) {
    return this.tickets.find(
      ticket => ticket.id === id,
    );
  }
}
```

The service layer provides a separation between HTTP handling and application logic.

---

# Middleware

Middleware runs during request processing.

A logging middleware can record:

- HTTP method
- URL
- Request timing
- Other request metadata

Example:

```ts
@Injectable()
export class LoggerMiddleware
  implements NestMiddleware {

  use(req: Request, res: Response, next: NextFunction) {
    console.log(
      `${req.method} ${req.originalUrl}`,
    );

    next();
  }
}
```

### Why middleware?

Logging is a cross-cutting concern.

Instead of repeating logging code inside every controller, middleware can handle it centrally.

---

# Guards

Guards determine whether a request is allowed to continue.

Example:

```ts
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    return true;
  }
}
```

Usage:

```ts
@UseGuards(AuthGuard)
@Get()
findAll() {
  return this.ticketsService.findAll();
}
```

The guard layer is intended for authorization/access-control decisions.

---

# Interceptors

Interceptors can execute logic before and after the controller handler.

They are useful for:

- Response transformation
- Request timing
- Logging
- Consistent response formatting
- Cross-cutting behavior

Example standardized response:

```json
{
  "success": true,
  "data": {}
}
```

This allows response formatting to be handled centrally rather than duplicated across controllers.

---

# Request Lifecycle

A simplified lifecycle for this project:

```text
Client
  │
  ▼
Middleware
  │
  ▼
Guards
  │
  ▼
Interceptors
  │
  ▼
Pipes / Validation
  │
  ▼
Controller
  │
  ▼
Service
  │
  ▼
Controller Response
  │
  ▼
Interceptors
  │
  ▼
Client
```

Understanding this lifecycle is an important part of understanding NestJS architecture.

---

# Installation

## Requirements

Make sure the following are installed:

```bash
node --version
bun --version
git --version
```

---

# Clone the Project

```bash
git clone <YOUR_REPOSITORY_URL>
```

Move into the project:

```bash
cd helpdesk-lite
```

---

# Install Dependencies

This project uses Bun.

```bash
bun install
```

---

# Development

Start the development server:

```bash
bun run start:dev
```

The API will normally be available at:

```text
http://localhost:3000
```

---

# Build

Create a production build:

```bash
bun run build
```

The compiled application will be generated inside the `dist` directory.

---

# Production

Start the production application:

```bash
bun run start:prod
```

The production process should execute the compiled NestJS application.

---

# package.json Scripts

The project uses scripts similar to:

```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main"
  }
}
```

Bun executes them with:

```bash
bun run build
bun run start:dev
bun run start:prod
```

---

# Environment Variables

The project currently has minimal environment requirements.

For local development, a `.env` file can be used when environment-specific configuration is introduced.

Example:

```env
PORT=3000
NODE_ENV=development
```

Do not commit `.env` files containing secrets.

Recommended `.gitignore` entries:

```gitignore
node_modules/
dist/
.env
.env.*
!.env.example
```

---

# Render Deployment

The project can be deployed as a Render Web Service.

## Deployment Architecture

```text
Local Development
       │
       ▼
     Git
       │
       ▼
    GitHub
       │
       ▼
     Render
       │
       ├── Install dependencies
       │
       ├── Build NestJS
       │
       └── Start production server
       │
       ▼
 Public API
```

---

## Render Build Command

Use:

```bash
bun install && bun run build
```

---

## Render Start Command

Use:

```bash
bun run start:prod
```

---

## Render Port Configuration

The application should listen on the port supplied by the hosting platform.

Use:

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');
}

bootstrap();
```

The important parts are:

```ts
process.env.PORT
```

and:

```ts
'0.0.0.0'
```

This allows the application to accept traffic correctly in a managed cloud environment.

---

# Deployment Checklist

Before deploying:

```text
[ ] bun install
[ ] bun run build
[ ] bun run start:prod
[ ] API tested locally
[ ] .env excluded from Git
[ ] Git repository updated
[ ] GitHub push successful
[ ] Render Web Service created
[ ] Build command configured
[ ] Start command configured
[ ] PORT handling verified
[ ] Production API tested
```

---

# Development Workflow

Recommended workflow:

```text
Create Feature
     ↓
Implement
     ↓
Run Local Server
     ↓
Test API
     ↓
Run Build
     ↓
Commit
     ↓
Push to GitHub
     ↓
Render Deploys
     ↓
Test Production API
```

Example:

```bash
bun run start:dev
```

Then:

```bash
bun run build
```

Then:

```bash
git add .
git commit -m "feat: add ticket update endpoint"
git push
```

---

# Error Debugging

## Build errors

Run:

```bash
bun run build
```

Fix TypeScript/NestJS errors before deployment.

---

## Production start errors

Run:

```bash
bun run start:prod
```

Check whether the `dist` directory was generated correctly.

---

## Port errors

Verify:

```ts
await app.listen(
  process.env.PORT || 3000,
  '0.0.0.0',
);
```

---

## API route errors

Check:

- Controller prefix
- HTTP method
- Route parameters
- Query parameters
- Request body
- DTO validation
- Guard behavior

---

# Current Limitations

This version intentionally does not include:

- Database
- PostgreSQL
- Prisma
- MongoDB
- JWT authentication
- User management
- Role management
- File upload
- Redis
- Docker
- Microservices

These can be introduced in future versions.

---

# Future Roadmap

## Phase 1 — Core NestJS

- [x] Project setup
- [x] Modules
- [x] Controllers
- [x] Services
- [x] Dependency Injection
- [x] Route parameters
- [x] Query parameters
- [x] DTOs
- [x] ValidationPipe
- [x] POST
- [x] PATCH
- [x] Middleware
- [x] Guards
- [x] Interceptors
- [x] Production build
- [x] Cloud deployment

## Phase 2 — Database

Planned:

- PostgreSQL
- Prisma
- Database schema
- Migrations
- Persistent tickets
- Repository/data-access layer

## Phase 3 — Authentication

Planned:

- User registration
- Login
- JWT
- Authentication guards
- Role-based authorization
- User/ticket ownership

## Phase 4 — Production Engineering

Planned:

- Unit testing
- E2E testing
- Docker
- CI/CD
- Structured logging
- Error handling
- API documentation
- Health checks
- Monitoring

---

# Engineering Principles

## Keep Controllers Thin

Controllers should primarily coordinate HTTP requests.

```text
Controller
    ↓
Service
    ↓
Business Logic
```

Avoid putting large business rules directly inside controllers.

---

## Separate Responsibilities

Use the appropriate NestJS abstraction:

```text
HTTP routes
    → Controller

Business logic
    → Service

Request shape
    → DTO

Validation
    → Pipe

Request processing
    → Middleware

Authorization
    → Guard

Response transformation
    → Interceptor
```

---

# API Testing

The API can be tested using:

- Postman
- Thunder Client
- REST Client
- cURL
- Browser for simple GET requests

Example:

```bash
curl http://localhost:3000/tickets
```

Create ticket:

```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Unable to login",
    "description": "User cannot access the account"
  }'
```

---

# Project Status

**Status:** Active Learning / Engineering Project

**Backend:** NestJS

**Language:** TypeScript

**Package Manager:** Bun

**Database:** None — in-memory

**Deployment:** Render

**API Style:** REST

---

# License

This project is intended for learning and engineering practice.

Add an appropriate open-source license here if the project is later published as an open-source repository.
