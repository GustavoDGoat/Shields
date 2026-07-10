import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    const userRoles = await ctx.db
      .query("userRoles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    const isAdmin = userRoles.some((r) => r.role === "admin");
    return {
      profile,
      roles: userRoles.map((r) => r.role),
      isAdmin,
    };
  },
});

export const isAdmin = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const role = await ctx.db
      .query("userRoles")
      .withIndex("by_userId_role", (q) => q.eq("userId", args.userId).eq("role", "admin"))
      .first();
    return role !== null;
  },
});

export const createProfile = mutation({
  args: { userId: v.string(), fullName: v.optional(v.string()), email: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const adminEmails = ["gustavodgoat@gmail.com", "williamsjoshuas067@gmail.com"];
    const normalizedEmail = args.email?.toLowerCase();
    const role = normalizedEmail && adminEmails.some((e) => e.toLowerCase() === normalizedEmail) ? "admin" : "student";

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (existing) {
      const existingRole = await ctx.db
        .query("userRoles")
        .withIndex("by_userId_role", (q) => q.eq("userId", args.userId).eq("role", "admin"))
        .first();
      if (role === "admin" && !existingRole) {
        await ctx.db.insert("userRoles", { userId: args.userId, role: "admin" });
      }
      return existing._id;
    }

    await ctx.db.insert("profiles", {
      userId: args.userId,
      fullName: args.fullName,
      email: args.email,
    });

    const existingRoles = await ctx.db
      .query("userRoles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    if (existingRoles.length === 0) {
      await ctx.db.insert("userRoles", {
        userId: args.userId,
        role,
      });
    }
    return args.userId;
  },
});
