"use client";

import type { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { config } from "./config";

const convex = new ConvexReactClient(
  config.convexUrl || "https://placeholder.convex.cloud",
);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children as React.ReactNode}
    </ConvexProviderWithClerk>
  );
}
