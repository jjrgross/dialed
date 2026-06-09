# Dialed — Technology Stack

## Product

**Dialed** is a productivity app for task management, focus sessions, habit tracking, and personal growth.

| Area | Features |
|------|----------|
| **Dash** | To-do and review workflows (Today tab) |
| **Wheel** | Analytics and customizable wheel of life (Profile) |
| **Log** | Activity and reflection log (Profile) |
| **Plans** | Goals and planning (Profile) |
| **Self** | Profile, settings, and identity (Profile tab) |

## Architecture

```
dialed/
├── mobile/          # Expo + React Native (iOS, Android)
├── web/             # Next.js (marketing + web app)
├── convex/          # Convex backend (shared)
└── packages/shared/ # Shared types and utilities
```

## Stack

| Layer | Technology |
|-------|------------|
| **Mobile** | Expo SDK 52, React Native, Expo Router |
| **Web** | Next.js 15 (App Router) |
| **State** | Zustand |
| **Auth** | Clerk (`ConvexProviderWithClerk`) |
| **Backend** | Convex (realtime DB, functions, cron) |
| **Email** | Resend (via Convex actions) |
| **Analytics** | PostHog |
| **Errors** | Sentry |
| **Payments** | RevenueCat + Adapty (mobile) |
| **Attribution** | AppsFlyer (mobile) |

## Data Model (Convex)

| Table | Purpose |
|-------|---------|
| `users` | User profiles synced from Clerk |
| `tasks` | To-dos with status, priority, due dates |
| `habits` | Recurring habits and streaks |
| `focusSessions` | Pomodoro / deep work sessions |

## Mobile Navigation

| Tab | Screen |
|-----|--------|
| **Today** | Dash — daily to-do and review |
| **Tasks** | Full task list and filters |
| **Focus** | Focus timer and session history |
| **Profile** | Self, Wheel, Log, Plans |

## Auth Flow

1. User signs in via Clerk (mobile: `@clerk/clerk-expo`, web: `@clerk/nextjs`).
2. `ConvexProviderWithClerk` passes Clerk JWT to Convex.
3. Convex `auth.config.ts` validates JWT; mutations/queries use `ctx.auth.getUserIdentity()`.

## Environment Setup

1. Copy `.env.example` to app-specific env files.
2. Create a [Clerk](https://clerk.com) application and enable JWT template for Convex.
3. Run `npx convex dev` and link deployment.
4. Set Convex env vars: `CLERK_JWT_ISSUER_DOMAIN`, `RESEND_API_KEY`.
5. Configure PostHog, Sentry, RevenueCat, Adapty, AppsFlyer keys for production.

## Commands

```bash
npm install
npm run dev:convex    # Convex dev server
npm run dev:mobile    # Expo dev server
npm run dev:web       # Next.js dev server
npm run typecheck     # TypeScript across all packages
```
