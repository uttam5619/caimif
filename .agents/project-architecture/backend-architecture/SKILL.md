---
name: backend-architecture
description: Authoritative backend architecture guidelines, layered dependency flow, controller-service-repository pattern, and API standards for caimif_v1
---

# Backend Architecture Specification

## 1. Architectural Authority & Alignment

This document defines the backend architectural standards for `caimif_v1`. It is strictly synchronized with:
- **Parent Authority**: `.agents/project-architecture/SKILL.md`
- **Root Agent Governance**: `AGENTS.md`

All backend code located in `src/server/` and `src/app/api/` must follow these rules without exception.


## 2. Mandatory Business Logic Comments

In alignment with `AGENTS.md` and `project-architecture/SKILL.md`:

> While writing the business logic use the comments properly so the flow of business logic in the given function or class should remain clear to the developer or the person who is reading it.

- **Controllers**: Comment extracted parameters, authentication context, and status code logic.
- **Services**: Comment each step of the business workflow, domain rules, calculation logic, and transaction boundaries.
- **Repositories**: Comment complex SQL/Prisma query logic, indexing considerations, and data mapping.


## 3. Standard Dependency Flow

Maintain the following unidirectional dependency flow at all times:

```text
Next.js App Routes / API Handlers (src/app/api/...)
                  |
                  v
             Controllers (src/server/modules/*/M.controller.ts)
                  |
                  v
              Services (src/server/modules/*/M.service.ts)
                  |
                  v
            Repositories (src/server/modules/*/M.repository.ts)
                  |
                  v
              Database (Prisma / MariaDB)
```

The dependency direction must never be bypassed or inverted.

### Layer Responsibilities

#### Next.js App Routes (`src/app/api/.../route.ts`)
- Handle HTTP routing and incoming request entry points.
- Connect incoming requests to the appropriate controllers.
- Parse HTTP-specific concerns such as route parameters, query strings, and HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).
- **Forbidden**: Must not contain business logic or direct database queries. Keep route handlers thin.

#### Controllers (`M.controller.ts`)
- Handle incoming request processing and coordination.
- Extract validated request data, body payloads, parameters, and authentication context.
- Invoke the appropriate service functions.
- Translate service results into structured HTTP responses with proper status codes (`200`, `201`, `400`, `404`, `500`).
- **Forbidden**: Must not contain business logic, business calculations, or database queries.

#### Services (`M.service.ts`)
- Contain the core application and domain business logic.
- Enforce business rules, access policies, and application-level validations.
- Coordinate workflows involving multiple repositories when required.
- Manage business workflows and transaction boundaries.
- **Forbidden**: Must not depend on HTTP request or response objects (`NextRequest`, `NextResponse`). Must not contain raw database queries.

#### Repositories (`M.repository.ts`)
- Handle all database-related operations and persistence logic.
- Encapsulate Prisma ORM queries, database models, and transactions.
- Provide reusable data-access functions.
- **Forbidden**: Must not contain business logic or HTTP-specific functionality. Must not depend on controllers.

#### Database
- Responsible for persistent data storage (MariaDB managed via Prisma).
- Direct database access from routes, controllers, components, or services is strictly prohibited.


## 4. Feature-Based Module Organization

Organize backend functionality by business domain or feature inside `src/server/modules/`.

```text
src/server/
├── modules/
│   ├── users/
│   │   ├── users.controller.ts      # HTTP request handling & response mapping
│   │   ├── users.service.ts         # Business logic & domain workflows
│   │   ├── users.repository.ts      # Database queries via Prisma
│   │   ├── users.validation.ts      # Zod / validation schemas
│   │   ├── users.types.ts           # Module types & interfaces
│   │   └── users.constants.ts       # Module constants & enums
│   │
│   ├── instruments/
│   │   ├── instruments.controller.ts
│   │   ├── instruments.service.ts
│   │   ├── instruments.repository.ts
│   │   └── ...
│   │
│   └── bookings/
│       ├── bookings.controller.ts
│       ├── bookings.service.ts
│       ├── bookings.repository.ts
│       └── ...
│
├── middleware/                      # Auth guards, logging, rate-limiters
├── config/                          # Server environment configurations
├── database/                        # Prisma client singleton
├── utils/                           # Server utilities (hashing, jwt, formatting)
└── types/                           # Shared global backend types
```

### Module Organization Rules
- Each module owns its own controllers, services, and repository functions.
- Name files following the pattern: `<module>.<layer>.ts` (e.g. `users.controller.ts`, `users.service.ts`, `users.repository.ts`).
- Keep validation schemas, types, and constants local to the module unless they are genuinely shared across domains.


## 5. Module Independence & Boundaries

- Modules must maintain high cohesion and low coupling.
- **No Direct Cross-Repository Access**: A module must not directly call or import another module's repository.
- **Cross-Module Service Invocation**: Cross-module operations must use the corresponding service layer interface.
- **No Circular Dependencies**: Structure domain relationships to prevent circular imports between modules.
- **Shared Code Location**: Common utilities reside in `src/server/utils/`, shared database client in `src/server/database/`.


## 6. Repository and Database Rules

- All database queries must be encapsulated within repositories.
- Do not expose ORM-specific implementation details unnecessarily to higher layers.
- **Transaction Ownership**: Transactions spanning multiple operations must be owned and initiated in the service layer, passing transaction clients down to repository methods.
- **Performance**: Avoid N+1 queries by leveraging Prisma relation joins (`include` or `select`).
- **Pagination**: Always paginate endpoints that return collections using cursor or skip/take pagination.
- **Security**: Never return database models directly if they contain sensitive or internal attributes (e.g., hashed passwords, internal tokens). Project to safe DTOs.


## 7. API, Validation and Error Handling Standards

### Request Validation
- Validate all incoming request data on the server before processing.
- Validate request bodies, query parameters, route parameters, and authorization tokens.
- Client-side validation is a UX convenience, never a security boundary.

### Standard Response Structure
Maintain a consistent API response structure across all endpoints:

```typescript
// Successful Response
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource could not be found",
    "details": null
  }
}
```

### Error Handling
- Use centralized error handling mechanisms.
- Throw typed application errors from the service layer (e.g., `NotFoundError`, `ValidationError`, `UnauthorizedError`).
- Translate application errors into appropriate HTTP status codes at the controller layer.
- Never expose internal database errors, SQL queries, or stack traces to public API consumers.
