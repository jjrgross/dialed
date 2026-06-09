import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import * as SecureStore from "expo-secure-store";
import { colors } from "@/constants/theme";
import { config } from "@/lib/config";
import { initAnalytics } from "@/lib/analytics";
import { initMobileIntegrations } from "@/lib/integrations";

const tokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
};

const convex = new ConvexReactClient(config.convexUrl || "https://placeholder.convex.cloud");

function IntegrationsBootstrap() {
  const { userId } = useAuth();

  useEffect(() => {
    initAnalytics();
    void initMobileIntegrations(userId ?? undefined);
  }, [userId]);

  return null;
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={config.clerkPublishableKey || "pk_test_placeholder"}
      tokenCache={tokenCache}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ClerkLoaded>
          <IntegrationsBootstrap />
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.text,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </ClerkLoaded>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
