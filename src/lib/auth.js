import { randomBytes } from "node:crypto";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { MongoClient } from "mongodb";

// Re-use the Mongo client between hot reloads / serverless invocations
const globalForMongo = globalThis;
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
const mongoUri = process.env.MONGODB_URI || (isBuildPhase ? "mongodb://127.0.0.1:27017" : undefined);
const authSecret = process.env.BETTER_AUTH_SECRET || (isBuildPhase ? randomBytes(32).toString("base64") : undefined);
if (!mongoUri) throw new Error("MONGODB_URI is required to run PizzaHub authentication.");
if (!authSecret) throw new Error("BETTER_AUTH_SECRET is required to run PizzaHub authentication.");
const client = globalForMongo._pizzaMongoClient || new MongoClient(mongoUri);
if (!globalForMongo._pizzaMongoClient) globalForMongo._pizzaMongoClient = client;
const db = client.db(process.env.DB_NAME || "pizzahub");

const googleEnabled = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: authSecret,
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
  database: mongodbAdapter(db, { client }),

  emailAndPassword: { enabled: true, minPasswordLength: 6 },

  socialProviders: googleEnabled
    ? { google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET } }
    : {},

  // The Better Auth "user" collection is stored as "users" and carries our business fields
  user: {
    modelName: "users",
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      isBlocked: { type: "boolean", required: false, defaultValue: false, input: false },
      businessName: { type: "string", required: false, input: true },
      subscriptionPlan: { type: "string", required: false, defaultValue: "free", input: false },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
    },
  },

  databaseHooks: {
    user: {
      create: {
        // Public sign-up can NEVER create an admin or set blocked/subscription fields
        before: async (user) => {
          const role = ["vendor", "customer"].includes(user.role) ? user.role : "customer";
          return {
            data: {
              ...user,
              role,
              isBlocked: false,
              subscriptionPlan: "free",
              businessName: role === "vendor" ? user.businessName || user.name : undefined,
            },
          };
        },
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const password = ctx.body?.password || "";
        if (
          password.length < 8 ||
          !/[a-z]/.test(password) ||
          !/[A-Z]/.test(password) ||
          !/\d/.test(password)
        ) {
          throw new APIError("BAD_REQUEST", {
            message: "Password must be 8+ characters and include uppercase, lowercase, and a number",
          });
        }
      }
    }),
  },

  // jwt() exposes /api/auth/token and /api/auth/jwks, used by the Express server to verify tokens
  // nextCookies() must be the last plugin
  plugins: [jwt(), nextCookies()],
});
