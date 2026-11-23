
import { MongoClient } from "mongodb";

const { BETTER_AUTH_URL, MONGODB_URI, DB_NAME = "pizzahub", ADMIN_NAME = "PizzaHub Admin", ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!BETTER_AUTH_URL || !MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Set BETTER_AUTH_URL, MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD first.");
  process.exit(1);
}

// 1. Register the account through Better Auth (so the password is hashed correctly)
const res = await fetch(`${BETTER_AUTH_URL}/api/auth/sign-up/email`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Origin: BETTER_AUTH_URL },
  body: JSON.stringify({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
});
if (!res.ok) {
  const msg = await res.text();
  console.log(`Sign-up response (${res.status}): ${msg}\nContinuing - the account may already exist.`);
}

// 2. Promote it to admin directly in the database (admin can never be self-selected from the UI)
const client = new MongoClient(MONGODB_URI);
await client.connect();
const result = await client
  .db(DB_NAME)
  .collection("users")
  .updateOne({ email: ADMIN_EMAIL.toLowerCase() }, { $set: { role: "admin", isBlocked: false } });
await client.close();

console.log(result.matchedCount ? `Admin ready: ${ADMIN_EMAIL}` : "User not found - check the sign-up error above.");
