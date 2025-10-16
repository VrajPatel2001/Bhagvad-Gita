# Bhagavad Gita Interactive Quiz Engine

An engaging browser-based learning experience powered by React, TypeScript, and Vite. The app blends fast-paced quizzing with reflective study tools to help players deepen their understanding of the Bhagavad Gita.

## Features

- **Dynamic game lobby** with mode descriptions, difficulty presets, and immersive presentation.
- **Reusable quiz engine** that handles question generation, difficulty scaling, scoring, and feedback effects.
- **Real-time HUD** tracking score, streaks, best streak, progress, and a responsive countdown timer.
- **Outcome-aware scoring** with bonuses for quick answers, combo streaks, and tougher question tiers.
- **Results analytics** summarising every round with accuracy stats, streak insights, and per-question breakdowns.

## Game modes

| Mode | Focus | Highlights |
| --- | --- | --- |
| **Verse Voyager** | Identify the exact chapter & verse for a given teaching. | Classic multiple choice, timer pressure, streak multipliers. |
| **Theme Tracker** | Match Bhagavad Gita themes to the passages that embody them. | Concept recognition, similar-option distractors, adaptive timers. |
| **Fragment Forge** | Reassemble shuffled verse fragments into their original wording. | Interactive arrangement gameplay, longer meditative timer, reflective reinforcement. |

## Getting started

```bash
npm install
npm run dev
```

The development server will start on <http://localhost:5173>. Save changes in `src/` to trigger instant hot module reloads.

## Project structure

```
src/
├── components/          # Lobby, game, HUD, and results UI
├── data/                # Bhagavad Gita verse library & mode metadata
├── engine/              # Core quiz engine logic
├── types/               # Shared TypeScript interfaces
├── App.tsx              # High-level view/state orchestration
├── App.css              # Primary design system styles
└── index.css            # Global resets and typography
```

## Scripts

- `npm run dev` – start the local development server.
- `npm run build` – generate the production build.
- `npm run preview` – preview the production build locally.

---

Designed to keep Gita study joyful, focused, and replayable. Enjoy exploring the teachings!
