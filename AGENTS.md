# AGENTS.md

## Cursor Cloud specific instructions

**Dialed** is an npm workspaces monorepo: `mobile/` (Expo), `web/` (Next.js), `convex/` (backend), `packages/shared/`.

### Services

| Service | Required | Command | Notes |
|---------|----------|---------|-------|
| Convex | Yes (for data) | `npm run dev:convex` | Needs `CONVEX_DEPLOYMENT` / `npx convex dev` login |
| Mobile | Optional | `npm run dev:mobile` | Expo; needs Clerk + Convex env vars |
| Web | Optional | `npm run dev:web` | Next.js on port 3000; needs Clerk keys in `web/.env.local` |

### Environment

Copy `.env.example` and set keys per app:

- **Web:** `web/.env.local` — `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CONVEX_URL`
- **Mobile:** `mobile/.env` or shell exports — `EXPO_PUBLIC_*` vars
- **Convex dashboard:** `CLERK_JWT_ISSUER_DOMAIN`, `RESEND_API_KEY`

Without real Clerk/Convex credentials, apps start but auth and data calls fail at runtime. Typecheck does not require live services.

### Typecheck

```bash
npm install
npx convex codegen   # generates convex/_generated — required before typecheck
npm run typecheck
```

### Lint

```bash
npm run lint   # web only (eslint-config-next)
```

### Non-obvious notes

- Run `npx convex codegen` after schema changes; mobile and web import `convex/_generated/api`.
- Mobile integrations (RevenueCat, Adapty, AppsFlyer, Sentry) are stubbed in `mobile/lib/integrations.ts` for Expo Go; wire native SDKs in EAS production builds.
- `ConvexProviderWithClerk` is used on both mobile (`mobile/app/_layout.tsx`) and web (`web/src/lib/convex.tsx`).
