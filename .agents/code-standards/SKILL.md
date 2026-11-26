---
name: code-standards
description: Authoritative code quality, modularity, anti-overengineering, naming conventions, and business logic commenting standards for caimif_v1
---

# Code Standards & Quality Guidelines

## 1. Authority & Synchronization

This document defines the code-level implementation standards for `caimif_v1`. It is strictly synchronized with:
- **Root Agent Governance**: `AGENTS.md`
- **Master Project Architecture**: `.agents/project-architecture/SKILL.md`
- **Sub-Architectures**: `backend-architecture/SKILL.md` and `frontend-architecture/SKILL.md`

Every contributor, developer, and agent must adhere to these standards when writing, refactoring, or reviewing code.


## 2. Core Coding Tenets

All code written in this repository must embody three pillars:

- **Modular**: Code must be encapsulated into cohesive, self-contained units (modules, components, services). High cohesion and low coupling must be maintained.
- **Extensible**: Code should follow the Open/Closed Principle (OCP)—open for reasonable extension without breaking or rewriting existing, stable implementations.
- **Scalable**: Code must support growing traffic, data volume, and feature complexity through predictable patterns, proper database indexing, and clear abstraction boundaries.


## 3. Mandatory Business Logic Commenting Standard

In direct alignment with `AGENTS.md`:

> While writing the business logic use the comments properly so the flow of business logic in the given function, component, or class should remain clear to the developer or the person who is reading it.

### Rules for Writing Effective Comments:
- **Focus on the "Why" and Flow**: Explain the business rationale, edge cases, domain policies, and calculation steps—not just what the code syntactically does.
- **Clarify Complex Workflows**:
  - In **Services**: Comment each milestone of a multi-step business process (e.g. validating eligibility, creating transaction, updating equipment quota, sending confirmation).
  - In **Controllers**: Comment parameter extraction, role authorization checks, and HTTP response translation.
  - In **Repositories**: Comment non-trivial query joins, ordering, pagination constraints, and database locking.
  - In **Components & Hooks**: Comment state machines, conditional render paths, accessibility behaviors, and effect cleanup triggers.
- **Avoid Comment Noise**: Do not write comments that merely re-state trivial syntax (e.g. `// increment i by 1`).
- **Maintain Synchrony**: Update comments whenever modifying the underlying business logic. Outdated comments are worse than no comments.


## 4. Anti-Overengineering Invariants

Overengineering introduces cognitive debt, slows development, and complicates maintenance. The following rules are strictly enforced:

### Strict "Do Not" Directives:
1. **Do not create unnecessary classes, interfaces, services, repositories, hooks, or utility files**:
   - Only create an abstraction when it serves an immediate, concrete requirement or encapsulates non-trivial complexity.
2. **Do not introduce abstractions for hypothetical future requirements (YAGNI)**:
   - Build for today's requirements with clean patterns that allow future extension, but do not write code for speculative use cases.
3. **Do not add pass-through layers**:
   - Avoid creating functions or services that merely forward calls to another function without adding validation, domain logic, or transformation.
4. **Do not introduce design patterns merely for demonstration**:
   - Avoid implementing complex patterns (factories, decorators, adapters, DI containers) unless they solve a genuine, present architecture problem.
5. **Do not add dependencies without clear justification**:
   - Prefer native language capabilities, standard library APIs, or existing installed packages before introducing new third-party dependencies.
6. **Do not prematurely optimize**:
   - Measure first. Focus on algorithmic efficiency and proper database indexing rather than premature micro-optimizations that harm readability.
7. **Do not sacrifice readability for cleverness (KISS)**:
   - Straightforward, readable code is always superior to concise but opaque one-liners.
8. **Do not rewrite existing working code merely to suit stylistic preferences**:
   - Respect established conventions unless an explicit refactoring requirement exists.
9. **Do not hardcode endpoints or make routing assumptions unless given explicitly**:
   - Always use `#` as a placeholder for navigation URLs, redirect destinations, or API routes until concrete endpoints are explicitly provided by the user or technical specification.
   - Never invent hypothetical routes (e.g. `/admin/dashboard`, `/home`) on your own.
