import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const isAdmin = await ctx.db
      .query("userRoles")
      .withIndex("by_userId_role", (q) => q.eq("userId", userId).eq("role", "admin"))
      .first();

    let incidents;
    if (isAdmin) {
      incidents = await ctx.db.query("incidents").order("desc").collect();
    } else {
      incidents = await ctx.db
        .query("incidents")
        .withIndex("by_studentId", (q) => q.eq("studentId", userId))
        .order("desc")
        .collect();
    }

    const studentIds = [...new Set(incidents.map((i) => i.studentId))];
    const profiles = await Promise.all(
      studentIds.map((sid) =>
        ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", sid))
          .first(),
      ),
    );
    const profileByUserId = Object.fromEntries(
      profiles.filter(Boolean).map((p) => [p!.userId, { fullName: p!.fullName, email: p!.email }]),
    );

    return incidents.map((incident) => ({
      _id: incident._id,
      _creationTime: incident._creationTime,
      studentId: incident.studentId,
      incidentType: incident.incidentType,
      description: incident.description,
      status: incident.status,
      urgencyLevel: incident.urgencyLevel,
      evidenceUrl: incident.evidenceUrl,
      adminNote: incident.adminNote,
      updatedAt: incident.updatedAt,
      studentName: profileByUserId[incident.studentId]?.fullName ?? "Unknown User",
      studentEmail: profileByUserId[incident.studentId]?.email ?? "",
    }));
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    incidentType: v.union(
      v.literal("phishing"),
      v.literal("malware"),
      v.literal("identity_theft"),
      v.literal("data_breach"),
      v.literal("unauthorized_access"),
      v.literal("other"),
    ),
    description: v.string(),
    urgencyLevel: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    evidenceStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    let evidenceUrl: string | undefined;
    if (args.evidenceStorageId) {
      evidenceUrl = (await ctx.storage.getUrl(args.evidenceStorageId)) ?? undefined;
    }

    await ctx.db.insert("incidents", {
      studentId: userId,
      incidentType: args.incidentType,
      description: args.description,
      urgencyLevel: args.urgencyLevel,
      status: "pending",
      evidenceUrl,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("incidents"),
    status: v.union(v.literal("pending"), v.literal("investigating"), v.literal("resolved")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const isAdmin = await ctx.db
      .query("userRoles")
      .withIndex("by_userId_role", (q) => q.eq("userId", userId).eq("role", "admin"))
      .first();
    if (!isAdmin) throw new Error("Not authorized");

    await ctx.db.patch(args.id, { status: args.status, updatedAt: new Date().toISOString() });
  },
});

export const addAdminNote = mutation({
  args: { id: v.id("incidents"), note: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const isAdmin = await ctx.db
      .query("userRoles")
      .withIndex("by_userId_role", (q) => q.eq("userId", userId).eq("role", "admin"))
      .first();
    if (!isAdmin) throw new Error("Not authorized");

    await ctx.db.patch(args.id, { adminNote: args.note, updatedAt: new Date().toISOString() });
  },
});

export const remove = mutation({
  args: { id: v.id("incidents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const isAdmin = await ctx.db
      .query("userRoles")
      .withIndex("by_userId_role", (q) => q.eq("userId", userId).eq("role", "admin"))
      .first();
    if (!isAdmin) throw new Error("Not authorized");

    await ctx.db.delete(args.id);
  },
});
