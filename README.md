# Dialed

A productivity app for tasks, focus, habits, and personal growth.

## Features

- **Today** — Daily dash: to-do and review
- **Tasks** — Full task management
- **Focus** — Deep work sessions and timer
- **Profile** — Wheel of life, log, plans, and settings

## Stack

Expo + React Native · Next.js · Convex · Clerk · Zustand

See [STACK.md](./STACK.md) for the full technology reference.

## Quick start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Configure Clerk, Convex, and other keys (see STACK.md)

# Start Convex backend
npm run dev:convex

# Mobile (separate terminal)
npm run dev:mobile

# Web (separate terminal)
npm run dev:web

# Typecheck
npm run typecheck
```

## Project structure

```
├── mobile/     Expo app (iOS / Android)
├── web/        Next.js web app
├── convex/     Backend functions and schema
└── packages/   Shared code
```

## Documentation

- [STACK.md](./STACK.md) — Architecture and integrations
- [AGENTS.md](./AGENTS.md) — Cursor Cloud agent instructions
