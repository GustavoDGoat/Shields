import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const deleteUser = mutation({
  args: { targetUserId: v.string(), adminUserId: v.string() },
  handler: async (ctx, args) => {
    const isAdmin = await ctx.db
      .query("userRoles")
      .withIndex("by_userId_role", (q) => q.eq("userId", args.adminUserId).eq("role", "admin"))
      .first();
    if (!isAdmin) throw new Error("Not authorized");

    if (args.targetUserId === args.adminUserId) throw new Error("Cannot delete yourself");

    const roles = await ctx.db
      .query("userRoles")
      .withIndex("by_userId", (q) => q.eq("userId", args.targetUserId))
      .collect();
    await Promise.all(roles.map((r) => ctx.db.delete(r._id)));

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.targetUserId))
      .first();
    if (profile) {
      await ctx.db.delete(profile._id);
    }

    const incidents = await ctx.db
      .query("incidents")
      .withIndex("by_studentId", (q) => q.eq("studentId", args.targetUserId))
      .collect();
    await Promise.all(incidents.map((i) => ctx.db.delete(i._id)));

    const simulationResults = await ctx.db
      .query("simulationResults")
      .withIndex("by_userId", (q) => q.eq("userId", args.targetUserId))
      .collect();
    await Promise.all(simulationResults.map((r) => ctx.db.delete(r._id)));

    const postTestResults = await ctx.db
      .query("postTestResults")
      .withIndex("by_userId", (q) => q.eq("userId", args.targetUserId))
      .collect();
    await Promise.all(postTestResults.map((r) => ctx.db.delete(r._id)));
  },
});
