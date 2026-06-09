import PostHog from "posthog-react-native";
import { config } from "./config";

let posthog: PostHog | null = null;

export function initAnalytics(): void {
  if (!config.posthogKey) return;

  posthog = new PostHog(config.posthogKey, {
    host: config.posthogHost,
  });
}

export function trackEvent(
  event: string,
  properties?: Record<string, string | number | boolean>,
): void {
  posthog?.capture(event, properties);
}

export function identifyUser(
  userId: string,
  traits?: Record<string, string>,
): void {
  posthog?.identify(userId, traits);
}
