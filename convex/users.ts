import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  getAuthenticatedUser,
  requireAuthenticatedUser,
} from "./lib/auth";

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getAuthenticatedUser(ctx);
  },
});

export const ensure = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuthenticatedUser(ctx);
    return user._id;
  },
});

export const upsert = mutation({
  args: {
    name: v.optional(v.string()),
    timezone: v.optional(v.string()),
    wheelOfLife: v.optional(
      v.array(
        v.object({
          area: v.string(),
          score: v.number(),
          color: v.optional(v.string()),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const existing = await getAuthenticatedUser(ctx);
    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId: identity.subject,
      email: identity.email ?? "",
      name: args.name ?? identity.name,
      timezone: args.timezone,
      wheelOfLife: args.wheelOfLife,
      createdAt: now,
      updatedAt: now,
    });
  },
});
