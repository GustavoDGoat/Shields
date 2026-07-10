import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listByUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("simulationResults")
      .withIndex("by_userId_completedAt", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const create = mutation({
  args: {
    score: v.number(),
    totalQuestions: v.number(),
    correctAnswers: v.number(),
    grade: v.string(),
    completedAt: v.string(),
    timeTakenSeconds: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.insert("simulationResults", {
      userId,
      ...args,
    });
  },
});
