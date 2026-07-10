import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const isAdmin = await ctx.db
      .query("userRoles")
      .withIndex("by_userId_role", (q) => q.eq("userId", args.userId).eq("role", "admin"))
      .first();
    if (!isAdmin) return [];

    const profiles = await ctx.db.query("profiles").order("desc").collect();
    const userRoles = await ctx.db.query("userRoles").collect();
    const roleMap = new Map(userRoles.map((r) => [r.userId, r.role]));
    return profiles.map((p) => ({
      ...p,
      role: roleMap.get(p.userId) ?? "student",
    }));
  },
});
