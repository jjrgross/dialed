import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/lib/convex";
import { PostHogProvider } from "@/lib/analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dialed — Productivity reimagined",
  description: "Tasks, focus, habits, and personal growth in one app.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <PostHogProvider>
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
