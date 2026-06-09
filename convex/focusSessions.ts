import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  getAuthenticatedUser,
  requireAuthenticatedUser,
} from "./lib/auth";

export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("active"),
        v.literal("completed"),
        v.literal("cancelled"),
      ),
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return [];

    const limit = args.limit ?? 50;

    if (args.status) {
      return await ctx.db
        .query("focusSessions")
        .withIndex("by_user_status", (q) =>
          q.eq("userId", user._id).eq("status", args.status!),
        )
        .order("desc")
        .take(limit);
    }

    return await ctx.db
      .query("focusSessions")
      .withIndex("by_user_started", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(limit);
  },
});

export const active = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return null;

    return await ctx.db
      .query("focusSessions")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", user._id).eq("status", "active"),
      )
      .first();
  },
});

export const start = mutation({
  args: {
    durationMinutes: v.number(),
    taskId: v.optional(v.id("tasks")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx);
    const now = Date.now();

    const existing = await ctx.db
      .query("focusSessions")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", user._id).eq("status", "active"),
      )
      .first();

    if (existing) throw new Error("A focus session is already active");

    return await ctx.db.insert("focusSessions", {
      userId: user._id,
      taskId: args.taskId,
      durationMinutes: args.durationMinutes,
      startedAt: now,
      status: "active",
      notes: args.notes,
      createdAt: now,
    });
  },
});

export const complete = mutation({
  args: {
    id: v.id("focusSessions"),
    actualMinutes: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx);
    const session = await ctx.db.get(args.id);
    if (!session || session.userId !== user._id)
      throw new Error("Session not found");

    await ctx.db.patch(args.id, {
      status: "completed",
      endedAt: Date.now(),
      actualMinutes: args.actualMinutes ?? session.durationMinutes,
      notes: args.notes ?? session.notes,
    });
  },
});

export const cancel = mutation({
  args: { id: v.id("focusSessions") },
  handler: async (ctx, args) => {
    const user = await requireAuthenticatedUser(ctx);
    const session = await ctx.db.get(args.id);
    if (!session || session.userId !== user._id)
      throw new Error("Session not found");

    await ctx.db.patch(args.id, {
      status: "cancelled",
      endedAt: Date.now(),
    });
  },
});
