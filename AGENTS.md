<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


## Comments & Documentation

While writing the business logic use the comments properly so the flow of business logic
in the given function, component, or class should remain clear to the developer or the person who is reading it.
Explain the "why" behind non-obvious logic, validation rules, state transitions, and database queries.


## Skills & Architecture Guidelines

Use relevant architectural skills located in `.agents/`:

- **Complete Project & Overall Architecture:**
  Read `.agents/project-architecture/SKILL.md`
  *(Authoritative guide covering SOLID principles, project structure, and cross-cutting rules)*

  - **Backend Architecture:**
    Read `.agents/project-architecture/backend-architecture/SKILL.md`
    *(Layered architecture, Controller-Service-Repository separation, module isolation, transactions, and error handling)*

  - **Frontend Architecture:**
    Read `.agents/project-architecture/frontend-architecture/SKILL.md`
    *(App Router structure, modular component design, barrel index.ts exports, custom hooks, and state management)*

- **Code Standards & Quality Guidelines:**
  Read `.agents/code-standards/SKILL.md`
  *(Code modularity, anti-overengineering rules, naming conventions, and business logic commenting standards)*

- **API Development:**
  Read `.agents/api-development/SKILL.md`

- **Database Design & Development:**
  Read `.agents/database-design-and-development/SKILL.md`

- **UI & Design Policy:**
  Read `.agents/ui-policy/SKILL.md`
  *(Master UI/UX design tokens, colors, typography, accessibility, and visual consistency)*

  - **Responsive Design & Mobile-First Policy:**
    Read `.agents/ui-policy/responsiveness-policy/SKILL.md`
    *(Breakpoint systems, touch targets, fluid layouts, and mobile-first standards)*

  - **Component Architecture & Design Policy:**
    Read `.agents/ui-policy/component-policy/SKILL.md`
    *(Component taxonomy, prop contracts, state rules, and barrel index.ts exports)*

- **Security Policies:**
  Read `.agents/security-policies/SKILL.md`

Do not load unrelated skills.


## Architectural Invariants & Dependency Rules

Follow the architecture defined in `.agents/project-architecture/SKILL.md` whenever creating, modifying, or refactoring application code.

### 1. Strict Dependency Direction (Backend)
Maintain the following unidirectional flow:

```
Next.js App Routes (src/app/api/...)
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

- **Routes**: Thin request entry points. No direct database access or business logic.
- **Controllers**: Request validation, status codes, and HTTP translation. No business logic or database queries.
- **Services**: Business rules, workflows, validation, and transaction boundaries. HTTP-agnostic.
- **Repositories**: All ORM/database queries. No business logic or HTTP concerns.
- **Database**: Accessed strictly through repository methods.

### 2. Feature-Based Module Organization
Each backend module `M` inside `src/server/modules/` maintains:
- `M.controller.ts` — Module controllers
- `M.service.ts` — Business logic and service functions
- `M.repository.ts` — Database operations and queries
- `M.validation.ts` — Request validation schemas
- `M.types.ts` — Domain types and interfaces
- `M.constants.ts` — Module-specific constants

### 3. Frontend Modular Organization
- **Pages / Routes (`src/app/`)**: Thin orchestrators handling routing and layout composition.
- **Components (`src/components/`)**: Modular, domain-driven components organized by feature directory without mediator `index.ts` files. Always directly import components and functions from their implementation file.
- **Separation of Data from UI (SRP & OCP)**: The core responsibility of a UI component is exclusively rendering presentation, not holding data. Never hardcode data (navigation items, static arrays, mock domain lists) inside a component file. Always store data in separate `*.data.ts` or `*.config.ts` files and import it. Whenever data changes, only the data file undergoes modification—never the component file.
- **Direct Imports (No Mediator Files)**: Never create mediator files (`index.ts` or proxy bridge files) just for import and export. Always import directly from the target file.
- **Custom Hooks (`src/hooks/`)**: Reusable stateful logic; separated from presentation.
- **Client Libraries (`src/lib/`)**: Shared client utilities and centralized API fetch helpers.
