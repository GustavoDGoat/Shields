import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const isAdmin = await ctx.db
      .query("userRoles")
      .withIndex("by_userId_role", (q) => q.eq("userId", userId).eq("role", "admin"))
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
