import Constants from "expo-constants";

export const config = {
  clerkPublishableKey:
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ??
    (Constants.expoConfig?.extra?.clerkPublishableKey as string | undefined) ??
    "",
  convexUrl:
    process.env.EXPO_PUBLIC_CONVEX_URL ??
    (Constants.expoConfig?.extra?.convexUrl as string | undefined) ??
    "",
  posthogKey: process.env.EXPO_PUBLIC_POSTHOG_KEY ?? "",
  posthogHost:
    process.env.EXPO_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
  sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? "",
  revenueCatIosKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? "",
  revenueCatAndroidKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? "",
  adaptyPublicKey: process.env.EXPO_PUBLIC_ADAPTY_PUBLIC_KEY ?? "",
  appsFlyerDevKey: process.env.EXPO_PUBLIC_APPSFLYER_DEV_KEY ?? "",
  appsFlyerAppId: process.env.EXPO_PUBLIC_APPSFLYER_APP_ID ?? "",
};
