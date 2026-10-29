import "server-only";
import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { collection } from "./db";

const WINDOW_MS = 15 * 60 * 1000;
let indexPromise: Promise<string> | undefined;

export async function allowRequest(scope: "admin-login" | "enquiry", limit: number) {
  const incoming = await headers();
  const ip = (incoming.get("x-vercel-forwarded-for") ?? incoming.get("x-forwarded-for") ?? "unknown")
    .split(",")[0].trim();
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");

  const window = Math.floor(Date.now() / WINDOW_MS);
  const fingerprint = createHmac("sha256", secret).update(ip).digest("hex");
  const limits = await collection<{ _id: string; count: number; expiresAt: Date }>("rate_limits");
  indexPromise ??= limits.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch((error) => {
    indexPromise = undefined;
    throw error;
  });
  await indexPromise;

  const attempt = await limits.findOneAndUpdate(
    { _id: `${scope}:${fingerprint}:${window}` },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((window + 1) * WINDOW_MS) } },
    { upsert: true, returnDocument: "after" },
  );
  return (attempt?.count ?? limit + 1) <= limit;
}
