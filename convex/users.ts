import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";

export const currentUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    const userRoles = await ctx.db
      .query("userRoles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    const isAdmin = userRoles.some((r) => r.role === "admin");
    return {
      _id: userId,
      profile,
      roles: userRoles.map((r) => r.role),
      isAdmin,
    };
  },
});

export const currentUserId = query({
  handler: async (ctx) => {
    return await getAuthUserId(ctx);
  },
});

export const currentUserIsAdmin = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;
    const role = await ctx.db
      .query("userRoles")
      .withIndex("by_userId_role", (q) => q.eq("userId", userId).eq("role", "admin"))
      .first();
    return role !== null;
  },
});

export const createProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (existing) return existing._id;
    const identity = await ctx.auth.getUserIdentity();
    await ctx.db.insert("profiles", {
      userId,
      fullName: identity?.name ?? identity?.email ?? undefined,
      email: identity?.email ?? undefined,
    });
    await ctx.db.insert("userRoles", {
      userId,
      role: "student",
    });
    return userId;
  },
});
