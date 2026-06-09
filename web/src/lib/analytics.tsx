"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { config } from "./config";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!config.posthogKey) return;
    posthog.init(config.posthogKey, {
      api_host: config.posthogHost,
      person_profiles: "identified_only",
    });
  }, []);

  return <>{children}</>;
}

export { posthog };
