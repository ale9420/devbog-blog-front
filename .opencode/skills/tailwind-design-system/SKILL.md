---
name: tailwind-design-system
description: Guides the styling implementation using Tailwind CSS utility classes, responsive design, and design token consistency.
---

# Tailwind CSS Styling & Design System Skill

This skill governs how styles, layouts, and responsive utilities are structured across the frontend application using Tailwind CSS.

## 1. Utility-First Implementation
- Avoid using custom CSS or the `@apply` directive inside `<style>` blocks unless absolutely necessary for third-party library overrides. Use Tailwind's utility classes directly on the HTML elements.
- Keep HTML classes highly scannable. When building complex dynamic class bindings, use the `clsx` or `tailwind-merge` utility patterns to prevent class duplication or style conflicts.

## 2. Responsive and Adaptive Design
- Always adopt a mobile-first approach. Use bare utility classes for mobile layout specifications, and use responsive modifiers (`sm:`, `md:`, `lg:`, `xl:`) strictly to scale up the interface.
- Implement native Dark Mode capabilities leveraging Tailwind's `dark:` modifier class, ensuring text-to-background contrast ratios satisfy WCAG AA requirements (at least 4.5:1 for normal text).

## 3. Consistency with Theme Tokens
- Restrict arbitrary values (e.g., `h-[432px]` or `bg-[#ff0011]`) within the codebase. Every color, spacing, font-size, and border-radius must strictly map to the layout tokens configured in `tailwind.config.js`.
