"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

export const sendWelcome = action({
  args: {
    to: v.string(),
    name: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL ?? "Dialed <onboarding@resend.dev>";

    if (!apiKey) {
      console.warn("RESEND_API_KEY not configured — skipping welcome email");
      return { success: false, reason: "not_configured" };
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: args.to,
        subject: "Welcome to Dialed",
        html: `<h1>Welcome, ${args.name}!</h1><p>You're dialed in. Start your first focus session today.</p>`,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend error: ${error}`);
    }

    return { success: true };
  },
});
