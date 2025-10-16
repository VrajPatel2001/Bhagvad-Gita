# Game Grid

A modern React + TypeScript scaffold for building browser-based games with a focus on rapid prototyping, responsive layout primitives, and a streamlined developer experience.

## What's included

- ⚡️ [Vite](https://vitejs.dev/) powered React 18 + TypeScript setup
- 🎨 [Tailwind CSS](https://tailwindcss.com/) with theme tokens and global styles
- 🧭 [React Router](https://reactrouter.com/) navigation and layout shell
- 🧪 [Vitest](https://vitest.dev/) with Testing Library utilities
- 🧹 ESLint + Prettier configuration tuned for modern React projects

## Getting started

```bash
npm install
npm run dev
```

The application is served at `http://localhost:5173` by default.

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build the production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |
| `npm run typecheck` | Validate TypeScript types without emitting files |
| `npm run test` | Execute the Vitest test suite once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run format` | Format the codebase with Prettier |
| `npm run format:check` | Check formatting without writing changes |

## Project structure

```
src/
├── components/       # Shared UI and layout primitives
├── data/             # Static data and configuration
├── pages/            # Route-level views
├── routes/           # React Router configuration
├── store/            # Application state utilities
├── styles/           # Theme tokens and shared styles
├── test/             # Vitest setup files
└── main.tsx          # Application entry point
```

## Styling primitives

Global theme tokens are defined with CSS variables (`src/index.css`) and mirrored in TypeScript (`src/styles/theme.ts`). Tailwind utilities are configured to consume these tokens, keeping colors and typography consistent across the project.

## Testing

Vitest is configured to run in a JSDOM environment with Testing Library helpers. Global matchers are initialised in `src/test/setupTests.ts`.
