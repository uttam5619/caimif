---
name: component-policy
description: Component architecture, modular folder conventions, prop contracts, state rules, and visual variants for caimif_v1
---

# Component Architecture & Design Policy

## 1. Architectural Authority & Scope

This specification defines the component-level implementation standards for `caimif_v1`. It operates under the authority of:
- **Parent Policy**: `.agents/ui-policy/SKILL.md`
- **Root Agent Governance**: `AGENTS.md`
- **Frontend Architecture**: `.agents/project-architecture/frontend-architecture/SKILL.md`
- **Code Standards**: `.agents/code-standards/SKILL.md`

All reusable and domain-specific UI components created in `src/components/` must comply with this policy.


## 2. Component Taxonomy

To maintain clarity and prevent bloated monolithic files, components in `caimif_v1` are categorized as follows:

1. **Atoms & Primitives**:
   - Smallest individual building blocks (buttons, badges, inputs, tooltips, spinners).
   - Focused exclusively on presentation; zero knowledge of application business domains.
2. **Molecules & Domain Blocks**:
   - Small combinations of primitives serving a specific domain role (e.g. `NavBrand`, `NavLinks`, `MetricCard`, `InstrumentCard`).
   - May accept domain data objects (e.g. `NavItem`, `InstrumentRecord`).
3. **Organisms & Complex Composites**:
   - Complete functional sections composed of molecules and atoms (e.g. `Navbar`, `HeroSection`, `RequisitionQueueTable`).
   - May manage local UI state (e.g. drawer visibility, search filtering, tab selection).


## 3. Modular Folder Structure & Direct File Imports

Every component directory in `src/components/` follows a clean, direct modular structure:

```text
src/components/[feature]/
├── [Feature].tsx         # High-level orchestrator component
├── [SubComponentA].tsx   # Focused child component
├── [SubComponentB].tsx   # Focused child component
├── types.ts              # Prop interfaces and data contracts
├── [feature].data.ts     # Decoupled presentation data & mock records (pure .ts)
└── [feature].config.ts   # Configuration, constants, static metadata
```

### Direct Import Invariant:
- **Zero Mediator Files**: Do NOT create `index.ts` files merely to re-export other files. Every component, function, and type must be imported **directly from its own source file** (e.g. `import Sidebar from "@/components/admin/dashboard/sidebar/Sidebar"`).
- **Decoupled Data**: Move constant lists, links, and table configurations to `*.data.ts` or `*.config.ts` files rather than hardcoding them inside component JSX.
- **Isolated Types**: Keep component prop interfaces in `types.ts` within the component folder.


## 4. Component Prop Contracts

- **Explicit Typing**: Never use un-typed props or `any`. Define an explicit interface:
  ```typescript
  export interface InstrumentCardProps {
    instrument: InstrumentRecord;
    onSelect?: (id: string) => void;
  }
  ```
- **NEVER Pass `className` as a Prop**:
  - Components must be 100% self-contained and own their entire visual styling, layout, typography, borders, and responsive behavior.
  - **Never add `className?: string` to component prop contracts.**
  - **Never pass `className` into components.**
  - Do not use default prop parameters to inject layout classes (`className = "..."`). Embed all layout and responsive utilities directly into the component's root JSX markup.
- **Handler Naming**: Name event handler props with the `on[Action]` pattern (`onClose`, `onToggle`, `onSubmit`, `onFilterChange`).
- **Composition over Boolean Proliferation**: Use `children` or render slots instead of passing dozens of boolean flags to alter internal markup.


## 5. Component State Guidelines

- **Default to Stateless (Presentational)**: Prefer components that receive data via props and emit events via callbacks.
- **Local State for UI Concerns**: Use `useState` only for state that belongs strictly inside the component (e.g., dropdown open/close, hover tooltip, active tab index).
- **Synchronous Effect Warning**: Avoid setting state synchronously inside `useEffect` on prop changes. Derive state during render or use event handlers instead.
- **Event Typing (React 19)**: Do NOT use deprecated `React.FormEvent` for form submission handlers. In React 19, `FormEvent` is deprecated. Use `React.SubmitEvent<HTMLFormElement>` for `onSubmit` form handlers, and `React.ChangeEvent<HTMLInputElement>` for input changes.


## 6. Theme & Color Token Integration

All components must apply colors from the primary design tokens established in `ui-policy/SKILL.md`:
- **Primary Elements**: Use `#172554` (`bg-primary`, `text-primary`, `border-primary`) for primary buttons, active link markers, and brand badges.
- **Secondary Elements**: Use `#00191E` (`bg-secondary`, `text-secondary`, `border-secondary`) for rich dark containers, footers, and contrast blocks.
- **Surface & Cards**: Use crisp `white` (`bg-white`) for card bodies, modal dialogs, and elevated surfaces.
- **Avoid Hardcoded Hexes**: Reference the token classes or CSS variables instead of scattershot ad-hoc colors.


## 7. Mandatory Comments

In alignment with `AGENTS.md`:

> While writing the business logic use the comments properly so the flow of business logic in the given function, component, or class should remain clear to the developer or the person who is reading it.

- Add JSDoc headers to every component explaining its responsibility and usage.
- Document complex conditional render paths, accessibility keydown listeners, and custom event handlers.
- Avoid obvious syntax comments; focus on user experience rationale and state transitions.


## 8. Clean Code & Anti-Overengineering Standards for UI Components

To prevent cognitive debt, JSX bloat, and maintain high readability across the codebase, all UI components must follow these clean code practices:

