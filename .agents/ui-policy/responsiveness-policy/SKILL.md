---
name: responsiveness-policy
description: Authoritative responsive design, mobile-first strategies, breakpoint systems, touch targets, and layout scaling rules for caimif_v1
---

# Responsiveness & Adaptive Layout Specification

## 1. Architectural Authority & Scope

This specification defines the responsive layout rules for `caimif_v1`. It operates under the authority of:
- **Parent Policy**: `.agents/ui-policy/SKILL.md`
- **Root Agent Governance**: `AGENTS.md`
- **Frontend Architecture**: `.agents/project-architecture/frontend-architecture/SKILL.md`

Every screen, page, modal, and component must render flawlessly across all standard device viewports, from small smartphones (375px) to ultra-wide desktop monitors (1920px+).


## 2. Mobile-First Philosophy

All CSS styles and Tailwind utility classes must be written following the **Mobile-First** paradigm:

1. **Base Classes Are Mobile Classes**:
   - Write unprefixed utilities to target the smallest viewports first (e.g. `flex flex-col text-2xl p-4`).
2. **Progressive Enhancement**:
   - Apply breakpoint prefixes (`sm:`, `md:`, `lg:`, `xl:`) only when expanding or adapting the layout for wider viewports (e.g. `md:flex-row md:text-4xl md:p-8`).
3. **Prohibition of Fixed Layout Widths**:
   - Never use fixed pixel container widths (e.g. `w-[1200px]`, `min-w-[900px]`).
   - Use fluid container classes: `w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.


## 3. Standard Breakpoint System

`caimif_v1` adheres to the standard Tailwind CSS breakpoint matrix:

| Prefix | Min Width | Target Device Class | Typical Layout Shift |
| :--- | :--- | :--- | :--- |
| **Default** | `< 640px` | Small to standard smartphones | 1-column layouts, full-width buttons, hamburger menu |
| `sm` | `640px` | Large phones, phablets, small tablets | 2-column grids, inline CTA buttons |
| `md` | `768px` | Tablets, iPads, small laptops | **Desktop navigation visible**, sidebar splits |
| `lg` | `1024px` | Standard desktops, laptops | 3 or 4-column cards, advanced multi-pane panels |
| `xl` | `1280px` | Large monitors | Max-width content boundaries (`max-w-7xl`) |
| `2xl` | `1536px` | Ultra-wide displays | Centered bounded canvas |


## 4. Key Responsive Component Patterns

### 4.1 Global Navigation (`Navbar`)
- **Mobile (`< md` / 768px)**:
  - Navigation links must collapse into an accessible hamburger menu toggle.
  - The mobile menu drawer overlays the viewport (`fixed inset-x-0 top-20 bottom-0 z-40`).
  - Document body scrolling must be locked while the drawer is open (`document.body.style.overflow = "hidden"`).
  - Tapping any route link automatically closes the drawer.
- **Desktop (`>= md` / 768px)**:
  - Hamburger toggle is hidden (`md:hidden`).
  - Navigation items render horizontally inline (`hidden md:flex items-center gap-1 lg:gap-2`).

### 4.2 Grid Layout Scaling
Grid layouts must adapt progressively to prevent squished content or horizontal page blowout:

```tsx
{/* Metric / KPI Stats */}
<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">...</div>

{/* Instrument / Feature Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">...</div>

{/* Forms with Multiple Fields */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">...</div>
```

### 4.3 Data Tables & Dense Sets
- Tables must never cause the entire webpage to scroll horizontally on mobile screens.
- **Mandatory Pattern**: Wrap all `<table>` elements in a fluid scroll container:
  ```tsx
  <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
    <table className="w-full text-left text-sm">
      {/* Table content */}
    </table>
  </div>
  ```

### 4.4 Buttons, CTAs & Touch Targets
- **Touch Target Size**: Interactive elements on mobile must maintain a minimum touch area of **44px × 44px** (WCAG 2.5.5) to prevent accidental taps.
- **Button Stacking**:
  - Full-width on mobile viewports for easy thumb reach: `w-full sm:w-auto`.
  - Grouped buttons must stack vertically on mobile and align horizontally on desktop:
    ```tsx
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <button className="w-full sm:w-auto ...">Primary Action</button>
      <button className="w-full sm:w-auto ...">Secondary Action</button>
    </div>
    ```


## 5. Typography & Text Scaling

- **Responsive Font Sizing**: Scale headings gracefully across viewports:
  - Main Headlines: `text-3xl sm:text-5xl lg:text-6xl`
  - Subheadings: `text-lg sm:text-xl`
  - Overlines: `text-xs uppercase font-bold`
- **Text Wrapping & Long Strings**:
  - URLs, DOIs, email addresses, and hashes must not break outside container boundaries.
  - Use `break-words` or `truncate` with tooltips where appropriate.


## 6. Viewport Testing & Verification Checklist

Before approving any UI page or component, verify its presentation against these key viewports:

1. **375px (Mobile Portrait - e.g. iPhone SE / Mini)**:
   - No horizontal page scrollbar (`document.body.scrollWidth === window.innerWidth`).
   - Text is legible without zooming.
   - Drawer toggle and modal dialogs fit within the screen.
2. **768px (Tablet Portrait - e.g. iPad)**:
   - Clean transition between mobile drawer and desktop navigation bar.
   - 2-column card layouts render balanced margins.
3. **1024px (Desktop / Laptop)**:
   - Full desktop navigation and multi-column grid cards display comfortably.
4. **1440px+ (Large Monitor)**:
   - Content container does not stretch infinitely; respects `max-w-7xl` centering.
