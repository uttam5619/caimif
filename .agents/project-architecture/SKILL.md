---
name: project-architecture
description: Authoritative project architecture guideline for caimif_v1 coordinating frontend and backend architectures
---

# Project Architecture Specification

## 1. Architectural Authority

Follow the architecture defined in this document whenever creating, modifying, extending, or refactoring application code.

- **Master Alignment**: This document is synchronized with `AGENTS.md` and serves as the overarching architectural authority for the project.
- **Inspect Before Modifying**: Inspect existing project conventions and directory structures before introducing changes.
- **Extend Over Re-inventing**: Prefer extending existing implementations over creating parallel structures or redundant abstractions.
- **No Unsolicited Architecture**: Do not introduce new architectural patterns or frameworks without an explicit requirement.
- **Primary Objective**: Maintain a modular, maintainable, scalable, extensible, and loosely coupled application without unnecessary complexity.


## 2. Mandatory Commenting Standard

In direct synchronization with `AGENTS.md`:

> While writing the business logic use the comments properly so the flow of business logic in the given function, component, or class should remain clear to the developer or the person who is reading it.

- Document the **purpose** and **invariants** of functions and components.
- Explain non-obvious business workflows, calculations, data transformations, and validation rules.
- Clarify state transitions in frontend hooks and transaction boundaries in backend services.


## 3. Core Architectural Principles

All implementations across frontend and backend must adhere to these foundational principles:

- **Separation of Concerns (SoC)**: Isolate presentation, business logic, data access, and transport layers.
- **Modular Architecture**: Group code by feature and domain rather than arbitrary flat folders.
- **Layered Architecture**: Respect strict unidirectional dependency flows.
- **High Cohesion & Low Coupling**: Keep related code together; minimize inter-module dependencies.
- **SOLID Principles**:
  - **Single Responsibility (SRP)**: Each class, function, or component has one reason to change.
  - **Open/Closed (OCP)**: Code is open for extension, closed for modification.
  - **Liskov Substitution (LSP)**: Subtypes must be substitutable for their base types.
  - **Interface Segregation (ISP)**: Create small, focused interfaces rather than bloated contracts.
  - **Dependency Inversion (DIP)**: High-level policy must not depend on low-level detail.
- **DRY (Don't Repeat Yourself)**: Eliminate duplicate logic; maintain a single source of truth.
- **KISS (Keep It Simple, Stupid)**: Favor clear, readable code over clever, convoluted abstractions.
- **YAGNI (You Aren't Gonna Need It)**: Do not write code or abstractions for hypothetical future needs.


## 4. Project Directory Structure

The application source code lives inside `src/` adhering to the following structure:

```text
caimif_v1/
├── AGENTS.md                            # Root agent governance & rules
├── .agents/                             # Agent architectural skills
│   ├── project-architecture/
│   │   ├── SKILL.md                     # This file (Master architecture)
│   │   ├── backend-architecture/
│   │   │   └── SKILL.md                 # Backend architecture specification
│   │   └── frontend-architecture/
│   │       └── SKILL.md                 # Frontend architecture specification
│   ├── code-standards/                  # Code standards & quality guidelines
│   │   └── SKILL.md
│   ├── api-development/
│   ├── database-design-and-development/
│   ├── security-policies/
│   └── ui-policy/                       # Master UI/UX policy & design system
│       ├── SKILL.md
│       ├── responsiveness-policy/
│       │   └── SKILL.md                 # Responsive design & mobile-first rules
│       └── component-policy/
│           └── SKILL.md                 # Component taxonomy, props & state rules
│
├── src/
│   ├── app/                             # Next.js App Router
│   │   ├── (routes)/                    # Page routes (home, facilities, research, team, etc.)
│   │   ├── api/                         # API route handlers (HTTP entry points)
│   │   ├── layout.tsx                   # Global root layout (Navbar, shared wrappers)
│   │   ├── page.tsx                     # Root landing page
│   │   └── globals.css                  # Global Tailwind styles
│   │
│   ├── components/                      # Modular UI components
│   │   ├── navbar/                      # Top navigation with barrel index.ts export
│   │   ├── home/                        # Home domain components (HeroSection, etc.)
│   │   └── common/                      # Shared reusable UI atoms
│   │
│   ├── hooks/                           # Custom reusable React hooks
│   ├── lib/                             # Shared client utilities, formatters, API fetchers
│   │
│   └── server/                          # Backend architectural root
│       ├── modules/                     # Feature modules (users, instruments, bookings, etc.)
│       │   └── [module]/
│       │       ├── [module].controller.ts
│       │       ├── [module].service.ts
│       │       ├── [module].repository.ts
│       │       ├── [module].validation.ts
│       │       ├── [module].types.ts
│       │       └── [module].constants.ts
│       ├── middleware/                  # Server-side auth, rate limiting, logging middlewares
│       ├── config/                      # Environment and server configuration
│       ├── database/                    # Prisma client instance and DB connections
│       ├── utils/                       # Server-side utility functions
│       └── types/                       # Shared backend types
│
├── public/                              # Static public assets (images, icons, svgs)
├── package.json                         # Dependencies & scripts
└── tsconfig.json                        # TypeScript configuration (paths: @/* -> ./src/*)
```


## 5. Sub-Architecture Specifications

For domain-specific guidelines, always consult and strictly follow the respective sub-architecture skill:

1. **Backend Architecture**:
   - Location: `.agents/project-architecture/backend-architecture/SKILL.md`
   - Governs: Controller-Service-Repository pattern, layered dependency flow, module independence, transaction management, request validation, and error handling.

2. **Frontend Architecture**:
   - Location: `.agents/project-architecture/frontend-architecture/SKILL.md`
   - Governs: App Router page responsibilities, component hierarchy, barrel `index.ts` exports, custom hooks, state management, and API layer communication.