### 1. DRY Class Constants for Repeated Control Styles
Do NOT repeat identical 10-15 Tailwind utility strings across sibling inputs, buttons, or form controls. Define a clean, local constant at the top of the component or render scope:
```typescript
const inputClass =
  "w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-xs focus:border-[#172554] focus:outline-none focus:ring-1 focus:ring-[#172554] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100";
```
Apply it directly to elements: `<input className={inputClass} ... />`, or compose cleanly:
```typescript
className={`${inputClass} flex items-center justify-between font-medium cursor-pointer`}
```

### 2. Eliminate Redundant DOM Wrappers
Do NOT wrap every individual input, button, or text node in an unnecessary `<div>`.
- **Anti-Pattern**:
  ```tsx
  <div>
    <input className="..." />
  </div>
  ```
- **Clean Pattern**: Place `<input className={inputClass} />` directly inside the parent container that utilizes spacing utilities (e.g., `space-y-4` or `flex flex-col gap-4`).
- Only introduce a wrapper `<div>` when strictly required as an anchor for floating/absolute elements (e.g. a dropdown menu container).

### 3. Lean Primitives over Bloated Inline SVGs
Avoid dumping 20-line inline SVG paths for trivial visual indicators like dropdown arrows or chevrons.
- Prefer clean, semantic text/unicode indicators (e.g. `<span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>`) or a dedicated icon primitive.
- Keep the JSX tree readable and uncluttered.

### 4. Data Simplicity over Metadata Overkill (YAGNI & KISS)
Do NOT create complex multi-property metadata dictionaries (`{ id, label, description, iconType, badge }[]`) when a simple typed array is all that is required:
```typescript
const ROLES: AdminRole[] = ["SecurityAdmin", "SubAdmin"];
```
Only introduce complex data objects when those individual fields are actually displayed in the UI.

### 5. Invariant: NEVER Pass `className` as a Prop
- **Never pass `className` as a prop to any component.**
- Component interfaces must never include `className?: string`.
- All layout classes (e.g. grid spans `lg:col-span-7 xl:col-span-7`, flex positioning, widths, margins, padding) must be written directly inside the component's own root element JSX.
- Components are fully autonomous building blocks that encapsulate their complete styling and responsive layout.

### 6. Lean, Native Accessibility
Use native semantic elements and apply WAI-ARIA attributes (`role="listbox"`, `role="option"`, `aria-selected`, `aria-expanded`, `aria-haspopup="listbox"`) directly on the interactive elements without adding wrapper bureaucracy.

### 7. Clean Async Flow & Error Handling
Use standard `try / catch / finally` blocks with concise state updates for async actions:
```typescript
try {
  await apiCall();
  router.push(onSuccessRedirect);
} catch {
  setErrorMsg("Authentication failed. Please try again.");
} finally {
  setIsLoading(false);
}
```
- Document complex ternary operations, accessibility keydown listeners, and custom animation hooks.


## 9. Strict Separation of Data from UI Presentation (SRP & OCP Enforcement)

### 9.1 The Core Responsibility of a UI Component
The sole responsibility of a UI component is to **render visual presentation and handle interactive user events** based on incoming props and local UI interaction state. **A UI component must never act as a data store or hold hardcoded domain/presentation data, navigation structures, mock datasets, or static arrays directly inside its component `.tsx` file.**

### 9.2 Violations of SOLID Principles
1. **Single Responsibility Principle (SRP) Violation**:
   When static or initial data is hardcoded inside a component:
   - The file has **two reasons to change**:
     1. Whenever the visual appearance, Tailwind styling, accessibility attributes, or DOM layout change.
     2. Whenever the data content, navigation links, labels, category lists, or default values change.
   - SRP mandates that a module should have one, and only one, reason to change.
2. **Open/Closed Principle (OCP) Violation**:
   - Components should be **closed for modification, but open for extension**.
   - If adding a navigation item, changing a mock record, or updating domain text forces you to edit the component file, the entire component undergoes modification.
   - Modifying component files for data changes introduces severe regression risks to layout, rendering logic, and event handlers.

### 9.3 Invariant: Zero Hardcoded Data in Component Files
- **Always Externalize Data**: Move all navigation arrays, menu structures, mock domain lists, static options, metric definitions, and initial records into dedicated files:
  - `[feature].data.ts` or `[feature].data.tsx` (for datasets, navigation lists, mock data)
  - `[feature].config.ts` (for static configuration, metadata, constants)
- **Import into Component**: The component must strictly import its data from the external file or receive it via props:
  ```typescript
  // In sidebar.data.tsx
  export const NAV_ITEMS: NavItem[] = [ ... ];

  // In Sidebar.tsx
  import { NAV_ITEMS } from "./sidebar.data";
  ```
- **Modifying Data without Modifying UI**: Whenever content, items, or records need to be updated, added, or removed, **only the data file is modified**. The component file remains completely untouched.


## 10. Direct Import Invariant (Zero Mediator / Barrel Files)

### 10.1 Absolute Prohibition of Mediator Files
- **Direct Import Only**: All consumers must import components, functions, and types directly from their canonical file (e.g. `import RegisterNewDomainForm from "@/components/admin/dashboard/researchDomain/RegisterNewDomainForm"`).
- **No Mediator / Proxy Files**: Do not create third files (`index.ts`, `ResearchDomainForm.tsx`, etc.) whose sole purpose is to re-export other files.
- **Why**:
  1. **Zero Added Value**: Introduces a redundant pass-through layer that provides no validation, transformation, or logic.
  2. **File Tree Clutter**: Adds dead files that clutter developer navigation and IDE autocompletion.
  3. **Violation of Clean Code & Anti-Overengineering**: If a component needs to be used, import it directly where it is defined. Never use a mediator file just for import and export.


