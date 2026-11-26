---
name: frontend-architecture
description: Authoritative frontend architecture guidelines, Next.js App Router structure, component design, barrel exports, hooks, and state management for caimif_v1
---

# Frontend Architecture Specification

## 1. Architectural Authority & Alignment

This document defines the frontend architectural standards for `caimif_v1`. It is strictly synchronized with:
- **Parent Authority**: `.agents/project-architecture/SKILL.md`
- **Root Agent Governance**: `AGENTS.md`

All frontend code located in `src/app/`, `src/components/`, `src/hooks/`, and `src/lib/` must adhere to these standards.


## 2. Mandatory Business Logic Comments

In alignment with `AGENTS.md` and `project-architecture/SKILL.md`:

> While writing the business logic use the comments properly so the flow of business logic in the given function, component, or class should remain clear to the developer or the person who is reading it.

- **Components**: Comment the component responsibility, props contract, and UI conditional rendering logic.
- **Custom Hooks**: Comment the purpose of state variables, effect cleanup, and state transitions.
- **Client Utilities / API**: Comment data normalization, error handling, and authorization header injection.


## 3. Frontend Layered Responsibilities

Maintain a strict separation between UI presentation, application logic, state management, and API communication.

```text
Pages / Route Components (src/app/(routes)/...)
                  |
                  v
       Domain Components (src/components/...)
                  |
                  v
       Custom Hooks (src/hooks/...)
                  |
                  v
       API Layer / Client Utilities (src/lib/...)
```

### Layer Responsibilities

#### 1. Pages / Route Components (`src/app/`)
- Represent application routes in the Next.js App Router.
- Responsible for page-level layout composition, metadata, and high-level routing.
- Orchestrate data fetching (Server Components) or initiate initial queries.
- **Rule**: Avoid large blocks of business logic or inline styling inside route files. Delegate to domain components.

#### 2. Domain & UI Components (`src/components/`)
- Handle user interface presentation, styling, and user interaction.
- Organized by feature/domain (e.g., `navbar/`, `home/`, `facilities/`, `admin/`).
- Prefer small, focused, and reusable components adhering to Single Responsibility.
- Must use TypeScript interfaces for all component props.

#### 3. Custom Hooks (`src/hooks/`)
- Encapsulate reusable React stateful logic and browser side-effects.
- Each hook must have one clearly defined responsibility (e.g., `useActiveRoute`, `useModalState`, `useDebounce`).
- **Rule**: Do not create hooks for trivial one-liners. Only abstract when genuine reuse or complexity justifies it.

#### 4. API Layer (`src/lib/api/`)
- Centralize all communication with backend HTTP endpoints (`src/app/api/...`).
- Standardize request headers, credential inclusion, and error parsing.
- Avoid scattering raw `fetch` calls across unrelated UI components.

#### 5. State Management
- **Local State (`useState`, `useReducer`)**: Default choice for UI state local to a single component or its direct children.
- **URL State (`useSearchParams`, `usePathname`)**: Use query parameters for shareable state like filters, tabs, search queries, and pagination.
- **Global State**: Introduce only when state genuinely needs to be shared across disjointed component subtrees without prop-drilling.


## 4. Modular Component Structure & Direct Imports

To keep components clean, direct, and maintainable, every component directory in `src/components/` follows this modular structure:

```text
src/components/[feature]/
├── [Feature].tsx         # High-level orchestrator component (rendering UI only)
├── [SubComponentA].tsx   # Focused sub-component A
├── [SubComponentB].tsx   # Focused sub-component B
├── types.ts              # Prop interfaces and data contracts
├── [feature].data.ts     # Decoupled presentation data, nav items, mock records
└── [feature].config.ts   # Static constants, metadata, theme mappings
```

### Strict Separation of Data from UI Presentation (SRP & OCP)
- **Component Core Responsibility**: UI components exist strictly to render the user interface and handle user interactions. They must **never store hardcoded data**.
- **SRP & OCP Protection**: Hardcoding data inside a component creates two reasons to change and forces the complete component file under modification whenever data values change.
- **Dedicated Data Files**: Always place data into separate `*.data.ts` or `*.data.tsx` files and import it. When data evolves, only the data file is modified—never the component JSX file.

### Direct Import Invariant (Zero Mediator / Barrel Files)
- **Direct Import Only**: Always import components and functions directly from their specific file path (e.g. `import Sidebar from "@/components/admin/dashboard/sidebar/Sidebar"`).
- **No Mediator Files**: Do NOT create `index.ts` files or proxy files just for import and export. Introducing a third intermediary file adds dead weight, clutters navigation, and creates duplicate import paths.


## 5. React Server Components (RSC) vs. Client Components

- **Default to Server Components**: Keep pages and components as Server Components by default for optimal performance, reduced client bundle size, and SEO.
- **Use `"use client"` sparingly**: Mark a file with `"use client"` ONLY when it requires:
  - Interactive React state (`useState`, `useReducer`)
  - Component lifecycle effects (`useEffect`, `useLayoutEffect`)
  - DOM event listeners (`onClick`, `onChange`, `onSubmit`)
  - Browser APIs (`window`, `localStorage`, `document`)
  - Next.js client navigation hooks (`usePathname`, `useRouter`, `useSearchParams`)
- Push `"use client"` boundaries as far down the component tree as possible (leaf components).


## 6. Styling & Accessibility Standards

- **Styling**: Use Tailwind CSS utility classes. Avoid arbitrary inline styles (`style={{ ... }}`).
- **Theme Variables**: Use design tokens defined in `globals.css` (e.g., `zinc-900`, `blue-600`, dark mode variants).
- **Accessibility (a11y)**:
  - Interactive elements must be keyboard-accessible (`Tab`, `Enter`, `Escape`).
  - Use proper ARIA attributes (`aria-label`, `aria-expanded`, `aria-current`).
  - Ensure color contrast ratios meet WCAG AA standards.
