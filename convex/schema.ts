import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profiles: defineTable({
    userId: v.string(),
    fullName: v.optional(v.string()),
    email: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  userRoles: defineTable({
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("student")),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_role", ["userId", "role"]),

  incidents: defineTable({
    studentId: v.string(),
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
    status: v.union(v.literal("pending"), v.literal("investigating"), v.literal("resolved")),
    evidenceUrl: v.optional(v.string()),
    adminNote: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  })
    .index("by_studentId", ["studentId"])
    .index("by_status", ["status"]),

  phishingSimulations: defineTable({
    title: v.string(),
    description: v.string(),
    difficultyLevel: v.string(),
    content: v.any(),
    isPhishing: v.boolean(),
    createdBy: v.string(),
  }).index("by_createdBy", ["createdBy"]),

  simulationResults: defineTable({
    userId: v.string(),
    score: v.number(),
    totalQuestions: v.number(),
    correctAnswers: v.number(),
    grade: v.string(),
    completedAt: v.string(),
    timeTakenSeconds: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_completedAt", ["userId", "completedAt"]),

  questionnaireResults: defineTable({
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
  }).index("by_userId", ["userId"]),

  postTestResults: defineTable({
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
  })
    .index("by_userId", ["userId"])
    .index("by_userId_completedAt", ["userId", "completedAt"]),

  trainingVideos: defineTable({
    title: v.string(),
    description: v.string(),
    youtubeUrl: v.string(),
    category: v.string(),
    createdBy: v.optional(v.string()),
  }).index("by_category", ["category"]),
});
