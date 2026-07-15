import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("simulationResults")
      .withIndex("by_userId_completedAt", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const listAll = query({
  args: { adminUserId: v.string() },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("userRoles")
      .withIndex("by_userId_role", (q) => q.eq("userId", args.adminUserId).eq("role", "admin"))
      .first();
    if (!admin) return [];

    const profiles = await ctx.db.query("profiles").collect();
    const profileMap = new Map(profiles.map((p) => [p.userId, { fullName: p.fullName, email: p.email }]));
    const results = await ctx.db.query("simulationResults").order("desc").collect();
    return results.map((r) => ({
      ...r,
      userName: profileMap.get(r.userId)?.fullName ?? "Unknown",
      userEmail: profileMap.get(r.userId)?.email ?? "",
    }));
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    score: v.number(),
    totalQuestions: v.number(),
    correctAnswers: v.number(),
    grade: v.string(),
    completedAt: v.string(),
    timeTakenSeconds: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("simulationResults", args);
  },
});
