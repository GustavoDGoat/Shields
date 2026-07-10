import { v } from "convex/values";
import { query } from "./_generated/server";

export const hasRole = query({
  args: { userId: v.string(), role: v.union(v.literal("admin"), v.literal("student")) },
  handler: async (ctx, args) => {
    const role = await ctx.db
      .query("userRoles")
      .withIndex("by_userId_role", (q) => q.eq("userId", args.userId).eq("role", args.role))
      .first();
    return role !== null;
  },
});
