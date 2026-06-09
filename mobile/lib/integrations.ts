import { Platform } from "react-native";
import { config } from "./config";

/**
 * RevenueCat, Adapty, AppsFlyer, and Sentry require native modules.
 * These stubs initialize when keys are present and no-op otherwise,
 * keeping typecheck and Expo Go development unblocked.
 */

export async function initSentry(): Promise<void> {
  if (!config.sentryDsn) return;
  // Native Sentry SDK wired in production builds via @sentry/react-native
  console.info("[Sentry] DSN configured — enable @sentry/react-native in EAS build");
}

export async function initRevenueCat(userId?: string): Promise<void> {
  const key =
    Platform.OS === "ios"
      ? config.revenueCatIosKey
      : config.revenueCatAndroidKey;
  if (!key) return;
  console.info("[RevenueCat] Key configured for", Platform.OS, userId ?? "anonymous");
}

export async function initAdapty(): Promise<void> {
  if (!config.adaptyPublicKey) return;
  console.info("[Adapty] Public key configured");
}

export async function initAppsFlyer(): Promise<void> {
  if (!config.appsFlyerDevKey) return;
  console.info("[AppsFlyer] Dev key configured for app", config.appsFlyerAppId);
}

export async function initMobileIntegrations(userId?: string): Promise<void> {
  await Promise.all([
    initSentry(),
    initRevenueCat(userId),
    initAdapty(),
    initAppsFlyer(),
  ]);
}
