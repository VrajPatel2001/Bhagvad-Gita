# Bhagavad Gita Learning Platform

A serene learning companion built with Next.js 14 and the App Router. The project provides an approachable foundation for expanding the Bhagavad Gita experience with guided study, reflective practice, and curated resources.

## Tech stack

- **Next.js 14** (App Router) with TypeScript
- **Tailwind CSS v4** with a custom, spiritually inspired design palette
- **ESLint** (Next.js Core Web Vitals + Prettier) for consistent code quality
- **Prettier** with the Tailwind CSS plugin for opinionated formatting

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

3. Lint the project:

   ```bash
   npm run lint
   ```

## Project structure

```
app/           # App Router layouts, pages, and route groups
components/    # Shared UI building blocks (header, footer, etc.)
data/          # Static data sources and content stubs
lib/           # Configuration helpers, utilities, and constants
public/        # Static assets served by Next.js
```

Key routes scaffolded for future development:

- `/` — Landing page with hero messaging, chapter highlights, and calls-to-action
- `/about` — Explains the platform intention and guiding principles
- `/chapters` — Summaries of initial chapters with room for extended study guides
- `/resources` — Roadmap and placeholders for upcoming study materials

## Screenshots

![Landing page experience](./public/screenshots/overview.svg)

## Experience highlights

- Refined hero spacing and highlight cards introduce spiritual iconography and responsive layouts that scale gracefully from mobile through desktop.
- Chapter previews and footer links now surface contextual cues with motion-safe hover states and accessible focus treatment.
- Games catalog gains consistent spacing and colour accents that mirror the main site for a cohesive study journey.

## Design system notes

Tailwind CSS is configured through `app/globals.css` using the new v4 `@theme` API. Custom colors and shadows evoke warm, peaceful tones such as `sand`, `lotus`, `peacock`, and `saffron`. Use these utilities when composing new interfaces to maintain consistency.

Global typography is managed with Google Fonts (Manrope for body copy and Playfair Display for headings). Utility classes such as `shadow-soft`, `bg-sand-25`, and `text-peacock-900` are available across the app.

## Accessibility & responsiveness

- A persistent “skip to main content” control, labelled navigation drawers, and progress indicators with live regions improve keyboard and assistive technology support.
- Mobile chapter navigation now traps focus with Escape-to-close support while the main content receives scroll offset guards for in-page anchors.
- Motion preferences are respected through reduced-motion fallbacks so animated feedback never overwhelms sensitive users.

## Code quality & conventions

- Paths use absolute aliases (e.g. `@/components/...`) defined in `tsconfig.json`
- ESLint and Prettier should be run through the provided npm scripts — avoid committing failing lint errors
- Keep components stateless where possible and colocate route-specific logic under `app/`
- Prefer the existing design tokens before introducing new ones; if additions are needed, place them inside the `@theme` block in `app/globals.css`

## Testing

Run the Vitest suite to exercise dataset helpers, the language provider, and game state transitions:

```bash
npm run test
```

## Next steps

The foundation is ready for integrating dynamic chapter content, meditation practices, authentication, and community features. Add new route groups or feature modules under `app/` and leverage `data/` + `lib/` for fetching and transforming content.
