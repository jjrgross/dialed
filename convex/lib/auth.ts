import type { MutationCtx, QueryCtx } from "../_generated/server";

export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();
}

export async function requireAuthenticatedUser(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const existing = await getAuthenticatedUser(ctx);
  if (existing) return existing;

  const now = Date.now();
  const userId = await ctx.db.insert("users", {
    clerkId: identity.subject,
    email: identity.email ?? "",
    name: identity.name,
    avatarUrl: identity.pictureUrl,
    createdAt: now,
    updatedAt: now,
  });

  const user = await ctx.db.get(userId);
  if (!user) throw new Error("Failed to create user");
  return user;
}

export async function requireExistingUser(ctx: QueryCtx) {
  const user = await getAuthenticatedUser(ctx);
  if (!user) throw new Error("Unauthorized");
  return user;
}
