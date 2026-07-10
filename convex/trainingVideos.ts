import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    const videos = await ctx.db.query("trainingVideos").collect();
    return videos.sort((a, b) => {
      const catCmp = a.category.localeCompare(b.category);
      if (catCmp !== 0) return catCmp;
      return a._creationTime - b._creationTime;
    });
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    youtubeUrl: v.string(),
    category: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const isAdmin = await ctx.db
      .query("userRoles")
      .withIndex("by_userId_role", (q) => q.eq("userId", args.userId).eq("role", "admin"))
      .first();
    if (!isAdmin) throw new Error("Not authorized");

    await ctx.db.insert("trainingVideos", {
      title: args.title,
      description: args.description,
      youtubeUrl: args.youtubeUrl,
      category: args.category,
      createdBy: args.userId,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("trainingVideos"),
    title: v.string(),
    description: v.string(),
    youtubeUrl: v.string(),
    category: v.string(),
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
  args: { id: v.id("trainingVideos"), userId: v.string() },
  handler: async (ctx, args) => {
    const isAdmin = await ctx.db
      .query("userRoles")
      .withIndex("by_userId_role", (q) => q.eq("userId", args.userId).eq("role", "admin"))
      .first();
    if (!isAdmin) throw new Error("Not authorized");

    await ctx.db.delete(args.id);
  },
});