10. **Do not hardcode presentation data, navigation items, mock records, or domain datasets inside UI components**:
   - The core responsibility of a UI component is exclusively rendering presentation and managing interactive UI state, NOT storing data.
   - Hardcoding data inside a component violates the Single Responsibility Principle (SRP) and the Open/Closed Principle (OCP). Whenever data changes, the entire component undergoes modification, risking regressions in layout and event handlers.
   - Always extract data into dedicated `*.data.ts`, `*.data.tsx`, or `*.config.ts` files, and import it into the component. When data changes, only the separate data file is modified—the component `.tsx` file remains untouched.
11. **Do not create mediator or barrel files (Direct Imports Invariant)**:
   - Never create an unnecessary file (e.g. `index.ts` or aliasing files) whose sole purpose is to re-export other components, functions, or types.
   - If a component, utility, or function needs to be imported, import it **directly** from its canonical file (e.g. `import RegisterNewDomainForm from "@/components/admin/dashboard/researchDomain/RegisterNewDomainForm"`).
   - Do not use a mediator file just for import and export. Introducing a third intermediary file adds dead weight, clutters navigation, and violates clean code principles.


## 5. Naming Conventions & Organization

Follow consistent naming patterns throughout the project:

### 5.1 File & Directory Naming
- **Backend Modules**: Inside `src/server/modules/[module]/`, use `<module>.<layer>.ts`:
  - `[module].controller.ts` (e.g. `bookings.controller.ts`)
  - `[module].service.ts` (e.g. `bookings.service.ts`)
  - `[module].repository.ts` (e.g. `bookings.repository.ts`)
  - `[module].validation.ts` (e.g. `bookings.validation.ts`)
  - `[module].types.ts` (e.g. `bookings.types.ts`)
  - `[module].constants.ts` (e.g. `bookings.constants.ts`)
- **Frontend Components**:
  - Component files: `PascalCase.tsx` (e.g. `Navbar.tsx`, `HeroSection.tsx`, `NavBrand.tsx`).
  - Component directories: `kebab-case` or domain name (e.g. `src/components/navbar/`, `src/components/home/`).
  - Direct imports: Import components directly by their file path; do not create mediator `index.ts` files.
- **Routes**: Next.js App Router conventions: `page.tsx`, `layout.tsx`, `route.ts`, `error.tsx`, `loading.tsx`.

### 5.2 Identifiers & Conventions
- **Variables & Functions**: `camelCase` (e.g. `isMobileMenuOpen`, `getUserBookingHistory()`).
  - Functions should start with a descriptive verb: `calculateFee()`, `validateInstrumentSlot()`, `formatDate()`.
- **Types & Interfaces**: `PascalCase` (e.g. `NavItem`, `InstrumentRecord`, `BookingStatus`).
  - Do not prefix interfaces with `I` (use `NavItem`, not `INavItem`).
- **Constants & Enums**: `UPPER_SNAKE_CASE` for global and static configurations (e.g. `NAV_ITEMS`, `BRAND_CONFIG`, `DEFAULT_PAGE_SIZE`).
- **React Custom Hooks**: `camelCase` prefixed with `use` (e.g. `usePathname`, `useInstrumentFilter`).


## 6. TypeScript Strictness & Type Safety

- **Zero Tolerance for `any`**:
  - Avoid `any`. Use precise domain interfaces, generics, or `unknown` combined with type narrowing/guards.
- **Explicit Component Props**:
  - Every React component must define its prop contract using a dedicated TypeScript interface.
- **Strict Null & Undefined Handling**:
  - Handle optional parameters and nullable database fields explicitly. Avoid unchecked non-null assertions (`!`).
- **Use Zod / Schemas for Boundary Validation**:
  - All external data entering via HTTP requests (`req.json()`, `req.nextUrl.searchParams`) must be validated at the boundary before being passed to business logic.


## 7. Clean Code & Function Hygiene

- **Small, Focused Functions**: Each function should perform one task well (Single Responsibility Principle).
- **Limit Function Arguments**: Prefer passing a single options/input object for functions requiring more than 3 parameters.
- **Avoid Deep Nesting**: Use early returns (guard clauses) to handle error and edge conditions upfront, keeping the happy path linear.
- **Immutable Data Habits**: Favor pure functions and non-mutating array methods (`map`, `filter`, `reduce`, spread syntax) over in-place mutation.
