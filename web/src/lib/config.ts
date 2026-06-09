export const config = {
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL ?? "",
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "",
  posthogHost:
    process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? "",
};
