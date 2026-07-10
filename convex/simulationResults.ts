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
