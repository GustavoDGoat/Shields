import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("phishingSimulations").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    difficultyLevel: v.string(),
    content: v.any(),
    isPhishing: v.boolean(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const isAdmin = await ctx.db
      .query("userRoles")
      .withIndex("by_userId_role", (q) => q.eq("userId", args.createdBy).eq("role", "admin"))
      .first();
    if (!isAdmin) throw new Error("Not authorized");

    await ctx.db.insert("phishingSimulations", {
      title: args.title,
      description: args.description,
      difficultyLevel: args.difficultyLevel,
      content: args.content,
      isPhishing: args.isPhishing,
      createdBy: args.createdBy,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("phishingSimulations"),
    title: v.string(),
    description: v.string(),
    difficultyLevel: v.string(),
    content: v.any(),
    isPhishing: v.boolean(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const isAdmin = await ctx.db
      .query("userRoles")
      .withIndex("by_userId_role", (q) => q.eq("userId", args.userId).eq("role", "admin"))
      .first();
    if (!isAdmin) throw new Error("Not authorized");

    const { id, userId, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("phishingSimulations"), userId: v.string() },
  handler: async (ctx, args) => {
    const isAdmin = await ctx.db
      .query("userRoles")
      .withIndex("by_userId_role", (q) => q.eq("userId", args.userId).eq("role", "admin"))
      .first();
    if (!isAdmin) throw new Error("Not authorized");

    await ctx.db.delete(args.id);
  },
});
