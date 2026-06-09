import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  getAuthenticatedUser,
  requireAuthenticatedUser,
} from "./lib/auth";

export const list = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return [];

    if (args.activeOnly) {
      return await ctx.db
        .query("habits")
        .withIndex("by_user_active", (q) =>
          q.eq("userId", user._id).eq("isActive", true),
        )
        .collect();
    }

    return await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    frequency: v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("custom"),
    ),
    targetDays: v.optional(v.array(v.number())),
  },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx);
    const now = Date.now();

    return await ctx.db.insert("habits", {
      userId: user._id,
      title: args.title,
      description: args.description,
      frequency: args.frequency,
      targetDays: args.targetDays,
      streak: 0,
      longestStreak: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const complete = mutation({
  args: { id: v.id("habits") },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx);
    const habit = await ctx.db.get(args.id);
    if (!habit || habit.userId !== user._id) throw new Error("Habit not found");

    const now = Date.now();
    const newStreak = habit.streak + 1;

    await ctx.db.patch(args.id, {
      streak: newStreak,
      longestStreak: Math.max(habit.longestStreak, newStreak),
      lastCompletedAt: now,
      updatedAt: now,
    });
  },
});
