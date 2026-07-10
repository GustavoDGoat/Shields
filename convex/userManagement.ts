import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new Error("Not authenticated");

    const isAdmin = await ctx.db
      .query("userRoles")
      .withIndex("by_userId_role", (q) => q.eq("userId", adminId).eq("role", "admin"))
      .first();
    if (!isAdmin) throw new Error("Not authorized");

    if (args.userId === adminId) throw new Error("Cannot delete yourself");

    const roles = await ctx.db
      .query("userRoles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    await Promise.all(roles.map((r) => ctx.db.delete(r._id)));

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (profile) {
      await ctx.db.delete(profile._id);
    }

    const incidents = await ctx.db
      .query("incidents")
      .withIndex("by_studentId", (q) => q.eq("studentId", args.userId))
      .collect();
    await Promise.all(incidents.map((i) => ctx.db.delete(i._id)));

    const simulationResults = await ctx.db
      .query("simulationResults")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    await Promise.all(simulationResults.map((r) => ctx.db.delete(r._id)));
  },
});
