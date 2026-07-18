import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getMyResult = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("questionnaireResults")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
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
    answers: v.array(
      v.object({
        questionId: v.string(),
        selectedOption: v.string(),
        isCorrect: v.boolean(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    // One-time only: reject if the user already has a completed questionnaire
    const existing = await ctx.db
      .query("questionnaireResults")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (existing) throw new Error("Questionnaire already completed");

    await ctx.db.insert("questionnaireResults", args);
  },
});
