---
name: ui-policy
description: Master UI/UX policy, design system tokens, typography, color palettes, accessibility, and visual consistency standards for caimif_v1
---

# Global UI/UX Policy Specification

## 1. Architectural Authority & Scope

This document defines the overarching visual and design standards for `caimif_v1`. It is strictly synchronized with:
- **Root Agent Governance**: `AGENTS.md`
- **Master Project Architecture**: `.agents/project-architecture/SKILL.md`
- **Frontend Architecture**: `.agents/project-architecture/frontend-architecture/SKILL.md`
- **Code Standards**: `.agents/code-standards/SKILL.md`

All pages (`src/app/`) and components (`src/components/`) must adhere to this policy to guarantee a cohesive, professional, accessible, and high-performance user experience.

### Sub-Policies:
1. **Responsive Design & Breakpoints**: Read `.agents/ui-policy/responsiveness-policy/SKILL.md`
2. **Component Structure & State Standards**: Read `.agents/ui-policy/component-policy/SKILL.md`


## 2. Mandatory Business Logic & UI Commenting

In direct alignment with `AGENTS.md`:

> While writing the business logic use the comments properly so the flow of business logic in the given function, component, or class should remain clear to the developer or the person who is reading it.

- Document the **purpose** and **props contract** of all UI components.
- Explain conditional render paths, modal dialog state machines, form validation flows, and event handling logic.
- Avoid obvious syntax comments; focus on user experience rationale and state transitions.


## 3. Design System Tokens & Foundations

`caimif_v1` utilizes **Tailwind CSS v4** with design tokens mapped to CSS variables in `src/app/globals.css`.

### 3.1 Color Palette & Theme Tokens

The facility color system is built around three core pillars:

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. PRIMARY COLOR    : #172554  (Deep Navy Blue)             │
│ 2. SECONDARY COLOR  : #00191E  (Deep Teal / Dark Cyan)      │
│ 3. THIRD CHOICE     : #FFFFFF  (Crisp White / Clean Surface)│
└─────────────────────────────────────────────────────────────┘
```

#### 1. Primary Color (`#172554` - Deep Navy Blue)
- **Role**: Primary brand identity, primary CTA buttons, active state indicators, key headers, and brand badges.
- **Tailwind Mappings**:
  - Base Solid: `bg-[#172554]` (or `bg-primary`)
  - Hover Action: `hover:bg-[#1e3a8a]`
  - Text Emphasis: `text-[#172554]` (or `text-primary`)
  - Active Borders & Rings: `border-[#172554]`, `ring-[#172554]`
  - Subtle Tint / Pill Background: `bg-[#172554]/10` (light) / `bg-[#172554]/30` (dark)

#### 2. Secondary Color (`#00191E` - Deep Teal / Dark Cyan-Black)
- **Role**: Secondary branding, high-contrast dark sections, footer backgrounds, dark mode canvases, accent badges, and specialized technical data blocks.
- **Tailwind Mappings**:
  - Base Solid: `bg-[#00191E]` (or `bg-secondary`)
  - Hover / Border: `hover:bg-[#002f38]`, `border-[#00191E]`
  - Text: `text-[#00191E]` (or `text-secondary`)
  - Subtle Tint: `bg-[#00191E]/10` (light) / `bg-[#00191E]/40` (dark)
  - Gradients: Often combined with primary for high-impact visual banners: `bg-gradient-to-br from-[#172554] to-[#00191E]`.

#### 3. Third Choice (`#FFFFFF` - Crisp White / Clean Surface)
- **Role**: Primary background for clean readability, content card surfaces, modal dialog fills, and high-contrast text against `#172554` and `#00191E`.
- **Tailwind Mappings**:
  - Card & Container Surface: `bg-white`
  - High-Contrast Text: `text-white` on `#172554` or `#00191E` backgrounds
  - Crisp Borders: `border-white/20` over dark surfaces
  - Subtle Hover Tint: `hover:bg-white/10` on dark buttons

#### 4. Semantic Status Indicators
- **Operational / Success**: `text-emerald-600`, `bg-emerald-50` / `bg-emerald-950`
- **In Use / Active**: `text-[#172554]`, `bg-blue-50` / `bg-blue-950`
- **Calibration / Warning / Pending**: `text-amber-600`, `bg-amber-50` / `bg-amber-950`
- **Maintenance / Danger / Destructive**: `text-rose-600`, `bg-rose-50` / `bg-rose-950`


### 3.2 Typography Hierarchy
- **Standard Font Family**: `Open Sans` (`var(--font-open-sans)`, "Open Sans", sans-serif) is the authoritative, standard font for all headers, titles, navigation elements, buttons, and body copy across the application.
- **Monospace Family**: `Geist Mono` (`var(--font-geist-mono)`, monospace) for equipment codes, DOIs, timestamps, request IDs, and technical specs.

| Level | Tailwind Classes | Usage |
| :--- | :--- | :--- |
| **Hero Title** | `text-4xl sm:text-6xl font-extrabold tracking-tight text-[#172554] dark:text-white` | Main landing hero |
| **Page Title** | `text-3xl sm:text-5xl font-extrabold tracking-tight text-[#172554] dark:text-white` | Facilities, Research, Team, Gallery |
| **Section Title** | `text-2xl sm:text-3xl font-bold tracking-tight text-[#172554] dark:text-white` | Major section headings within pages |
| **Overline Badge** | `text-xs font-bold uppercase tracking-wider text-[#172554] dark:text-blue-300` | Category callouts above headers |
| **Card Heading** | `text-lg sm:text-xl font-bold text-zinc-900 dark:text-white` | Instrument cards, team cards, publication titles |
| **Body (Default)** | `text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed` | General descriptive copy |
| **Technical / Meta** | `text-xs font-mono font-medium text-zinc-500` | Specs, units, dates, IDs |


### 3.3 Spacing, Borders & Shadows
- **Containers**: Center layouts with `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`.
- **Card Padding**: Use `p-6` on mobile, scaling to `sm:p-8` for major containers.
- **Border Radius**:
  - Controls, badges, inputs, buttons: `rounded-xl`
  - Cards, modals, containers: `rounded-2xl`
- **Shadows**: Clean, layered elevation: `shadow-sm` for resting cards, `hover:shadow-md` or `hover:shadow-lg` for interactive elevations, `shadow-[#172554]/15` for primary brand glow accents.


## 4. Interaction States & Visual Feedback

Every interactive element (button, link, input, tab, card) must implement explicit feedback:

1. **Hover State**:
   - Primary Buttons (`bg-[#172554]`): Shift to `hover:bg-[#1e3a8a]` with elevation increase.
   - Secondary Elements (`bg-[#00191E]`): Shift to `hover:bg-[#002f38]`.
   - Links: Color transition (`text-zinc-600 hover:text-[#172554] transition-colors`).
   - Cards: Border accentuation (`hover:border-[#172554]/40 hover:shadow-md`).
2. **Focus State**:
   - Always visible keyboard focus outline: `focus:outline-none focus-visible:ring-2 focus-visible:ring-[#172554] focus-visible:ring-offset-2`.
3. **Active State**:
   - Tactile click feedback: `active:scale-[0.99]`.
4. **Disabled State**:
   - Visually muted and non-interactive: `disabled:opacity-60 disabled:cursor-not-allowed`.
5. **Empty & Loading States**:
   - Provide informative empty states with descriptive guidance and an action button.
   - Use skeleton pulse screens (`animate-pulse`) during async data loading.


## 5. Accessibility (a11y) Standards

- **Contrast Ratios**:
  - Text in `#172554` on white background yields a contrast ratio of **14.8:1** (far exceeds WCAG AAA of 7:1).
  - Text in `white` on `#00191E` yields a contrast ratio of **18.7:1** (exceeds WCAG AAA).
- **Semantic HTML**: Use native semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<button>`, `<input>`) instead of generic `<div>` tags with click handlers.
- **Accessible Labelling**:
  - Buttons containing only icons must have `<span className="sr-only">Description</span>` or `aria-label`.
  - Disclosures and drawers must declare `aria-expanded` and `aria-controls`.
  - Active navigation links must declare `aria-current="page"`.
- **Motion Safety**: Use smooth transitions (`transition-all duration-150` or `duration-200`).


## 6. Prohibitions & Anti-Patterns

- **NEVER hardcode endpoints or make routing assumptions unless given explicitly**: Always use `#` as a placeholder for redirects and navigation links (e.g., `onSuccessRedirect = "#"`, `href="#"`) unless concrete endpoints are explicitly specified by the user.
- **NEVER pass `className` as a prop**: Components must be 100% self-contained and encapsulate their own styling, layout, typography, and responsive behavior internally. Never add `className` to prop contracts. Never pass `className` across component boundaries. All layout rules, grid column spans, and positioning must be declared directly within the component itself.
- **Do NOT duplicate long Tailwind strings across sibling inputs/controls**: Define reusable local constants (e.g., `inputClass = "..."`) to eliminate repetitive class clutter.
- **Do NOT introduce redundant DOM wrapper layers**: Avoid wrapping individual `<input>` or button elements in useless `<div>` containers when direct styling on the control inside a flex/grid layout suffices.
- **Do NOT bloat JSX with heavy inline SVG paths for trivial indicators**: Prefer clean unicode characters (e.g. `▼` with `transition-transform`) or dedicated, reusable icon primitives.
- **Do NOT over-engineer data structures and state (YAGNI & KISS)**: Keep data structures minimal. Do not create complex metadata dictionaries when simple typed arrays (`const ROLES: AdminRole[] = [...]`) are all that is needed.
- **Do NOT** use ad-hoc color hexes that conflict with the primary (`#172554`), secondary (`#00191E`), and white (`#FFFFFF`) palette.
- **Do NOT** use inline `style={{ ... }}` unless calculating purely dynamic geometry values.
- **Do NOT** duplicate UI components when a reusable shared component can be leveraged.
- **Do NOT** disable focus rings without providing an accessible `focus-visible` replacement.
- **Do NOT** design desktop-only interfaces that break or require horizontal scrolling on mobile viewports.
